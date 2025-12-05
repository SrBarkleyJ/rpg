// Skill Definitions for all classes
const SKILL_DEFINITIONS = {
    warrior: {
        skill1: {
            name: 'Heroic Strike',
            description: 'A powerful strike dealing increased damage',
            type: 'damage',
            baseValue: 150, // 150% damage
            scaling: 15, // +15% per level
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (150 + (level * 15)) / 100;
                return { damageMultiplier, message: 'Heroic Strike' };
            }
        },
        skill2: {
            name: 'Shield Wall',
            description: 'Reduce incoming damage',
            type: 'defensive',
            baseValue: 30, // 30% damage reduction
            scaling: 5, // +5% per level
            cooldown: 4,
            duration: 2,
            calculate: (level) => {
                const damageReduction = 30 + (level * 5);
                return { damageReduction, duration: 2, message: 'Shield Wall active' };
            }
        },
        skill3: {
            name: 'Battle Cry',
            description: 'Increase damage dealt temporarily',
            type: 'buff',
            baseValue: 20, // +20% damage
            scaling: 4, // +4% per level
            cooldown: 5,
            duration: 3,
            calculate: (level) => {
                const damageBuff = 20 + (level * 4);
                return { damageBuff, duration: 3, message: 'Battle Cry activated' };
            }
        },
        skill4: {
            name: 'Execute',
            description: 'Massive damage to low HP enemies',
            type: 'finisher',
            baseValue: 300, // 300% damage if enemy <30% HP
            scaling: 20, // +20% per level
            cooldown: 3,
            calculate: (level, userStats, enemyHP, enemyMaxHP) => {
                const threshold = enemyMaxHP * 0.3;
                if (enemyHP <= threshold) {
                    const damageMultiplier = (300 + (level * 20)) / 100;
                    return { damageMultiplier, message: 'EXECUTE!' };
                }
                return { damageMultiplier: 1, message: 'Execute failed (enemy HP too high)' };
            }
        }
    },
    mage: {
        skill1: {
            name: 'Fireball',
            description: 'Magical damage with defense penetration',
            type: 'damage',
            baseValue: 180, // 180% INT as damage
            basePenetration: 10, // 10% defense penetration
            scaling: 18, // +18% damage per level
            penetrationScaling: 2, // +2% penetration per level
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (180 + (level * 18)) / 100;
                const penetration = 10 + (level * 2);
                return { damageMultiplier, penetration, usesInt: true, message: 'Fireball' };
            }
        },
        skill2: {
            name: 'Frost Nova',
            description: 'Chance to freeze enemy',
            type: 'control',
            baseValue: 50, // 50% chance to stun
            scaling: 8, // +8% per level
            cooldown: 5,
            calculate: (level) => {
                const stunChance = 50 + (level * 8);
                return { stunChance, message: 'Frost Nova' };
            }
        },
        skill3: {
            name: 'Arcane Shield',
            description: 'Absorb damage',
            type: 'defensive',
            baseValue: 50, // Absorbs 50 HP
            scaling: 15, // +15 HP per level
            cooldown: 4,
            calculate: (level) => {
                const shieldAmount = 50 + (level * 15);
                return { shieldAmount, message: 'Arcane Shield activated' };
            }
        },
        skill4: {
            name: 'Mana Surge',
            description: 'Reset cooldowns',
            type: 'utility',
            cooldown: 6,
            calculate: (level) => {
                const skillsToReset = level >= 5 ? 'all' : level >= 3 ? 2 : 1;
                return { cooldownReset: skillsToReset, message: 'Mana Surge' };
            }
        }
    },
    rogue: {
        skill1: {
            name: 'Backstab',
            description: 'Guaranteed critical hit',
            type: 'damage',
            baseValue: 140, // 140% damage, always crit
            scaling: 14, // +14% per level
            cooldown: 2,
            calculate: (level, userStats) => {
                const damageMultiplier = (140 + (level * 14)) / 100;
                return { damageMultiplier, guaranteedCrit: true, message: 'Backstab' };
            }
        },
        skill2: {
            name: 'Smoke Bomb',
            description: 'Evade next attack',
            type: 'defensive',
            baseValue: 60, // 60% evasion
            scaling: 6, // +6% per level
            cooldown: 3,
            calculate: (level) => {
                const evasionChance = 60 + (level * 6);
                return { evasionChance, message: 'Smoke Bomb' };
            }
        },
        skill3: {
            name: 'Poison Blade',
            description: 'Damage over time',
            type: 'dot',
            baseValue: 20, // 20 damage per turn
            scaling: 5, // +5 per level
            cooldown: 4,
            duration: 3,
            calculate: (level) => {
                const dotDamage = 20 + (level * 5);
                return { dotDamage, duration: 3, message: 'Poison Blade applied' };
            }
        },
        skill4: {
            name: 'Shadow Strike',
            description: 'Attack with chain potential',
            type: 'chain',
            baseValue: 100, // Normal damage
            chainBonus: 10, // +10% to chain attack per level
            scaling: 10,
            cooldown: 4,
            calculate: (level, userStats, enemyKilled) => {
                if (enemyKilled) {
                    const chainMultiplier = 1 + (level * 0.1);
                    return { chainAttack: true, chainMultiplier, message: 'Shadow Strike chains!' };
                }
                return { damageMultiplier: 1, message: 'Shadow Strike' };
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
