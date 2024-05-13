const User = require('../models/User');
const InvitationCode = require('../models/InvitationCode');
const { successResponse, errorResponse } = require('../views/responses');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
function generateToken(userId, deviceId) {
    return jwt.sign({ _id: userId.toString(), deviceId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

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
        const token = generateToken(newUser._id, deviceId);
        newUser.tokens.push({ token, deviceId });

        await newUser.save();
        invitationCode.used = true;
        invitationCode.userId = newUser._id;
        invitationCode.usedAt = new Date();
        await invitationCode.save();

        successResponse(res, 'User signed up and logged in successfully.', {
            user: {
                firstname, lastname, email, code_used, token
            }
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

        user.tokens = user.tokens.filter(t => t.deviceId !== deviceId); // Remove old tokens for this device
        const token = generateToken(user._id, deviceId);
        user.tokens.push({ token, deviceId });
        await user.save();

        successResponse(res, 'Logged in successfully', {
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                token
            }
        });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const originalTokenCount = user.tokens.length;
        user.tokens = user.tokens.filter(t => t.token !== req.token);

        if (user.tokens.length === originalTokenCount) {
            return errorResponse(res, 'Token not found or already removed', 404);
        }

        await user.save();
        successResponse(res, 'Disconnected successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

module.exports = {
    signup,
    login,
    logout,
};
