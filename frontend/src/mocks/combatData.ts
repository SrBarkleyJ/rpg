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
            inProgress: false
        },
        {
            _id: "dungeon_2",
            name: "Dragon's Lair",
            description: "The nest of a mighty dragon.",
            levelRequired: 10,
            totalEnemies: 10,
            inProgress: false
        }
    ]
};
