const express = require('express');
const router = express.Router();
const { loginUser, registerAdmin, registerCustomer, getCurrentUser } = require('../controllers/authController');

// Login
router.post('/login', loginUser);

// Register first Admin (only if no admin exists)
router.post('/register-admin', registerAdmin);

// Register customer (default role)
router.post('/register', registerCustomer);

// Get current user (NEW endpoint - this fixes the 404 error)
router.get('/me', getCurrentUser);

module.exports = router;