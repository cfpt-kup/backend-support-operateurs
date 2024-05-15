const trelloService = require('../services/trelloService');
const { successResponse, errorResponse } = require('../views/responses');

const VALID_LIST_IDS = [
    process.env.TRELLO_LIST_ID_TODO,
    process.env.TRELLO_LIST_ID_REVIEW,
    process.env.TRELLO_LIST_ID_CLOSED
];

const getTrelloColumnsWithCards = async (req, res) => {
    try {
        const columnsWithCards = await trelloService.getColumnsWithCards();
        successResponse(res, 'Trello columns and their cards fetched successfully.', { columns: columnsWithCards });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const moveCard = async (req, res) => {
    const { cardId, targetListId } = req.body;

    if (!VALID_LIST_IDS.includes(targetListId)) {
        return errorResponse(res, 'Invalid target list ID.', 400);
    }

    try {
        const updatedCard = await trelloService.moveCard(cardId, targetListId);
        successResponse(res, 'Card moved successfully.', { card: updatedCard });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const getCardById = async (req, res) => {
    const { cardId } = req.params;
    try {
        const card = await trelloService.getCardById(cardId);
        successResponse(res, 'Card fetched successfully.', { card });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

module.exports = { getTrelloColumnsWithCards, moveCard, getCardById };
