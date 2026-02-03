const Sale = require('../models/Sale');
const Product = require('../models/Product');

const createSale = async(req, res) => {
    const { products, paymentMethod } = req.body;
    const cashierId = req.user.id; // assuming authMiddleware sets req.user

    try {
        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No products provided" });
        }

        let totalAmount = 0;
        const saleItems = [];

        for (let item of products) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });

            if (item.quantity > product.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            // Calculate total
            totalAmount += product.sellingPrice * item.quantity;

            // Update stock
            product.quantity -= item.quantity;
            await product.save();

            // Push to sale items
            saleItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.sellingPrice
            });
        }

        const sale = new Sale({
            cashier: cashierId,
            items: saleItems,
            totalAmount,
            paymentMethod
        });

        await sale.save();

        res.status(201).json({ message: "Sale completed successfully", sale });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createSale };