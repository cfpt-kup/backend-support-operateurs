const express = require('express');
const { getTrelloColumnsWithCards, moveCard } = require('../controllers/trelloController');
const authenticate = require('../middlewares/userAuthentication');
const router = express.Router();

router.get('/trello/columns/cards', authenticate, getTrelloColumnsWithCards);
router.post('/trello/cards/move', authenticate, moveCard); // Route to move card

module.exports = router;
