const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

const makePayment = async(req, res) => {
    const { items, paymentMethod } = req.body;
    const customerId = req.user._id;

    try {
        let total = 0;
        const orderItems = [];

        for (const item of items) {

            // Validate productId
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({ message: 'Invalid productId' });
            }

            // Find product
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} only has ${product.quantity} in stock`
                });
            }

            const itemTotal = product.sellingPrice * item.quantity;
            total += itemTotal;

            // Build correct order item object
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.sellingPrice
            });
        }

        // Reduce stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { quantity: -item.quantity }
            });
        }

        // Create order
        const order = new Order({
            customer: customerId,
            items: orderItems,
            totalAmount: total,
            paymentMethod,
            status: 'Paid'
        });

        await order.save();

        res.status(201).json({
            message: 'Payment successful',
            order
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};