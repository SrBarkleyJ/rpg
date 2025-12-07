const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // Refers to Reward/Item
    quantity: { type: Number, default: 1 },
    acquiredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
