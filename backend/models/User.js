const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ===== User Schema =====
const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please provide name'] },
    email: { type: String, required: [true, 'Please provide email'], unique: true },
    password: { type: String, required: [true, 'Please provide password'] },

    // ✅ Added Customer role here
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Cashier', 'Storekeeper', 'Customer'],
        required: true
    },

    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// ===== Pre-save hook (hash password) =====
// ✅ Important: must be a normal function, not arrow function
userSchema.pre('save', async function(next) {
    // In Mongoose 7, async pre hooks do NOT require `next()` anymore
    if (!this.isModified('password')) return; // nothing to do

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err; // throw error instead of calling next(err)
    }
});

// ===== Compare password method =====
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);