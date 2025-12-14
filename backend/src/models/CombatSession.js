const mongoose = require('mongoose');

const CombatSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    enemy: {
        name: { type: String, required: true },
        image: { type: String }, // Enemy sprite filename
        tier: { type: Number }, // Enemy tier for UI display
        level: { type: Number, required: true },
        hp: { type: Number, required: true },
        maxHP: { type: Number, required: true },
        damage: { type: Number, required: true }
    },

    playerHP: { type: Number, required: true },
    playerDefending: { type: Boolean, default: false }, // If player used defend action

    turn: { type: Number, default: 1 },
    status: {
        type: String,
        enum: ['active', 'victory', 'defeat', 'dungeon-complete'],
        default: 'active'
    },

    // Dungeon fields
    dungeonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dungeon' },
    dungeonProgress: { type: Number, default: 0 }, // Current enemy index in dungeon
    totalDungeonEnemies: { type: Number },

    log: [{
        turn: Number,
        actor: String,
        action: String,
        damage: Number,
        targetHP: Number,
        message: String
    }],

    createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-delete after 1 hour
});

// Índices para optimizar queries
CombatSessionSchema.index({ userId: 1, status: 1 }); // Para encontrar combate activo del usuario
CombatSessionSchema.index({ userId: 1, dungeonId: 1, status: 1 }); // Para mazmorra activa

module.exports = mongoose.model('CombatSession', CombatSessionSchema);

