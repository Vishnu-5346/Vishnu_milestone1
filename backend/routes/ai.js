const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Helper to proxy post requests to the FastAPI microservice
 */
async function proxyToAIService(endpoint, body, res) {
  try {
    const url = `${AI_SERVICE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        message: `AI microservice returned an error: ${response.statusText}`,
        error: errorText
      });
    }

    const data = await response.json();
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error(`AI Microservice Connection Failed on ${endpoint}: ${error.message}`);
    return res.status(502).json({
      success: false,
      message: 'AI Service is currently offline or unreachable. Please verify that the FastAPI microservice is running on port 8000.',
      error: error.message
    });
  }
}

// @desc    Generate personalized content based on prompt, tone, channel, recipient profile
// @route   POST /api/ai/generate
// @access  Private
router.post('/generate', protect, (req, res) => {
  const { prompt, tone, recipient_profile, objective, channel } = req.body;
  if (!prompt || !tone || !recipient_profile || !objective || !channel) {
    return res.status(400).json({ success: false, message: 'Please provide all required parameters (prompt, tone, recipient_profile, objective, channel)' });
  }
  return proxyToAIService('/api/ai/generate', req.body, res);
});

// @desc    Translate campaign message to selected Indian languages
// @route   POST /api/ai/translate
// @access  Private
router.post('/translate', protect, (req, res) => {
  const { text, target_languages } = req.body;
  if (!text || !target_languages || !Array.isArray(target_languages)) {
    return res.status(400).json({ success: false, message: 'Please provide text and target_languages array' });
  }
  return proxyToAIService('/api/ai/translate', req.body, res);
});

// @desc    Optimize campaign text based on sentiment and suggested tone
// @route   POST /api/ai/optimize
// @access  Private
router.post('/optimize', protect, (req, res) => {
  const { text, desired_tone } = req.body;
  if (!text || !desired_tone) {
    return res.status(400).json({ success: false, message: 'Please provide text and desired_tone' });
  }
  return proxyToAIService('/api/ai/optimize', req.body, res);
});

// @desc    Validate text compliance and check for placeholders/spam indicators
// @route   POST /api/ai/review
// @access  Private
router.post('/review', protect, (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Please provide text to review' });
  }
  return proxyToAIService('/api/ai/review', req.body, res);
});

module.exports = router;
