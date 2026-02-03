const Product = require('../models/Product');
const Order = require('../models/Order');

// Get all products for customer
const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find().select('-buyingPrice');
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Customer payment
const makePayment = async(req, res) => {
    const { items, paymentMethod } = req.body;
    const customerId = req.user._id;

    try {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items are required' });
        }

        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} only has ${product.quantity} in stock`
                });
            }

            total += product.sellingPrice * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.sellingPrice
            });
        }

        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity }
            });
        }

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

// Customer order history
const getCustomerHistory = async(req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('items.product', 'name sellingPrice');
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    makePayment,
    getCustomerHistory
};