const Enemy = require('../../models/enemyModel');
const User = require('../../models/User');
const { getRandomEnemyForLevel } = require('../../data/enemies');

// Generate enemy based on player level
// BALANCE: Enemy stats scale at HALF the rate of player stats
const generateEnemy = (playerLevel, language = 'en') => {
    // Enemy stats scale at 50% rate compared to player
    const levelScaling = playerLevel * 0.5; // Half scaling
    const baseHP = 50 + (levelScaling * 10);
    const baseDamage = 5 + (levelScaling * 2);

    // Get random enemy from database
    const enemyTemplate = getRandomEnemyForLevel(playerLevel);

    return {
        id: enemyTemplate.id,
        name: enemyTemplate.name[language] || enemyTemplate.name.en,
        description: enemyTemplate.description[language] || enemyTemplate.description.en,
        level: playerLevel,
        hp: Math.floor(baseHP * enemyTemplate.hpMod),
        maxHP: Math.floor(baseHP * enemyTemplate.hpMod),
        damage: Math.floor(baseDamage * enemyTemplate.dmgMod),
        image: enemyTemplate.image,
        special: enemyTemplate.special,
        tier: enemyTemplate.tier,
        loot: enemyTemplate.loot
    };
};

// Calculate difficulty rating based on player and enemy stats
const calculateDifficulty = (player, enemy) => {
    const levelDiff = enemy.level - player.level;

    // Calculate stat power
    const playerPower = player.stats.strength + player.stats.defense + (player.stats.intelligence || 0);
    const enemyPower = enemy.strength + enemy.defense + (enemy.maxHP / 10);

    const powerRatio = enemyPower / playerPower;

    // Determine difficulty
    if (levelDiff <= -3 || powerRatio < 0.7) return 'easy';
    if (levelDiff <= -1 || powerRatio < 0.9) return 'medium';
    if (levelDiff <= 1 || powerRatio < 1.2) return 'hard';
    if (levelDiff <= 3 || powerRatio < 1.5) return 'very-hard';
    return 'extreme';
};

// Get all available enemies with difficulty ratings
const getEnemies = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get all enemies from catalog
        const enemies = await Enemy.find({}).sort({ tier: 1, baseLevel: 1 });

        // Add difficulty for each enemy at player's level
        const enemiesWithDifficulty = enemies.map(enemy => {
            const scaledEnemy = enemy.scaleToLevel(user.level);
            const difficulty = calculateDifficulty(user, scaledEnemy);

            return {
                _id: enemy._id,
                name: enemy.name,
                image: enemy.image,
                tier: enemy.tier,
                level: user.level,
                stats: {
                    hp: scaledEnemy.maxHP,
                    strength: scaledEnemy.strength,
                    defense: scaledEnemy.defense,
                    mana: scaledEnemy.mana
                },
                rewards: scaledEnemy.rewards,
                difficulty,
                description: enemy.description
            };
        });

        res.json({ enemies: enemiesWithDifficulty });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    generateEnemy,
    calculateDifficulty,
    getEnemies
};
