const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  equipped: { type: Boolean, default: false },
  enhancementLevel: { type: Number, default: 0, min: 0, max: 10 }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, index: true }, // Email without validation - can be anything
  passwordHash: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  gold: { type: Number, default: 0 },
  stamina: { type: Number, default: 10 },
  class: { type: String, required: true, immutable: true }, // Immutable after creation
  avatar: { type: String, enum: ['img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9', 'img10'], default: 'img1' }, // Character avatar
  pushToken: { type: String, default: null },

  // RPG Stats System
  stats: {
    strength: { type: Number, default: 10 },      // Physical damage multiplier
    intelligence: { type: Number, default: 10 },  // Magical damage multiplier
    vitality: { type: Number, default: 10 },      // HP multiplier
    dexterity: { type: Number, default: 10 },     // Critical chance
    luck: { type: Number, default: 10 }           // Loot/critical bonus
  },

  // Combat System
  combat: {
    currentHP: { type: Number, default: 100 },
    maxHP: { type: Number, default: 100 },
    currentMana: { type: Number, default: 50 },
    maxMana: { type: Number, default: 50 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
  },

  // Progression System
  skillPoints: { type: Number, default: 0 },
  tetranuta: { type: Number, default: 0 }, // Forging material
  skills: {
    skill1: {
      level: { type: Number, default: 0, min: 0, max: 5 }
    },
    skill2: {
      level: { type: Number, default: 0, min: 0, max: 5 }
    },
    skill3: {
      level: { type: Number, default: 0, min: 0, max: 5 }
    },
    skill4: {
      level: { type: Number, default: 0, min: 0, max: 5 }
    }
  },
  weeklyTasksCompleted: { type: Number, default: 0 },

  // Equipment Bonuses (separate from base stats)
  equipmentBonuses: {
    strength: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    vitality: { type: Number, default: 0 },
    dexterity: { type: Number, default: 0 },
    luck: { type: Number, default: 0 }
  },

  inventory: { type: [InventoryItemSchema], default: [] },
  completedQuests: { type: [String], default: [] },
  lastRestTime: { type: Date, default: null }
}, { timestamps: true });

// Method to calculate max HP based on vitality + equipment
UserSchema.methods.calculateMaxHP = function () {
  const totalVitality = this.stats.vitality + (this.equipmentBonuses?.vitality || 0);
  return 100 + (totalVitality * 10);
};

// Method to calculate max Mana based on intelligence + equipment
UserSchema.methods.calculateMaxMana = function () {
  const totalIntelligence = this.stats.intelligence + (this.equipmentBonuses?.intelligence || 0);
  // Base 50 + 5 per INT point
  return 50 + (totalIntelligence * 5);
};

// Method to calculate physical damage
UserSchema.methods.calculatePhysicalDamage = function (baseWeaponDamage = 10) {
  const totalStrength = this.stats.strength + (this.equipmentBonuses?.strength || 0);
  return Math.floor(baseWeaponDamage * (1 + (totalStrength / 20)));
};

// Method to calculate magical damage
UserSchema.methods.calculateMagicalDamage = function (baseSpellDamage = 10) {
  const totalIntelligence = this.stats.intelligence + (this.equipmentBonuses?.intelligence || 0);
  return Math.floor(baseSpellDamage * (1 + (totalIntelligence / 20)));
};

// Method to calculate critical chance
UserSchema.methods.calculateCritChance = function () {
  const totalDexterity = this.stats.dexterity + (this.equipmentBonuses?.dexterity || 0);
  const totalLuck = this.stats.luck + (this.equipmentBonuses?.luck || 0);
  return 5 + (totalDexterity / 10) + (totalLuck / 20);
};

module.exports = mongoose.model('User', UserSchema);
