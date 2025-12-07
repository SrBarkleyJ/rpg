const User = require('../../models/User');
const CombatSession = require('../../models/CombatSession');
const Dungeon = require('../../models/dungeonModel');
const Enemy = require('../../models/enemyModel');

// Perform combat action (attack, defend, use-item, skill)
const performAction = async (req, res, next) => {
    try {
        const { combatId, action, itemId } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const session = await CombatSession.findById(combatId);
        if (!session) return res.status(404).json({ message: 'Combat session not found' });

        if (session.status !== 'active') {
            return res.status(400).json({ message: 'Combat session is not active' });
        }

        if (session.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not your combat session' });
        }

        let playerHP = session.playerHP;
        let enemyHP = session.enemy.hp;
        const log = [...session.log];

        // Determine player damage based on class
        const isWarrior = user.class === 'warrior' || user.stats.strength > user.stats.intelligence;
        const playerBaseDamage = isWarrior ?
            user.calculatePhysicalDamage(15) :
            user.calculateMagicalDamage(15);

        const critChance = user.calculateCritChance();

        // PLAYER TURN
        if (action === 'attack') {
            const isCrit = Math.random() * 100 < critChance;
            const playerDamage = isCrit ? Math.floor(playerBaseDamage * 1.5) : playerBaseDamage;
            enemyHP -= playerDamage;

            log.push({
                turn: session.turn,
                actor: 'Player',
                action: isCrit ? 'Critical Hit!' : 'Attack',
                damage: playerDamage,
                targetHP: Math.max(0, enemyHP),
                message: `You dealt ${playerDamage} damage!`
            });

            session.playerDefending = false;

        } else if (action === 'defend') {
            session.playerDefending = true;
            log.push({
                turn: session.turn,
                actor: 'Player',
                action: 'Defend',
                damage: 0,
                targetHP: playerHP,
                message: 'You brace for the next attack! (50% damage reduction)'
            });

        } else if (action === 'use-item') {
            if (!itemId) {
                return res.status(400).json({ message: 'Item ID required' });
            }

            // Import Reward model for item lookup
            const Reward = require('../../models/Reward');

            // Try to find by itemId first (item template ID), then by inventory entry _id for backwards compatibility
            let itemIndex = user.inventory.findIndex(i => i.itemId && i.itemId.toString() === itemId);
            if (itemIndex === -1) {
                itemIndex = user.inventory.findIndex(i => i._id && i._id.toString() === itemId);
            }

            if (itemIndex === -1) {
                return res.status(400).json({ message: 'Item not in inventory' });
            }

            // Get the actual item details from the database
            const invItem = user.inventory[itemIndex];
            const itemDetails = await Reward.findById(invItem.itemId);

            if (!itemDetails || itemDetails.type !== 'consumable') {
                return res.status(400).json({ message: 'This item cannot be used in combat' });
            }

            const effects = itemDetails.effects || {};
            const maxHP = user.calculateMaxHP();
            const maxMana = user.calculateMaxMana ? user.calculateMaxMana() : 50;
            const oldHP = playerHP;
            const oldMana = user.combat.currentMana || 0;

            let totalHealed = 0;
            let totalManaRestored = 0;
            let message = `You used ${itemDetails.name}!`;

            // Apply HP healing
            if (effects.healHP > 0) {
                playerHP = Math.min(playerHP + effects.healHP, maxHP);
                totalHealed = playerHP - oldHP;
            }

            // Apply percentage HP healing (for Full Restore type items)
            if (effects.healPercent > 0) {
                const percentHeal = Math.floor(maxHP * (effects.healPercent / 100));
                playerHP = Math.min(playerHP + percentHeal, maxHP);
                totalHealed = playerHP - oldHP;
            }

            // Apply Mana restoration
            if (effects.healMana > 0) {
                user.combat.currentMana = Math.min(oldMana + effects.healMana, maxMana);
                totalManaRestored = user.combat.currentMana - oldMana;
            }

            // Apply percentage Mana restoration
            if (effects.manaPercent > 0) {
                const percentMana = Math.floor(maxMana * (effects.manaPercent / 100));
                user.combat.currentMana = Math.min(oldMana + percentMana, maxMana);
                totalManaRestored = user.combat.currentMana - oldMana;
            }

            // Build result message
            const effectMessages = [];
            if (totalHealed > 0) effectMessages.push(`+${totalHealed} HP`);
            if (totalManaRestored > 0) effectMessages.push(`+${totalManaRestored} MP`);
            if (effects.curePoison) effectMessages.push('Cured poison!');

            message = effectMessages.length > 0
                ? `Used ${itemDetails.name}: ${effectMessages.join(', ')}`
                : `Used ${itemDetails.name}`;

            log.push({
                turn: session.turn,
                actor: 'Player',
                action: 'Use Item',
                damage: -(totalHealed + totalManaRestored),
                targetHP: playerHP,
                message
            });

            // Remove 1 from quantity
            if (user.inventory[itemIndex].quantity > 1) {
                user.inventory[itemIndex].quantity -= 1;
            } else {
                user.inventory.splice(itemIndex, 1);
            }

            // Update session HP (but not turn - items don't consume turn!)
            session.playerHP = playerHP;
            session.log = log;
            await session.save();
            await user.save();

            // IMPORTANT: Using items does NOT consume your turn!
            // Return immediately without enemy attacking
            return res.json({
                combatId: session._id,
                status: 'active',
                enemy: session.enemy,
                enemyHP: session.enemy.hp,
                playerHP: session.playerHP,
                playerMaxHP: maxHP,
                playerMana: user.combat.currentMana || 0,
                playerMaxMana: maxMana,
                turn: session.turn, // Same turn - item usage is "free action"
                log: session.log,
                defending: session.playerDefending,
                playerTurn: true, // Still player's turn!
                itemUsed: true,
                user: {
                    level: user.level,
                    xp: user.xp,
                    gold: user.gold,
                    combat: user.combat,
                    inventory: user.inventory
                }
            });

        } else if (action === 'skill') {
            const { skillId } = req.body;
            if (!skillId) return res.status(400).json({ message: 'Skill ID required' });

            // Define skills - 18 skills (6 per class) from animation-test
            const SKILLS = {
                // ===== MAGE SKILLS (6) =====
                'fireball': { name: 'Fireball', cost: 15, dmgMult: 1.5, type: 'magical' },
                'ice_shard': { name: 'Ice Shard', cost: 12, dmgMult: 1.2, type: 'magical' },
                'arcane_bolt': { name: 'Arcane Bolt', cost: 10, dmgMult: 1.3, type: 'magical' },
                'meteor': { name: 'Meteor', cost: 40, dmgMult: 2.5, type: 'magical' },
                'chain_lightning': { name: 'Chain Lightning', cost: 25, dmgMult: 1.8, type: 'magical' },
                'thunder_strike': { name: 'Thunder Strike', cost: 35, dmgMult: 2.0, type: 'magical' },

                // ===== WARRIOR SKILLS (6) =====
                'bash': { name: 'Bash', cost: 10, dmgMult: 1.5, type: 'physical' },
                'berserk': { name: 'Berserk', cost: 20, effect: 'buff_str', duration: 3 },
                'execute': { name: 'Execute', cost: 30, dmgMult: 1.0, type: 'physical', executeBonus: 2.5 },
                'ground_slam': { name: 'Ground Slam', cost: 25, dmgMult: 1.8, type: 'physical' },
                'war_cry': { name: 'War Cry', cost: 15, effect: 'buff_str', duration: 2 },
                'charge': { name: 'Charge', cost: 12, dmgMult: 1.4, type: 'physical' },

                // ===== ROGUE SKILLS (6) =====
                'double_stab': { name: 'Double Stab', cost: 10, dmgMult: 1.6, type: 'physical' },
                'poison_tip': { name: 'Poison Tip', cost: 15, dmgMult: 1.2, type: 'physical', dot: true },
                'backstab': { name: 'Backstab', cost: 18, dmgMult: 2.0, type: 'physical', guaranteedCrit: true },
                'assassinate': { name: 'Assassinate', cost: 40, dmgMult: 2.5, type: 'physical' },
                'shadow_strike': { name: 'Shadow Strike', cost: 20, dmgMult: 1.5, type: 'physical' },
                'blade_dance': { name: 'Blade Dance', cost: 30, dmgMult: 2.2, type: 'physical' }
            };

            const skill = SKILLS[skillId];
            if (!skill) return res.status(400).json({ message: 'Invalid skill' });

            const currentMana = user.combat.currentMana || 0;
            if (currentMana < skill.cost) {
                return res.status(400).json({ message: 'Not enough Mana!' });
            }

            // Deduct Mana
            user.combat.currentMana -= skill.cost;

            let damage = 0;
            let message = '';

            if (skill.type === 'heal') {
                const healAmount = Math.floor(user.stats.intelligence * 2);
                const maxHP = user.calculateMaxHP();
                const oldHP = playerHP;
                playerHP = Math.min(playerHP + healAmount, maxHP);
                const actualHeal = playerHP - oldHP;

                message = `You cast ${skill.name} and healed ${actualHeal} HP!`;

                log.push({
                    turn: session.turn,
                    actor: 'Player',
                    action: skill.name,
                    damage: -actualHeal,
                    targetHP: playerHP,
                    message
                });
            } else if (skill.effect) {
                message = `You used ${skill.name}! (Buffs not fully implemented yet)`;
                log.push({
                    turn: session.turn,
                    actor: 'Player',
                    action: skill.name,
                    damage: 0,
                    targetHP: enemyHP,
                    message
                });
            } else {
                // Damage Skills
                let baseDmg = 0;
                if (skill.type === 'physical') {
                    baseDmg = user.calculatePhysicalDamage(15);
                } else {
                    baseDmg = user.calculateMagicalDamage(15);
                }

                damage = Math.floor(baseDmg * skill.dmgMult);

                // Execute bonus
                if (skill.executeBonus && (enemyHP / session.enemy.maxHP) < 0.3) {
                    damage = Math.floor(damage * skill.executeBonus);
                    message = `Execute! Massive damage!`;
                }

                // Crit check
                const isCrit = Math.random() * 100 < critChance;
                if (isCrit) {
                    damage = Math.floor(damage * 1.5);
                    message = `Critical ${skill.name}!`;
                }

                enemyHP -= damage;
                message = message || `You used ${skill.name} for ${damage} damage!`;

                log.push({
                    turn: session.turn,
                    actor: 'Player',
                    action: skill.name,
                    damage: damage,
                    targetHP: Math.max(0, enemyHP),
                    message
                });
            }

            session.playerDefending = false;

        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        // Check if enemy is defeated
        if (enemyHP <= 0) {
            session.status = 'victory';
            session.enemy.hp = 0;
            session.playerHP = playerHP;
            session.log = log;

            // Award rewards
            user.combat.wins += 1;
            const xpGained = 20 + (session.enemy.level * 5);
            const goldGained = 10 + (session.enemy.level * 3);

            user.xp += xpGained;
            user.gold += goldGained;
            user.combat.currentHP = playerHP;

            // 15% chance to drop Tetranuta
            let tetranutaDropped = false;
            if (Math.random() < 0.15) {
                user.tetranuta = (user.tetranuta || 0) + 1;
                tetranutaDropped = true;
                log.push({
                    turn: session.turn,
                    actor: 'System',
                    action: 'Reward',
                    message: 'You found 1 Tetranuta! ⚒️'
                });
            }

            // Level up logic
            let leveledUp = false;
            let newLevel = user.level;
            while (true) {
                const xpToLevel = 100 + (user.level - 1) * 50;
                if (user.xp < xpToLevel) break;

                user.level += 1;
                user.xp -= xpToLevel;
                leveledUp = true;
                newLevel = user.level;

                if (user.level % 5 === 0) {
                    user.skillPoints += 1;
                }
            }

            await user.save();
            await session.save();

            // ===== DUNGEON PROGRESSION LOGIC =====
            if (session.dungeonId) {
                const dungeon = await Dungeon.findById(session.dungeonId).populate('enemies.enemyId');
                if (!dungeon) return res.status(404).json({ message: 'Dungeon not found' });

                // Check if there are more enemies
                if (session.dungeonProgress < dungeon.enemies.length - 1) {
                    // Load next enemy
                    const nextEnemyIndex = session.dungeonProgress + 1;
                    const nextEnemyData = dungeon.enemies[nextEnemyIndex];
                    const enemyTemplate = await Enemy.findById(nextEnemyData.enemyId);
                    if (!enemyTemplate) {
                        return res.status(404).json({ message: 'Enemy template not found. Please re-run seeds.' });
                    }
                    const nextEnemy = enemyTemplate.scaleToLevel(nextEnemyData.level);

                    // Update session for next enemy
                    session.enemy = nextEnemy;
                    session.dungeonProgress = nextEnemyIndex;
                    session.status = 'active';
                    session.turn = 1;
                    session.playerDefending = false;
                    session.log = [{
                        turn: 0,
                        actor: 'System',
                        action: 'Victory',
                        message: `Enemy defeated! +${xpGained} XP, +${goldGained} Gold`
                    }, {
                        turn: 0,
                        actor: 'System',
                        action: 'Next Enemy',
                        message: `Enemy ${nextEnemyIndex + 1}/${dungeon.enemies.length}: ${nextEnemy.name} appears!`
                    }];

                    await session.save();

                    return res.json({
                        combatId: session._id,
                        status: 'victory',
                        nextEnemy: true,
                        enemy: session.enemy,
                        enemyHP: session.enemy.hp,
                        playerHP: session.playerHP,
                        playerMaxHP: user.combat.maxHP,
                        playerMana: user.combat.currentMana || 0,
                        turn: session.turn,
                        log: session.log,
                        rewards: { xpGained, goldGained, tetranutaDropped },
                        leveledUp,
                        newLevel: leveledUp ? newLevel : undefined,
                        dungeonInfo: {
                            name: dungeon.name,
                            currentEnemy: nextEnemyIndex,
                            totalEnemies: dungeon.enemies.length
                        },
                        user: {
                            level: user.level,
                            xp: user.xp,
                            gold: user.gold,
                            combat: user.combat,
                            skillPoints: user.skillPoints,
                            inventory: user.inventory,
                            tetranuta: user.tetranuta
                        }
                    });
                } else {
                    // DUNGEON COMPLETE!
                    session.status = 'victory';
                    await session.save();

                    // Award dungeon completion rewards
                    user.gold += dungeon.rewards.gold;
                    user.xp += dungeon.rewards.xp;
                    user.tetranuta = (user.tetranuta || 0) + dungeon.rewards.tetranuta;

                    // Level up logic for dungeon rewards
                    while (true) {
                        const xpToLevel = 100 + (user.level - 1) * 50;
                        if (user.xp < xpToLevel) break;

                        user.level += 1;
                        user.xp -= xpToLevel;
                        leveledUp = true;
                        newLevel = user.level;

                        if (user.level % 5 === 0) {
                            user.skillPoints += 1;
                        }
                    }

                    await user.save();

                    return res.json({
                        combatId: session._id,
                        status: 'victory',
                        dungeonComplete: true,
                        enemy: session.enemy,
                        playerHP: session.playerHP,
                        playerMaxHP: user.combat.maxHP,
                        turn: session.turn,
                        log: session.log,
                        rewards: { xpGained, goldGained, tetranutaDropped },
                        dungeonRewards: dungeon.rewards,
                        leveledUp,
                        newLevel: leveledUp ? newLevel : undefined,
                        user: {
                            level: user.level,
                            xp: user.xp,
                            gold: user.gold,
                            combat: user.combat,
                            skillPoints: user.skillPoints,
                            inventory: user.inventory,
                            tetranuta: user.tetranuta
                        },
                        message: `🎉 Dungeon Complete! You cleared ${dungeon.name}!`
                    });
                }
            }

            // Regular combat (non-dungeon) victory
            return res.json({
                combatId: session._id,
                status: 'victory',
                enemy: session.enemy,
                playerHP: session.playerHP,
                playerMaxHP: user.combat.maxHP,
                turn: session.turn,
                log: session.log,
                rewards: { xpGained, goldGained, tetranutaDropped },
                leveledUp,
                newLevel: leveledUp ? newLevel : undefined,
                user: {
                    level: user.level,
                    xp: user.xp,
                    gold: user.gold,
                    combat: user.combat,
                    skillPoints: user.skillPoints,
                    inventory: user.inventory,
                    tetranuta: user.tetranuta
                }
            });
        }

        // ENEMY TURN
        let enemyDamage = session.enemy.damage + Math.floor(Math.random() * 5);

        // Apply defend reduction
        if (session.playerDefending) {
            enemyDamage = Math.floor(enemyDamage * 0.5);
            log.push({
                turn: session.turn,
                actor: 'System',
                action: 'Defend Effect',
                message: 'Your defense reduced the damage by 50%!'
            });
        }

        playerHP -= enemyDamage;

        log.push({
            turn: session.turn,
            actor: session.enemy.name,
            action: 'Attack',
            damage: enemyDamage,
            targetHP: Math.max(0, playerHP),
            message: `${session.enemy.name} dealt ${enemyDamage} damage!`
        });

        // Check if player is defeated
        if (playerHP <= 0) {
            session.status = 'defeat';
            session.playerHP = 0;
            session.log = log;

            user.combat.losses += 1;
            user.combat.currentHP = 0;
            const goldLost = Math.floor(user.gold * 0.1);
            user.gold = Math.max(0, user.gold - goldLost);

            await user.save();
            await session.save();

            return res.json({
                combatId: session._id,
                status: 'defeat',
                enemy: session.enemy,
                playerHP: 0,
                playerMaxHP: user.combat.maxHP,
                turn: session.turn,
                log: session.log,
                goldLost,
                user: {
                    level: user.level,
                    xp: user.xp,
                    gold: user.gold,
                    combat: user.combat,
                    inventory: user.inventory
                }
            });
        }

        // Update session for next turn
        session.enemy.hp = enemyHP;
        session.playerHP = playerHP;
        session.turn += 1;
        session.log = log;
        await session.save();

        // Update user HP
        user.combat.currentHP = playerHP;
        await user.save();

        res.json({
            combatId: session._id,
            status: 'active',
            enemy: session.enemy,
            enemyHP: enemyHP,
            playerHP: session.playerHP,
            playerMaxHP: user.combat.maxHP,
            playerMana: user.combat.currentMana || 0,
            turn: session.turn,
            log: session.log,
            defending: session.playerDefending,
            playerTurn: true,  // Always player's turn after enemy attacks
            user: {
                level: user.level,
                xp: user.xp,
                gold: user.gold,
                combat: user.combat,
                inventory: user.inventory
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    performAction
};
