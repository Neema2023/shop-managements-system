require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ===== Import routes =====
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const reportRoutes = require('./routes/reportRoutes');
const managerRoutes = require('./routes/managerRoutes');
const cashierRoutes = require('./routes/cashierRoutes');
const customerRoutes = require('./routes/customerRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');

// ===== Middlewares =====
const { protect } = require('./middlewares/authMiddleware');
const authorize = require('./middlewares/roleMiddleware');

const app = express();

// ===== Global middlewares =====
// FIX: Increase payload size limit to handle images
app.use(express.json({ limit: '50mb' })); // Increased from default 1MB to 50MB
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// ===== Routes =====
app.use('/api/auth', authRoutes);

// Admin only
app.use('/api/users', protect, authorize('Admin'), userRoutes);

// Admin / Manager / Cashier
app.use(
    '/api/products',
    protect,
    authorize('Admin', 'Manager', 'Cashier'),
    productRoutes
);

// Cashier only
app.use('/api/cashier', protect, authorize('Cashier'), cashierRoutes);

// Sales
app.use(
    '/api/sales',
    protect,
    authorize('Cashier', 'Admin', 'Manager'),
    saleRoutes
);

// Reports
app.use(
    '/api/reports',
    protect,
    authorize('Admin', 'Manager'),
    reportRoutes
);

// Manager
app.use('/api/manager', protect, authorize('Manager', 'Admin'), managerRoutes);

// Customer
app.use('/api/customer', protect, authorize('Customer'), customerRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Shop Management System Backend is running');
});

// ===== MongoDB connection =====
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

connectDB();

// ===== Start server =====
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend is running at ➜ Local: ${FRONTEND_URL}`);
    console.log('Payload limit increased to 50MB for image uploads');
    console.log('/api/auth/me endpoint is now available');
});