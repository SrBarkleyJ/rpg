const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  quantity: { type: Number, default: 1 },
  equipped: { type: Boolean, default: false },
  equippedSlot: { type: String, default: null }, // Nuevo: para saber en qué slot está equipado
  enhancementLevel: { type: Number, default: 0, min: 0, max: 10 }
}); // REMOVED: { _id: false }

// Schema para items equipados específicamente
const EquipmentSlotSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', default: null },
  slotType: { type: String, required: true },
  itemDetails: { type: Object, default: null } // Cache de detalles para performance
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, index: true },
  passwordHash: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  gold: { type: Number, default: 0 },
  stamina: { type: Number, default: 10 },
  class: { type: String, required: true, immutable: true },
  avatar: { type: String, enum: ['img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9', 'img10'], default: 'img1' },
  pushToken: { type: String, default: null },

  // RPG Stats System
  stats: {
    strength: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    vitality: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    luck: { type: Number, default: 10 }
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

  // Equipment System - Múltiples slots al estilo Dark Souls
  equipment: {
    mainhand: { type: EquipmentSlotSchema, default: () => ({ slotType: 'mainhand', itemId: null, itemDetails: null }) },
    offhand: { type: EquipmentSlotSchema, default: () => ({ slotType: 'offhand', itemId: null, itemDetails: null }) },
    helmet: { type: EquipmentSlotSchema, default: () => ({ slotType: 'helmet', itemId: null, itemDetails: null }) },
    chest: { type: EquipmentSlotSchema, default: () => ({ slotType: 'chest', itemId: null, itemDetails: null }) },
    gloves: { type: EquipmentSlotSchema, default: () => ({ slotType: 'gloves', itemId: null, itemDetails: null }) },
    boots: { type: EquipmentSlotSchema, default: () => ({ slotType: 'boots', itemId: null, itemDetails: null }) },
    ring1: { type: EquipmentSlotSchema, default: () => ({ slotType: 'ring1', itemId: null, itemDetails: null }) },
    ring2: { type: EquipmentSlotSchema, default: () => ({ slotType: 'ring2', itemId: null, itemDetails: null }) },
    ring3: { type: EquipmentSlotSchema, default: () => ({ slotType: 'ring3', itemId: null, itemDetails: null }) },
    ring4: { type: EquipmentSlotSchema, default: () => ({ slotType: 'ring4', itemId: null, itemDetails: null }) },
    amulet: { type: EquipmentSlotSchema, default: () => ({ slotType: 'amulet', itemId: null, itemDetails: null }) },
    belt: { type: EquipmentSlotSchema, default: () => ({ slotType: 'belt', itemId: null, itemDetails: null }) },
    cape: { type: EquipmentSlotSchema, default: () => ({ slotType: 'cape', itemId: null, itemDetails: null }) },
    artifact: { type: EquipmentSlotSchema, default: () => ({ slotType: 'artifact', itemId: null, itemDetails: null }) },
  },

  // Equipment Bonuses (calculados automáticamente)
  equipmentBonuses: {
    strength: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    vitality: { type: Number, default: 0 },
    dexterity: { type: Number, default: 0 },
    luck: { type: Number, default: 0 },
    armorRating: { type: Number, default: 0 },
    magicResistance: { type: Number, default: 0 },
    fireResistance: { type: Number, default: 0 },
    poisonResistance: { type: Number, default: 0 },
    iceResistance: { type: Number, default: 0 },
    lightningResistance: { type: Number, default: 0 }
  },
  // Additional combat-related bonuses
  equipmentBonusesExtra: {
    physicalDamagePercent: { type: Number, default: 0 },
    magicDamagePercent: { type: Number, default: 0 },
    critChancePercent: { type: Number, default: 0 },
    manaRegen: { type: Number, default: 0 },
    maxManaBonus: { type: Number, default: 0 }
  },

  inventory: { type: [InventoryItemSchema], default: [] },
  completedQuests: { type: [String], default: [] },
  taskHistory: [{
    taskId: { type: String, required: true },
    completedAt: { type: Date, default: Date.now }
  }],
  focusAreas: { type: [String], default: [] },
  lastRestTime: { type: Date, default: null },

  // Progression System
  skillPoints: { type: Number, default: 0 },
  tetranuta: { type: Number, default: 0 },
  skills: {
    skill1: { level: { type: Number, default: 0, min: 0, max: 5 } },
    skill2: { level: { type: Number, default: 0, min: 0, max: 5 } },
    skill3: { level: { type: Number, default: 0, min: 0, max: 5 } },
    skill4: { level: { type: Number, default: 0, min: 0, max: 5 } },
    skill5: { level: { type: Number, default: 0, min: 0, max: 5 } },
    skill6: { level: { type: Number, default: 0, min: 0, max: 5 } }
  },
  weeklyTasksCompleted: { type: Number, default: 0 }
}, { timestamps: true });

