const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();    // Load environment variables from .env file    

const connectDB = async () => {
  try {
    //Database connection
     await mongoose.connect(process.env.MONGO_URI);

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;
