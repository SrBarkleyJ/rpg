const Reward = require('../models/Reward');
const User = require('../models/User');
const {
    SLOT_MAP,
    determineCompatibleSlot,
    findAvailableRingSlot,
    validateClassCompatibility,
    applyEquipmentBonus,
    removeEquipmentBonus
} = require('../utils/equipmentUtils');


// LIST REWARDS - Mantener igual
const listRewards = async (req, res, next) => {
    try {
        const rewards = await Reward.find({});

        // Map 'value' to 'cost' for frontend compatibility
        const rewardsWithCost = rewards.map(reward => ({
            ...reward.toObject(),
            cost: reward.value
        }));
        res.json(rewardsWithCost);
    } catch (err) { next(err); }
};

// CREATE REWARD - Mantener igual
const createReward = async (req, res, next) => {
    try {
        const reward = await Reward.create(req.body);
        res.status(201).json(reward);
    } catch (err) { next(err); }
};

// BUY REWARD - Mantener igual
const buyReward = async (req, res, next) => {
    try {
        const { rewardId } = req.body;
        const reward = await Reward.findById(rewardId);
        if (!reward) return res.status(404).json({ success: false, message: 'Reward not found' });

        const user = await User.findById(req.user._id);
        if (user.gold < reward.value) {
            return res.status(400).json({ success: false, message: 'Not enough gold' });
        }

        user.gold -= reward.value;

        // Check for stacking if consumable
        let itemAdded = false;
        if (reward.type === 'consumable' || reward.stackable) {
            const existingItem = user.inventory.find(item => item.itemId.toString() === rewardId);
            if (existingItem) {
                existingItem.quantity += 1;
                itemAdded = true;
            }
        }

        if (!itemAdded) {
            user.inventory.push({ itemId: reward._id, quantity: 1 });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Reward purchased',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    gold: user.gold,
                    inventory: user.inventory,
                    stats: user.stats,
                    combat: user.combat,
                    equipment: user.equipment,
                    equipmentBonuses: user.equipmentBonuses,
                    equipmentBonusesExtra: user.equipmentBonusesExtra
                }
            }
        });
    } catch (err) { next(err); }
};

// GET INVENTORY - Mejorado para incluir equipo detallado
const getInventory = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        // Populate inventory items with full reward details
        const inventoryWithDetails = await Promise.all(
            user.inventory.map(async (invItem) => {
                const reward = await Reward.findById(invItem.itemId);
                return {
                    ...invItem.toObject(),
                    details: reward
                };
            })
        );

        // Organizar items equipados por slot
        const equippedBySlot = {};
        const equippedItems = inventoryWithDetails.filter(item => item.equipped);
        
        equippedItems.forEach(item => {
            const slot = item.equippedSlot || 'unknown';
            equippedBySlot[slot] = item;
        });

        // Obtener estadísticas totales
        let totalBonuses = {
            strength: 0,
            intelligence: 0,
            vitality: 0,
            dexterity: 0,
            luck: 0
        };

        // Calcular bonificaciones totales
        equippedItems.forEach(item => {
            if (item.details && item.details.effects) {
                const effects = item.details.effects;
                if (effects.buffStrength) totalBonuses.strength += effects.buffStrength;
                if (effects.buffIntelligence) totalBonuses.intelligence += effects.buffIntelligence;
                if (effects.buffVitality) totalBonuses.vitality += effects.buffVitality;
                if (effects.buffDexterity) totalBonuses.dexterity += effects.buffDexterity;
                if (effects.buffLuck) totalBonuses.luck += effects.buffLuck;
            }
        });

        res.json({
            inventory: inventoryWithDetails,
            equipped: equippedBySlot,
            equipmentBonuses: totalBonuses,
            totalStats: {
                strength: user.stats.strength + totalBonuses.strength,
                intelligence: user.stats.intelligence + totalBonuses.intelligence,
                vitality: user.stats.vitality + totalBonuses.vitality,
                dexterity: user.stats.dexterity + totalBonuses.dexterity,
                luck: user.stats.luck + totalBonuses.luck
            },
            maxHP: user.calculateMaxHP(),
            maxMana: user.calculateMaxMana()
        });
    } catch (err) { 
        next(err); 
    }
};

