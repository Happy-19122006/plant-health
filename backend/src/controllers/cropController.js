const { validationResult } = require('express-validator');
const { Crop, CropCategory, Disease, CropDisease } = require('../models');
const logger = require('../utils/logger');

class CropController {
  /**
   * Get all crops with optional filtering
   */
  async getAllCrops(req, res) {
    try {
      const {
        category_id,
        language = 'en',
        search,
        limit = 50,
        offset = 0
      } = req.query;

      const whereClause = { is_active: true };

      // Filter by category
      if (category_id) {
        whereClause.category_id = category_id;
      }

      // Search functionality
      if (search && search.trim().length > 0) {
        const { Op } = require('sequelize');
        whereClause[Op.or] = [
          { common_name_en: { [Op.iLike]: `%${search}%` } },
          { common_name_hi: { [Op.iLike]: `%${search}%` } },
          { scientific_name: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const crops = await Crop.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: CropCategory,
            as: 'category',
            attributes: ['id', 'name_en', 'name_hi']
          }
        ],
        order: [['common_name_en', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const formattedCrops = crops.rows.map(crop => ({
        id: crop.id,
        scientific_name: crop.scientific_name,
        common_name_en: crop.common_name_en,
        common_name_hi: crop.common_name_hi,
        local_names: crop.local_names,
        description_en: crop.description_en,
        description_hi: crop.description_hi,
        growing_season: crop.growing_season,
        climate_requirements: crop.climate_requirements,
        soil_requirements: crop.soil_requirements,
        image_url: crop.image_url,
        category: crop.category
      }));

      res.status(200).json({
        success: true,
        data: {
          crops: formattedCrops,
          total_count: crops.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });

    } catch (error) {
      logger.error('Error fetching crops:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch crops'
        }
      });
    }
  }

  /**
   * Get crop by ID with detailed information
   */
  async getCropById(req, res) {
    try {
      const { id } = req.params;
      const { language = 'en', include_diseases = true } = req.query;

      const crop = await Crop.findByPk(id, {
        include: [
          {
            model: CropCategory,
            as: 'category',
            attributes: ['id', 'name_en', 'name_hi', 'description_en', 'description_hi']
          },
          ...(include_diseases === 'true' ? [{
            model: Disease,
            as: 'diseases',
            through: { 
              attributes: ['prevalence_score', 'seasonal_pattern', 'regional_prevalence'] 
            },
            where: { is_active: true },
            required: false,
            order: [['severity_level', 'DESC']]
          }] : [])
        ]
      });

      if (!crop) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CROP_NOT_FOUND',
            message: 'Crop not found'
          }
        });
      }

      const response = {
        id: crop.id,
        scientific_name: crop.scientific_name,
        common_name_en: crop.common_name_en,
        common_name_hi: crop.common_name_hi,
        local_names: crop.local_names,
        description_en: crop.description_en,
        description_hi: crop.description_hi,
        growing_season: crop.growing_season,
        climate_requirements: crop.climate_requirements,
        soil_requirements: crop.soil_requirements,
        image_url: crop.image_url,
        category: crop.category
      };

      if (include_diseases === 'true') {
        response.common_diseases = crop.diseases?.map(disease => ({
          id: disease.id,
          name_en: disease.common_name_en,
          name_hi: disease.common_name_hi,
          scientific_name: disease.scientific_name,
          severity_level: disease.severity_level,
          prevalence_score: disease.CropDisease?.prevalence_score,
          seasonal_pattern: disease.CropDisease?.seasonal_pattern,
          regional_prevalence: disease.CropDisease?.regional_prevalence
        })) || [];
      }

      res.status(200).json({
        success: true,
        data: response
      });

    } catch (error) {
      logger.error('Error fetching crop details:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch crop details'
        }
      });
    }
  }

  /**
   * Search crops by name
   */
  async searchCrops(req, res) {
    try {
      const { query, language = 'en', limit = 10 } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'QUERY_TOO_SHORT',
            message: 'Query must be at least 2 characters long'
          }
        });
      }

      const crops = await Crop.searchByName(query, language, parseInt(limit));

      const formattedCrops = crops.map(crop => ({
        id: crop.id,
        scientific_name: crop.scientific_name,
        common_name_en: crop.common_name_en,
        common_name_hi: crop.common_name_hi,
        local_names: crop.local_names,
        description_en: crop.description_en,
        description_hi: crop.description_hi,
        growing_season: crop.growing_season,
        image_url: crop.image_url
      }));

      res.status(200).json({
        success: true,
        data: {
          crops: formattedCrops,
          total_count: crops.length,
          query,
          language
        }
      });

    } catch (error) {
      logger.error('Error searching crops:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search crops'
        }
      });
    }
  }

  /**
   * Get crop categories
   */
  async getCropCategories(req, res) {
    try {
      const { language = 'en' } = req.query;

      const categories = await CropCategory.findAll({
        where: { is_active: true },
        order: [['name_en', 'ASC']]
      });

      const formattedCategories = categories.map(category => ({
        id: category.id,
        name_en: category.name_en,
        name_hi: category.name_hi,
        description_en: category.description_en,
        description_hi: category.description_hi,
        icon_url: category.icon_url
      }));

      res.status(200).json({
        success: true,
        data: {
          categories: formattedCategories,
          total_count: categories.length
        }
      });

    } catch (error) {
      logger.error('Error fetching crop categories:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch crop categories'
        }
      });
    }
  }

  /**
   * Get crop statistics
   */
  async getCropStats(req, res) {
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

      // Get most queried crops
      const { FarmerQuery } = require('../models');
      const cropStats = await FarmerQuery.findAll({
        where: {
          detected_crop: { [require('sequelize').Op.ne]: null },
          created_at: { [require('sequelize').Op.gte]: startDate }
        },
        attributes: [
          'detected_crop',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'query_count']
        ],
        group: ['detected_crop'],
        order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
        limit: 10
      });

      // Get total crop count
      const totalCrops = await Crop.count({
        where: { is_active: true }
      });

      res.status(200).json({
        success: true,
        data: {
          period,
          total_crops: totalCrops,
          most_queried_crops: cropStats.map(stat => ({
            crop: stat.detected_crop,
            query_count: parseInt(stat.dataValues.query_count)
          })),
          period_start: startDate,
          period_end: now
        }
      });

    } catch (error) {
      logger.error('Error fetching crop stats:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch crop statistics'
        }
      });
    }
  }
}

module.exports = new CropController();