// Índices para optimizar queries frecuentes
UserSchema.index({ username: 1 }); // Ya existe
UserSchema.index({ email: 1 }); // Ya existe
UserSchema.index({ createdAt: -1 }); // Para listar usuarios por fecha
UserSchema.index({ level: 1 }); // Para queries de nivel

// Middleware para calcular bonificaciones antes de guardar
UserSchema.pre('save', async function (next) {
  // Solo recalcular si hay cambios en el equipo
  if (this.isModified('equipment') || this.isModified('inventory')) {
    await this.calculateEquipmentBonuses();

    // Recalcular HP y Mana máximos
    this.combat.maxHP = this.calculateMaxHP();
    this.combat.maxMana = this.calculateMaxMana();

    // Asegurar que el HP/MP actual no exceda el máximo
    if (this.combat.currentHP > this.combat.maxHP) {
      this.combat.currentHP = this.combat.maxHP;
    }
    if (this.combat.currentMana > this.combat.maxMana) {
      this.combat.currentMana = this.combat.maxMana;
    }
  }
  next();
});

// Método para calcular bonificaciones del equipo
UserSchema.methods.calculateEquipmentBonuses = async function () {
  const Reward = mongoose.model('Reward');
  const equipmentSlots = ['mainhand', 'offhand', 'helmet', 'chest', 'gloves', 'boots',
    'ring1', 'ring2', 'ring3', 'ring4', 'amulet', 'belt', 'cape', 'artifact'];

  // Resetear bonificaciones
  this.equipmentBonuses = {
    strength: 0,
    intelligence: 0,
    vitality: 0,
    dexterity: 0,
    luck: 0,
    armorRating: 0,
    magicResistance: 0,
    fireResistance: 0,
    poisonResistance: 0,
    iceResistance: 0,
    lightningResistance: 0
  };
  // Resetear bonificaciones extra
  this.equipmentBonusesExtra = {
    physicalDamagePercent: 0,
    magicDamagePercent: 0,
    critChancePercent: 0,
    manaRegen: 0,
    maxManaBonus: 0
  };

  // Calcular bonificaciones de cada slot
  for (const slot of equipmentSlots) {
    const slotData = this.equipment[slot];
    if (slotData && slotData.itemId) {
      let item;

      // Usar cache si está disponible
      if (slotData.itemDetails) {
        item = slotData.itemDetails;
      } else {
        item = await Reward.findById(slotData.itemId);
        // Cachear detalles para próxima vez
        this.equipment[slot].itemDetails = item;
      }

      if (item && item.effects) {
        const effects = item.effects;

        // Sumar bonificaciones de stats
        if (effects.buffStrength) this.equipmentBonuses.strength += effects.buffStrength;
        if (effects.buffIntelligence) this.equipmentBonuses.intelligence += effects.buffIntelligence;
        if (effects.buffVitality) this.equipmentBonuses.vitality += effects.buffVitality;
        if (effects.buffDexterity) this.equipmentBonuses.dexterity += effects.buffDexterity;
        if (effects.buffLuck) this.equipmentBonuses.luck += effects.buffLuck;

        // Sumar defensas
        if (effects.defense) this.equipmentBonuses.armorRating += effects.defense;
        if (effects.magicResistance) this.equipmentBonuses.magicResistance += effects.magicResistance;

        // Sumar resistencias elementales
        if (effects.fireResistance) this.equipmentBonuses.fireResistance += effects.fireResistance;
        if (effects.poisonResistance) this.equipmentBonuses.poisonResistance += effects.poisonResistance;
        if (effects.iceResistance) this.equipmentBonuses.iceResistance += effects.iceResistance;
        if (effects.lightningResistance) this.equipmentBonuses.lightningResistance += effects.lightningResistance;

        // Bonificaciones adicionales de HP/Mana
        if (effects.maxHpBonus) {
          this.combat.maxHP += effects.maxHpBonus;
          this.combat.currentHP = Math.min(this.combat.currentHP + effects.maxHpBonus, this.combat.maxHP);
        }
        // Support both naming conventions for mana bonus
        const manaBonus = effects.maxManaBonus || effects.buffMaxMana || 0;
        if (manaBonus) {
          this.combat.maxMana += manaBonus;
          this.combat.currentMana = Math.min(this.combat.currentMana + manaBonus, this.combat.maxMana);
          this.equipmentBonusesExtra.maxManaBonus += manaBonus;
        }

        // Physical / Magic damage percent bonuses
        if (effects.physicalDamagePercent) {
          this.equipmentBonusesExtra.physicalDamagePercent += effects.physicalDamagePercent;
        }
        if (effects.magicDamagePercent) {
          this.equipmentBonusesExtra.magicDamagePercent += effects.magicDamagePercent;
        }

        // Critical chance and mana regen
        if (effects.buffCritChance) {
          this.equipmentBonusesExtra.critChancePercent += effects.buffCritChance;
        }
        if (effects.manaRegen) {
          this.equipmentBonusesExtra.manaRegen += effects.manaRegen;
        }
      }
    }
  }
};

