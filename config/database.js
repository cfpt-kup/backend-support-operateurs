const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string
const dbURI = process.env.MONGODB_URI;
const dbName = 'backend-support-operateurs'; // Your application-specific database

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            dbName: dbName, // Specify the application database name here
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
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
