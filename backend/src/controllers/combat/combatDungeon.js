const Dungeon = require('../../models/dungeonModel');
const CombatSession = require('../../models/CombatSession');
const User = require('../../models/User');
const Enemy = require('../../models/enemyModel');

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

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find active session for this dungeon (either in active combat or between enemies)
        const session = await CombatSession.findOne({
            userId: user._id,
            dungeonId: dungeonId,
            status: { $in: ['active', 'victory'] }
        });

        if (!session) {
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
    getDungeons,
    startDungeon,
    continueDungeon,
    getActiveDungeonSession
};
