const mongoose = require('mongoose');
const Reward = require('../models/Reward');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const seedRewards = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding rewards...');

        await Reward.deleteMany({});

        const rewards = [
            // ==========================================
            // 🧪 CONSUMABLES (Potions & Elixirs)
            // ==========================================
            {
                name: 'Minor Health Potion',
                desc: 'Restores 50 HP. A staple for adventurers.',
                type: 'consumable',
                image: 'health_potion_small',
                effects: { healHP: 50, duration: 0 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 15,
                cost: 20
            },
            {
                name: 'Health Potion',
                desc: 'Restores 100 HP. Reliable healing.',
                type: 'consumable',
                image: 'health_potion_medium',
                effects: { healHP: 100, duration: 0 },
                rarity: 'uncommon',
                allowedClasses: ['all'],
                value: 35,
                cost: 50
            },
            {
                name: 'Greater Health Potion',
                desc: 'Restores 250 HP. For serious battles.',
                type: 'consumable',
                image: 'health_potion_large',
                effects: { healHP: 250, duration: 0 },
                rarity: 'rare',
                allowedClasses: ['all'],
                value: 80,
                cost: 150
            },
            {
                name: 'Mana Potion',
                desc: 'Restores 50 Mana. Keep the magic flowing.',
                type: 'consumable',
                image: 'mana_potion',
                effects: { healMana: 50, duration: 0 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 20,
                cost: 30
            },
            {
                name: 'Elixir of Power',
                desc: 'Temporarily boosts all stats by +5 for 3 turns.',
                type: 'consumable',
                image: 'elixir',
                effects: { buffAll: 5, duration: 3 }, // Note: Backend needs to handle 'buffAll' or individual buffs
                rarity: 'rare',
                allowedClasses: ['all'],
                value: 100,
                cost: 200
            },

            // ==========================================
            // ⚔️ WARRIOR WEAPONS (STR vs Hybrid Builds)
            // ==========================================
            // Tier 1
            {
                name: 'Rusty Sword',
                desc: 'Old but sharp enough. +2 STR',
                type: 'weapon',
                slot: 'mainhand',
                image: 'warrior_weapon_1',
                effects: { buffStrength: 2 },
                rarity: 'common',
                allowedClasses: ['warrior'],
                value: 20,
                cost: 50,
                tier: 1
            },
            // Tier 2 - Split Path
            {
                name: 'Iron Broadsword',
                desc: 'Heavy hitter. +5 STR',
                type: 'weapon',
                slot: 'mainhand',
                image: 'warrior_weapon_2',
                effects: { buffStrength: 5 },
                rarity: 'common',
                allowedClasses: ['warrior'],
                value: 60,
                cost: 150,
                tier: 2
            },
            // Tier 3
            {
                name: 'Steel Claymore',
                desc: 'A massive blade. +10 STR, -2 Speed',
                type: 'weapon',
                slot: 'mainhand',
                image: 'warrior_weapon_3',
                effects: { buffStrength: 10, buffDexterity: -2 },
                rarity: 'uncommon',
                allowedClasses: ['warrior'],
                value: 150,
                cost: 400,
                tier: 3
            },
            {
                name: 'Rune Blade',
                desc: 'Magical edges. +5 STR, +10 INT (Great for Skills)',
                type: 'weapon',
                slot: 'mainhand',
                image: 'warrior_weapon_4', // Using visual 4 for rune look
                effects: { buffStrength: 5, buffIntelligence: 10 },
                rarity: 'rare',
                allowedClasses: ['warrior'],
                value: 200,
                cost: 500,
                tier: 3
            },
            // Tier 4 (Final Shop)
            {
                name: 'Dragon Slayer',
                desc: 'Forged in dragonfire. +20 STR, +5 VIT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'warrior_weapon_5',
                effects: { buffStrength: 20, buffVitality: 5 },
                rarity: 'epic',
                allowedClasses: ['warrior'],
                value: 800,
                cost: 2000,
                tier: 4
            },

            // ==========================================
            // 🔮 MAGE WEAPONS (Glass Cannon vs Battlemage)
            // ==========================================
            // Tier 1
            {
                name: 'Wooden Staff',
                desc: 'Basic focus. +2 INT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'mage_weapon_1',
                effects: { buffIntelligence: 2 },
                rarity: 'common',
                allowedClasses: ['mage'],
                value: 20,
                cost: 50,
                tier: 1
            },
            // Tier 2
            {
                name: 'Apprentice Wand',
                desc: 'Standard issue. +5 INT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'mage_weapon_2',
                effects: { buffIntelligence: 5 },
                rarity: 'common',
                allowedClasses: ['mage'],
                value: 60,
                cost: 150,
                tier: 2
            },
            // Tier 3 - Split
            {
                name: 'Crystal Staff',
                desc: 'Pure magical channel. +12 INT, -3 VIT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'mage_weapon_3',
                effects: { buffIntelligence: 12, buffVitality: -3 },
                rarity: 'uncommon',
                allowedClasses: ['mage'],
                value: 150,
                cost: 400,
                tier: 3
            },
            {
                name: 'Void Scepter',
                desc: 'Dark powers. +8 INT, +5 STR (Battlemage)',
                type: 'weapon',
                slot: 'mainhand',
                image: 'mage_weapon_4',
                effects: { buffIntelligence: 8, buffStrength: 5 },
                rarity: 'rare',
                allowedClasses: ['mage'],
                value: 200,
                cost: 550,
                tier: 3
            },
            // Tier 4
            {
                name: 'Divine Staff',
                desc: 'Channeling godhood. +25 INT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'mage_weapon_5',
                effects: { buffIntelligence: 25 },
                rarity: 'epic',
                allowedClasses: ['mage'],
                value: 900,
                cost: 2500,
                tier: 4
            },

            // ==========================================
            // 🗡️ ROGUE WEAPONS (Crit vs Speed)
            // ==========================================
            // Tier 1
            {
                name: 'Iron Dagger',
                desc: 'Small but deadly. +2 DEX',
                type: 'weapon',
                slot: 'mainhand',
                image: 'rogue_weapon_1',
                effects: { buffDexterity: 2 },
                rarity: 'common',
                allowedClasses: ['rogue'],
                value: 20,
                cost: 50,
                tier: 1
            },
            // Tier 2
            {
                name: 'Poisoned Knife',
                desc: 'Coated in venom. +4 DEX, +2 STR',
                type: 'weapon',
                slot: 'mainhand',
                image: 'rogue_weapon_2',
                effects: { buffDexterity: 4, buffStrength: 2 },
                rarity: 'common',
                allowedClasses: ['rogue'],
                value: 65,
                cost: 160,
                tier: 2
            },
            // Tier 3
            {
                name: 'Twin Blades',
                desc: 'One for each hand. +10 DEX',
                type: 'weapon',
                slot: 'mainhand',
                image: 'rogue_weapon_3',
                effects: { buffDexterity: 10 },
                rarity: 'uncommon',
                allowedClasses: ['rogue'],
                value: 150,
                cost: 400,
                tier: 3
            },
            {
                name: 'Shadow Blade',
                desc: 'Hard to see. +7 DEX, +5 LUCK (Crit Build)',
                type: 'weapon',
                slot: 'mainhand',
                image: 'rogue_weapon_4',
                effects: { buffDexterity: 7, buffLuck: 5 },
                rarity: 'rare',
                allowedClasses: ['rogue'],
                value: 220,
                cost: 600,
                tier: 3
            },
            // Tier 4
            {
                name: 'Assassin\'s Edge',
                desc: 'Kill confirm. +18 DEX, +5 LUCK',
                type: 'weapon',
                slot: 'mainhand',
                image: 'rogue_weapon_5',
                effects: { buffDexterity: 18, buffLuck: 5 },
                rarity: 'epic',
                allowedClasses: ['rogue'],
                value: 850,
                cost: 2200,
                tier: 4
            },

            // ==========================================
            // 🛡️ ARMOR (Universal)
            // ==========================================
            {
                name: 'Leather Tunic',
                desc: 'Light protection. +3 VIT',
                type: 'armor',
                slot: 'chest',
                image: 'leather_armor',
                effects: { buffVitality: 3 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 50,
                cost: 100
            },
            {
                name: 'Chainmail Vest',
                desc: 'Balanced defense. +6 VIT, -1 DEX',
                type: 'armor',
                slot: 'chest',
                image: 'chainmail',
                effects: { buffVitality: 6, buffDexterity: -1 },
                rarity: 'uncommon',
                allowedClasses: ['all'],
                value: 120,
                cost: 300
            },
            {
                name: 'Plate Armor',
                desc: 'Heavy defense. +12 VIT, -3 DEX',
                type: 'armor',
                slot: 'chest',
                image: 'armour_plate',
                effects: { buffVitality: 12, buffDexterity: -3 },
                rarity: 'rare',
                allowedClasses: ['warrior'],
                value: 250,
                cost: 700
            },
            {
                name: 'Novice Robe',
                desc: 'Comfortable cloth. +2 INT',
                type: 'armor',
                slot: 'chest',
                image: 'robe_novice',
                effects: { buffIntelligence: 2 },
                rarity: 'common',
                allowedClasses: ['mage'],
                value: 40,
                cost: 80
            },
            {
                name: 'Master Robe',
                desc: 'Magically woven. +8 INT, +2 VIT',
                type: 'armor',
                slot: 'chest',
                image: 'robe_master',
                effects: { buffIntelligence: 8, buffVitality: 2 },
                rarity: 'rare',
                allowedClasses: ['mage'],
                value: 220,
                cost: 600
            },

            // ==========================================
            // 💍 ACCESSORIES
            // ==========================================
            {
                name: 'Gold Ring',
                desc: 'Shiny. +2 LUCK',
                type: 'accessory',
                slot: 'accessory',
                image: 'ring_gold',
                effects: { buffLuck: 2 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 100,
                cost: 250
            },
            {
                name: 'Ring of Power',
                desc: 'Classic artifact. +2 All Stats',
                type: 'accessory',
                slot: 'accessory',
                image: 'ring_of_power',
                effects: { buffStrength: 2, buffIntelligence: 2, buffVitality: 2, buffDexterity: 2, buffLuck: 2 },
                rarity: 'legendary', // Shop legendary is very expensive
                allowedClasses: ['all'],
                value: 1000,
                cost: 5000,
                obtainableInShop: true
            },

            // ==========================================
            // 💀 LEGENDARY "EASTER EGG" ITEMS (Not in Shop)
            // ==========================================
            {
                name: 'Blade of the Fallen King',
                desc: 'Cursed Strength. +25 STR, -10 VIT.',
                type: 'weapon',
                slot: 'mainhand',
                image: 'legendary_sword',
                effects: { buffStrength: 25, buffVitality: -10 },
                rarity: 'legendary',
                allowedClasses: ['warrior'],
                value: 5000,
                cost: 99999,
                obtainableInShop: false // HIDDEN
            },
            {
                name: 'Grimoire of Forbidden Knowledge',
                desc: 'Madness for Power. +30 INT, -50 HP.',
                type: 'weapon',
                slot: 'offhand', // or mainhand
                image: 'legendary_book',
                effects: { buffIntelligence: 30, maxHpBonus: -50 },
                rarity: 'legendary',
                allowedClasses: ['mage'],
                value: 5000,
                cost: 99999,
                obtainableInShop: false // HIDDEN
            },
            {
                name: 'Dagger of Time',
                desc: 'Bend reality. +20 DEX, +15 LUCK.',
                type: 'weapon',
                slot: 'mainhand',
                image: 'legendary_dagger',
                effects: { buffDexterity: 20, buffLuck: 15 },
                rarity: 'legendary',
                allowedClasses: ['rogue'],
                value: 5000,
                cost: 99999,
                obtainableInShop: false // HIDDEN
            }
        ];

        await Reward.insertMany(rewards);
        console.log('Rewards seeded successfully with', rewards.length, 'items');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedRewards();
