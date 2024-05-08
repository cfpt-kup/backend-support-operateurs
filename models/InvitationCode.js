const mongoose = require('mongoose');

const invitationCodeSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    used: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now },
    usedAt: { type: Date, default: null }
});

module.exports = mongoose.model('InvitationCode', invitationCodeSchema);
