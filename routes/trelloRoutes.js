const express = require('express');
const { getTrelloColumnsWithCards, moveCard, getCardById, addCommentToCard, getCardComments } = require('../controllers/trelloController');
const authenticate = require('../middlewares/userAuthentication');
const router = express.Router();

router.get('/trello/columns/cards', authenticate, getTrelloColumnsWithCards);
router.post('/trello/cards/move', authenticate, moveCard);
router.get('/trello/cards/:cardId', authenticate, getCardById);
router.post('/trello/cards/comment', authenticate, addCommentToCard);
router.get('/trello/cards/:cardId/comments', authenticate, getCardComments);


module.exports = router;
