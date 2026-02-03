const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login existing user
const loginUser = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({
            id: user._id,
            name: user.name,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Register first admin
const registerAdmin = async(req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if any admin already exists
        const existingAdmin = await User.findOne({ role: 'Admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new User({
            name,
            email,
            password,
            role: 'Admin',
            status: 'Active'
        });

        await admin.save();

        res.status(201).json({
            message: 'Admin registered successfully',
            id: admin._id,
            name: admin.name,
            role: admin.role,
            token: generateToken(admin._id, admin.role)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// New: Register Customer (default role)
const registerCustomer = async(req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const customer = new User({
            name,
            email,
            password,
            role: 'Customer', // Default role
            status: 'Active'
        });

        await customer.save();

        res.status(201).json({
            message: 'Customer registered successfully',
            id: customer._id,
            name: customer.name,
            role: customer.role,
            token: generateToken(customer._id, customer.role)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user
const getCurrentUser = async(req, res) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt
        });
    } catch (err) {
        console.error('Error in /me endpoint:', err);

        // Handle specific JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired' });
        }

        // Handle other errors
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser, registerAdmin, registerCustomer, getCurrentUser };