const User = require('../models/User');
const Reward = require('../models/Reward');

// Enhancement costs by level
const FORGE_COSTS = {
    1: 3, 2: 5, 3: 7, 4: 9, 5: 12,
    6: 15, 7: 18, 8: 21, 9: 24, 10: 30
};

// Calculate stat multiplier based on enhancement level
const calculateStatMultiplier = (level) => {
    if (level === 0) return 1.0;
    if (level >= 1 && level <= 4) {
        return 1.0 + (level * 0.20); // +20% per level
    }
    if (level >= 5 && level <= 10) {
        return 1.8 + ((level - 4) * 1.0); // +100% per level after +4
    }
    return 1.0;
};

// Apply enhancement multiplier to stats
const applyEnhancement = (baseEffects, level) => {
    const multiplier = calculateStatMultiplier(level);
    const enhanced = {};

    for (const [key, value] of Object.entries(baseEffects)) {
        if (typeof value === 'number' && key.startsWith('buff')) {
            enhanced[key] = Math.floor(value * multiplier);
        } else {
            enhanced[key] = value;
        }
    }

    return enhanced;
};

// Get all forgeable items from inventory
const getForgeableItems = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const forgeableItems = [];

        for (const invItem of user.inventory) {
            const reward = await Reward.findById(invItem.itemId);
            if (!reward) continue;
            if (reward.type === 'consumable') continue;

            const currentLevel = invItem.enhancementLevel || 0;
            const canEnhance = currentLevel < 10;
            const nextLevel = currentLevel + 1;
            const cost = FORGE_COSTS[nextLevel] || 0;

            // Calculate current stats
            const currentStats = applyEnhancement(reward.effects, currentLevel);

            // Calculate next level stats
            const nextStats = canEnhance ? applyEnhancement(reward.effects, nextLevel) : null;

            forgeableItems.push({
                inventoryId: invItem._id,
                ...reward.toObject(),
                currentLevel,
                canEnhance,
                nextLevel: canEnhance ? nextLevel : null,
                forgeCost: canEnhance ? cost : null,
                currentStats,
                nextStats,
                equipped: invItem.equipped
            });
        }

        res.json({
            tetranuta: user.tetranuta || 0,
            items: forgeableItems
        });
    } catch (err) { next(err); }
};

// Enhance an item to the next level
const forgeItem = async (req, res, next) => {
    try {
        const { inventoryId } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find item in inventory
        const invItem = user.inventory.id(inventoryId);
        if (!invItem) return res.status(404).json({ message: 'Item not found in inventory' });

        // Get item details
        const reward = await Reward.findById(invItem.itemId);
        if (!reward) return res.status(404).json({ message: 'Item details not found' });

        // Check current level
        const currentLevel = invItem.enhancementLevel || 0;
        if (currentLevel >= 10) {
            return res.status(400).json({ message: 'Item is already at maximum level (+10)' });
        }

        const nextLevel = currentLevel + 1;
        const cost = FORGE_COSTS[nextLevel];

        // Check tetranuta
        if ((user.tetranuta || 0) < cost) {
            return res.status(400).json({ message: `Not enough Tetranuta. Need ${cost}.` });
        }

        // Calculate old and new stats
        const oldStats = applyEnhancement(reward.effects, currentLevel);
        const newStats = applyEnhancement(reward.effects, nextLevel);

        // If item is equipped, update equipment bonuses
        if (invItem.equipped) {
            // Remove old bonuses
            for (const [key, value] of Object.entries(oldStats)) {
                if (typeof value === 'number' && key.startsWith('buff')) {
                    const stat = key.replace('buff', '').toLowerCase();
                    if (user.equipmentBonuses[stat] !== undefined) {
                        user.equipmentBonuses[stat] -= value;
                    }
                }
            }

            // Add new bonuses
            for (const [key, value] of Object.entries(newStats)) {
                if (typeof value === 'number' && key.startsWith('buff')) {
                    const stat = key.replace('buff', '').toLowerCase();
                    if (user.equipmentBonuses[stat] !== undefined) {
                        user.equipmentBonuses[stat] += value;
                    }
                }
            }
        }

        // Deduct tetranuta
        user.tetranuta -= cost;

        // Increment enhancement level
        invItem.enhancementLevel = nextLevel;

        // Update max HP if vitality changed
        user.combat.maxHP = user.calculateMaxHP();
        if (user.combat.currentHP > user.combat.maxHP) {
            user.combat.currentHP = user.combat.maxHP;
        }

        await user.save();

        res.json({
            message: `Successfully enhanced ${reward.name} to +${nextLevel}!`,
            newLevel: nextLevel,
            newStats,
            user: {
                tetranuta: user.tetranuta,
                inventory: user.inventory,
                equipmentBonuses: user.equipmentBonuses,
                combat: user.combat
            }
        });

    } catch (err) { next(err); }
};

module.exports = { getForgeableItems, forgeItem };
