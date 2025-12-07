const User = require('../models/User');
const CombatSession = require('../models/CombatSession');
const Enemy = require('../models/enemyModel');
const Dungeon = require('../models/dungeonModel');
const { getRandomEnemyForLevel } = require('../data/enemies');

// ===== ORIGINAL FUNCTIONS =====

// Generate enemy based on player level
const generateEnemy = (playerLevel, language = 'en') => {
    const baseHP = 50 + (playerLevel * 10);
    const baseDamage = 5 + (playerLevel * 2);

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

// Simulate automatic combat
const simulateCombat = (player, enemy) => {
    const log = [];
    let playerHP = player.combat.currentHP;
    let enemyHP = enemy.hp;

    // Determine player damage based on class
    const isWarrior = player.class === 'warrior' || player.stats.strength > player.stats.intelligence;
    const playerBaseDamage = isWarrior ?
        player.calculatePhysicalDamage(15) :
        player.calculateMagicalDamage(15);

    const critChance = player.calculateCritChance();

    let turn = 1;
    while (playerHP > 0 && enemyHP > 0 && turn <= 20) {
        // Player turn
        const isCrit = Math.random() * 100 < critChance;
        const playerDamage = isCrit ? Math.floor(playerBaseDamage * 1.5) : playerBaseDamage;
        enemyHP -= playerDamage;

        log.push({
            turn,
            actor: 'Player',
            action: isCrit ? 'Critical Hit!' : 'Attack',
            damage: playerDamage,
            targetHP: Math.max(0, enemyHP)
        });

        if (enemyHP <= 0) break;

        // Enemy turn
        const enemyDamage = enemy.damage + Math.floor(Math.random() * 5);
        playerHP -= enemyDamage;

        log.push({
            turn,
            actor: enemy.name,
            action: 'Attack',
            damage: enemyDamage,
            targetHP: Math.max(0, playerHP)
        });

        turn++;
    }

    const victory = enemyHP <= 0;

    return {
        victory,
        log,
        finalPlayerHP: Math.max(0, playerHP),
        finalEnemyHP: Math.max(0, enemyHP),
        turns: turn - 1
    };
};

// Start automatic combat
const startAutoCombat = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if player has enough HP
        if (user.combat.currentHP <= 0) {
            return res.status(400).json({ message: 'Not enough HP to fight! Rest or use a potion.' });
        }

        // Generate enemy
        const enemy = generateEnemy(user.level);

        // Simulate combat
        const result = simulateCombat(user, enemy);

        // Update user stats
        user.combat.currentHP = result.finalPlayerHP;

        let xpGained = 0;
        let goldGained = 0;
        let goldLost = 0;
        let tetranutaDropped = false;
        let leveledUp = false;
        let newLevel = user.level;

        if (result.victory) {
            user.combat.wins += 1;
            xpGained = 20 + (enemy.level * 5);
            goldGained = 10 + (enemy.level * 3);

            user.xp += xpGained;
            user.gold += goldGained;

            // 15% chance to drop Tetranuta
            if (Math.random() < 0.15) {
                user.tetranuta = (user.tetranuta || 0) + 1;
                tetranutaDropped = true;
                result.log.push({
                    turn: result.turns + 1,
                    actor: 'System',
                    action: 'Reward',
                    message: 'You found 1 Tetranuta! ⚒️'
                });
            }

            // Level up logic
            const xpNeeded = user.level * 100;
            if (user.xp >= xpNeeded) {
                user.level += 1;
                user.xp -= xpNeeded;
                user.skillPoints += 1;
                user.combat.maxHP = user.calculateMaxHP();
                user.combat.currentHP = user.combat.maxHP; // Heal on level up
                leveledUp = true;
                newLevel = user.level;
            }
        } else {
            user.combat.losses += 1;
            goldLost = Math.floor(user.gold * 0.1); // Lose 10% gold
            user.gold = Math.max(0, user.gold - goldLost);
        }

        await user.save();

        res.json({
            result: result.victory ? `Victory! You defeated ${enemy.name}` : `Defeat! You were defeated by ${enemy.name}`,
            enemy,
            combatLog: result.log,
            finalPlayerHP: result.finalPlayerHP,
            finalEnemyHP: result.finalEnemyHP,
            xpGained,
            goldGained,
            goldLost,
            tetranutaDropped,
            leveledUp,
            newLevel,
            user: {
                level: user.level,
                xp: user.xp,
                gold: user.gold,
                combat: user.combat,
                tetranuta: user.tetranuta
            }
        });
    } catch (err) {
        next(err);
    }
};

