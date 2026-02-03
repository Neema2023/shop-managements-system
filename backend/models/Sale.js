const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    sellingPrice: { type: Number, required: true }
});

const saleSchema = new mongoose.Schema({
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [saleItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Mobile', 'Card'], required: true },
    status: { type: String, enum: ['Completed', 'Cancelled'], default: 'Completed' },
    dayClosed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);