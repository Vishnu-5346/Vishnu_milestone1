const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Store temporary reset codes (in memory)
const resetCodes = new Map(); // email -> { code, expiresAt }

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

// @desc    Request password reset (Forgot Password)
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address' });
    }

    const emailLower = email.toLowerCase().trim();
    let userExists = false;

    if (global.useMockDatabase) {
      userExists = global.mockUsers.some(u => u.email.toLowerCase() === emailLower);
    } else {
      const user = await User.findOne({ email: emailLower });
      userExists = !!user;
    }

    if (!userExists) {
      return res.status(404).json({ success: false, message: 'No account found with this email address' });
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes.set(emailLower, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    });

    // Simulate sending email by returning the code in the response
    return res.json({
      success: true,
      message: 'Reset code generated successfully',
      code: code // Returning the code directly so frontend can simulate "receiving" it
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Reset password using verification code
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
    }

    const emailLower = email.toLowerCase().trim();
    const savedRecord = resetCodes.get(emailLower);

    if (!savedRecord || savedRecord.code !== code || savedRecord.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (global.useMockDatabase) {
      const userIndex = global.mockUsers.findIndex(u => u.email.toLowerCase() === emailLower);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      global.mockUsers[userIndex].password = hashedPassword;
    } else {
      const user = await User.findOne({ email: emailLower });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      user.password = newPassword;
      await user.save();
    }

    // Clean up reset code
    resetCodes.delete(emailLower);

    return res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