// Initiate new combat session
const initiateCombat = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if player has enough HP
        if (user.combat.currentHP <= 0) {
            return res.status(400).json({ message: 'Not enough HP to fight! Rest or use a potion.' });
        }

        // Check if user already has an active combat session
        const existingSession = await CombatSession.findOne({
            userId: user._id,
            status: 'active'
        });

        if (existingSession) {
            return res.json({
                combatId: existingSession._id,
                status: 'active',
                enemy: existingSession.enemy,
                playerHP: existingSession.playerHP,
                playerMaxHP: user.combat.maxHP,
                playerMana: user.combat.currentMana || 0,
                playerMaxMana: user.combat.maxMana || 0,
                turn: existingSession.turn,
                log: existingSession.log,
                message: 'Resuming existing combat session'
            });
        }

        // Generate enemy
        const enemy = generateEnemy(user.level);

        // Create new combat session
        const session = await CombatSession.create({
            userId: user._id,
            enemy,
            playerHP: user.combat.currentHP,
            turn: 1,
            status: 'active',
            log: [{
                turn: 0,
                actor: 'System',
                action: 'Combat Start',
                message: `A wild ${enemy.name} appears!`
            }]
        });

        res.json({
            combatId: session._id,
            status: 'active',
            enemy: session.enemy,
            playerHP: session.playerHP,
            playerMaxHP: user.combat.maxHP,
            playerMana: user.combat.currentMana || 0,
            playerMaxMana: user.combat.maxMana || 0,
            turn: session.turn,
            log: session.log,
            message: 'Combat initiated!'
        });
    } catch (err) {
        next(err);
    }
};