// EQUIP ITEM - Mejorado para múltiples slots
const equipItem = async (req, res, next) => {
    try {
        const { itemId, slot } = req.body; // itemId es el ID de la instancia del inventario
        const user = await User.findById(req.user._id);

        // Find item in inventory by its unique instance ID
        const invItem = user.inventory.id(itemId);
        if (!invItem) return res.status(404).json({ message: 'Item not found in inventory' });

        // Get item details
        const reward = await Reward.findById(invItem.itemId);
        if (!reward) return res.status(404).json({ message: 'Item details not found' });

        // Validaciones básicas
        if (reward.type === 'consumable') {
            return res.status(400).json({ message: 'Consumables cannot be equipped. Use them instead.' });
        }

        if (reward.effects?.duration > 0) {
            return res.status(400).json({ message: 'Temporary items cannot be equipped. Use them instead.' });
        }

        // Validar compatibilidad de clase
        const userClass = user.class.toLowerCase();
        if (!validateClassCompatibility(userClass, reward.allowedClasses)) {
            return res.status(400).json({ 
                message: `Your class (${user.class}) cannot equip this item. Allowed: ${reward.allowedClasses.join(', ')}` 
            });
        }

        // Determinar slot de destino
        let targetSlot = slot;
        if (!targetSlot) {
            targetSlot = determineCompatibleSlot(reward.type, reward.slot);
        }

        // Caso especial para anillos
        if (reward.type === 'accessory' && (!targetSlot || reward.slot === 'ring')) {
            targetSlot = findAvailableRingSlot(user, slot);
        }

        if (!targetSlot) {
            return res.status(400).json({ message: 'Cannot determine equipment slot for this item' });
        }

        // Verificar si el slot existe en nuestro mapa
        if (!SLOT_MAP[targetSlot]) {
            return res.status(400).json({ message: `Invalid equipment slot: ${targetSlot}` });
        }

        // Verificar compatibilidad de tipo con el slot
        const slotTypes = SLOT_MAP[targetSlot];
        if (!slotTypes.includes(reward.type) && !slotTypes.includes(reward.slot)) {
            return res.status(400).json({ 
                message: `This item cannot be equipped in the ${targetSlot} slot. Item type: ${reward.type}, slot: ${reward.slot}` 
            });
        }

        // DESEQUIPAR ITEM ACTUAL EN EL MISMO SLOT (si existe)
        const currentlyEquippedInSlot = user.inventory.find(item => 
            item.equipped && item.equippedSlot === targetSlot
        );

        if (currentlyEquippedInSlot) {
            // Remover bonificaciones del item actual
            const currentReward = await Reward.findById(currentlyEquippedInSlot.itemId);
            if (currentReward && currentReward.effects) {
                user.equipmentBonuses.strength -= (currentReward.effects.buffStrength || 0);
                user.equipmentBonuses.intelligence -= (currentReward.effects.buffIntelligence || 0);
                user.equipmentBonuses.vitality -= (currentReward.effects.buffVitality || 0);
                user.equipmentBonuses.dexterity -= (currentReward.effects.buffDexterity || 0);
                user.equipmentBonuses.luck -= (currentReward.effects.buffLuck || 0);
            }
            
            // Desequipar
            currentlyEquippedInSlot.equipped = false;
            currentlyEquippedInSlot.equippedSlot = null;
        }

        // EQUIPAR NUEVO ITEM
        invItem.equipped = true;
        invItem.equippedSlot = targetSlot;

        // Aplicar bonificaciones del nuevo item
        if (reward.effects) {
            user.equipmentBonuses.strength += (reward.effects.buffStrength || 0);
            user.equipmentBonuses.intelligence += (reward.effects.buffIntelligence || 0);
            user.equipmentBonuses.vitality += (reward.effects.buffVitality || 0);
            user.equipmentBonuses.dexterity += (reward.effects.buffDexterity || 0);
            user.equipmentBonuses.luck += (reward.effects.buffLuck || 0);
        }

        // Actualizar HP/MP máximos si la vitalidad cambió
        user.combat.maxHP = user.calculateMaxHP();
        user.combat.maxMana = user.calculateMaxMana();
        
        if (user.combat.currentHP > user.combat.maxHP) {
            user.combat.currentHP = user.combat.maxHP;
        }
        if (user.combat.currentMana > user.combat.maxMana) {
            user.combat.currentMana = user.combat.maxMana;
        }

        await user.save();

        // Obtener respuesta detallada
        const inventoryWithDetails = await Promise.all(
            user.inventory.map(async (item) => {
                const itemReward = await Reward.findById(item.itemId);
                return {
                    ...item.toObject(),
                    details: itemReward
                };
            })
        );

        const equippedItems = inventoryWithDetails.filter(item => item.equipped);

        res.json({ 
            success: true,
            message: `Item equipped in ${targetSlot} slot`,
            data: {
                user,
                equippedSlot: targetSlot,
                equippedItem: {
                    ...invItem.toObject(),
                    details: reward
                },
                inventory: inventoryWithDetails,
                equipmentBonuses: user.equipmentBonuses
            }
        });
    } catch (err) { 
        console.error('Equip error:', err);
        next(err); 
    }
};

