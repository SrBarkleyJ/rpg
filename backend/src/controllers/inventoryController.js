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

// GET INVENTORY
const getInventory = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        const inventoryWithDetails = await Promise.all(
            user.inventory.map(async (invItem) => {
                const reward = await Reward.findById(invItem.itemId);
                return {
                    _id: invItem._id,
                    itemId: invItem.itemId,
                    quantity: invItem.quantity,
                    equipped: invItem.equipped,
                    equippedSlot: invItem.equippedSlot || null,
                    enhancementLevel: invItem.enhancementLevel,
                    details: reward ? reward.toObject() : null
                };
            })
        );

        res.json({
            success: true,
            data: {
                inventory: inventoryWithDetails,
                equipped: inventoryWithDetails.filter(i => i.equipped),
                equipmentBonuses: user.equipmentBonuses || {},
                user: {
                    gold: user.gold,
                    stats: user.stats,
                    combat: user.combat
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// EQUIP ITEM
const equipItem = async (req, res, next) => {
    try {
        let { invId, itemId, slot } = req.body;

        // Permissive check: use invId if present, otherwise itemId (frontend compatibility)
        const targetId = invId || itemId;

        if (!targetId) {
            console.log('[Equip] Error: Missing invId/itemId. Body:', req.body);
            return res.status(400).json({ success: false, message: 'invId is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Use the User model method which handles validation, slot determination, and state updates
        // Note: user.equipItem expects just itemId (string) but we are passing inventory ID
        // We need to retrieve the itemId from the inventory item first
        const invItem = user.inventory.id(invId);
        if (!invItem) {
            return res.status(404).json({ success: false, message: 'Item not found in inventory' });
        }

        try {
            // Pass the inventory instance ID (targetId) directly
            const result = await user.equipItem(targetId, slot);
            await user.save(); // Triggers bonus recalculation

            res.json({
                success: true,
                message: `Item equipped in ${result.slot} slot`,
                data: { user }
            });
        } catch (modelError) {
            return res.status(400).json({ success: false, message: modelError.message });
        }

    } catch (err) {
        next(err);
    }
};

// UNEQUIP ITEM
const unequipItem = async (req, res, next) => {
    try {
        const { invId, slot } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let targetSlot = slot;

        // If invId provided, find which slot it is equipped in
        if (invId && !targetSlot) {
            const invItem = user.inventory.id(invId);
            if (invItem && invItem.equipped) {
                targetSlot = invItem.equippedSlot;
            }
        }

        if (!targetSlot) {
            return res.status(400).json({ success: false, message: 'Slot or valid equipped invId required' });
        }

        await user.unequipSlot(targetSlot);
        await user.save(); // Triggers bonus recalculation

        res.json({ success: true, message: 'Item unequipped', data: { user } });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getInventory,
    equipItem,
    unequipItem,
};
