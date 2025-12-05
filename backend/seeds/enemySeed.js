const Enemy = require('../src/models/enemyModel');

// Seed complete enemy catalog with 22 unique monsters
const seedEnemies = async () => {
    const enemies = [
        // ===== TIER 1 - Easy enemies (Levels 1-5) =====
        {
            name: 'Crimson Imp',
            image: 'monster.01.png',
            tier: 1,
            baseLevel: 1,
            stats: { hp: 35, strength: 6, defense: 3, mana: 5 },
            rewards: { baseGold: 12, baseXP: 18, tetranutaChance: 0.05 },
            description: 'A small demonic creature with sharp claws and an attitude.'
        },
        {
            name: 'Swamp Zombie',
            image: 'monster.02.png',
            tier: 1,
            baseLevel: 2,
            stats: { hp: 50, strength: 8, defense: 5, mana: 0 },
            rewards: { baseGold: 18, baseXP: 22, tetranutaChance: 0.08 },
            description: 'A rotting corpse risen from the murky depths.'
        },
        {
            name: 'Void Squid',
            image: 'monster.03.png',
            tier: 1,
            baseLevel: 3,
            stats: { hp: 45, strength: 10, defense: 4, mana: 10 },
            rewards: { baseGold: 25, baseXP: 28, tetranutaChance: 0.10 },
            description: 'A tentacled horror from the dark ocean.'
        },
        {
            name: 'Serpent Wyrm',
            image: 'monster.04.png',
            tier: 1,
            baseLevel: 4,
            stats: { hp: 55, strength: 12, defense: 6, mana: 0 },
            rewards: { baseGold: 30, baseXP: 35, tetranutaChance: 0.12 },
            description: 'A massive sea serpent with venomous fangs.'
        },

        // ===== TIER 2 - Medium enemies (Levels 5-10) =====
        {
            name: 'Bone Runner',
            image: 'monster.05.png',
            tier: 2,
            baseLevel: 5,
            stats: { hp: 70, strength: 15, defense: 8, mana: 0 },
            rewards: { baseGold: 45, baseXP: 55, tetranutaChance: 0.15 },
            description: 'An undead skeleton that moves with unnatural speed.'
        },
        {
            name: 'Wraith Hound',
            image: 'monster.06.png',
            tier: 2,
            baseLevel: 6,
            stats: { hp: 85, strength: 18, defense: 10, mana: 20 },
            rewards: { baseGold: 55, baseXP: 65, tetranutaChance: 0.18 },
            description: 'A spectral beast that hunts in the night.'
        },
        {
            name: 'Reaper Shade',
            image: 'monster.07.png',
            tier: 2,
            baseLevel: 7,
            stats: { hp: 75, strength: 20, defense: 12, mana: 30 },
            rewards: { baseGold: 65, baseXP: 75, tetranutaChance: 0.20 },
            description: 'A hooded figure that collects souls for the underworld.'
        },
        {
            name: 'Bone Colossus',
            image: 'monster.08.png',
            tier: 2,
            baseLevel: 8,
            stats: { hp: 110, strength: 22, defense: 15, mana: 0 },
            rewards: { baseGold: 75, baseXP: 85, tetranutaChance: 0.22 },
            description: 'A towering skeletal giant with immense strength.'
        },
        {
            name: 'Shadow Fiend',
            image: 'monster.09.png',
            tier: 2,
            baseLevel: 9,
            stats: { hp: 95, strength: 24, defense: 14, mana: 25 },
            rewards: { baseGold: 85, baseXP: 95, tetranutaChance: 0.24 },
            description: 'A creature of pure darkness with razor-sharp claws.'
        },

        // ===== TIER 3 - Hard enemies (Levels 10-15) =====
        {
            name: 'Maw of the Deep',
            image: 'monster.10.png',
            tier: 3,
            baseLevel: 10,
            stats: { hp: 180, strength: 28, defense: 18, mana: 0 },
            rewards: { baseGold: 110, baseXP: 130, tetranutaChance: 0.28 },
            description: 'A massive worm with an insatiable appetite for flesh.'
        },
        {
            name: 'Rot Hound',
            image: 'monster.11.png',
            tier: 3,
            baseLevel: 11,
            stats: { hp: 140, strength: 30, defense: 20, mana: 15 },
            rewards: { baseGold: 125, baseXP: 145, tetranutaChance: 0.30 },
            description: 'A decaying canine with a plague-ridden bite.'
        },
        {
            name: 'Leviathan Maw',
            image: 'monster.12.png',
            tier: 3,
            baseLevel: 12,
            stats: { hp: 200, strength: 32, defense: 22, mana: 0 },
            rewards: { baseGold: 140, baseXP: 160, tetranutaChance: 0.32 },
            description: 'An abyssal horror with rows of deadly teeth.'
        },
        {
            name: 'Lurking Horror',
            image: 'monster.13.png',
            tier: 3,
            baseLevel: 13,
            stats: { hp: 160, strength: 34, defense: 24, mana: 35 },
            rewards: { baseGold: 155, baseXP: 175, tetranutaChance: 0.34 },
            description: 'A shadowy predator that stalks its prey from darkness.'
        },
        {
            name: 'Arachnid Lord',
            image: 'monster.14.png',
            tier: 3,
            baseLevel: 14,
            stats: { hp: 170, strength: 36, defense: 26, mana: 20 },
            rewards: { baseGold: 170, baseXP: 190, tetranutaChance: 0.36 },
            description: 'A giant spider with venomous fangs and web attacks.'
        },

        // ===== TIER 4 - Very Hard enemies (Levels 15-20) =====
        {
            name: 'Dread Bat',
            image: 'monster.16.png',
            tier: 4,
            baseLevel: 15,
            stats: { hp: 190, strength: 38, defense: 28, mana: 40 },
            rewards: { baseGold: 200, baseXP: 220, tetranutaChance: 0.38 },
            description: 'A massive bat creature with sonic scream attacks.'
        },
        {
            name: 'Chrysalis Moth',
            image: 'monster.18.png',
            tier: 4,
            baseLevel: 16,
            stats: { hp: 175, strength: 40, defense: 30, mana: 60 },
            rewards: { baseGold: 220, baseXP: 240, tetranutaChance: 0.40 },
            description: 'A mystical insect that casts powerful spells with its wings.'
        },
        {
            name: 'Plague Zombie',
            image: 'monster.15.png',
            tier: 4,
            baseLevel: 17,
            stats: { hp: 220, strength: 42, defense: 32, mana: 0 },
            rewards: { baseGold: 240, baseXP: 260, tetranutaChance: 0.42 },
            description: 'A grotesque undead covered in festering sores.'
        },
        {
            name: 'Bone Spider',
            image: 'monster.17.png',
            tier: 4,
            baseLevel: 18,
            stats: { hp: 200, strength: 45, defense: 35, mana: 30 },
            rewards: { baseGold: 260, baseXP: 280, tetranutaChance: 0.45 },
            description: 'An arachnid made entirely of animated bones.'
        },

        // ===== TIER 5 - Extreme enemies (Bosses, Levels 20+) =====
        {
            name: 'Spike Horror',
            image: 'monster.19.png',
            tier: 5,
            baseLevel: 20,
            stats: { hp: 320, strength: 50, defense: 40, mana: 50 },
            rewards: { baseGold: 350, baseXP: 450, tetranutaChance: 0.50 },
            description: 'A demonic entity covered in razor-sharp spikes.'
        },
        {
            name: 'Abyssal Behemoth',
            image: 'monster.20.png',
            tier: 5,
            baseLevel: 22,
            stats: { hp: 380, strength: 55, defense: 45, mana: 80 },
            rewards: { baseGold: 420, baseXP: 520, tetranutaChance: 0.55 },
            description: 'A colossal deep-sea terror with devastating power.'
        },
        {
            name: 'Void Stalker',
            image: 'monster.21.png',
            tier: 5,
            baseLevel: 24,
            stats: { hp: 350, strength: 60, defense: 50, mana: 100 },
            rewards: { baseGold: 480, baseXP: 580, tetranutaChance: 0.60 },
            description: 'A creature from the void between dimensions.'
        },
        {
            name: 'Eldritch Abomination',
            image: 'monster.22.png',
            tier: 5,
            baseLevel: 26,
            stats: { hp: 400, strength: 65, defense: 55, mana: 120 },
            rewards: { baseGold: 550, baseXP: 650, tetranutaChance: 0.65 },
            description: 'An incomprehensible horror that defies natural law.'
        }
    ];

    // Clear existing enemies first
    await Enemy.deleteMany({});
    console.log('🗑️  Cleared old enemy catalog');

    for (const enemyData of enemies) {
        await Enemy.create(enemyData);
    }

    console.log('✅ Enemy catalog seeded successfully with 22 monsters!');
};

module.exports = { seedEnemies };
