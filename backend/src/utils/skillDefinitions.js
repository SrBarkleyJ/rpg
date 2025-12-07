// Skill Definitions for all classes - 6 upgradeable skills per class
// Synced with animation-test
const SKILL_DEFINITIONS = {
    warrior: {
        skill1: {
            name: 'Bash',
            description: 'A powerful strike dealing increased damage',
            type: 'damage',
            baseValue: 150,
            scaling: 15,
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (150 + (level * 15)) / 100;
                return { damageMultiplier, message: 'Bash!' };
            }
        },
        skill2: {
            name: 'Berserk',
            description: 'Enter a rage, increasing STR temporarily',
            type: 'buff',
            baseValue: 20,
            scaling: 5,
            cooldown: 4,
            duration: 3,
            calculate: (level) => {
                const damageBuff = 20 + (level * 5);
                return { damageBuff, duration: 3, message: 'Berserk activated!' };
            }
        },
        skill3: {
            name: 'Execute',
            description: 'Massive damage to low HP enemies',
            type: 'finisher',
            baseValue: 250,
            scaling: 25,
            cooldown: 3,
            calculate: (level, userStats, enemyHP, enemyMaxHP) => {
                const threshold = enemyMaxHP * 0.3;
                if (enemyHP <= threshold) {
                    const damageMultiplier = (250 + (level * 25)) / 100;
                    return { damageMultiplier, message: 'EXECUTE!' };
                }
                return { damageMultiplier: 1, message: 'Execute failed (enemy HP too high)' };
            }
        },
        skill4: {
            name: 'Ground Slam',
            description: 'Slam the ground dealing AoE damage',
            type: 'damage',
            baseValue: 180,
            scaling: 18,
            cooldown: 4,
            calculate: (level, userStats) => {
                const damageMultiplier = (180 + (level * 18)) / 100;
                return { damageMultiplier, message: 'Ground Slam!' };
            }
        },
        skill5: {
            name: 'War Cry',
            description: 'Buff attack power for a short time',
            type: 'buff',
            baseValue: 15,
            scaling: 4,
            cooldown: 3,
            duration: 2,
            calculate: (level) => {
                const damageBuff = 15 + (level * 4);
                return { damageBuff, duration: 2, message: 'War Cry!' };
            }
        },
        skill6: {
            name: 'Charge',
            description: 'Rush at the enemy with increased damage',
            type: 'damage',
            baseValue: 140,
            scaling: 14,
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (140 + (level * 14)) / 100;
                return { damageMultiplier, message: 'Charge!' };
            }
        }
    },
    mage: {
        skill1: {
            name: 'Fireball',
            description: 'Launch a fireball with defense penetration',
            type: 'damage',
            baseValue: 150,
            basePenetration: 10,
            scaling: 15,
            penetrationScaling: 2,
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (150 + (level * 15)) / 100;
                const penetration = 10 + (level * 2);
                return { damageMultiplier, penetration, usesInt: true, message: 'Fireball!' };
            }
        },
        skill2: {
            name: 'Ice Shard',
            description: 'Throw ice shards that may slow enemies',
            type: 'damage',
            baseValue: 120,
            scaling: 12,
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (120 + (level * 12)) / 100;
                return { damageMultiplier, usesInt: true, message: 'Ice Shard!' };
            }
        },
        skill3: {
            name: 'Arcane Bolt',
            description: 'A quick magical projectile',
            type: 'damage',
            baseValue: 130,
            scaling: 13,
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (130 + (level * 13)) / 100;
                return { damageMultiplier, usesInt: true, message: 'Arcane Bolt!' };
            }
        },
        skill4: {
            name: 'Meteor',
            description: 'Call down a devastating meteor',
            type: 'finisher',
            baseValue: 250,
            scaling: 25,
            cooldown: 5,
            calculate: (level, userStats) => {
                const damageMultiplier = (250 + (level * 25)) / 100;
                return { damageMultiplier, usesInt: true, message: 'METEOR!' };
            }
        },
        skill5: {
            name: 'Chain Lightning',
            description: 'Electric attack that chains between enemies',
            type: 'damage',
            baseValue: 180,
            scaling: 18,
            cooldown: 4,
            calculate: (level, userStats) => {
                const damageMultiplier = (180 + (level * 18)) / 100;
                return { damageMultiplier, usesInt: true, message: 'Chain Lightning!' };
            }
        },
        skill6: {
            name: 'Thunder Strike',
            description: 'Call down powerful lightning',
            type: 'damage',
            baseValue: 200,
            scaling: 20,
            cooldown: 4,
            calculate: (level, userStats) => {
                const damageMultiplier = (200 + (level * 20)) / 100;
                return { damageMultiplier, usesInt: true, message: 'Thunder Strike!' };
            }
        }
    },
    rogue: {
        skill1: {
            name: 'Double Stab',
            description: 'Two quick strikes in succession',
            type: 'damage',
            baseValue: 160,
            scaling: 16,
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (160 + (level * 16)) / 100;
                return { damageMultiplier, message: 'Double Stab!' };
            }
        },
        skill2: {
            name: 'Poison Tip',
            description: 'Apply poison damage over time',
            type: 'dot',
            baseValue: 25,
            scaling: 5,
            cooldown: 3,
            duration: 3,
            calculate: (level) => {
                const dotDamage = 25 + (level * 5);
                return { dotDamage, duration: 3, message: 'Poison applied!' };
            }
        },
        skill3: {
            name: 'Backstab',
            description: 'Guaranteed critical hit from behind',
            type: 'damage',
            baseValue: 200,
            scaling: 20,
            cooldown: 3,
            calculate: (level, userStats) => {
                const damageMultiplier = (200 + (level * 20)) / 100;
                return { damageMultiplier, guaranteedCrit: true, message: 'Backstab!' };
            }
        },
        skill4: {
            name: 'Assassinate',
            description: 'Ultimate lethal attack',
            type: 'finisher',
            baseValue: 250,
            scaling: 25,
            cooldown: 5,
            calculate: (level, userStats) => {
                const damageMultiplier = (250 + (level * 25)) / 100;
                return { damageMultiplier, guaranteedCrit: true, message: 'ASSASSINATE!' };
            }
        },
        skill5: {
            name: 'Shadow Strike',
            description: 'Strike from the shadows with chain potential',
            type: 'chain',
            baseValue: 150,
            chainBonus: 15,
            scaling: 15,
            cooldown: 4,
            calculate: (level, userStats, enemyKilled) => {
                const damageMultiplier = (150 + (level * 15)) / 100;
                if (enemyKilled) {
                    const chainMultiplier = 1 + (level * 0.15);
                    return { damageMultiplier, chainAttack: true, chainMultiplier, message: 'Shadow Strike chains!' };
                }
                return { damageMultiplier, message: 'Shadow Strike!' };
            }
        },
        skill6: {
            name: 'Blade Dance',
            description: 'Rapid multi-slash attack',
            type: 'damage',
            baseValue: 220,
            scaling: 22,
            cooldown: 4,
            calculate: (level, userStats) => {
                const damageMultiplier = (220 + (level * 22)) / 100;
                return { damageMultiplier, message: 'Blade Dance!' };
            }
        }
    }
};

// Calculate skill cost in SP
const getSkillCost = (currentLevel) => {
    const costs = [0, 1, 1, 2, 2, 3]; // Index = current level, value = cost to upgrade
    return costs[currentLevel] || 0;
};

// Get total SP needed to reach a level
const getTotalSPForLevel = (level) => {
    let total = 0;
    for (let i = 0; i < level; i++) {
        total += getSkillCost(i);
    }
    return total;
};

module.exports = {
    SKILL_DEFINITIONS,
    getSkillCost,
    getTotalSPForLevel
};
