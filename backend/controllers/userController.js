const User = require('../models/User');

// Create user (Manager or Cashier or Storekeeper)
const createUser = async(req, res) => {
    const { name, email, password, role } = req.body;

    // Prevent creating Customer by admin (optional but recommended)
    if (role === 'Customer') {
        return res.status(400).json({ message: 'Admin cannot create customer' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ name, email, password, role, status: 'Active' });
        await user.save();

        res.status(201).json({
            message: `${role} created successfully`,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
const getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by ID
const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user
const updateUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, password, role, status } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // will hash automatically
        if (role) user.role = role;
        if (status) user.status = status;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user
const deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };