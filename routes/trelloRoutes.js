const express = require('express');
const { getTrelloColumnsWithCards } = require('../controllers/trelloController');
const authenticate = require('../middlewares/userAuthentication');
const router = express.Router();

router.get('/trello/columns/cards', authenticate, getTrelloColumnsWithCards);

module.exports = router;
