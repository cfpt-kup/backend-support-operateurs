const { createInvitationCode, createMultipleInvitationCodes, validateAndUseCode } = require('../utils/invitationCode');
const { successResponse, errorResponse } = require('../views/responses');

const generateCode = async (req, res) => {
    try {
        const newCode = await createInvitationCode();
        successResponse(res, 'Invitation code created successfully', newCode);
    } catch (error) {
        errorResponse(res, error.message);
    }
};

// Updated to use query parameters
const generateMultipleCodes = async (req, res) => {
    const count = parseInt(req.query.count);
    if (!count || count < 1) {
        return errorResponse(res, 'Please specify a valid count greater than zero.');
    }
    try {
        const newCodes = await createMultipleInvitationCodes(count);
        successResponse(res, `${count} invitation codes created successfully`, newCodes);
    } catch (error) {
        errorResponse(res, error.message);
    }
};

const signupWithCode = async (req, res) => {
    const { code, userId } = req.body;
    try {
        await validateAndUseCode(code, userId);
        successResponse(res, 'User registered successfully.');
    } catch (error) {
        errorResponse(res, error.message);
    }
};

module.exports = {
    generateCode,
    generateMultipleCodes,
    signupWithCode,
};
