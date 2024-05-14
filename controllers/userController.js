const User = require('../models/User');
const InvitationCode = require('../models/InvitationCode');
const { successResponse, errorResponse } = require('../views/responses');

const signup = async (req, res) => {
    const { firstname, lastname, email, password, code_used, deviceId } = req.body;

    try {
        if (await User.findOne({ email })) {
            return errorResponse(res, 'Email already exists.', 409);
        }

        const invitationCode = await InvitationCode.findOne({ code: code_used, used: false });
        if (!invitationCode) {
            return errorResponse(res, 'Invalid or already used invitation code.', 400);
        }

        const newUser = new User({ firstname, lastname, email, password, code_used: invitationCode.code });
        const { token, expiresAt } = await newUser.generateAuthToken(deviceId); // Generate token and get expiresAt
        await newUser.save();

        invitationCode.used = true;
        invitationCode.userId = newUser._id;
        invitationCode.usedAt = new Date();
        await invitationCode.save();

        // Convert expiresAt to local time for display
        const expiresAtLocal = new Date(expiresAt).toLocaleString('en-CH', { timeZone: 'Europe/Zurich' });

        successResponse(res, 'User signed up and logged in successfully.', {
            user: { firstname, lastname, email, code_used, token, expiresAt: expiresAtLocal }
        });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const login = async (req, res) => {
    const { email, password, deviceId } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.isValidPassword(password))) {
            return errorResponse(res, 'Invalid login credentials', 401);
        }

        // Check for an existing valid token
        const currentTime = new Date();
        const validToken = user.tokens.find(t => t.deviceId === deviceId && t.expiresAt > currentTime);

        if (validToken) {
            // Convert expiresAt to local time for display
            const expiresAtLocal = new Date(validToken.expiresAt).toLocaleString('en-CH', { timeZone: 'Europe/Zurich' });

            return successResponse(res, 'Logged in successfully with existing token.', {
                user: { firstname: user.firstname, lastname: user.lastname, email: user.email, token: validToken.token, expiresAt: expiresAtLocal }
            });
        }

        // Generate a new token if no valid token is found
        const { token, expiresAt } = await user.generateAuthToken(deviceId);
        await user.save();

        // Convert expiresAt to local time for display
        const expiresAtLocal = new Date(expiresAt).toLocaleString('en-CH', { timeZone: 'Europe/Zurich' });

        successResponse(res, 'Logged in successfully.', {
            user: { firstname: user.firstname, lastname: user.lastname, email: user.email, token, expiresAt: expiresAtLocal }
        });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const originalTokenCount = user.tokens.length;
        const currentTime = new Date();
        console.log(`Current time (UTC): ${currentTime.toISOString()}`);

        // Filter out the token being logged out and any expired tokens
        user.tokens = user.tokens.filter(t => t.token !== req.token && t.expiresAt > currentTime);

        if (user.tokens.length === originalTokenCount) {
            return errorResponse(res, 'Token not found or already removed.', 404);
        }

        await user.save();
        successResponse(res, 'Disconnected successfully and expired tokens removed.');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        successResponse(res, 'User profile fetched successfully.', {
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                code_used: user.code_used
            }
        });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'firstname lastname email code_used'); // Fetch all users with specific fields
        successResponse(res, 'All users fetched successfully.', { users });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

// Fetch user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, 'firstname lastname email code_used'); // Fetch user by ID with specific fields

        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        successResponse(res, 'User fetched successfully.', { user });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

module.exports = { signup, login, logout, getProfile, getAllUsers, getUserById };
