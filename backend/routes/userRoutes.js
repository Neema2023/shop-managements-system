const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

router.post('/', createUser); // Create Manager or Cashier
router.get('/', getAllUsers); // Get all users
router.get('/:id', getUserById); // Get one user
router.put('/:id', updateUser); // Update user
router.delete('/:id', deleteUser); // Delete user

module.exports = router;