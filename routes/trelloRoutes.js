const express = require('express');
const { getTrelloColumnsWithCards, moveCard, getCardById } = require('../controllers/trelloController');
const authenticate = require('../middlewares/userAuthentication');
const router = express.Router();

router.get('/trello/columns/cards', authenticate, getTrelloColumnsWithCards);
router.post('/trello/cards/move', authenticate, moveCard);
router.get('/trello/cards/:cardId', authenticate, getCardById);

module.exports = router;
