const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    es: { type: String, required: true }
  },
  description: {
    en: String,
    es: String
  },
  category: String,
  rewardXP: { type: Number, default: 10 },
  rewardGold: { type: Number, default: 5 },
  repeatType: { type: String, enum: ['once', 'daily', 'weekly'], default: 'once' },
  type: { type: String, enum: ['user', 'system'], default: 'user' },
  difficulty: { type: Number, default: 1 },
  duration: { type: Number, default: 0 } // Duration in seconds (0 = instant)
}, { timestamps: true });

// Índices para optimizar queries
TaskSchema.index({ category: 1 }); // Para filtrar por categoría
TaskSchema.index({ type: 1 }); // Para filtrar por tipo (user/system)
TaskSchema.index({ repeatType: 1 }); // Para queries de tareas diarias/semanales
TaskSchema.index({ createdAt: -1 }); // Para listar tareas por fecha

module.exports = mongoose.model('Task', TaskSchema);