// Perform combat action (attack, defend, use-item, skill) - FULL IMPLEMENTATION FROM STEP 137
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

            // Try to find by itemId first (item template ID), then by inventory entry _id for backwards compatibility
            let itemIndex = user.inventory.findIndex(i => i.itemId && i.itemId.toString() === itemId);
            if (itemIndex === -1) {
                itemIndex = user.inventory.findIndex(i => i._id && i._id.toString() === itemId);
            }

            if (itemIndex === -1) {
                return res.status(400).json({ message: 'Item not in inventory' });
            }

            // For now, assume all consumable items heal 50 HP
            const HEAL_AMOUNT = 50;
            const maxHP = user.calculateMaxHP();
            const oldHP = playerHP;

            playerHP = Math.min(playerHP + HEAL_AMOUNT, maxHP);
            const healed = playerHP - oldHP;

            log.push({
                turn: session.turn,
                actor: 'Player',
                action: 'Use Item',
                damage: -healed,
                targetHP: playerHP,
                message: `You used an item and healed ${healed} HP!`
            });

            // Remove 1 from quantity
            if (user.inventory[itemIndex].quantity > 1) {
                user.inventory[itemIndex].quantity -= 1;
            } else {
                user.inventory.splice(itemIndex, 1);
            }
            await user.save();

            session.playerDefending = false;

        } else if (action === 'skill') {
            const { skillId } = req.body;
            if (!skillId) return res.status(400).json({ message: 'Skill ID required' });

            // Define skills
            const SKILLS = {
                // Warrior
                'bash': { name: 'Bash', cost: 10, dmgMult: 1.5, type: 'physical' },
                'berserk': { name: 'Berserk', cost: 20, effect: 'buff_str', duration: 3 },
                'execute': { name: 'Execute', cost: 30, dmgMult: 1.0, type: 'physical', executeBonus: 2.5 },
                'iron_skin': { name: 'Iron Skin', cost: 15, effect: 'buff_def', duration: 2 },

                // Mage
                'fireball': { name: 'Fireball', cost: 15, dmgMult: 1.5, type: 'magical' },
                'ice_shard': { name: 'Ice Shard', cost: 20, dmgMult: 1.2, type: 'magical' },
                'thunder_strike': { name: 'Thunder Strike', cost: 35, dmgMult: 2.0, type: 'magical' },
                'heal': { name: 'Heal', cost: 25, type: 'heal' },

                // Rogue
                'double_stab': { name: 'Double Stab', cost: 10, dmgMult: 1.6, type: 'physical' },
                'poison_tip': { name: 'Poison Tip', cost: 15, dmgMult: 1.0, type: 'physical' },
                'evasion': { name: 'Evasion', cost: 20, effect: 'buff_dodge', duration: 1 },
                'assassinate': { name: 'Assassinate', cost: 40, dmgMult: 2.5, type: 'physical' }
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

// Rest to restore HP (out of combat)
const rest = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check cooldown (8 hours = 28800000 ms)
        const COOLDOWN = 8 * 60 * 60 * 1000;
        const now = new Date();

        if (user.lastRestTime) {
            const timeSinceRest = now - new Date(user.lastRestTime);
            if (timeSinceRest < COOLDOWN) {
                const remaining = Math.ceil((COOLDOWN - timeSinceRest) / (60 * 1000));
                const hours = Math.floor(remaining / 60);
                const minutes = remaining % 60;
                return res.status(400).json({
                    message: `Cannot rest yet. Wait ${hours}h ${minutes}m.`,
                    remainingMs: COOLDOWN - timeSinceRest
                });
            }
        }

        const maxHP = user.calculateMaxHP();
        const hpRestored = Math.floor(maxHP * 0.5);

        const maxMana = user.calculateMaxMana();
        const manaRestored = Math.floor(maxMana * 0.5);

        user.combat.currentHP = Math.min(user.combat.currentHP + hpRestored, maxHP);
        user.combat.maxHP = maxHP;

        user.combat.currentMana = Math.min((user.combat.currentMana || 0) + manaRestored, maxMana);
        user.combat.maxMana = maxMana;

        user.lastRestTime = now;

        await user.save();

        res.json({
            message: `Rested and restored ${hpRestored} HP and ${manaRestored} Mana`,
            combat: user.combat,
            lastRestTime: user.lastRestTime
        });
    } catch (err) {
        next(err);
    }
};

// ===== NEW FUNCTIONS FOR ENEMY SELECTION & DUNGEONS =====


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

// Get all available dungeons
const getDungeons = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get active dungeons that player meets requirements for
        const dungeons = await Dungeon.find({
            isActive: true,
            requiredLevel: { $lte: user.level }
        }).populate('enemies.enemyId');

        // Check if user has dungeon in progress
        const dungeonInProgress = await CombatSession.findOne({
            userId: user._id,
            dungeonId: { $exists: true },
            status: 'active'
        });

        const dungeonsWithProgress = dungeons.map(dungeon => {
            const inProgress = dungeonInProgress && dungeonInProgress.dungeonId.toString() === dungeon._id.toString();

            return {
                _id: dungeon._id,
                name: dungeon.name,
                description: dungeon.description,
                difficulty: dungeon.difficulty,
                requiredLevel: dungeon.requiredLevel,
                enemyCount: dungeon.enemies.length,
                rewards: dungeon.rewards,
                inProgress,
                currentEnemy: inProgress ? dungeonInProgress.dungeonProgress : 0
            };
        });

        res.json({ dungeons: dungeonsWithProgress });
    } catch (err) {
        next(err);
    }
};

