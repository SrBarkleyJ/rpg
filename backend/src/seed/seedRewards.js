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
            // --- Consumables (All classes) ---
            {
                name: 'Health Potion',
                desc: 'Restores 50 HP instantly',
                type: 'consumable',
                slot: 'none',
                image: 'health_potion',
                effects: { healHP: 50, duration: 0 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 10
            },
            {
                name: 'Mana Potion',
                desc: 'Restores 50 MP (Not implemented yet)',
                type: 'consumable',
                slot: 'none',
                image: 'mana_potion',
                effects: { duration: 0 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 15
            },
            {
                name: 'Greater Health Potion',
                desc: 'Restores 100 HP instantly',
                type: 'consumable',
                slot: 'none',
                image: 'health_potion',
                effects: { healHP: 100, duration: 0 },
                rarity: 'uncommon',
                allowedClasses: ['all'],
                value: 25
            },

            // --- WARRIOR Weapons ---
            {
                name: 'Rusty Sword',
                desc: 'A worn but functional blade. +2 STR',
                type: 'weapon',
                slot: 'mainhand',
                image: 'sword_basic',
                effects: { buffStrength: 2, duration: 0 },
                rarity: 'common',
                allowedClasses: ['warrior'],
                value: 25,
                tier: 1,
                nextTier: 'Iron Sword',
                forgeCost: 5
            },
            {
                name: 'Iron Sword',
                desc: 'Solid iron blade. +4 STR',
                type: 'weapon',
                slot: 'mainhand',
                image: 'iron_sword',
                effects: { buffStrength: 4, duration: 0 },
                rarity: 'common',
                allowedClasses: ['warrior'],
                value: 60,
                tier: 2,
                nextTier: 'Steel Sword',
                forgeCost: 10
            },
            {
                name: 'Steel Sword',
                desc: 'Sharp steel blade. +6 STR',
                type: 'weapon',
                slot: 'mainhand',
                image: 'steel_sword',
                effects: { buffStrength: 6, duration: 0 },
                rarity: 'uncommon',
                allowedClasses: ['warrior'],
                value: 120,
                tier: 3,
                nextTier: 'Battle Axe',
                forgeCost: 20
            },
            {
                name: 'Battle Axe',
                desc: 'Heavy war axe. +8 STR, +1 VIT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'battle_axe',
                effects: { buffStrength: 8, buffVitality: 1, duration: 0 },
                rarity: 'rare',
                allowedClasses: ['warrior'],
                value: 250,
                tier: 4
            },

            // --- WARRIOR Shield ---
            {
                name: 'Wooden Shield',
                desc: 'Basic protection. +3 VIT',
                type: 'weapon',
                slot: 'offhand',
                image: 'shield_basic',
                effects: { buffVitality: 3, duration: 0 },
                rarity: 'common',
                allowedClasses: ['warrior'],
                value: 40,
                tier: 1,
                nextTier: 'Iron Shield',
                forgeCost: 5
            },
            {
                name: 'Iron Shield',
                desc: 'Sturdy defense. +5 VIT, +1 STR',
                type: 'weapon',
                slot: 'offhand',
                image: 'iron_shield',
                effects: { buffVitality: 5, buffStrength: 1, duration: 0 },
                rarity: 'uncommon',
                allowedClasses: ['warrior'],
                value: 100,
                tier: 2
            },

            // --- MAGE Weapons ---
            {
                name: 'Wooden Staff',
                desc: 'Apprentice staff. +2 INT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'wooden_staff',
                effects: { buffIntelligence: 2, duration: 0 },
                rarity: 'common',
                allowedClasses: ['mage'],
                value: 25,
                tier: 1,
                nextTier: 'Ember Staff',
                forgeCost: 5
            },
            {
                name: 'Ember Staff',
                desc: 'Fire-infused staff. +4 INT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'ember_staff',
                effects: { buffIntelligence: 4, duration: 0 },
                rarity: 'common',
                allowedClasses: ['mage'],
                value: 60,
                tier: 2,
                nextTier: 'Crystal Staff',
                forgeCost: 10
            },
            {
                name: 'Crystal Staff',
                desc: 'Arcane crystal core. +6 INT',
                type: 'weapon',
                slot: 'mainhand',
                image: 'crystal_staff',
                effects: { buffIntelligence: 6, duration: 0 },
                rarity: 'uncommon',
                allowedClasses: ['mage'],
                value: 120,
                tier: 3,
                nextTier: 'God Staff',
                forgeCost: 20
            },
            {
                name: 'God Staff',
                desc: 'Divine artifact of ultimate power. +8 INT, +1 LUCK',
                type: 'weapon',
                slot: 'mainhand',
                image: 'god_staff',
                effects: { buffIntelligence: 8, buffLuck: 1, duration: 0 },
                rarity: 'rare',
                allowedClasses: ['mage'],
                value: 250,
                tier: 4
            },

            // --- ROGUE Weapons ---
            {
                name: 'Worn Dagger',
                desc: 'Simple steel dagger. +2 DEX',
                type: 'weapon',
                slot: 'mainhand',
                image: 'worn_dagger',
                effects: { buffDexterity: 2, duration: 0 },
                rarity: 'common',
                allowedClasses: ['rogue'],
                value: 25,
                tier: 1,
                nextTier: 'Sharp Dagger',
                forgeCost: 5
            },
            {
                name: 'Sharp Dagger',
                desc: 'Well-balanced blade. +4 DEX',
                type: 'weapon',
                slot: 'mainhand',
                image: 'sharp_dagger',
                effects: { buffDexterity: 4, duration: 0 },
                rarity: 'common',
                allowedClasses: ['rogue'],
                value: 60,
                tier: 2,
                nextTier: 'Twin Blades',
                forgeCost: 10
            },
            {
                name: 'Twin Blades',
                desc: 'Dual wielding daggers. +6 DEX',
                type: 'weapon',
                slot: 'mainhand',
                image: 'twin_blades',
                effects: { buffDexterity: 6, duration: 0 },
                rarity: 'uncommon',
                allowedClasses: ['rogue'],
                value: 120,
                tier: 3,
                nextTier: 'Shadowstrike',
                forgeCost: 20
            },
            {
                name: 'Shadowstrike',
                desc: 'Legendary assassin blade. +8 DEX, +1 LUCK',
                type: 'weapon',
                slot: 'mainhand',
                image: 'shadowstrike',
                effects: { buffDexterity: 8, buffLuck: 1, duration: 0 },
                rarity: 'rare',
                allowedClasses: ['rogue'],
                value: 250,
                tier: 4
            },

            // --- Armor (All classes can wear) ---
            {
                name: 'Basic Helmet',
                desc: 'Leather cap. +1 VIT',
                type: 'armor',
                slot: 'head',
                image: 'helmet_basic',
                effects: { buffVitality: 1, duration: 0 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 25
            },
            {
                name: 'Leather Armor',
                desc: 'Basic protection. +2 VIT',
                type: 'armor',
                slot: 'chest',
                image: 'leather_armor',
                effects: { buffVitality: 2, duration: 0 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 75
            },
            {
                name: 'Chainmail Armor',
                desc: 'Solid defense. +4 VIT',
                type: 'armor',
                slot: 'chest',
                image: 'chainmail_armor',
                effects: { buffVitality: 4, duration: 0 },
                rarity: 'uncommon',
                allowedClasses: ['warrior'], // Heavy armor for warriors
                value: 150
            },
            {
                name: 'Basic Boots',
                desc: 'Simple leather boots. +1 DEX',
                type: 'armor',
                slot: 'legs',
                image: 'boots_basic',
                effects: { buffDexterity: 1, duration: 0 },
                rarity: 'common',
                allowedClasses: ['all'],
                value: 20
            },
            {
                name: 'Swift Boots',
                desc: 'Enhances agility. +3 DEX',
                type: 'accessory',
                slot: 'legs',
                image: 'swift_boots',
                effects: { buffDexterity: 3, duration: 0 },
                rarity: 'uncommon',
                allowedClasses: ['all'],
                value: 60
            },

            // --- Accessories (All classes) ---
            {
                name: 'Lucky Charm',
                desc: 'Increases fortune. +5 LUCK',
                type: 'accessory',
                slot: 'accessory',
                image: 'lucky_charm',
                effects: { buffLuck: 5, duration: 0 },
                rarity: 'rare',
                allowedClasses: ['all'],
                value: 75
            },
            {
                name: 'Ring of Power',
                desc: 'Ancient artifact. +2 to ALL stats',
                type: 'accessory',
                slot: 'accessory',
                image: 'ring_of_power',
                effects: {
                    buffStrength: 2,
                    buffIntelligence: 2,
                    buffVitality: 2,
                    buffDexterity: 2,
                    buffLuck: 2,
                    duration: 0
                },
                rarity: 'legendary',
                allowedClasses: ['all'],
                value: 500
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
