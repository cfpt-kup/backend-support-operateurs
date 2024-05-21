const User = require('../models/User');

const userService = {
    getUserDetails: async (userId) => {
        try {
            const user = await User.findById(userId).select('firstname lastname');
            return user;
        } catch (error) {
            throw new Error(`Failed to fetch user details: ${error.message}`);
        }
    }
};

module.exports = userService;

