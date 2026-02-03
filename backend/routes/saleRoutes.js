const express = require('express');
const router = express.Router();

const {
    createSale,
    cancelSale,
    getMySales,
    closeDailySales
} = require('../controllers/cashierController');

const { protect } = require('../middlewares/authMiddleware'); // ✅ FIX
const authorize = require('../middlewares/roleMiddleware');

// Apply middlewares to all routes below
router.use(protect);
router.use(authorize('Cashier'));

router.post('/create-sale', createSale);
router.post('/cancel-sale/:id', cancelSale);
router.get('/my-sales', getMySales);
router.get('/close-daily-sales', closeDailySales);

module.exports = router;