const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['Received', 'Sold', 'Adjusted'], required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String }, // Optional: reason for adjustment or notes
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);