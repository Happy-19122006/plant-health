const { validationResult } = require('express-validator');
const { Treatment, TreatmentCategory, Disease } = require('../models');
const logger = require('../utils/logger');

class TreatmentController {
  /**
   * Get treatment recommendations for a disease
   */
  async getTreatmentRecommendations(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: errors.array()
          }
        });
      }

      const { disease_id } = req.params;
      const {
        organic_only = false,
        language = 'en',
        region = null,
        limit = 10
      } = req.query;

      // Verify disease exists
      const disease = await Disease.findByPk(disease_id);
      if (!disease) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DISEASE_NOT_FOUND',
            message: 'Disease not found'
          }
        });
      }

      // Get treatments for the disease
      const treatments = await Treatment.findByDisease(disease_id, organic_only === 'true');

      // Filter by region if specified (this would need regional data)
      let filteredTreatments = treatments;
      if (region) {
        // Add region-specific filtering logic here
        // For now, return all treatments
      }

      // Limit results
      filteredTreatments = filteredTreatments.slice(0, parseInt(limit));

      const formattedTreatments = filteredTreatments.map(treatment => ({
        id: treatment.id,
        name_en: treatment.name_en,
        name_hi: treatment.name_hi,
        active_ingredient: treatment.active_ingredient,
        formulation: treatment.formulation,
        concentration: treatment.concentration,
        dosage_en: treatment.dosage_en,
        dosage_hi: treatment.dosage_hi,
        application_method: treatment.application_method,
        frequency_en: treatment.frequency_en,
        frequency_hi: treatment.frequency_hi,
        safety_precautions_en: treatment.safety_precautions_en,
        safety_precautions_hi: treatment.safety_precautions_hi,
        waiting_period_days: treatment.waiting_period_days,
        effectiveness_score: treatment.effectiveness_score,
        cost_per_unit: treatment.cost_per_unit,
        unit: treatment.unit,
        product_links: treatment.product_links,
        is_organic: treatment.is_organic,
        category: {
          id: treatment.category_id,
          name_en: treatment.category?.name_en,
          name_hi: treatment.category?.name_hi,
          safety_level: treatment.category?.safety_level
        }
      }));

      // Sort by effectiveness score
      formattedTreatments.sort((a, b) => b.effectiveness_score - a.effectiveness_score);

      res.status(200).json({
        success: true,
        data: {
          disease: {
            id: disease.id,
            name_en: disease.common_name_en,
            name_hi: disease.common_name_hi,
            scientific_name: disease.scientific_name
          },
          treatments: formattedTreatments,
          total_count: formattedTreatments.length,
          organic_only: organic_only === 'true',
          region
        },
        message: 'Treatment recommendations retrieved successfully'
      });

    } catch (error) {
      logger.error('Error getting treatment recommendations:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get treatment recommendations'
        }
      });
    }
  }

  /**
   * Get treatment by ID
   */
  async getTreatmentById(req, res) {
    try {
      const { id } = req.params;
      const { language = 'en' } = req.query;

      const treatment = await Treatment.findByPk(id, {
        include: [
          {
            model: Disease,
            as: 'disease',
            attributes: ['id', 'common_name_en', 'common_name_hi', 'scientific_name']
          },
          {
            model: TreatmentCategory,
            as: 'category',
            attributes: ['id', 'name_en', 'name_hi', 'safety_level']
          }
        ]
      });

      if (!treatment) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'TREATMENT_NOT_FOUND',
            message: 'Treatment not found'
          }
        });
      }

      const response = {
        id: treatment.id,
        name_en: treatment.name_en,
        name_hi: treatment.name_hi,
        active_ingredient: treatment.active_ingredient,
        formulation: treatment.formulation,
        concentration: treatment.concentration,
        dosage_en: treatment.dosage_en,
        dosage_hi: treatment.dosage_hi,
        application_method: treatment.application_method,
        frequency_en: treatment.frequency_en,
        frequency_hi: treatment.frequency_hi,
        safety_precautions_en: treatment.safety_precautions_en,
        safety_precautions_hi: treatment.safety_precautions_hi,
        waiting_period_days: treatment.waiting_period_days,
        effectiveness_score: treatment.effectiveness_score,
        cost_per_unit: treatment.cost_per_unit,
        unit: treatment.unit,
        product_links: treatment.product_links,
        is_organic: treatment.is_organic,
        is_approved: treatment.is_approved,
        disease: treatment.disease,
        category: treatment.category
      };

      res.status(200).json({
        success: true,
        data: response
      });

    } catch (error) {
      logger.error('Error fetching treatment details:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch treatment details'
        }
      });
    }
  }

  /**
   * Get treatment categories
   */
  async getTreatmentCategories(req, res) {
    try {
      const { language = 'en' } = req.query;

      const categories = await TreatmentCategory.findAll({
        where: { is_active: true },
        order: [['name_en', 'ASC']]
      });

      const formattedCategories = categories.map(category => ({
        id: category.id,
        name_en: category.name_en,
        name_hi: category.name_hi,
        description_en: category.description_en,
        description_hi: category.description_hi,
        safety_level: category.safety_level
      }));

      res.status(200).json({
        success: true,
        data: {
          categories: formattedCategories,
          total_count: categories.length
        }
      });

    } catch (error) {
      logger.error('Error fetching treatment categories:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch treatment categories'
        }
      });
    }
  }

  /**
   * Search treatments
   */
  async searchTreatments(req, res) {
    try {
      const {
        query,
        category_id,
        organic_only = false,
        language = 'en',
        limit = 20
      } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'QUERY_TOO_SHORT',
            message: 'Query must be at least 2 characters long'
          }
        });
      }

      const { Op } = require('sequelize');
      const whereClause = {
        is_approved: true,
        [Op.or]: [
          { name_en: { [Op.iLike]: `%${query}%` } },
          { name_hi: { [Op.iLike]: `%${query}%` } },
          { active_ingredient: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (category_id) {
        whereClause.category_id = category_id;
      }

      if (organic_only === 'true') {
        whereClause.is_organic = true;
      }

      const treatments = await Treatment.findAll({
        where: whereClause,
        include: [
          {
            model: Disease,
            as: 'disease',
            attributes: ['id', 'common_name_en', 'common_name_hi']
          },
          {
            model: TreatmentCategory,
            as: 'category',
            attributes: ['id', 'name_en', 'name_hi', 'safety_level']
          }
        ],
        order: [['effectiveness_score', 'DESC']],
        limit: parseInt(limit)
      });

      const formattedTreatments = treatments.map(treatment => ({
        id: treatment.id,
        name_en: treatment.name_en,
        name_hi: treatment.name_hi,
        active_ingredient: treatment.active_ingredient,
        formulation: treatment.formulation,
        concentration: treatment.concentration,
        effectiveness_score: treatment.effectiveness_score,
        is_organic: treatment.is_organic,
        cost_per_unit: treatment.cost_per_unit,
        unit: treatment.unit,
        disease: treatment.disease,
        category: treatment.category
      }));

      res.status(200).json({
        success: true,
        data: {
          treatments: formattedTreatments,
          total_count: treatments.length,
          query,
          filters: {
            category_id,
            organic_only: organic_only === 'true'
          }
        }
      });

    } catch (error) {
      logger.error('Error searching treatments:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search treatments'
        }
      });
    }
  }

  /**
   * Get treatment statistics
   */
  async getTreatmentStats(req, res) {
    try {
      const { period = '30d' } = req.query;

      // Calculate date range
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
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get treatment effectiveness statistics
      const treatmentStats = await Treatment.findAll({
        where: { is_approved: true },
        attributes: [
          'is_organic',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
          [require('sequelize').fn('AVG', require('sequelize').col('effectiveness_score')), 'avg_effectiveness'],
          [require('sequelize').fn('AVG', require('sequelize').col('cost_per_unit')), 'avg_cost']
        ],
        group: ['is_organic'],
        order: [['is_organic', 'ASC']]
      });

      // Get total treatment count
      const totalTreatments = await Treatment.count({
        where: { is_approved: true }
      });

      res.status(200).json({
        success: true,
        data: {
          period,
          total_treatments: totalTreatments,
          treatment_stats: treatmentStats.map(stat => ({
            is_organic: stat.is_organic,
            count: parseInt(stat.dataValues.count),
            avg_effectiveness: parseFloat(stat.dataValues.avg_effectiveness || 0),
            avg_cost: parseFloat(stat.dataValues.avg_cost || 0)
          })),
          period_start: startDate,
          period_end: now
        }
      });

    } catch (error) {
      logger.error('Error fetching treatment stats:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch treatment statistics'
        }
      });
    }
  }
}

module.exports = new TreatmentController();
