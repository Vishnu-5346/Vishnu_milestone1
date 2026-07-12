const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt connection with a short 3-second timeout
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mass_comm', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDatabase = false;
  } catch (error) {
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    console.warn('⚠️ WARNING: Could not connect to MongoDB server.');
    console.warn('⚡ FALLBACK: Enabling local in-memory Mock Database for verification.');
    console.warn('To use MongoDB, start your local service or configure MONGODB_URI in backend/.env');
    global.useMockDatabase = true;
  }
};

module.exports = connectDB;
