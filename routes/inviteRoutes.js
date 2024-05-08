const express = require('express');
const { generateCode, generateMultipleCodes } = require('../controllers/inviteController');
const router = express.Router();

router.post('/generate-code', generateCode);
router.post('/generate-multiple-codes', generateMultipleCodes);

module.exports = router;
