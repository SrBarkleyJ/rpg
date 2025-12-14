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
    enum: ['mainhand', 'offhand', 'helmet', 'chest', 'gloves', 'boots', 'cape', 'ring', 'amulet', 'belt', 'artifact', 'head', 'legs', 'accessory', 'none'],
    default: 'none'
  },

  // Item Effects
  effects: {
    // Healing effects
    healHP: { type: Number, default: 0 },           // Instant HP restoration
    healMana: { type: Number, default: 0 },         // Instant Mana restoration
    healPercent: { type: Number, default: 0 },      // Heal percentage of max HP (for Full Restore)
    manaPercent: { type: Number, default: 0 },      // Restore percentage of max Mana
    curePoison: { type: Boolean, default: false },  // Cure poison status
    
    // Stat buffs
    buffStrength: { type: Number, default: 0 },     // STR boost
    buffIntelligence: { type: Number, default: 0 }, // INT boost
    buffVitality: { type: Number, default: 0 },     // VIT boost
    buffDexterity: { type: Number, default: 0 },    // DEX boost
    buffLuck: { type: Number, default: 0 },         // LUCK boost
    
    // Equipment-specific effects (Ring/Armor bonuses)
    physicalDamagePercent: { type: Number, default: 0 },    // Physical damage % (Ring of Physical Might)
    magicDamagePercent: { type: Number, default: 0 },       // Magic damage % (Ring of Arcane Power)
    buffCritChance: { type: Number, default: 0 },           // Crit chance bonus (Ring of Precision)
    manaRegen: { type: Number, default: 0 },                // Mana regeneration per turn (Ring of Mana Flow)
    buffMaxMana: { type: Number, default: 0 },              // Max mana bonus (Ring of Mana Flow)
    maxManaBonus: { type: Number, default: 0 },             // Alternative name for max mana bonus
    armorRating: { type: Number, default: 0 },              // Armor/Defense rating (Ring of Eternal Defense)
    magicResistance: { type: Number, default: 0 },          // Magic resistance (Ring of Mystic Knowledge)
    
    // Elemental resistances
    fireResistance: { type: Number, default: 0 },
    poisonResistance: { type: Number, default: 0 },
    iceResistance: { type: Number, default: 0 },
    lightningResistance: { type: Number, default: 0 },
    
    // HP bonus
    maxHpBonus: { type: Number, default: 0 },               // Max HP bonus (Grimoire of Forbidden Knowledge)
    
    // Misc
    duration: { type: Number, default: 0 }                   // Duration in combats (0 = permanent)
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

  value: { type: Number, default: 0 },      // Selling price
  cost: { type: Number, default: 0 },       // Purchase price in shop
  stackable: { type: Boolean, default: false } // Can stack in inventory
});

module.exports = mongoose.model('Reward', RewardSchema);
