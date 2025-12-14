/**
 * Seed script to add additional rings to the database
 * Run with: node src/seed/seedRings.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Reward = require('../models/Reward');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for ring seeding');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedRings = async () => {
    try {
        // Limpiar anillos existentes (opcional)
        // await Reward.deleteMany({ type: 'accessory', slot: 'ring' });

        const newRings = [
            {
                name: 'Ring of Might',
                desc: 'Channels raw power. +7 STR, +3 VIT',
                type: 'accessory',
                slot: 'ring',
                image: 'ring_gold', // Placeholder - será reemplazado con imagen real
                effects: { buffStrength: 7, buffVitality: 3 },
                rarity: 'uncommon',
                allowedClasses: ['all'],
                value: 180,
                cost: 450,
                obtainableInShop: true
            },
            {
                name: 'Ring of the Archmage',
                desc: 'Amplifies magical power. +8 INT, +4 Magic RES',
                type: 'accessory',
                slot: 'ring',
                image: 'ring_gold', // Placeholder
                effects: { buffIntelligence: 8, magicResistance: 4 },
                rarity: 'uncommon',
                allowedClasses: ['all'],
                value: 200,
                cost: 500,
                obtainableInShop: true
            },
            {
                name: 'Ring of Endurance',
                desc: 'Strengthens the body. +10 VIT, +5 Armor',
                type: 'accessory',
                slot: 'ring',
                image: 'ring_gold', // Placeholder
                effects: { buffVitality: 10, armorRating: 5 },
                rarity: 'uncommon',
                allowedClasses: ['all'],
                value: 220,
                cost: 550,
                obtainableInShop: true
            }
        ];

        // Insertar anillos
        const result = await Reward.insertMany(newRings);
        console.log(`✅ ${result.length} new rings seeded successfully!`);
        console.log('Ring names:', result.map(r => r.name).join(', '));

        // Mostrar estadísticas
        const totalAccessories = await Reward.countDocuments({ type: 'accessory' });
        const totalRings = await Reward.countDocuments({ type: 'accessory', slot: 'ring' });
        console.log(`\n📊 Statistics:`);
        console.log(`   Total accessories: ${totalAccessories}`);
        console.log(`   Total rings: ${totalRings}`);

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run seeding
connectDB().then(() => seedRings());
