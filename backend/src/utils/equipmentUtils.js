/**
 * Utility functions for equipment/inventory management
 * Consolidates shared logic between inventory and reward controllers
 */

// Mapa de slots compatibles
const SLOT_MAP = {
    'mainhand': ['weapon'],
    'offhand': ['weapon', 'shield'],
    'helmet': ['armor'],
    'chest': ['armor'],
    'gloves': ['armor'],
    'boots': ['armor'],
    'cape': ['armor'],
    'ring1': ['accessory'],
    'ring2': ['accessory'],
    'ring3': ['accessory'],
    'ring4': ['accessory'],
    'amulet': ['accessory'],
    'belt': ['accessory'],
    'artifact': ['accessory']
};

/**
 * Determine compatible slot based on item type and specified slot
 */
const determineCompatibleSlot = (itemType, itemSlot) => {
    if (itemSlot && SLOT_MAP[itemSlot]) {
        return itemSlot;
    }
    
    switch (itemType) {
        case 'weapon':
            return itemSlot === 'offhand' ? 'offhand' : 'mainhand';
        case 'shield':
            return 'offhand';
        case 'armor':
            if (itemSlot === 'helmet') return 'helmet';
            if (itemSlot === 'chest') return 'chest';
            if (itemSlot === 'gloves') return 'gloves';
            if (itemSlot === 'boots') return 'boots';
            if (itemSlot === 'cape') return 'cape';
            return 'chest';
        case 'accessory':
            if (itemSlot === 'amulet') return 'amulet';
            if (itemSlot === 'belt') return 'belt';
            if (itemSlot === 'artifact') return 'artifact';
            return null;
        default:
            return null;
    }
};

/**
 * Find available ring slot
 */
const findAvailableRingSlot = (user, forceSlot = null) => {
    if (forceSlot && ['ring1', 'ring2', 'ring3', 'ring4'].includes(forceSlot)) {
        return forceSlot;
    }
    for (let i = 1; i <= 4; i++) {
        const slot = `ring${i}`;
        const isTaken = user.inventory.some(item => item.equipped && item.equippedSlot === slot);
        if (!isTaken) return slot;
    }
    return 'ring1';
};

/**
 * Validate class compatibility
 */
const validateClassCompatibility = (userClass, allowedClasses) => {
    if (!allowedClasses || allowedClasses.length === 0) return true;
    if (allowedClasses.includes('all')) return true;
    return allowedClasses.includes(userClass.toLowerCase());
};

/**
 * Apply equipment bonuses to user
 */
const applyEquipmentBonus = (equipmentBonuses, reward) => {
    if (!reward || !reward.effects) return;
    
    equipmentBonuses.strength += reward.effects.buffStrength || 0;
    equipmentBonuses.intelligence += reward.effects.buffIntelligence || 0;
    equipmentBonuses.vitality += reward.effects.buffVitality || 0;
    equipmentBonuses.dexterity += reward.effects.buffDexterity || 0;
    equipmentBonuses.luck += reward.effects.buffLuck || 0;
};

/**
 * Remove equipment bonuses from user
 */
const removeEquipmentBonus = (equipmentBonuses, reward) => {
    if (!reward || !reward.effects) return;
    
    equipmentBonuses.strength -= reward.effects.buffStrength || 0;
    equipmentBonuses.intelligence -= reward.effects.buffIntelligence || 0;
    equipmentBonuses.vitality -= reward.effects.buffVitality || 0;
    equipmentBonuses.dexterity -= reward.effects.buffDexterity || 0;
    equipmentBonuses.luck -= reward.effects.buffLuck || 0;
};

module.exports = {
    SLOT_MAP,
    determineCompatibleSlot,
    findAvailableRingSlot,
    validateClassCompatibility,
    applyEquipmentBonus,
    removeEquipmentBonus
};
