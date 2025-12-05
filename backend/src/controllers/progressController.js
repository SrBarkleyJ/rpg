const User = require('../models/User');

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
    try {
        const updates = req.body;
        // Prevent updating sensitive fields directly
        delete updates.passwordHash;
        delete updates.xp;
        delete updates.level;
        delete updates.gold;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
        res.json(user);
    } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile };
