/**
 * Unified Seed Runner
 * Runs all seeds in the correct order
 * 
 * Usage: node seeds/index.js
 */

const { seedEnemies } = require('./enemySeed');
const { seedDungeons } = require('./dungeonSeed');
const mongoose = require('mongoose');
require('dotenv').config();

const runAllSeeds = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🌱 SEEDING DATABASE...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // NOTE: Seeds in src/seed/ (users, rewards, tasks) auto-execute when run directly
        // They have their own mongoose connections and process.exit() calls
        // To avoid conflicts, we only seed Enemies and Dungeons here

        // For users/rewards/tasks, run them separately:
        // node src/seed/seedUsers.js
        // node src/seed/seedRewards.js
        // node src/seed/seedTasks.js

        // 1. Enemies (no dependencies)
        console.log('1️⃣  Seeding Enemies...');
        await seedEnemies();
        console.log('   ✅ Enemies seeded\n');

        // 2. Dungeons (depends on Enemies)
        console.log('2️⃣  Seeding Dungeons...');
        await seedDungeons();
        console.log('   ✅ Dungeons seeded\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✨ ENEMY & DUNGEON SEEDS COMPLETED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('💡 To seed users/rewards/tasks, run:');
        console.log('   node src/seed/seedUsers.js');
        console.log('   node src/seed/seedRewards.js');
        console.log('   node src/seed/seedTasks.js\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ SEED ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    runAllSeeds();
}

module.exports = { runAllSeeds };