// UNEQUIP ITEM - Mejorado para slots específicos
const unequipItem = async (req, res, next) => {
    try {
        const { itemId, slot } = req.body; // Puede ser itemId o slot específico
        const user = await User.findById(req.user._id);

        let invItem;
        
        // Si se proporciona itemId, buscar por ID
        if (itemId) {
            invItem = user.inventory.id(itemId);
            if (!invItem) return res.status(404).json({ message: 'Item not found in inventory' });
            if (!invItem.equipped) return res.status(400).json({ message: 'Item is not equipped' });
        } 
        // Si se proporciona slot, buscar por slot
        else if (slot) {
            invItem = user.inventory.find(item => 
                item.equipped && item.equippedSlot === slot
            );
            if (!invItem) return res.status(400).json({ message: `No item equipped in ${slot} slot` });
        } 
        else {
            return res.status(400).json({ message: 'Either itemId or slot must be provided' });
        }

        // Get item details
        const reward = await Reward.findById(invItem.itemId);
        if (!reward) return res.status(404).json({ message: 'Item details not found' });

        const equippedSlot = invItem.equippedSlot;

        // Remover bonificaciones
        if (reward.effects) {
            user.equipmentBonuses.strength -= (reward.effects.buffStrength || 0);
            user.equipmentBonuses.intelligence -= (reward.effects.buffIntelligence || 0);
            user.equipmentBonuses.vitality -= (reward.effects.buffVitality || 0);
            user.equipmentBonuses.dexterity -= (reward.effects.buffDexterity || 0);
            user.equipmentBonuses.luck -= (reward.effects.buffLuck || 0);
        }

        // Desequipar
        invItem.equipped = false;
        invItem.equippedSlot = null;

        // Actualizar HP/MP máximos
        const newMaxHP = user.calculateMaxHP();
        const newMaxMana = user.calculateMaxMana();
        
        user.combat.maxHP = newMaxHP;
        user.combat.maxMana = newMaxMana;
        
        if (user.combat.currentHP > newMaxHP) {
            user.combat.currentHP = newMaxHP;
        }
        if (user.combat.currentMana > newMaxMana) {
            user.combat.currentMana = newMaxMana;
        }

        await user.save();

        res.json({ 
            success: true,
            message: `Item unequipped from ${equippedSlot || 'slot'}`,
            data: { user }
        });
    } catch (err) { 
        console.error('Unequip error:', err);
        next(err); 
    }
};

// USE ITEM - Mantener similar con mejoras
const useItem = async (req, res, next) => {
    try {
        const { itemId } = req.body; // This is the inventory item _id (instance ID)
        const user = await User.findById(req.user._id);

        // Find item in inventory by instance ID
        const invItem = user.inventory.id(itemId);
        if (!invItem) return res.status(404).json({ message: 'Item not found in inventory' });

        // Get item details
        const reward = await Reward.findById(invItem.itemId);
        if (!reward) return res.status(404).json({ message: 'Item details not found' });

        let message = `Used ${reward.name}!`;
        let effectsApplied = [];

        // Aplicar efectos basados en tipo
        if (reward.type === 'consumable') {
            // Efectos de curación
            if (reward.effects?.healHP) {
                const healAmount = reward.effects.healHP;
                user.combat.currentHP = Math.min(user.combat.currentHP + healAmount, user.combat.maxHP);
                effectsApplied.push(`Restored ${healAmount} HP`);
            }

            if (reward.effects?.healMana) {
                const manaAmount = reward.effects.healMana;
                user.combat.currentMana = Math.min(user.combat.currentMana + manaAmount, user.combat.maxMana);
                effectsApplied.push(`Restored ${manaAmount} Mana`);
            }

            // Buffs temporales (para implementación futura)
            if (reward.effects?.duration > 0) {
                // Aquí podrías añadir lógica para buffs temporales
                effectsApplied.push(`Temporary buff for ${reward.effects.duration} turns`);
            }

            // Otros efectos
            if (reward.effects?.grantXP) {
                user.xp += reward.effects.grantXP;
                effectsApplied.push(`Gained ${reward.effects.grantXP} XP`);
            }

            if (reward.effects?.addGold) {
                user.gold += reward.effects.addGold;
                effectsApplied.push(`Gained ${reward.effects.addGold} Gold`);
            }

            // Decrease quantity or remove item
            if (invItem.quantity > 1) {
                invItem.quantity -= 1;
            } else {
                // Remove item from inventory
                user.inventory.pull(itemId);
            }
        } 
        else if (reward.type === 'scroll' || reward.type === 'skill_book') {
            // Lógica para pergaminos o libros de habilidades
            effectsApplied.push('Skill/Spell effect applied');
            
            // Decrease quantity or remove
            if (invItem.quantity > 1) {
                invItem.quantity -= 1;
            } else {
                user.inventory.pull(itemId);
            }
        }
        else {
            return res.status(400).json({ message: 'This item type cannot be used directly' });
        }

        // Construir mensaje final
        if (effectsApplied.length > 0) {
            message += ' ' + effectsApplied.join(', ');
        }

        await user.save();

        res.json({ 
            success: true,
            message: message,
            data: { user }
        });
    } catch (err) { 
        console.error('Use item error:', err);
        next(err); 
    }
};

