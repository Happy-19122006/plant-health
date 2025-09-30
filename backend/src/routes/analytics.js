const express = require('express');
const { query } = require('express-validator');
const { FarmerQuery, SearchTrend, SearchAnalytics } = require('../models');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateStatsQuery = [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Period must be one of: 7d, 30d, 90d, 1y'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  query('region')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Region must be a string with max 100 characters')
];

const validateTrendsQuery = [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Period must be one of: 7d, 30d, 90d, 1y'),
  query('language')
    .optional()
    .isIn(['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa'])
    .withMessage('Invalid language code'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Helper function to calculate date range
const getDateRange = (period) => {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return { startDate, endDate: now };
};

/**
 * @route GET /api/v1/analytics/overview
 * @desc Get analytics overview
 * @access Public
 */
router.get('/overview', validateStatsQuery, async (req, res) => {
  try {
    const { period = '30d', language, region } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Build where clause
    const whereClause = {
      created_at: {
        [require('sequelize').Op.between]: [startDate, endDate]
      }
    };

    if (language) {
      whereClause.query_language = language;
    }

    if (region) {
      whereClause.region = region;
    }

    // Get query statistics
    const totalQueries = await FarmerQuery.count({ where: whereClause });
    
    const feedbackStats = await FarmerQuery.findAll({
      where: {
        ...whereClause,
        user_feedback: { [require('sequelize').Op.ne]: null }
      },
      attributes: [
        'user_feedback',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['user_feedback']
    });

    const avgResponseTime = await FarmerQuery.findOne({
      where: whereClause,
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('response_time_ms')), 'avg_response_time']
      ]
    });

    const avgConfidence = await FarmerQuery.findOne({
      where: whereClause,
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('confidence_score')), 'avg_confidence']
      ]
    });

    // Calculate satisfaction rate
    const helpfulCount = feedbackStats.find(stat => stat.user_feedback === 'helpful')?.dataValues?.count || 0;
    const totalFeedback = feedbackStats.reduce((sum, stat) => sum + parseInt(stat.dataValues.count), 0);
    const satisfactionRate = totalFeedback > 0 ? helpfulCount / totalFeedback : 0;

    res.status(200).json({
      success: true,
      data: {
        period,
        date_range: {
          start: startDate,
          end: endDate
        },
        total_queries: totalQueries,
        satisfaction_rate: Math.round(satisfactionRate * 100) / 100,
        avg_response_time_ms: Math.round(avgResponseTime?.dataValues?.avg_response_time || 0),
        avg_confidence_score: Math.round((avgConfidence?.dataValues?.avg_confidence || 0) * 100) / 100,
        feedback_distribution: feedbackStats.map(stat => ({
          feedback: stat.user_feedback,
          count: parseInt(stat.dataValues.count)
        })),
        filters: {
          language,
          region
        }
      }
    });

  } catch (error) {
    logger.error('Error getting analytics overview:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Failed to get analytics overview'
      }
    });
  }
});

/**
 * @route GET /api/v1/analytics/trends
 * @desc Get search trends
 * @access Public
 */
router.get('/trends', validateTrendsQuery, async (req, res) => {
  try {
    const { period = '30d', language, limit = 20 } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Build where clause
    const whereClause = {
      last_searched: {
        [require('sequelize').Op.between]: [startDate, endDate]
      }
    };

    if (language) {
      whereClause.query_language = language;
    }

    // Get trending queries
    const trends = await SearchTrend.findAll({
      where: whereClause,
      order: [['search_count', 'DESC'], ['trend_score', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        date_range: {
          start: startDate,
          end: endDate
        },
        trends: trends.map(trend => ({
          query: trend.query_text,
          language: trend.query_language,
          search_count: trend.search_count,
          trend_score: trend.trend_score,
          last_searched: trend.last_searched
        })),
        total_trends: trends.length,
        filters: {
          language
        }
      }
    });

  } catch (error) {
    logger.error('Error getting search trends:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TRENDS_ERROR',
        message: 'Failed to get search trends'
      }
    });
  }
});