// Método para equipar un item
UserSchema.methods.equipItem = async function (inventoryId, slot) {
  const Reward = mongoose.model('Reward');

  // Verificar que el item existe en el inventario por su ID único de instancia
  const inventoryItem = this.inventory.id(inventoryId);
  if (!inventoryItem) {
    throw new Error('Item not found in inventory');
  }

  // Get the itemId (Reward ID) from the inventory item
  const itemId = inventoryItem.itemId;

  // Obtener detalles del item
  const item = await Reward.findById(itemId);
  if (!item) {
    throw new Error('Item details not found');
  }

  // Verificar compatibilidad de clase
  /* REMOVED BY USER REQUEST - ALL CLASSES CAN EQUIP EVERYTHING
  const userClass = this.class.toLowerCase();
  if (!item.allowedClasses.includes('all') && 
      !item.allowedClasses.includes(userClass)) {
    throw new Error('Your class cannot equip this item');
  }
  */

  // Determinar slot si no se especifica
  let targetSlot = slot;
  if (!targetSlot) {
    // Determinar slot basado en tipo de item
    targetSlot = this.determineItemSlot(item);
  }

  // Verificar que el slot existe
  if (!this.equipment[targetSlot]) {
    throw new Error('Invalid equipment slot');
  }

  // Verificar que el item puede ir en ese slot
  if (!this.canItemGoInSlot(item, targetSlot)) {
    throw new Error(`This item cannot be equipped in the ${targetSlot} slot`);
  }

  // Desequipar item actual si existe
  await this.unequipSlot(targetSlot);

  // Equipar nuevo item
  this.equipment[targetSlot] = {
    slotType: targetSlot,
    itemId: itemId,
    itemDetails: item // Cachear detalles
  };

  // Actualizar estado en inventario
  inventoryItem.equipped = true;
  inventoryItem.equippedSlot = targetSlot;

  return { success: true, slot: targetSlot };
};

// Método para desequipar un slot
UserSchema.methods.unequipSlot = async function (slot) {
  const slotData = this.equipment[slot];
  if (!slotData || !slotData.itemId) {
    return; // Slot ya está vacío
  }

  const itemId = slotData.itemId;

  // Encontrar el item en el inventario
  const inventoryItem = this.inventory.find(item =>
    item.itemId.toString() === itemId.toString()
  );

  if (inventoryItem) {
    inventoryItem.equipped = false;
    inventoryItem.equippedSlot = null;
  } else {
    // Si no está en inventario, añadirlo (por seguridad)
    this.inventory.push({
      itemId: itemId,
      quantity: 1,
      equipped: false,
      equippedSlot: null
    });
  }

  // Limpiar slot
  this.equipment[slot] = {
    slotType: slot,
    itemId: null,
    itemDetails: null
  };
};

