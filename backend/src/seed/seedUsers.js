const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const { getInitialStats, getInitialHP } = require('../utils/classStats');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding users...');

        await User.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // Warrior stats and HP
        const warriorStats = getInitialStats('warrior');
        const warriorHP = getInitialHP('warrior');

        // Mage stats and HP
        const mageStats = getInitialStats('mage');
        const mageHP = getInitialHP('mage');

        const users = [
            {
                username: 'Hero1',
                email: 'hero1@example.com',
                passwordHash,
                class: 'warrior',
                gender: 'male',
                xp: 0,
                level: 1,
                gold: 100,
                stats: warriorStats,
                combat: {
                    currentHP: warriorHP,
                    maxHP: warriorHP,
                    wins: 0,
                    losses: 0
                }
            },
            {
                username: 'Admin',
                email: 'admin@example.com',
                passwordHash,
                class: 'mage',
                gender: 'female',
                xp: 500,
                level: 5,
                gold: 1000,
                stats: mageStats,
                combat: {
                    currentHP: mageHP,
                    maxHP: mageHP,
                    wins: 0,
                    losses: 0
                }
            },
        ];

        await User.insertMany(users);
        console.log('Users seeded successfully with classes and stats');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
