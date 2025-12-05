const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getInitialStats, getInitialHP } = require('../utils/classStats');
require('dotenv').config();

const register = async (req, res, next) => {
  try {
    const { username, email, password, class: userClass, avatar } = req.body;

    if (!username || !password || !userClass) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate class
    const validClasses = ['warrior', 'mage', 'rogue'];
    if (!validClasses.includes(userClass)) {
      return res.status(400).json({ message: 'Invalid class' });
    }

    // Validate avatar (optional, defaults to img1)
    const validAvatars = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9', 'img10'];
    if (avatar && !validAvatars.includes(avatar)) {
      return res.status(400).json({ message: 'Invalid avatar' });
    }



    const salt = Number(process.env.BCRYPT_SALT || 10);
    const hash = await bcrypt.hash(password, salt);

    // Get initial stats based on class
    const initialStats = getInitialStats(userClass);
    const initialHP = getInitialHP(userClass);

    const user = await User.create({
      username,
      email,
      passwordHash: hash,
      class: userClass,
      avatar: avatar || 'img1', // Default to img1 if not provided
      stats: initialStats,
      combat: {
        currentHP: initialHP,
        maxHP: initialHP,
        wins: 0,
        losses: 0
      }
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        class: user.class,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        gold: user.gold,
        stamina: user.stamina,
        stats: user.stats,
        combat: user.combat,
        skillPoints: user.skillPoints,
        weeklyTasksCompleted: user.weeklyTasksCompleted,
        inventory: user.inventory,
        completedQuests: user.completedQuests
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    // Return complete user data (same as register)
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        class: user.class,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        gold: user.gold,
        stamina: user.stamina,
        stats: user.stats,
        combat: user.combat,
        skillPoints: user.skillPoints,
        weeklyTasksCompleted: user.weeklyTasksCompleted,
        inventory: user.inventory,
        completedQuests: user.completedQuests
      }
    });
  } catch (err) {
    next(err);
  }
};

const updatePushToken = async (req, res, next) => {
  try {
    const { pushToken } = req.body;
    if (!pushToken) return res.status(400).json({ message: 'Push token required' });

    await User.findByIdAndUpdate(req.user._id, { pushToken });
    res.json({ message: 'Push token updated' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, updatePushToken };
