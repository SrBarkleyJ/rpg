const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  name: String,
  desc: String,
  image: String,

  // Item Classification
  type: {
    type: String,
    enum: ['consumable', 'weapon', 'armor', 'accessory'],
    default: 'consumable'
  },

  // Equipment Slot (for weapons/armor/accessories)
  slot: {
    type: String,
    enum: ['mainhand', 'offhand', 'head', 'chest', 'legs', 'accessory', 'none'],
    default: 'none'
  },

  // Item Effects
  effects: {
    healHP: { type: Number, default: 0 },           // Instant HP restoration
    healMana: { type: Number, default: 0 },         // Instant Mana restoration
    healPercent: { type: Number, default: 0 },      // Heal percentage of max HP (for Full Restore)
    manaPercent: { type: Number, default: 0 },      // Restore percentage of max Mana
    curePoison: { type: Boolean, default: false },  // Cure poison status
    buffStrength: { type: Number, default: 0 },     // Temporary STR boost
    buffIntelligence: { type: Number, default: 0 }, // Temporary INT boost
    buffVitality: { type: Number, default: 0 },     // Permanent VIT boost
    buffDexterity: { type: Number, default: 0 },    // Permanent DEX boost
    buffLuck: { type: Number, default: 0 },         // Permanent LUCK boost
    duration: { type: Number, default: 0 }          // Duration in combats (0 = permanent)
  },

  // Rarity & Value
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },

  // Class restrictions
  allowedClasses: {
    type: [String],
    enum: ['warrior', 'mage', 'rogue', 'all'],
    default: ['all']
  },

  value: { type: Number, default: 0 }  // Gold cost
});

module.exports = mongoose.model('Reward', RewardSchema);
