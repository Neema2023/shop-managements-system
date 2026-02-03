const Sale = require('../models/Sale');
const Product = require('../models/Product');

// 1️⃣ Make Sale (POS)
const createSale = async(req, res) => {
    const { products, paymentMethod } = req.body;
    const cashierId = req.user._id;

    try {
        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products provided' });
        }

        let totalAmount = 0;
        const saleItems = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });

            if (item.quantity > product.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            // Update stock
            product.quantity -= item.quantity;
            await product.save();

            // Add to sale items
            saleItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                sellingPrice: product.sellingPrice
            });

            totalAmount += product.sellingPrice * item.quantity;
        }

        const sale = new Sale({
            cashier: cashierId,
            items: saleItems,
            totalAmount,
            paymentMethod
        });

        await sale.save();

        res.status(201).json({ message: 'Sale completed successfully', sale });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2️⃣ Cancel Sale
const cancelSale = async(req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        if (sale.status === 'Cancelled') {
            return res.status(400).json({ message: 'Sale already cancelled' });
        }

        // Return stock
        for (const item of sale.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.quantity += item.quantity;
                await product.save();
            }
        }

        sale.status = 'Cancelled';
        await sale.save();

        res.json({ message: 'Sale cancelled successfully', sale });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 3️⃣ Get My Sales
const getMySales = async(req, res) => {
    try {
        const sales = await Sale.find({ cashier: req.user._id }).sort({ createdAt: -1 });
        res.json(sales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 4️⃣ Close Daily Sales
const closeDailySales = async(req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sales = await Sale.find({
            cashier: req.user._id,
            createdAt: { $gte: today },
            status: 'Completed'
        });

        let totalRevenue = 0;
        sales.forEach(sale => totalRevenue += sale.totalAmount);

        // Mark as closed
        await Sale.updateMany({ _id: { $in: sales.map(s => s._id) } }, { dayClosed: true });

        res.json({
            message: 'Daily sales closed',
            totalSales: sales.length,
            totalRevenue
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createSale, cancelSale, getMySales, closeDailySales };