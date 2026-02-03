const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware'); // ✅ ensure correct import
const authorize = require('../middlewares/roleMiddleware');

const {
    receiveStock,
    viewStock,
    viewSalesReport,
    recordReport,
    closeDailySales // ✅ include the new function
} = require('../controllers/managerController');

// Only managers & admins
router.use(protect);
router.use(authorize('Manager', 'Admin'));

// Routes
router.post('/receive-stock', receiveStock);
router.get('/view-stock', viewStock);
router.get('/view-sales-report', viewSalesReport);
router.get('/record-report', recordReport);
router.get('/close-daily-sales', closeDailySales); // ✅ new route

module.exports = router;