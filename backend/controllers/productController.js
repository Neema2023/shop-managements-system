const Product = require('../models/Product');

// Create product
const createProduct = async(req, res) => {
    const { name, category, sellingPrice, quantity, description, image, manufactureDate, expiryDate, stockLocation } = req.body;

    try {
        const product = new Product({
            name,
            category,
            sellingPrice,
            quantity,
            description,
            image,
            manufactureDate,
            expiryDate,
            stockLocation
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all products
const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get product by ID
const getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update product
const updateProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { name, category, sellingPrice, quantity, description, image, manufactureDate, expiryDate, stockLocation } = req.body;

        if (name) product.name = name;
        if (category) product.category = category;
        if (sellingPrice) product.sellingPrice = sellingPrice;
        if (quantity !== undefined) product.quantity = quantity;
        if (description) product.description = description;
        if (image) product.image = image;
        if (manufactureDate) product.manufactureDate = manufactureDate;
        if (expiryDate) product.expiryDate = expiryDate;
        if (stockLocation) product.stockLocation = stockLocation;

        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete product
const deleteProduct = async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };