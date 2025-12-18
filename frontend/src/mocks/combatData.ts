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
    }
];

export const MOCK_REWARDS = [
    {
        _id: "reward_1",
        name: "Steel Sword",
        type: "weapon",
        rarity: "uncommon",
        cost: 200,
        obtainableInShop: true,
        allowedClasses: ["warrior", "rogue"],
        image: "sword_basic",
        stats: { attack: 15 },
        description: "A sturdy sword made of steel."
    },
    {
        _id: "reward_2",
        name: "Magic Staff",
        type: "weapon",
        rarity: "rare",
        cost: 500,
        obtainableInShop: true,
        allowedClasses: ["mage"],
        image: "staff_basic",
        stats: { intelligence: 10 },
        description: "A staff imbued with magical energy."
    }
];

export const MOCK_TASKS = [
    {
        _id: "task_1",
        title: { en: "Defeat 5 Slimes", es: "Derrota 5 Slimes" },
        description: { en: "Protect the village.", es: "Protege la aldea." },
        repeatType: "daily",
        difficulty: 1,
        rewardXP: 100,
        rewardGold: 50,
        type: "system"
    },
    {
        _id: "task_2",
        title: { en: "The Dragon Lair", es: "La Guarida del Dragón" },
        description: { en: "Defeat the mighty dragon.", es: "Derrota al poderoso dragón." },
        repeatType: "weekly",
        difficulty: 3,
        rewardXP: 1000,
        rewardGold: 500,
        type: "system"
    }
];

export const MOCK_FORGE = {
    tetranuta: 100,
    items: [
        {
            inventoryId: "inv_item_1",
            name: "Wooden Sword",
            image: "sword_basic",
            currentLevel: 0,
            nextLevel: 1,
            forgeCost: 10
        }
    ]
};

export const MOCK_SKILLS = {
    availableSP: 5,
    skills: [
        {
            id: "bash",
            name: "Bash",
            description: "A powerful strike.",
            currentLevel: 1,
            maxLevel: 5,
            nextCost: 1
        },
        {
            id: "fireball",
            name: "Fireball",
            description: "Launch a ball of fire.",
            currentLevel: 0,
            maxLevel: 5,
            nextCost: 1
        }
    ]
};
