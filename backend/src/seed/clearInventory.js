const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const clearInventory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB...');

        // Clear inventory for all users (or specific user)
        const result = await User.updateMany(
            {},
            {
                $set: {
                    inventory: [],
                    gold: 1000 // Give some gold to buy new items
                }
            }
        );

        console.log(`Cleared inventory for ${result.modifiedCount} users`);
        console.log('Gave 1000 gold to each user');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clearInventory();