// Método para determinar slot automáticamente
UserSchema.methods.determineItemSlot = function (item) {
  switch (item.type) {
    case 'weapon':
      // Si es arma, verificar si es mainhand u offhand
      if (item.slot === 'offhand') return 'offhand';
      if (item.slot === 'mainhand') return 'mainhand';
      // Por defecto, mainhand para armas
      return 'mainhand';

    case 'armor':
      // Determinar tipo de armadura
      if (item.slot === 'helmet') return 'helmet';
      if (item.slot === 'chest') return 'chest';
      if (item.slot === 'gloves') return 'gloves';
      if (item.slot === 'boots') return 'boots';
      if (item.slot === 'cape') return 'cape';
      // Por defecto, chest
      return 'chest';

    case 'accessory':
      // Encontrar primer anillo disponible
      if (item.slot === 'ring') {
        for (let i = 1; i <= 4; i++) {
          if (!this.equipment[`ring${i}`].itemId) {
            return `ring${i}`;
          }
        }
        return 'ring1'; // Si todos llenos, reemplazar el primero
      }
      if (item.slot === 'amulet') return 'amulet';
      if (item.slot === 'belt') return 'belt';
      if (item.slot === 'artifact') return 'artifact';
      // Por defecto, amulet
      return 'amulet';

    case 'shield':
      return 'offhand';

    default:
      throw new Error('Cannot determine slot for this item type');
  }
};

// Método para verificar si un item puede ir en un slot
UserSchema.methods.canItemGoInSlot = function (item, slot) {
  const slotConfig = {
    mainhand: ['weapon'],
    offhand: ['weapon', 'shield'],
    helmet: ['armor'],
    chest: ['armor'],
    gloves: ['armor'],
    boots: ['armor'],
    ring1: ['accessory'],
    ring2: ['accessory'],
    ring3: ['accessory'],
    ring4: ['accessory'],
    amulet: ['accessory'],
    belt: ['accessory'],
    cape: ['armor', 'accessory'],
    artifact: ['accessory']
  };

  // Verificar tipo
  const allowedTypes = slotConfig[slot];
  if (!allowedTypes || !allowedTypes.includes(item.type)) {
    return false;
  }

  // Verificar slot específico del item
  if (item.slot) {
    if (slot.startsWith('ring') && item.slot === 'ring') {
      return true;
    }
    if (item.slot === slot) {
      return true;
    }
    return false;
  }

  return true;
};

// Métodos existentes (mantener pero actualizar para usar equipmentBonuses)
UserSchema.methods.calculateMaxHP = function () {
  const totalVitality = this.stats.vitality + (this.equipmentBonuses?.vitality || 0);
  return 100 + (totalVitality * 20);
};

UserSchema.methods.calculateMaxMana = function () {
  const totalIntelligence = this.stats.intelligence + (this.equipmentBonuses?.intelligence || 0);
  return 50 + (totalIntelligence * 10);
};

UserSchema.methods.calculatePhysicalDamage = function (baseWeaponDamage = 10) {
  const totalStrength = this.stats.strength + (this.equipmentBonuses?.strength || 0);
  let dmg = Math.floor(baseWeaponDamage * (1 + (totalStrength / 10)));
  const physPct = this.equipmentBonusesExtra?.physicalDamagePercent || 0;
  if (physPct) {
    dmg = Math.floor(dmg * (1 + physPct / 100));
  }
  return dmg;
};

UserSchema.methods.calculateMagicalDamage = function (baseSpellDamage = 10) {
  const totalIntelligence = this.stats.intelligence + (this.equipmentBonuses?.intelligence || 0);
  let dmg = Math.floor(baseSpellDamage * (1 + (totalIntelligence / 10)));
  const magPct = this.equipmentBonusesExtra?.magicDamagePercent || 0;
  if (magPct) {
    dmg = Math.floor(dmg * (1 + magPct / 100));
  }
  return dmg;
};

UserSchema.methods.calculateCritChance = function () {
  const totalDexterity = this.stats.dexterity + (this.equipmentBonuses?.dexterity || 0);
  const totalLuck = this.stats.luck + (this.equipmentBonuses?.luck || 0);
  const base = 5 + (totalDexterity / 5) + (totalLuck / 10);
  const extraCrit = this.equipmentBonusesExtra?.critChancePercent || 0;
  return base + extraCrit;
};

// Método para obtener estadísticas totales
UserSchema.methods.getTotalStats = function () {
  return {
    strength: this.stats.strength + (this.equipmentBonuses?.strength || 0),
    intelligence: this.stats.intelligence + (this.equipmentBonuses?.intelligence || 0),
    vitality: this.stats.vitality + (this.equipmentBonuses?.vitality || 0),
    dexterity: this.stats.dexterity + (this.equipmentBonuses?.dexterity || 0),
    luck: this.stats.luck + (this.equipmentBonuses?.luck || 0),
    armorRating: this.equipmentBonuses?.armorRating || 0,
    magicResistance: this.equipmentBonuses?.magicResistance || 0
  };
};

module.exports = mongoose.model('User', UserSchema);