const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.post('/', createProduct); // Create product
router.get('/', getAllProducts); // Get all products
router.get('/:id', getProductById); // Get one product
router.put('/:id', updateProduct); // Update product
router.delete('/:id', deleteProduct); // Delete product

module.exports = router;