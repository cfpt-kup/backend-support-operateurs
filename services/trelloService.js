const axios = require('axios');

const trelloService = {
    getColumnsWithCards: async () => {
        const boardId = process.env.TRELLO_BOARD_ID;
        const listIds = [process.env.TRELLO_LIST_ID_1, process.env.TRELLO_LIST_ID_2, process.env.TRELLO_LIST_ID_3];
        const apiKey = process.env.TRELLO_API_KEY;
        const token = process.env.TRELLO_TOKEN;
        try {
            // Fetch columns and their cards
            const columnsPromises = listIds.map(listId =>
                axios.get(`https://api.trello.com/1/lists/${listId}?key=${apiKey}&token=${token}`)
            );
            const cardsPromises = listIds.map(listId =>
                axios.get(`https://api.trello.com/1/lists/${listId}/cards?key=${apiKey}&token=${token}`)
            );
            const columnsResponses = await Promise.all(columnsPromises);
            const cardsResponses = await Promise.all(cardsPromises);

            // Organize columns and their cards
            const columnsWithCards = columnsResponses.map((response, index) => ({
                ...response.data,
                cards: cardsResponses[index].data
            }));

            return columnsWithCards;
        } catch (error) {
            throw new Error(`Failed to fetch columns and cards: ${error.message}`);
        }
    }
};

module.exports = trelloService;
