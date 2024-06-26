const express = require('express');
const { signup, login, logout, getProfile, getAllUsers, getUserById, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const authenticate = require('../middlewares/userAuthentication')
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users', authenticate, updateUserProfile);
router.delete('/users', authenticate, deleteUserProfile);

module.exports = router;
