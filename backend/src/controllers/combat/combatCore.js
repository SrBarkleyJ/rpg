const User = require('../../models/User');
const CombatSession = require('../../models/CombatSession');
const { generateEnemy } = require('./combatEnemy');

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

module.exports = {
    startAutoCombat,
    initiateCombat,
    rest
};
