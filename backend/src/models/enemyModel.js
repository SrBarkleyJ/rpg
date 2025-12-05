const mongoose = require('mongoose');

const enemySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    tier: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    baseLevel: {
        type: Number,
        required: true,
        min: 1
    },
    stats: {
        hp: { type: Number, required: true },
        strength: { type: Number, required: true },
        defense: { type: Number, required: true },
        mana: { type: Number, default: 0 }
    },
    rewards: {
        baseGold: { type: Number, required: true },
        baseXP: { type: Number, required: true },
        tetranutaChance: { type: Number, default: 0.1, min: 0, max: 1 }
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Method to scale enemy to specific level
enemySchema.methods.scaleToLevel = function (targetLevel) {
    const levelDiff = targetLevel - this.baseLevel;
    const scalingFactor = 1 + (levelDiff * 0.15); // 15% increase per level

    const scaledHP = Math.floor(this.stats.hp * scalingFactor);
    const scaledStrength = Math.floor(this.stats.strength * scalingFactor);

    return {
        name: this.name,
        image: this.image,
        tier: this.tier,
        level: targetLevel,
        hp: scaledHP,              // For CombatSession compatibility
        maxHP: scaledHP,            // For display/calculations
        damage: scaledStrength,     // Base damage from strength
        strength: scaledStrength,
        defense: Math.floor(this.stats.defense * scalingFactor),
        mana: Math.floor(this.stats.mana * scalingFactor),
        rewards: {
            gold: Math.floor(this.rewards.baseGold * scalingFactor),
            xp: Math.floor(this.rewards.baseXP * scalingFactor),
            tetranutaChance: this.rewards.tetranutaChance
        }
    };
};

const Enemy = mongoose.model('Enemy', enemySchema);

module.exports = Enemy;
