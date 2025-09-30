const express = require('express');
const { body, param, query } = require('express-validator');
const farmerController = require('../controllers/farmerController');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for farmer queries
const queryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many queries from this IP, please try again later.'
    }
  }
});

// Validation middleware
const validateQuery = [
  body('query_text')
    .isString()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Query text must be between 3 and 1000 characters'),
  body('query_language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  body('region')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Region must be a string with max 100 characters'),
  body('include_voice')
    .optional()
    .isBoolean()
    .withMessage('include_voice must be a boolean')
];

const validateFeedback = [
  param('query_id')
    .isInt({ min: 1 })
    .withMessage('Query ID must be a positive integer'),
  body('feedback')
    .isIn(['helpful', 'not_helpful', 'partially_helpful'])
    .withMessage('Feedback must be one of: helpful, not_helpful, partially_helpful')
];

const validateSessionId = [
  param('session_id')
    .isUUID()
    .withMessage('Session ID must be a valid UUID')
];

const validateQueryHistory = [
  query('session_id')
    .optional()
    .isUUID()
    .withMessage('Session ID must be a valid UUID'),
  query('user_id')
    .optional()
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
];

// Routes

/**
 * @route POST /api/v1/farmer/query
 * @desc Process farmer query and return AI response
 * @access Public (with optional authentication)
 */
router.post('/query', queryLimiter, validateQuery, farmerController.processQuery);

/**
 * @route GET /api/v1/farmer/history
 * @desc Get farmer query history
 * @access Public (with optional authentication)
 */
router.get('/history', validateQueryHistory, farmerController.getQueryHistory);

/**
 * @route POST /api/v1/farmer/feedback/:query_id
 * @desc Submit feedback for a query
 * @access Public
 */
router.post('/feedback/:query_id', validateFeedback, farmerController.submitFeedback);

/**
 * @route GET /api/v1/farmer/session/:session_id
 * @desc Get session information
 * @access Public
 */
router.get('/session/:session_id', validateSessionId, farmerController.getSession);

module.exports = router;
