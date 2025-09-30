const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('region')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Region must be a string with max 100 characters'),
  body('language_preference')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language preference')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateRefreshToken = [
  body('refresh_token')
    .notEmpty()
    .withMessage('Refresh token is required')
];

// Helper function to generate tokens
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });

  return { accessToken, refreshToken };
};

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, name, phone, region, language_preference = 'en' } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      phone,
      region,
      language_preference,
      is_verified: false
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        access_token: accessToken,
        refresh_token: refreshToken
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    logger.error('Error in user registration:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: 'Failed to register user'
      }
    });
  }
});

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'Account is disabled'
        }
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        access_token: accessToken,
        refresh_token: refreshToken
      },
      message: 'Login successful'
    });

  } catch (error) {
    logger.error('Error in user login:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Failed to login user'
      }
    });
  }
});

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', validateRefreshToken, async (req, res) => {
  try {
    const { refresh_token } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid refresh token'
        }
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      success: true,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken
      },
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    logger.error('Error refreshing token:', error);
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Invalid refresh token'
      }
    });
  }
});

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', async (req, res) => {
  try {
    // This would be protected by auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    logger.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_ERROR',
        message: 'Failed to get user profile'
      }
    });
  }
});

/**
 * @route PUT /api/v1/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('region')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Region must be a string with max 100 characters'),
  body('language_preference')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language preference')
], async (req, res) => {
  try {
    const user = req.user;
    const { name, phone, region, language_preference } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Update user profile
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (region) updateData.region = region;
    if (language_preference) updateData.language_preference = language_preference;

    await user.update(updateData);

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_UPDATE_ERROR',
        message: 'Failed to update user profile'
      }
    });
  }
});

module.exports = router;
