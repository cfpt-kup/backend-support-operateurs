const trelloService = require('../services/trelloService');
const userService = require('../services/userService');
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

const addCommentToCard = async (req, res) => {
    const { cardId, text } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        const comment = await trelloService.addCommentToCard(cardId, text);
        const user = await userService.getUserDetails(userId);

        // Add user details to the comment response
        const commentWithUserDetails = {
            ...comment,
            memberCreator: {
                firstname: user.firstname,
                lastname: user.lastname,
            },
        };

        successResponse(res, 'Comment added successfully.', { comment: commentWithUserDetails });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const getCardComments = async (req, res) => {
    const { cardId } = req.params;
    try {
        const comments = await trelloService.getCardComments(cardId);
        successResponse(res, 'Comments fetched successfully.', { comments });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const updateCommentOnCard = async (req, res) => {
    const { commentId } = req.params;
    const { cardId, text } = req.body; // Ensure cardId is included in the request body
    try {
        const updatedComment = await trelloService.updateCommentOnCard(cardId, commentId, text);
        successResponse(res, 'Comment updated successfully.', { comment: updatedComment });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const deleteCommentOnCard = async (req, res) => {
    const { commentId } = req.params;
    try {
        await trelloService.deleteCommentOnCard(commentId);
        successResponse(res, 'Comment deleted successfully.');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

module.exports = {
    getTrelloColumnsWithCards,
    moveCard,
    getCardById,
    addCommentToCard,
    getCardComments,
    updateCommentOnCard,
    deleteCommentOnCard
};
