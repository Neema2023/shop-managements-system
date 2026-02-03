const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    makePayment,
    getCustomerHistory
} = require('../controllers/customerController');

const { protect } = require('../middlewares/authMiddleware'); // ✅ FIX
const authorize = require('../middlewares/roleMiddleware'); // ✅ FIX

router.get('/products', protect, authorize('Customer'), getAllProducts);
router.post('/pay', protect, authorize('Customer'), makePayment);
router.get('/history', protect, authorize('Customer'), getCustomerHistory);

module.exports = router;