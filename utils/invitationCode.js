const crypto = require('crypto');
const InvitationCode = require('../models/InvitationCode');

const generateUniqueCode = async () => {
    let code;
    let existingCode;
    do {
        code = crypto.randomBytes(8).toString('hex');
        existingCode = await InvitationCode.findOne({ code });
    } while (existingCode);
    return code;
};

// Create a single invitation code
const createInvitationCode = async () => {
    const code = await generateUniqueCode();
    const newCode = new InvitationCode({ code });
    await newCode.save();
    return newCode;
};

// Create multiple invitation codes in bulk
const createMultipleInvitationCodes = async (count) => {
    const codes = [];
    for (let i = 0; i < count; i++) {
        const code = await generateUniqueCode();
        codes.push({ code });
    }
    const newCodes = await InvitationCode.insertMany(codes);
    return newCodes;
};

// Validate and use an invitation code
const validateAndUseCode = async (code, userId) => {
    const foundCode = await InvitationCode.findOne({ code });
    if (!foundCode || foundCode.used) {
        throw new Error('Invalid or already used code.');
    }

    foundCode.used = true;
    foundCode.userId = userId;
    foundCode.usedAt = new Date();
    await foundCode.save();
    return foundCode;
};

module.exports = {
    createInvitationCode,
    createMultipleInvitationCodes,
    validateAndUseCode,
};
