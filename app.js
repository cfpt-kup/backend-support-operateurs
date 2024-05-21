const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const inviteRoutes = require('./routes/inviteRoutes');
const userRoutes = require('./routes/userRoutes');
const trelloRoutes = require('./routes/trelloRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use(cors()); // Add this line

// Connect to the database
connectDB();

// Include routes
app.use('/api', inviteRoutes);
app.use('/api', userRoutes);
app.use('/api', trelloRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
