const express = require('express');
const { param, query } = require('express-validator');
const cropController = require('../controllers/cropController');

const router = express.Router();

// Validation middleware
const validateCropId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Crop ID must be a positive integer')
];

const validateCropQuery = [
  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  query('search')
    .optional()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
];

const validateCropDetails = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Crop ID must be a positive integer'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  query('include_diseases')
    .optional()
    .isBoolean()
    .withMessage('include_diseases must be a boolean')
];

const validateCropSearch = [
  query('query')
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Query must be between 2 and 100 characters'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

const validateStatsQuery = [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Period must be one of: 7d, 30d, 90d, 1y')
];

// Routes

/**
 * @route GET /api/v1/crops
 * @desc Get all crops with optional filtering
 * @access Public
 */
router.get('/', validateCropQuery, cropController.getAllCrops);

/**
 * @route GET /api/v1/crops/search
 * @desc Search crops by name
 * @access Public
 */
router.get('/search', validateCropSearch, cropController.searchCrops);

/**
 * @route GET /api/v1/crops/categories
 * @desc Get crop categories
 * @access Public
 */
router.get('/categories', cropController.getCropCategories);

/**
 * @route GET /api/v1/crops/:id
 * @desc Get crop by ID with detailed information
 * @access Public
 */
router.get('/:id', validateCropDetails, cropController.getCropById);

/**
 * @route GET /api/v1/crops/stats/overview
 * @desc Get crop statistics
 * @access Public
 */
router.get('/stats/overview', validateStatsQuery, cropController.getCropStats);

module.exports = router;
