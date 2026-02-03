const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    quantity: { type: Number, default: 0 }, // umubare w’ibiri muri stock
    description: { type: String },
    image: { type: String },
    manufactureDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    stockLocation: { type: String }, // aho ibitse muri magazini (e.g., "Shelf 1", "Bin 2")
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);