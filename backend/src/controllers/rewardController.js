const Reward = require('../models/Reward');
const User = require('../models/User');

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

const createReward = async (req, res, next) => {
    try {
        const reward = await Reward.create(req.body);
        res.status(201).json(reward);
    } catch (err) { next(err); }
};

const buyReward = async (req, res, next) => {
    try {
        const { rewardId } = req.body;
        const reward = await Reward.findById(rewardId);
        if (!reward) return res.status(404).json({ message: 'Reward not found' });

        const user = await User.findById(req.user._id);
        if (user.gold < reward.value) return res.status(400).json({ message: 'Not enough gold' });

        user.gold -= reward.value;

        // Check for stacking if consumable
        let itemAdded = false;
        if (reward.type === 'consumable') {
            const existingItem = user.inventory.find(item => item.itemId === rewardId);
            if (existingItem) {
                existingItem.quantity += 1;
                itemAdded = true;
            }
        }

        if (!itemAdded) {
            user.inventory.push({ itemId: reward._id, quantity: 1 });
        }

        await user.save();

        res.json({ message: 'Reward purchased', user });
    } catch (err) { next(err); }
};

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

        res.json(inventoryWithDetails);
    } catch (err) { next(err); }
};

const equipItem = async (req, res, next) => {
    try {
        const { itemId } = req.body; // This is now the Inventory Item _id (instance ID)
        const user = await User.findById(req.user._id);

        // Find item in inventory by its unique instance ID
        const invItem = user.inventory.id(itemId);
        if (!invItem) return res.status(404).json({ message: 'Item not found in inventory' });

        // Get item details
        const reward = await Reward.findById(invItem.itemId);
        if (!reward) return res.status(404).json({ message: 'Item details not found' });

        // Only equipment can be equipped (not consumables)
        if (reward.type === 'consumable') {
            return res.status(400).json({ message: 'Consumables cannot be equipped. Use them instead.' });
        }

        // Check if item has temporary duration (should be used, not equipped)
        if (reward.effects.duration > 0) {
            return res.status(400).json({ message: 'Temporary items cannot be equipped. Use them instead.' });
        }

        // Unequip any item in the same slot
        const slotMap = {
            'mainhand': 'weapon',
            'offhand': 'weapon',
            'chest': 'armor',
            'head': 'armor',
            'legs': 'accessory',
            'accessory': 'accessory'
        };
        const equipSlot = slotMap[reward.slot];

        // Find currently equipped item in the same slot
        for (const item of user.inventory) {
            if (item.equipped) {
                const existingReward = await Reward.findById(item.itemId);
                if (existingReward && slotMap[existingReward.slot] === equipSlot) {
                    item.equipped = false;
                    // Remove bonuses from previously equipped item
                    if (existingReward.effects) {
                        user.equipmentBonuses.strength -= (existingReward.effects.buffStrength || 0);
                        user.equipmentBonuses.intelligence -= (existingReward.effects.buffIntelligence || 0);
                        user.equipmentBonuses.vitality -= (existingReward.effects.buffVitality || 0);
                        user.equipmentBonuses.dexterity -= (existingReward.effects.buffDexterity || 0);
                        user.equipmentBonuses.luck -= (existingReward.effects.buffLuck || 0);
                    }
                }
            }
        }

        // Equip the new item
        invItem.equipped = true;

        // Apply bonuses
        if (reward.effects) {
            user.equipmentBonuses.strength += (reward.effects.buffStrength || 0);
            user.equipmentBonuses.intelligence += (reward.effects.buffIntelligence || 0);
            user.equipmentBonuses.vitality += (reward.effects.buffVitality || 0);
            user.equipmentBonuses.dexterity += (reward.effects.buffDexterity || 0);
            user.equipmentBonuses.luck += (reward.effects.buffLuck || 0);
        }

        // Update max HP if vitality changed
        user.combat.maxHP = user.calculateMaxHP();
        if (user.combat.currentHP > user.combat.maxHP) {
            user.combat.currentHP = user.combat.maxHP;
        }

        await user.save();

        res.json({ message: 'Item equipped successfully', user });
    } catch (err) { next(err); }
};

const unequipItem = async (req, res, next) => {
    try {
        const { itemId } = req.body; // This is the Inventory Item _id (instance ID)
        const user = await User.findById(req.user._id);

        // Find item in inventory by instance ID
        const invItem = user.inventory.id(itemId);
        if (!invItem) return res.status(404).json({ message: 'Item not found in inventory' });
        if (!invItem.equipped) return res.status(400).json({ message: 'Item is not equipped' });

        // Get item details
        const reward = await Reward.findById(invItem.itemId);
        if (!reward) return res.status(404).json({ message: 'Item details not found' });

        // Unequip
        invItem.equipped = false;

        // Remove bonuses
        if (reward.effects) {
            user.equipmentBonuses.strength -= (reward.effects.buffStrength || 0);
            user.equipmentBonuses.intelligence -= (reward.effects.buffIntelligence || 0);
            user.equipmentBonuses.vitality -= (reward.effects.buffVitality || 0);
            user.equipmentBonuses.dexterity -= (reward.effects.buffDexterity || 0);
            user.equipmentBonuses.luck -= (reward.effects.buffLuck || 0);
        }

        // Update max HP if vitality changed
        const newMaxHP = user.calculateMaxHP();
        if (user.combat.maxHP > newMaxHP) {
            user.combat.maxHP = newMaxHP;
            if (user.combat.currentHP > newMaxHP) {
                user.combat.currentHP = newMaxHP;
            }
        }

        await user.save();

        res.json({ message: 'Item unequipped successfully', user });
    } catch (err) { next(err); }
};

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

        // Only consumables can be used
        if (reward.type !== 'consumable') {
            return res.status(400).json({ message: 'Only consumables can be used directly' });
        }

        // Apply effects
        let message = `Used ${reward.name}!`;

        if (reward.effects.healHP) {
            user.combat.currentHP = Math.min(user.combat.currentHP + reward.effects.healHP, user.combat.maxHP);
            message += ` Restored ${reward.effects.healHP} HP.`;
        }

        // Apply permanent stat buffs
        if (reward.effects.buffVitality) {
            user.baseStats.vitality += reward.effects.buffVitality;
            message += ` +${reward.effects.buffVitality} VIT permanently!`;
        }
        if (reward.effects.buffDexterity) {
            user.baseStats.dexterity += reward.effects.buffDexterity;
            message += ` +${reward.effects.buffDexterity} DEX permanently!`;
        }
        if (reward.effects.buffLuck) {
            user.baseStats.luck += reward.effects.buffLuck;
            message += ` +${reward.effects.buffLuck} LUCK permanently!`;
        }

        // Decrease quantity or remove item
        if (invItem.quantity > 1) {
            invItem.quantity -= 1;
        } else {
            // Remove item from inventory
            user.inventory.pull(itemId);
        }

        await user.save();

        res.json({ message, user });
    } catch (err) { next(err); }
};

module.exports = {
    listRewards,
    createReward,
    buyReward,
    getInventory,
    equipItem,
    unequipItem,
    useItem
};
