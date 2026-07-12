const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// --- In-Memory Database Initialization ---
if (!global.mockUsers) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('password123', salt);
  global.mockUsers = [
    {
      _id: 'mock_vishnu_id_123',
      fullname: 'Vishnu',
      email: 'vishnu@masscomm.com',
      phone: '+91 9876543210',
      password: hashedPassword,
      role: 'Campaign Manager',
      language: 'English',
      organization: 'Infosys MiniProject Corp',
      created_at: new Date()
    }
  ];
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, phone, password, role, language, organization } = req.body;

    // Validate inputs
    if (!fullname || !email || !phone || !password || !role || !organization) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    // --- Mock DB execution path ---
    if (global.useMockDatabase) {
      const emailLower = email.toLowerCase().trim();
      const userExists = global.mockUsers.some(u => u.email.toLowerCase() === emailLower);
      
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Email address already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'mock_user_' + Date.now(),
        fullname,
        email: emailLower,
        phone,
        password: hashedPassword,
        role,
        language: language || 'English',
        organization,
        created_at: new Date()
      };

      global.mockUsers.push(newUser);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (Mock Database)',
        data: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          role: newUser.role,
          language: newUser.language,
          organization: newUser.organization
        }
      });
    }

    // --- MongoDB execution path ---
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    // Create user
    const user = await User.create({
      fullname,
      email,
      phone,
      password,
      role,
      language: language || 'English',
      organization
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          language: user.language,
          organization: user.organization
        }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // --- Mock DB execution path ---
    if (global.useMockDatabase) {
      const emailLower = email.toLowerCase().trim();
      const user = global.mockUsers.find(u => u.email.toLowerCase() === emailLower);

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          success: true,
          message: 'Login successful (Mock Database)',
          token: generateToken(user._id),
          user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            phone: user.phone,
            language: user.language,
            organization: user.organization
          }
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    // --- MongoDB execution path ---
    // Find user
    const user = await User.findOne({ email });

    // Validate credentials
    if (user && (await user.comparePassword(password))) {
      return res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          phone: user.phone,
          language: user.language,
          organization: user.organization
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    if (global.useMockDatabase) {
      // req.user has already been set by middleware
      return res.json({
        success: true,
        data: req.user
      });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      return res.json({
        success: true,
        data: user
      });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
