const User = require('../models/User');
const InvitationCode = require('../models/InvitationCode');
const { successResponse, errorResponse } = require('../views/responses');

const signup = async (req, res) => {
    const { firstname, lastname, email, password, code_used } = req.body;

    try {
        // Validate the invitation code
        const invitationCode = await InvitationCode.findOne({ code: code_used, used: false });
        if (!invitationCode) {
            return errorResponse(res, 'Invalid or already used invitation code.');
        }

        // Check for existing user with the same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 'Email already exists.');
        }

        // Create the user with the code string
        const newUser = new User({ firstname, lastname, email, password, code_used: invitationCode.code });
        await newUser.save();

        // Update the invitation code as used
        invitationCode.used = true;
        invitationCode.userId = newUser._id;
        invitationCode.usedAt = new Date();
        await invitationCode.save();

        successResponse(res, 'User signed up successfully.', { userId: newUser._id });
    } catch (error) {
        errorResponse(res, error.message);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.isValidPassword(password))) {
            return errorResponse(res, 'Invalid login credentials', 401);
        }

        const token = await user.generateAuthToken();
        successResponse(res, 'Logged in successfully', { user, token });
    } catch (error) {
        errorResponse(res, error.message);
    }
};

module.exports = {
    signup,
    login,
};
