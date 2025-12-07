// Class stat templates
const CLASS_STATS = {
    warrior: {
        strength: 15,
        intelligence: 8,
        vitality: 12,
        dexterity: 10,
        luck: 10
    },
    mage: {
        strength: 8,
        intelligence: 15,
        vitality: 10,
        dexterity: 10,
        luck: 12
    },
    rogue: {
        strength: 10,
        intelligence: 10,
        vitality: 10,
        dexterity: 15,
        luck: 12
    }
};

const getInitialStats = (className) => {
    return CLASS_STATS[className] || CLASS_STATS.warrior;
};

const getInitialHP = (className) => {
    const stats = getInitialStats(className);
    return 100 + (stats.vitality * 10);
};

module.exports = { getInitialStats, getInitialHP };
