const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    xpEarned: { type: Number, default: 0 },
    goldEarned: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
});

module.exports = mongoose.model('Progress', ProgressSchema);
