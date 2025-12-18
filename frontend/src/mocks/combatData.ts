export const MOCK_COMBAT = {
    combatId: "mock_combat_456",
    status: "active",
    playerTurn: true,
    enemy: {
        id: "slime",
        name: "Slime",
        maxHP: 50,
        currentHP: 50,
        attack: 10,
        defense: 5,
        speed: 5
    },
    log: [
        { actor: "System", message: "A wild Slime appears!", type: "info" }
    ]
};

export const MOCK_DUNGEONS = {
    dungeons: [
        {
            _id: "dungeon_1",
            name: "Goblin Cave",
            description: "A dark cave filled with goblins.",
            levelRequired: 1,
            totalEnemies: 5,
            currentEnemy: 0,
            inProgress: false
        },
        {
            _id: "dungeon_2",
            name: "Dragon's Lair",
            description: "The nest of a mighty dragon.",
            levelRequired: 10,
            totalEnemies: 10,
            currentEnemy: 0,
            inProgress: false
        }
    ]
};

export const MOCK_INVENTORY = [
    {
        _id: "inv_item_1",
        itemId: "wooden_sword",
        quantity: 1,
        equipped: true,
        equippedSlot: "hand",
        enhancementLevel: 0,
        details: {
            name: "Wooden Sword",
            type: "weapon",
            rarity: "common",
            stats: { attack: 5 },
            effects: { buffStrength: 2, duration: 0 },
            description: "A simple sword made of wood."
        }
    },
    {
        _id: "inv_item_2",
        itemId: "health_potion",
        quantity: 5,
        equipped: false,
        enhancementLevel: 0,
        details: {
            name: "Health Potion",
            type: "consumable",
            rarity: "common",
            stats: { heal: 20 },
            effects: { healHP: 20, duration: 0 },
            description: "A red potion that restores HP."
        }
    },
    {
        _id: "inv_item_3",
        itemId: "iron_armor",
        quantity: 1,
        equipped: false,
        enhancementLevel: 0,
        details: {
            name: "Iron Armor",
            type: "armor",
            rarity: "common",
            stats: { defense: 10 },
            effects: { buffVitality: 5, duration: 0 },
            description: "Heavy plate armor."
        }
    }
];
