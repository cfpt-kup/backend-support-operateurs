const User = require('../models/User');
const InvitationCode = require('../models/InvitationCode');
const { successResponse, errorResponse } = require('../views/responses');
const jwt = require('jsonwebtoken');  // Ensure this line is at the top

const signup = async (req, res) => {
    const { firstname, lastname, email, password, code_used, deviceId } = req.body;

    try {
        // Validate the invitation code
        const invitationCode = await InvitationCode.findOne({ code: code_used, used: false });
        if (!invitationCode) {
            return errorResponse(res, 'Invalid or already used invitation code.');
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 'Email already exists.');
        }

        // Create the user
        const newUser = new User({ firstname, lastname, email, password, code_used: invitationCode.code });
        const token = jwt.sign({ _id: newUser._id.toString(), deviceId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Add token with device identifier to the user's tokens array
        newUser.tokens.push({ token, deviceId });
        await newUser.save();

        // Mark the invitation code as used
        invitationCode.used = true;
        invitationCode.userId = newUser._id;
        invitationCode.usedAt = new Date();
        await invitationCode.save();

        const userResponse = {
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            code_used: newUser.code_used,
            token // Including the token in the response
        };

        successResponse(res, 'User signed up and logged in successfully.', userResponse);
    } catch (error) {
        errorResponse(res, error.message);
    }
};

const login = async (req, res) => {
    const { email, password, deviceId } = req.body; // Assuming deviceId is sent by the client
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.isValidPassword(password))) {
            return errorResponse(res, 'Invalid login credentials', 401);
        }

        // Generate token
        const token = jwt.sign({ _id: user._id.toString(), deviceId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Remove the old token for this device, if it exists
        user.tokens = user.tokens.filter(t => t.deviceId !== deviceId);
        user.tokens.push({ token, deviceId }); // Add the new token with the device identifier
        await user.save();

        const userResponse = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            code_used: user.code_used,
        };

        successResponse(res, 'Logged in successfully', { user: userResponse, token });
    } catch (error) {
        errorResponse(res, error.message);
    }
};




module.exports = {
    signup,
    login,
};
