const express = require('express');
const { param, query, body } = require('express-validator');
const treatmentController = require('../controllers/treatmentController');

const router = express.Router();

// Validation middleware
const validateDiseaseId = [
  param('disease_id')
    .isInt({ min: 1 })
    .withMessage('Disease ID must be a positive integer')
];

const validateTreatmentId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Treatment ID must be a positive integer')
];

const validateTreatmentRecommendations = [
  param('disease_id')
    .isInt({ min: 1 })
    .withMessage('Disease ID must be a positive integer'),
  query('organic_only')
    .optional()
    .isBoolean()
    .withMessage('organic_only must be a boolean'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  query('region')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Region must be a string with max 100 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

const validateTreatmentDetails = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Treatment ID must be a positive integer'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code')
];

const validateTreatmentSearch = [
  query('query')
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Query must be between 2 and 100 characters'),
  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  query('organic_only')
    .optional()
    .isBoolean()
    .withMessage('organic_only must be a boolean'),
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
 * @route GET /api/v1/treatments/recommend/:disease_id
 * @desc Get treatment recommendations for a disease
 * @access Public
 */
router.get('/recommend/:disease_id', validateTreatmentRecommendations, treatmentController.getTreatmentRecommendations);

/**
 * @route GET /api/v1/treatments/search
 * @desc Search treatments
 * @access Public
 */
router.get('/search', validateTreatmentSearch, treatmentController.searchTreatments);

/**
 * @route GET /api/v1/treatments/categories
 * @desc Get treatment categories
 * @access Public
 */
router.get('/categories', treatmentController.getTreatmentCategories);

/**
 * @route GET /api/v1/treatments/:id
 * @desc Get treatment by ID
 * @access Public
 */
router.get('/:id', validateTreatmentDetails, treatmentController.getTreatmentById);

/**
 * @route GET /api/v1/treatments/stats/overview
 * @desc Get treatment statistics
 * @access Public
 */
router.get('/stats/overview', validateStatsQuery, treatmentController.getTreatmentStats);

module.exports = router;