// Start a new dungeon run
const startDungeon = async (req, res, next) => {
    try {
        const { dungeonId } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if player has enough HP
        if (user.combat.currentHP <= 0) {
            return res.status(400).json({ message: 'Not enough HP to enter dungeon! Rest or use a potion.' });
        }

        // Check for existing dungeon session
        const existingSession = await CombatSession.findOne({
            userId: user._id,
            status: 'active',
            dungeonId: { $exists: true }
        });

        if (existingSession) {
            return res.status(400).json({ message: 'You already have a dungeon in progress! Complete or abandon it first.' });
        }

        // Get dungeon
        const dungeon = await Dungeon.findById(dungeonId).populate('enemies.enemyId');
        if (!dungeon) return res.status(404).json({ message: 'Dungeon not found' });

        if (user.level < dungeon.requiredLevel) {
            return res.status(400).json({ message: `Level ${dungeon.requiredLevel} required to enter this dungeon` });
        }

        // Get first enemy
        const firstEnemyData = dungeon.enemies[0];
        const enemyTemplate = await Enemy.findById(firstEnemyData.enemyId);
        if (!enemyTemplate) {
            return res.status(404).json({ message: 'Enemy template not found. Please re-run seeds.' });
        }
        const enemy = enemyTemplate.scaleToLevel(firstEnemyData.level);

        // Create combat session with dungeon data
        const session = await CombatSession.create({
            userId: user._id,
            dungeonId: dungeon._id,
            dungeonProgress: 0,
            totalDungeonEnemies: dungeon.enemies.length,
            enemy,
            playerHP: user.combat.currentHP,
            turn: 1,
            status: 'active',
            log: [{
                turn: 0,
                actor: 'System',
                action: 'Dungeon Start',
                message: `You have entered ${dungeon.name}!`
            }, {
                turn: 0,
                actor: 'System',
                action: 'Enemy Appears',
                message: `Enemy 1/${dungeon.enemies.length}: ${enemy.name} appears!`
            }]
        });

        res.json({
            combatId: session._id,
            status: 'active',
            enemy: session.enemy,
            enemyHP: session.enemy.hp,
            playerHP: session.playerHP,
            playerMaxHP: user.combat.maxHP,
            playerMana: user.combat.currentMana || 0,
            playerMaxMana: user.combat.maxMana || 0,
            turn: session.turn,
            log: session.log,
            dungeonInfo: {
                name: dungeon.name,
                currentEnemy: 0,
                totalEnemies: dungeon.enemies.length
            },
            message: 'Dungeon started!'
        });
    } catch (err) {
        next(err);
    }
};

