require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

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
app.use('/api/ai', aiRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
  });
} else {
  // Base route / health check
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      message: 'AI Multilingual Mass Communication Platform API is running'
    });
  });
}

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
