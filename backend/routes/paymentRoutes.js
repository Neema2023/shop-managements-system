const express = require('express');
const router = express.Router();

const { makePayment } = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.post('/pay', protect, authorize('Customer'), makePayment);

module.exports = router;