const User = require('../models/User');
const { SKILL_DEFINITIONS, getSkillCost } = require('../utils/skillDefinitions');

// Get user's skills with metadata
const getSkills = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const userClass = user.class.toLowerCase();
        const classSkills = SKILL_DEFINITIONS[userClass];

        if (!classSkills) {
            return res.status(400).json({ message: 'Invalid class' });
        }

        // Build response with skill info
        const skills = ['skill1', 'skill2', 'skill3', 'skill4'].map(skillId => {
            const skillData = classSkills[skillId];
            const userSkill = user.skills[skillId];
            const currentLevel = userSkill.level;
            const nextCost = currentLevel < 5 ? getSkillCost(currentLevel) : null;

            return {
                id: skillId,
                name: skillData.name,
                description: skillData.description,
                type: skillData.type,
                currentLevel: currentLevel,
                maxLevel: 5,
                cooldown: userSkill.cooldown,
                maxCooldown: skillData.cooldown,
                nextCost: nextCost,
                isMaxed: currentLevel >= 5
            };
        });

        res.json({
            skills,
            availableSP: user.skillPoints
        });
    } catch (err) {
        next(err);
    }
};

// Upgrade a skill
const upgradeSkill = async (req, res, next) => {
    try {
        const { skillId } = req.body;
        const user = await User.findById(req.user._id);

        if (!['skill1', 'skill2', 'skill3', 'skill4'].includes(skillId)) {
            return res.status(400).json({ message: 'Invalid skill ID' });
        }

        const currentLevel = user.skills[skillId].level;

        if (currentLevel >= 5) {
            return res.status(400).json({ message: 'Skill already at max level' });
        }

        const cost = getSkillCost(currentLevel);

        if (user.skillPoints < cost) {
            return res.status(400).json({ message: 'Not enough skill points' });
        }

        // Upgrade skill
        user.skills[skillId].level += 1;
        user.skillPoints -= cost;

        await user.save();

        res.json({
            message: `Skill upgraded to level ${user.skills[skillId].level}`,
            user
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSkills,
    upgradeSkill
};
