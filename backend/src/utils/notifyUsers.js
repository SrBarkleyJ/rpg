const mongoose = require('mongoose');
const User = require('../models/User');
const { sendEmail } = require('./emailService');
const { sendPushNotifications } = require('./pushService');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const notifyAllUsers = async (type = 'daily') => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for notifications...');

        const users = await User.find({ $or: [{ email: { $exists: true, $ne: null } }, { pushToken: { $exists: true, $ne: null } }] });
        console.log(`Found ${users.length} users to notify.`);

        const subject = type === 'daily'
            ? 'New Daily Missions Available!'
            : 'New Weekly Missions Available!';

        const text = type === 'daily'
            ? 'Hello! Your new daily missions are ready. Log in now to complete them and earn rewards!'
            : 'Hello! A new week has started. Check out your new weekly missions and earn big rewards!';

        const html = type === 'daily'
            ? `<h1>Daily Missions Updated</h1>
         <p>Hello adventurer,</p>
         <p>Your <strong>daily missions</strong> have been refreshed.</p>
         <p>Log in now to complete them and earn XP and Gold!</p>
         <a href="rpgapp://home">Open App</a>`
            : `<h1>Weekly Missions Updated</h1>
         <p>Hello adventurer,</p>
         <p>Your <strong>weekly missions</strong> have been refreshed.</p>
         <p>You have a whole new week to complete these challenges.</p>
         <a href="rpgapp://home">Open App</a>`;

        let sentEmailCount = 0;
        const pushTokens = [];

        for (const user of users) {
            // Send Email
            if (user.email && user.email.includes('@')) {
                console.log(`Sending email to ${user.email}...`);
                const result = await sendEmail(user.email, subject, text, html);
                if (result) sentEmailCount++;
            }

            // Collect Push Tokens
            if (user.pushToken) {
                pushTokens.push(user.pushToken);
            }
        }

        // Send Push Notifications
        if (pushTokens.length > 0) {
            console.log(`Sending push notifications to ${pushTokens.length} devices...`);
            await sendPushNotifications(pushTokens, subject, text, { type });
        }

        console.log(`Successfully sent ${sentEmailCount} emails and notified ${pushTokens.length} devices.`);
        process.exit();
    } catch (error) {
        console.error('Error notifying users:', error);
        process.exit(1);
    }
};

// Get type from command line args
const type = process.argv[2] || 'daily';
notifyAllUsers(type);
