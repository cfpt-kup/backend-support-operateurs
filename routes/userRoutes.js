const express = require('express');
const { signup, login, logout, getProfile } = require('../controllers/userController');
const authenticate = require('../middlewares/userAuthentication')
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);


module.exports = router;
