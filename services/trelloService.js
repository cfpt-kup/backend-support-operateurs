const axios = require('axios');

const trelloService = {
    getColumnsWithCards: async () => {
        const listIds = [process.env.TRELLO_LIST_ID_TODO, process.env.TRELLO_LIST_ID_REVIEW, process.env.TRELLO_LIST_ID_CLOSED];
        const apiKey = process.env.TRELLO_API_KEY;
        const token = process.env.TRELLO_TOKEN;
        try {
            const columnsPromises = listIds.map(listId =>
                axios.get(`https://api.trello.com/1/lists/${listId}?key=${apiKey}&token=${token}`)
            );
            const cardsPromises = listIds.map(listId =>
                axios.get(`https://api.trello.com/1/lists/${listId}/cards?key=${apiKey}&token=${token}`)
            );
            const columnsResponses = await Promise.all(columnsPromises);
            const cardsResponses = await Promise.all(cardsPromises);

            const columnsWithCards = columnsResponses.map((response, index) => ({
                ...response.data,
                cards: cardsResponses[index].data
            }));

            return columnsWithCards;
        } catch (error) {
            throw new Error(`Failed to fetch columns and cards: ${error.message}`);
        }
    },

    moveCard: async (cardId, targetListId) => {
        const apiKey = process.env.TRELLO_API_KEY;
        const token = process.env.TRELLO_TOKEN;
        try {
            const response = await axios.put(`https://api.trello.com/1/cards/${cardId}?idList=${targetListId}&key=${apiKey}&token=${token}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to move card: ${error.message}`);
        }
    }
};

module.exports = trelloService;
