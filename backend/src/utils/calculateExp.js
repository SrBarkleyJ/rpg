/**
 * Calculates the XP required to reach the next level.
 * Formula: Base (100) * Level * Difficulty Multiplier (1.1)
 */
const calculateNextLevelXp = (level) => {
    return Math.floor(100 * (level * 1.5));
};

/**
 * Checks if the user has enough XP to level up and returns the new level and remaining XP.
 * @param {number} currentXp 
 * @param {number} currentLevel 
 * @returns {Object} { newLevel, remainderXp, leveledUp }
 */
const checkLevelUp = (currentXp, currentLevel) => {
    let xp = currentXp;
    let level = currentLevel;
    let leveledUp = false;

    let nextLevelXp = calculateNextLevelXp(level);

    while (xp >= nextLevelXp) {
        xp -= nextLevelXp;
        level++;
        nextLevelXp = calculateNextLevelXp(level);
        leveledUp = true;
    }

    return { newLevel: level, remainderXp: xp, leveledUp };
};

module.exports = { calculateNextLevelXp, checkLevelUp };