// Continue to next enemy in dungeon after victory OR reconnect to active session
const continueDungeon = async (req, res, next) => {
    try {
        const { dungeonId } = req.body;
        console.log('📥 continueDungeon called with dungeonId:', dungeonId);

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log('👤 User found:', user.username);

        // Find active session for this dungeon (either in active combat or between enemies)
        const session = await CombatSession.findOne({
            userId: user._id,
            dungeonId: dungeonId,
            status: { $in: ['active', 'victory'] }
        });

        console.log('🔍 Session search result:', session ? `Found session ${session._id} with status ${session.status}` : 'NO SESSION FOUND');

        if (!session) {
            console.log('❌ No active session found for dungeonId:', dungeonId);
            return res.status(404).json({ message: 'No active session for this dungeon' });
        }

        // Get dungeon
        const dungeon = await Dungeon.findById(session.dungeonId).populate('enemies.enemyId');
        if (!dungeon) return res.status(404).json({ message: 'Dungeon not found' });

        // Case 1: If status is 'active', just return the current state (reconnection)
        if (session.status === 'active') {
            return res.json({
                combatId: session._id,
                status: 'active',
                enemy: session.enemy,
                enemyHP: session.enemy.hp,
                playerHP: session.playerHP,
                playerMaxHP: user.combat.maxHP,
                playerMana: user.combat.currentMana || 0,
                playerMaxMana: user.combat.maxMana || 0,
                turn: session.turn,
                log: session.log,
                dungeonInfo: {
                    id: dungeon._id,
                    name: dungeon.name,
                    currentEnemy: session.dungeonProgress,
                    totalEnemies: dungeon.enemies.length
                },
                user: {
                    avatar: user.avatar,
                    class: user.class,
                    level: user.level,
                    combat: user.combat
                },
                message: `Reconnected to ${dungeon.name}`
            });
        }

        // Case 2: If status is 'victory', continue to next enemy
        if (session.status !== 'victory') {
            return res.status(400).json({ message: 'Invalid session status' });
        }

        // Check if dungeon is complete
        if (session.dungeonProgress >= dungeon.enemies.length - 1) {
            // DUNGEON COMPLETE!
            session.status = 'dungeon-complete';
            await session.save();

            // Award dungeon completion rewards
            user.gold += dungeon.rewards.gold;
            user.xp += dungeon.rewards.xp;
            user.tetranuta = (user.tetranuta || 0) + dungeon.rewards.tetranuta;

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

            return res.json({
                status: 'dungeon-complete',
                dungeonName: dungeon.name,
                rewards: dungeon.rewards,
                leveledUp,
                newLevel: leveledUp ? newLevel : undefined,
                user: {
                    level: user.level,
                    xp: user.xp,
                    gold: user.gold,
                    combat: user.combat,
                    tetranuta: user.tetranuta,
                    skillPoints: user.skillPoints
                },
                message: `🎉 Dungeon Complete! You cleared ${dungeon.name}!`
            });
        }

        // Load next enemy
        const nextEnemyIndex = session.dungeonProgress + 1;
        const nextEnemyData = dungeon.enemies[nextEnemyIndex];
        const enemyTemplate = await Enemy.findById(nextEnemyData.enemyId);
        const nextEnemy = enemyTemplate.scaleToLevel(nextEnemyData.level);

        // Update session
        session.enemy = nextEnemy;
        session.dungeonProgress = nextEnemyIndex;
        session.status = 'active';
        session.turn = 1;
        session.playerDefending = false;
        session.log = [{
            turn: 0,
            actor: 'System',
            action: 'Next Enemy',
            message: `Enemy ${nextEnemyIndex + 1}/${dungeon.enemies.length}: ${nextEnemy.name} appears!`
        }];

        await session.save();

        res.json({
            combatId: session._id,
            status: 'active',
            dungeonName: dungeon.name,
            dungeonProgress: nextEnemyIndex,
            totalEnemies: dungeon.enemies.length,
            enemy: session.enemy,
            playerHP: session.playerHP,
            playerMaxHP: user.combat.maxHP,
            playerMana: user.combat.currentMana || 0,
            playerMaxMana: user.combat.maxMana || 0,
            turn: session.turn,
            log: session.log,
            message: `Next enemy! ${nextEnemyIndex + 1}/${dungeon.enemies.length}`,
            user: {
                avatar: user.avatar,
                class: user.class,
                level: user.level,
                combat: user.combat
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get active dungeon session for reconnection
const getActiveDungeonSession = async (req, res, next) => {
    try {
        const { dungeonId } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const session = await CombatSession.findOne({
            userId: user._id,
            dungeonId,
            status: 'active'
        });

        if (!session) {
            return res.status(404).json({ message: 'No active session for this dungeon' });
        }

        const dungeon = await Dungeon.findById(dungeonId);
        if (!dungeon) return res.status(404).json({ message: 'Dungeon not found' });

        res.json({
            combatId: session._id,
            status: 'active',
            enemy: session.enemy,
            enemyHP: session.enemy.hp,
            playerHP: session.playerHP,
            playerMaxHP: user.combat.maxHP,
            playerMana: user.combat.currentMana || 0,
            playerMaxMana: user.combat.maxMana || 0,
            turn: session.turn,
            log: session.log,
            dungeonInfo: {
                id: dungeon._id,
                name: dungeon.name,
                currentEnemy: session.dungeonProgress,
                totalEnemies: dungeon.enemies.length
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    startAutoCombat,
    initiateCombat,
    performAction,
    rest,
    getEnemies,
    getDungeons,
    getActiveDungeonSession,
    startDungeon,
    continueDungeon
};
