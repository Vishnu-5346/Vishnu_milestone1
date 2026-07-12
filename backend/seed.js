require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mass_comm';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully.');

    // Clear existing users
    console.log('Clearing existing users...');
    await User.deleteMany({});

    // Create default Campaign Manager
    console.log('Seeding default Campaign Manager...');
    const defaultManager = await User.create({
      fullname: 'Vishnu',
      email: 'vishnu@masscomm.com',
      phone: '+91 9876543210',
      password: 'password123', // Will be hashed automatically by pre-save hooks
      role: 'Campaign Manager',
      language: 'English',
      organization: 'Infosys MiniProject Corp'
    });

    console.log(`Seeding successful!`);
    console.log(`-----------------------------------------------`);
    console.log(`Test Login Credentials:`);
    console.log(`Email:    ${defaultManager.email}`);
    console.log(`Password: password123`);
    console.log(`Role:     ${defaultManager.role}`);
    console.log(`-----------------------------------------------`);

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
