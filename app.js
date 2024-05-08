const express = require('express');
const bodyParser = require('body-parser');
const inviteRoutes = require('./routes/inviteRoutes');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connect to the database
connectDB();

// Use invite routes
app.use('/api', inviteRoutes);

// Get the port number from environment variables or use default (3000)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
