const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const { createSale, cancelSale, getMySales, closeDailySales } = require('../controllers/cashierController');

// Protect all routes
router.use(protect);
router.use(authorize('Cashier')); // Only Cashier can access

// Routes
router.post('/create-sale', createSale);
router.post('/cancel-sale/:id', cancelSale);
router.get('/my-sales', getMySales);
router.get('/close-daily-sales', closeDailySales);

module.exports = router;