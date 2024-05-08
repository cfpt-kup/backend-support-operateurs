const express = require('express');
const { signup } = require('../controllers/userController');
const router = express.Router();

// Sign up route
router.post('/users', signup);

module.exports = router;
