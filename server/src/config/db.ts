// server/src/config/db.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Get the MongoDB connection string from environment variables
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in your .env file');
    }

    // Attempt to connect to the database
    await mongoose.connect(mongoURI);

    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
    // Exit the process with failure
    process.exit(1);
  }
};

export default connectDB;