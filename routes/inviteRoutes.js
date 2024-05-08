const express = require('express');
const { generateCode, generateMultipleCodes, signupWithCode } = require('../controllers/inviteController');
const router = express.Router();

router.post('/generate-code', generateCode);
router.post('/generate-multiple-codes', generateMultipleCodes);
router.post('/signup', signupWithCode);

module.exports = router;
