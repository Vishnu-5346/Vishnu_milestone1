require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to Database
// Note: Catch error and output message so server doesn't crash immediately if DB is offline.
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Base route / health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'AI Multilingual Mass Communication Platform API is running'
  });
});

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
