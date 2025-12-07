const Dungeon = require('../src/models/dungeonModel');
const Enemy = require('../src/models/enemyModel');

// Seed initial dungeons with new enemy names
const seedDungeons = async () => {
    // Get enemy IDs using the new enemy names from enemySeed.js
    const crimsonImp = await Enemy.findOne({ name: 'Crimson Imp' });
    const swampZombie = await Enemy.findOne({ name: 'Swamp Zombie' });
    const voidSquid = await Enemy.findOne({ name: 'Void Squid' });
    const serpentWyrm = await Enemy.findOne({ name: 'Serpent Wyrm' });
    const boneRunner = await Enemy.findOne({ name: 'Bone Runner' });
    const wraithHound = await Enemy.findOne({ name: 'Wraith Hound' });
    const reaperShade = await Enemy.findOne({ name: 'Reaper Shade' });
    const boneColossus = await Enemy.findOne({ name: 'Bone Colossus' });
    const shadowFiend = await Enemy.findOne({ name: 'Shadow Fiend' });
    const mawOfTheDeep = await Enemy.findOne({ name: 'Maw of the Deep' });
    const rotHound = await Enemy.findOne({ name: 'Rot Hound' });
    const leviathanMaw = await Enemy.findOne({ name: 'Leviathan Maw' });
    const lurkingHorror = await Enemy.findOne({ name: 'Lurking Horror' });
    const arachnidLord = await Enemy.findOne({ name: 'Arachnid Lord' });
    const dreadBat = await Enemy.findOne({ name: 'Dread Bat' });
    const chrysalisMoth = await Enemy.findOne({ name: 'Chrysalis Moth' });
    const plagueZombie = await Enemy.findOne({ name: 'Plague Zombie' });
    const boneSpider = await Enemy.findOne({ name: 'Bone Spider' });
    const spikeHorror = await Enemy.findOne({ name: 'Spike Horror' });
    const abyssalBehemoth = await Enemy.findOne({ name: 'Abyssal Behemoth' });
    const voidStalker = await Enemy.findOne({ name: 'Void Stalker' });
    const eldritchAbomination = await Enemy.findOne({ name: 'Eldritch Abomination' });

    // Check if all enemies exist
    const requiredEnemies = {
        crimsonImp, swampZombie, voidSquid, serpentWyrm,
        boneRunner, wraithHound, reaperShade, boneColossus, shadowFiend,
        mawOfTheDeep, rotHound, leviathanMaw, lurkingHorror, arachnidLord,
        dreadBat, chrysalisMoth, plagueZombie, boneSpider,
        spikeHorror, abyssalBehemoth, voidStalker, eldritchAbomination
    };

    for (const [name, enemy] of Object.entries(requiredEnemies)) {
        if (!enemy) {
            console.log(`⚠️  Enemy not found: ${name} - Run enemySeed first!`);
        }
    }

    const dungeons = [
        {
            name: 'Imp Caverns',
            description: 'A dark cave system infested with imps and undead.',
            difficulty: 'easy',
            requiredLevel: 1,
            enemies: [
                { enemyId: crimsonImp._id, level: 1, position: 1 },
                { enemyId: swampZombie._id, level: 2, position: 2 },
                { enemyId: voidSquid._id, level: 3, position: 3 }
            ],
            rewards: {
                gold: 100,
                xp: 150,
                items: [],
                tetranuta: 1
            }
        },
        {
            name: 'Serpent Lair',
            description: 'A dangerous nest of serpents and bone creatures.',
            difficulty: 'medium',
            requiredLevel: 5,
            enemies: [
                { enemyId: serpentWyrm._id, level: 5, position: 1 },
                { enemyId: boneRunner._id, level: 6, position: 2 },
                { enemyId: wraithHound._id, level: 7, position: 3 },
                { enemyId: reaperShade._id, level: 8, position: 4 }
            ],
            rewards: {
                gold: 300,
                xp: 400,
                items: [],
                tetranuta: 2
            }
        },
        {
            name: 'Shadow Fortress',
            description: 'A massive fortress controlled by shadow creatures.',
            difficulty: 'hard',
            requiredLevel: 10,
            enemies: [
                { enemyId: boneColossus._id, level: 10, position: 1 },
                { enemyId: shadowFiend._id, level: 11, position: 2 },
                { enemyId: mawOfTheDeep._id, level: 12, position: 3 },
                { enemyId: rotHound._id, level: 13, position: 4 },
                { enemyId: leviathanMaw._id, level: 14, position: 5 }
            ],
            rewards: {
                gold: 800,
                xp: 1000,
                items: [],
                tetranuta: 3
            }
        },
        {
            name: 'Arachnid Temple',
            description: 'An ancient temple haunted by spiders and horrors.',
            difficulty: 'very-hard',
            requiredLevel: 15,
            enemies: [
                { enemyId: lurkingHorror._id, level: 15, position: 1 },
                { enemyId: arachnidLord._id, level: 16, position: 2 },
                { enemyId: dreadBat._id, level: 17, position: 3 },
                { enemyId: chrysalisMoth._id, level: 18, position: 4 },
                { enemyId: plagueZombie._id, level: 19, position: 5 }
            ],
            rewards: {
                gold: 1500,
                xp: 2000,
                items: [],
                tetranuta: 5
            }
        },
        {
            name: 'Void Abyss',
            description: 'The ultimate challenge: face the eldritch horrors!',
            difficulty: 'extreme',
            requiredLevel: 20,
            enemies: [
                { enemyId: boneSpider._id, level: 20, position: 1 },
                { enemyId: spikeHorror._id, level: 22, position: 2 },
                { enemyId: abyssalBehemoth._id, level: 24, position: 3 },
                { enemyId: voidStalker._id, level: 26, position: 4 },
                { enemyId: eldritchAbomination._id, level: 28, position: 5 }
            ],
            rewards: {
                gold: 3000,
                xp: 5000,
                items: [],
                tetranuta: 10
            }
        }
    ];

    // Clear existing dungeons
    await Dungeon.deleteMany({});
    console.log('🗑️  Cleared old dungeons');

    for (const dungeonData of dungeons) {
        await Dungeon.create(dungeonData);
    }

    console.log('✅ Dungeons seeded successfully with new enemies!');
};

module.exports = { seedDungeons };