/**
 * @route GET /api/v1/analytics/performance
 * @desc Get AI performance metrics
 * @access Public
 */
router.get('/performance', validateStatsQuery, async (req, res) => {
  try {
    const { period = '30d', language, region } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Build where clause
    const whereClause = {
      created_at: {
        [require('sequelize').Op.between]: [startDate, endDate]
      }
    };

    if (language) {
      whereClause.query_language = language;
    }

    if (region) {
      whereClause.region = region;
    }

    // Get performance metrics
    const performanceStats = await FarmerQuery.findAll({
      where: whereClause,
      attributes: [
        'query_type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'query_count'],
        [require('sequelize').fn('AVG', require('sequelize').col('confidence_score')), 'avg_confidence'],
        [require('sequelize').fn('AVG', require('sequelize').col('response_time_ms')), 'avg_response_time']
      ],
      group: ['query_type'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']]
    });

    // Get disease detection accuracy
    const diseaseDetectionStats = await FarmerQuery.findAll({
      where: {
        ...whereClause,
        detected_disease: { [require('sequelize').Op.ne]: null }
      },
      attributes: [
        'detected_disease',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'detection_count'],
        [require('sequelize').fn('AVG', require('sequelize').col('confidence_score')), 'avg_confidence']
      ],
      group: ['detected_disease'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        date_range: {
          start: startDate,
          end: endDate
        },
        performance_by_type: performanceStats.map(stat => ({
          query_type: stat.query_type,
          query_count: parseInt(stat.dataValues.query_count),
          avg_confidence: Math.round((stat.dataValues.avg_confidence || 0) * 100) / 100,
          avg_response_time_ms: Math.round(stat.dataValues.avg_response_time || 0)
        })),
        disease_detection_accuracy: diseaseDetectionStats.map(stat => ({
          disease: stat.detected_disease,
          detection_count: parseInt(stat.dataValues.detection_count),
          avg_confidence: Math.round((stat.dataValues.avg_confidence || 0) * 100) / 100
        })),
        filters: {
          language,
          region
        }
      }
    });

  } catch (error) {
    logger.error('Error getting performance metrics:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PERFORMANCE_ERROR',
        message: 'Failed to get performance metrics'
      }
    });
  }
});

/**
 * @route GET /api/v1/analytics/usage
 * @desc Get usage statistics
 * @access Public
 */
router.get('/usage', validateStatsQuery, async (req, res) => {
  try {
    const { period = '30d', language, region } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Build where clause
    const whereClause = {
      created_at: {
        [require('sequelize').Op.between]: [startDate, endDate]
      }
    };

    if (language) {
      whereClause.query_language = language;
    }

    if (region) {
      whereClause.region = region;
    }

    // Get usage by language
    const languageStats = await FarmerQuery.findAll({
      where: whereClause,
      attributes: [
        'query_language',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'query_count']
      ],
      group: ['query_language'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']]
    });

    // Get usage by region
    const regionStats = await FarmerQuery.findAll({
      where: whereClause,
      attributes: [
        'region',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'query_count']
      ],
      group: ['region'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
      limit: 10
    });

    // Get daily usage
    const dailyUsage = await FarmerQuery.findAll({
      where: whereClause,
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'query_count']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('created_at'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        date_range: {
          start: startDate,
          end: endDate
        },
        usage_by_language: languageStats.map(stat => ({
          language: stat.query_language,
          query_count: parseInt(stat.dataValues.query_count)
        })),
        usage_by_region: regionStats.map(stat => ({
          region: stat.region,
          query_count: parseInt(stat.dataValues.query_count)
        })),
        daily_usage: dailyUsage.map(stat => ({
          date: stat.dataValues.date,
          query_count: parseInt(stat.dataValues.query_count)
        })),
        filters: {
          language,
          region
        }
      }
    });

  } catch (error) {
    logger.error('Error getting usage statistics:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'USAGE_ERROR',
        message: 'Failed to get usage statistics'
      }
    });
  }
});

module.exports = router;
