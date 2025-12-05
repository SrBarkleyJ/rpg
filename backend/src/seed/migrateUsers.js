const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const migrateUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for user migration...');

        // Find all users
        const users = await User.find({});
        console.log(`Found ${users.length} users to migrate`);

        for (const user of users) {
            let updated = false;

            // Initialize Mana if not present
            if (user.combat.currentMana === undefined || user.combat.maxMana === undefined) {
                const maxMana = user.calculateMaxMana();
                user.combat.currentMana = maxMana;
                user.combat.maxMana = maxMana;
                updated = true;
                console.log(`Updated mana for user ${user.username}: ${maxMana}`);
            }

            // Initialize maxHP if needed
            if (!user.combat.maxHP || user.combat.maxHP === 100) {
                const maxHP = user.calculateMaxHP();
                user.combat.maxHP = maxHP;
                if (user.combat.currentHP > maxHP) {
                    user.combat.currentHP = maxHP;
                }
                updated = true;
                console.log(`Updated HP for user ${user.username}: ${maxHP}`);
            }

            if (updated) {
                await user.save();
            }
        }

        console.log('Migration completed successfully');
        process.exit();
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

migrateUsers();
