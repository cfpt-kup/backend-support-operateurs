const trelloService = require('../services/trelloService');
const { successResponse, errorResponse } = require('../views/responses');

const getTrelloColumnsWithCards = async (req, res) => {
    try {
        const columnsWithCards = await trelloService.getColumnsWithCards();
        successResponse(res, 'Trello columns and their cards fetched successfully.', { columns: columnsWithCards });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

module.exports = { getTrelloColumnsWithCards };
