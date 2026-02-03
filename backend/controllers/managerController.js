const Product = require('../models/Product');
const Sale = require('../models/Sale');
const User = require('../models/User');

// 1️⃣ Receive Stock (add quantity)
const receiveStock = async(req, res) => {
    const { productId, quantityReceived, stockLocation } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.quantity += quantityReceived;

        // Update stock location if provided
        if (stockLocation) product.stockLocation = stockLocation;

        await product.save();
        res.json({ message: 'Stock received successfully', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2️⃣ View Stock (all products)
const viewStock = async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 3️⃣ View Sales Report (all sales with cashier and product details)
const viewSalesReport = async(req, res) => {
    try {
        const sales = await Sale.find()
            .populate('cashier', 'name email role') // populate cashier info
            .populate('items.product', 'name category sellingPrice') // populate each item product
            .sort({ createdAt: -1 });

        const totalRevenue = sales
            .filter(s => s.status === 'Completed')
            .reduce((sum, sale) => sum + sale.totalAmount, 0);

        res.status(200).json({
            totalSales: sales.length,
            totalRevenue,
            sales
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 4️⃣ Record Report (summary: total revenue, total products sold)
const recordReport = async(req, res) => {
    try {
        const sales = await Sale.find();
        let totalRevenue = 0;
        let totalProductsSold = 0;

        sales.forEach(sale => {
            sale.items.forEach(item => {
                totalRevenue += item.sellingPrice * item.quantity;
                totalProductsSold += item.quantity;
            });
        });

        res.json({
            totalSales: sales.length,
            totalRevenue,
            totalProductsSold
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 5️⃣ Close Daily Sales (summary with payment method breakdown)
const closeDailySales = async(req, res) => {
    try {
        // Today's date range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Get all 'Paid' sales today
        const sales = await Sale.find({
            status: 'Paid',
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const totalSales = sales.length;
        let totalRevenue = 0;

        // Payment method totals
        const byPaymentMethod = {
            Cash: 0,
            Card: 0,
            'Mobile Money': 0
        };

        sales.forEach(sale => {
            totalRevenue += sale.totalAmount;
            if (sale.paymentMethod in byPaymentMethod) {
                byPaymentMethod[sale.paymentMethod] += sale.totalAmount;
            }
        });

        res.json({
            message: 'Daily sales closed',
            totalSales,
            totalRevenue,
            byPaymentMethod
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    receiveStock,
    viewStock,
    viewSalesReport,
    recordReport,
    closeDailySales // ✅ new
};