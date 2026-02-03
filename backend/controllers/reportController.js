const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Simple example: get total sales, products, and profit
const getAllReports = async(req, res) => {
    try {
        const sales = await Sale.find();
        const products = await Product.find();

        let totalRevenue = 0;
        let totalProfit = 0;

        sales.forEach(sale => {
            // support different field names
            const soldProducts = sale.products || sale.items || [];

            soldProducts.forEach(p => {

                // Choose correct product ID field
                const productId = p.productId || p.product || p.itemId;

                if (!productId) return; // skip if no product id

                const product = products.find(
                    prod => prod._id.toString() === productId.toString()
                );

                if (product) {
                    totalRevenue += p.quantity * product.sellingPrice;
                    const buyingPrice = product.buyingPrice || 0;
                    totalProfit += p.quantity * (product.sellingPrice - buyingPrice);
                }
            });
        });

        res.json({
            totalSales: sales.length,
            totalRevenue,
            totalProfit,
            totalProducts: products.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllReports };