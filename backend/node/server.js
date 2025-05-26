// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connection'); // database connection
const authRoutes = require('./routes/auth');
const analyses = require('./routes/analyses');
const pdfUploadRoute = require('./routes/pdfUploadRoute');

dotenv.config();           // loade .env variables
connectDB();               // connect to the database

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());   // allow JSON data in requests

// routes
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analyses);
app.use('/api/', pdfUploadRoute);


// server start
if (!process.env.PORT) {
    console.log('Set PORT in .env file to run the server');
    process.exit(1); // Exit if PORT is not set in .env file
} else {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}