// NUEVO: Obtener estadísticas detalladas del equipo
const getEquipmentStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        // Obtener items equipados con detalles
        const equippedItems = [];
        let totalBonuses = {
            strength: 0,
            intelligence: 0,
            vitality: 0,
            dexterity: 0,
            luck: 0,
            armorRating: 0,
            magicResistance: 0
        };

        // Calcular bonificaciones
        for (const invItem of user.inventory) {
            if (invItem.equipped) {
                const reward = await Reward.findById(invItem.itemId);
                if (reward && reward.effects) {
                    equippedItems.push({
                        ...invItem.toObject(),
                        details: reward,
                        slot: invItem.equippedSlot
                    });

                    // Sumar bonificaciones
                    const effects = reward.effects;
                    if (effects.buffStrength) totalBonuses.strength += effects.buffStrength;
                    if (effects.buffIntelligence) totalBonuses.intelligence += effects.buffIntelligence;
                    if (effects.buffVitality) totalBonuses.vitality += effects.buffVitality;
                    if (effects.buffDexterity) totalBonuses.dexterity += effects.buffDexterity;
                    if (effects.buffLuck) totalBonuses.luck += effects.buffLuck;
                    if (effects.defense) totalBonuses.armorRating += effects.defense;
                    if (effects.magicResistance) totalBonuses.magicResistance += effects.magicResistance;
                }
            }
        }

        // Calcular estadísticas totales
        const totalStats = {
            strength: user.stats.strength + totalBonuses.strength,
            intelligence: user.stats.intelligence + totalBonuses.intelligence,
            vitality: user.stats.vitality + totalBonuses.vitality,
            dexterity: user.stats.dexterity + totalBonuses.dexterity,
            luck: user.stats.luck + totalBonuses.luck
        };

        res.json({
            success: true,
            data: {
                equippedItems,
                equipmentBonuses: totalBonuses,
                totalStats,
                baseStats: user.stats,
                maxHP: user.calculateMaxHP(),
                maxMana: user.calculateMaxMana(),
                currentHP: user.combat.currentHP,
                currentMana: user.combat.currentMana
            }
        });
    } catch (err) {
        console.error('Get equipment stats error:', err);
        next(err);
    }
};

// NUEVO: Cambiar item de slot
const swapItemSlot = async (req, res, next) => {
    try {
        const { itemId, newSlot } = req.body;
        const user = await User.findById(req.user._id);

        // Verificar que el item existe y está equipado
        const invItem = user.inventory.id(itemId);
        if (!invItem) return res.status(404).json({ message: 'Item not found in inventory' });
        if (!invItem.equipped) return res.status(400).json({ message: 'Item must be equipped to swap slots' });

        // Obtener detalles del item
        const reward = await Reward.findById(invItem.itemId);
        if (!reward) return res.status(404).json({ message: 'Item details not found' });

        // Verificar que el nuevo slot sea compatible
        const compatibleSlot = determineCompatibleSlot(reward.type, reward.slot);
        if (newSlot !== compatibleSlot && !(reward.type === 'accessory' && newSlot.startsWith('ring'))) {
            return res.status(400).json({ 
                message: `Item cannot be moved to ${newSlot} slot. Compatible slot: ${compatibleSlot}` 
            });
        }

        // Verificar si hay un item en el nuevo slot
        const itemInNewSlot = user.inventory.find(item => 
            item.equipped && item.equippedSlot === newSlot
        );

        const oldSlot = invItem.equippedSlot;

        if (itemInNewSlot) {
            // Intercambiar slots
            itemInNewSlot.equippedSlot = oldSlot;
        }

        // Mover el item al nuevo slot
        invItem.equippedSlot = newSlot;

        await user.save();

        res.json({
            success: true,
            message: `Item moved from ${oldSlot} to ${newSlot}`,
            data: { user }
        });
    } catch (err) {
        console.error('Swap slot error:', err);
        next(err);
    }
};

module.exports = {
    listRewards,
    createReward,
    buyReward,
    getInventory,
    equipItem,
    unequipItem,
    useItem,
    getEquipmentStats,
    swapItemSlot
};