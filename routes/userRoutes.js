const express = require('express');
const { signup, login, logout } = require('../controllers/userController');
const authenticate = require('../middlewares/userAuthentication')
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);


module.exports = router;
