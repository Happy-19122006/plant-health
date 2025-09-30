const express = require('express');
const { param, query } = require('express-validator');
const diseaseController = require('../controllers/diseaseController');

const router = express.Router();

// Validation middleware
const validateDiseaseId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Disease ID must be a positive integer')
];

const validateCropId = [
  param('cropId')
    .isInt({ min: 1 })
    .withMessage('Crop ID must be a positive integer')
];

const validateSearchQuery = [
  query('query')
    .isString()
    .isLength({ min: 3, max: 200 })
    .withMessage('Query must be between 3 and 200 characters'),
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
    .withMessage('Limit must be between 1 and 50'),
  query('min_score')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Min score must be between 0 and 1')
];

const validateDiseaseDetails = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Disease ID must be a positive integer'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  query('include_treatments')
    .optional()
    .isBoolean()
    .withMessage('include_treatments must be a boolean'),
  query('include_symptoms')
    .optional()
    .isBoolean()
    .withMessage('include_symptoms must be a boolean')
];

const validateDiseasesByCrop = [
  param('cropId')
    .isInt({ min: 1 })
    .withMessage('Crop ID must be a positive integer'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  query('include_inactive')
    .optional()
    .isBoolean()
    .withMessage('include_inactive must be a boolean')
];

const validateStatsQuery = [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Period must be one of: 7d, 30d, 90d, 1y')
];

// Routes

/**
 * @route GET /api/v1/diseases/search
 * @desc Search diseases by symptoms or description
 * @access Public
 */
router.get('/search', validateSearchQuery, diseaseController.searchDiseases);

/**
 * @route GET /api/v1/diseases/crop/:cropId
 * @desc Get diseases for a specific crop
 * @access Public
 */
router.get('/crop/:cropId', validateDiseasesByCrop, diseaseController.getDiseasesByCrop);

/**
 * @route GET /api/v1/diseases/:id
 * @desc Get detailed disease information
 * @access Public
 */
router.get('/:id', validateDiseaseDetails, diseaseController.getDiseaseDetails);

/**
 * @route GET /api/v1/diseases/stats/overview
 * @desc Get disease statistics
 * @access Public
 */
router.get('/stats/overview', validateStatsQuery, diseaseController.getDiseaseStats);

module.exports = router;
