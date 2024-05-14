const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    code_used: { type: String, default: null },
    tokens: [tokenSchema]
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.generateAuthToken = async function (deviceId) {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString(), deviceId }, process.env.JWT_SECRET, { expiresIn: '10m' }); // 1 minute for testing
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now in UTC
    //console.log(`Token generated at (UTC): ${new Date().toISOString()}`);
    //console.log(`Token expires at (UTC): ${expiresAt.toISOString()}`);
    user.tokens = user.tokens.concat({ token, expiresAt }); // Add the token and expiration date
    await user.save(); // Save the user with the new token and expiration date

    return { token, expiresAt };
};

userSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
