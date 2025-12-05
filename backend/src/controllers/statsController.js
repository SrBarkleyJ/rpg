const User = require('../models/User');

// Get user stats
const getStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            stats: user.stats,
            skillPoints: user.skillPoints,
            combat: user.combat,
            calculatedMaxHP: user.calculateMaxHP(),
            calculatedPhysicalDamage: user.calculatePhysicalDamage(),
            calculatedMagicalDamage: user.calculateMagicalDamage(),
            calculatedCritChance: user.calculateCritChance()
        });
    } catch (err) {
        next(err);
    }
};

// Assign skill point to a stat
const assignSkillPoint = async (req, res, next) => {
    try {
        const { statName } = req.body; // 'strength', 'intelligence', 'vitality', 'dexterity', 'luck'

        const validStats = ['strength', 'intelligence', 'vitality', 'dexterity', 'luck'];
        if (!validStats.includes(statName)) {
            return res.status(400).json({ message: 'Invalid stat name' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.skillPoints <= 0) {
            return res.status(400).json({ message: 'No skill points available' });
        }

        // Increment the stat
        user.stats[statName] += 1;
        user.skillPoints -= 1;

        // If vitality increased, update max HP
        if (statName === 'vitality') {
            user.combat.maxHP = user.calculateMaxHP();
            // Also heal to new max if current HP is full
            if (user.combat.currentHP >= user.combat.maxHP - 10) {
                user.combat.currentHP = user.combat.maxHP;
            }
        }

        await user.save();

        res.json({
            message: `${statName} increased to ${user.stats[statName]}`,
            user,
            stats: user.stats,
            skillPoints: user.skillPoints,
            combat: user.combat
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getStats, assignSkillPoint };
