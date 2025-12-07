const mongoose = require('mongoose');

const dungeonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'very-hard', 'extreme'],
        required: true
    },
    enemies: [{
        enemyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Enemy',
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        position: {
            type: Number,
            required: true
        }
    }],
    rewards: {
        gold: { type: Number, required: true },
        xp: { type: Number, required: true },
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }],
        tetranuta: { type: Number, default: 0 }
    },
    requiredLevel: {
        type: Number,
        required: true,
        min: 1
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Dungeon = mongoose.model('Dungeon', dungeonSchema);

module.exports = Dungeon;
