import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_connect';

export const connectDB = async () => {
  try {
    // Attempt connection but don't exit if it fails
    // This allows the app to start even if DB is not available
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000 // Short timeout for failure
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('⚠️ MongoDB connection failed, running in mock mode:', error.message);
    // We don't exit(1) anymore to allow the server to start
  }
};

