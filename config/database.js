const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string
const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connection established');

        // Connection events
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
};

module.exports = connectDB;
