const { validationResult } = require('express-validator');
const vectorService = require('../services/vectorService');
const { Disease, Symptom, Treatment, Crop, CropDisease } = require('../models');
const logger = require('../utils/logger');

class DiseaseController {
  /**
   * Search diseases by symptoms or description
   */
  async searchDiseases(req, res) {
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

      const {
        query,
        language = 'en',
        region = null,
        limit = 10,
        min_score = 0.7
      } = req.query;

      if (!query || query.trim().length < 3) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'QUERY_TOO_SHORT',
            message: 'Query must be at least 3 characters long'
          }
        });
      }

      // Perform vector search
      const searchResults = await vectorService.searchDiseases(query, {
        language,
        region,
        topK: parseInt(limit),
        minScore: parseFloat(min_score)
      });

      res.status(200).json({
        success: true,
        data: {
          diseases: searchResults.diseases,
          total_count: searchResults.total_count,
          search_time_ms: searchResults.search_time_ms,
          query,
          language,
          region
        },
        message: 'Diseases found successfully'
      });

    } catch (error) {
      logger.error('Error searching diseases:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search diseases'
        }
      });
    }
  }

  /**
   * Get diseases for a specific crop
   */
  async getDiseasesByCrop(req, res) {
    try {
      const { cropId } = req.params;
      const { language = 'en', include_inactive = false } = req.query;

      const crop = await Crop.findByPk(cropId);
      if (!crop) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CROP_NOT_FOUND',
            message: 'Crop not found'
          }
        });
      }

      const diseases = await Disease.findAll({
        where: {
          is_active: include_inactive === 'true' ? undefined : true
        },
        include: [
          {
            model: Crop,
            as: 'crops',
            where: { id: cropId },
            through: { 
              attributes: ['prevalence_score', 'seasonal_pattern', 'regional_prevalence'] 
            }
          },
          {
            model: Symptom,
            as: 'symptoms',
            where: { is_active: true },
            required: false,
            limit: 3,
            order: [['is_primary', 'DESC']]
          }
        ],
        order: [['severity_level', 'DESC']]
      });

      const formattedDiseases = diseases.map(disease => ({
        id: disease.id,
        name_en: disease.common_name_en,
        name_hi: disease.common_name_hi,
        scientific_name: disease.scientific_name,
        severity_level: disease.severity_level,
        prevalence_score: disease.crops?.[0]?.CropDisease?.prevalence_score,
        seasonal_pattern: disease.crops?.[0]?.CropDisease?.seasonal_pattern,
        regional_prevalence: disease.crops?.[0]?.CropDisease?.regional_prevalence,
        primary_symptoms: disease.symptoms?.map(symptom => ({
          id: symptom.id,
          name_en: symptom.name_en,
          name_hi: symptom.name_hi,
          is_primary: symptom.is_primary
        })) || []
      }));

      res.status(200).json({
        success: true,
        data: {
          crop: {
            id: crop.id,
            name_en: crop.common_name_en,
            name_hi: crop.common_name_hi
          },
          diseases: formattedDiseases,
          total_count: diseases.length
        }
      });

    } catch (error) {
      logger.error('Error fetching diseases by crop:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch diseases'
        }
      });
    }
  }

  /**
   * Get detailed disease information
   */
  async getDiseaseDetails(req, res) {
    try {
      const { id } = req.params;
      const { language = 'en', include_treatments = true, include_symptoms = true } = req.query;

      const disease = await Disease.findByPk(id, {
        include: [
          {
            model: Symptom,
            as: 'symptoms',
            where: include_symptoms === 'true' ? { is_active: true } : undefined,
            required: false,
            order: [['is_primary', 'DESC'], ['display_order', 'ASC']]
          },
          {
            model: Treatment,
            as: 'treatments',
            where: include_treatments === 'true' ? { is_approved: true } : undefined,
            required: false,
            order: [['effectiveness_score', 'DESC']]
          },
          {
            model: Crop,
            as: 'crops',
            through: { 
              attributes: ['prevalence_score', 'seasonal_pattern', 'regional_prevalence'] 
            },
            required: false
          }
        ]
      });

      if (!disease) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DISEASE_NOT_FOUND',
            message: 'Disease not found'
          }
        });
      }

      const response = {
        id: disease.id,
        scientific_name: disease.scientific_name,
        common_name_en: disease.common_name_en,
        common_name_hi: disease.common_name_hi,
        local_names: disease.local_names,
        description_en: disease.description_en,
        description_hi: disease.description_hi,
        causal_organism: disease.causal_organism,
        severity_level: disease.severity_level,
        economic_impact: disease.economic_impact,
        image_url: disease.image_url,
        affected_crops: disease.crops?.map(crop => ({
          id: crop.id,
          name_en: crop.common_name_en,
          name_hi: crop.common_name_hi,
          prevalence_score: crop.CropDisease?.prevalence_score,
          seasonal_pattern: crop.CropDisease?.seasonal_pattern,
          regional_prevalence: crop.CropDisease?.regional_prevalence
        })) || []
      };

      if (include_symptoms === 'true') {
        response.symptoms = disease.symptoms?.map(symptom => ({
          id: symptom.id,
          name_en: symptom.name_en,
          name_hi: symptom.name_hi,
          description_en: symptom.description_en,
          description_hi: symptom.description_hi,
          symptom_type: symptom.symptom_type,
          severity_indicator: symptom.severity_indicator,
          image_url: symptom.image_url,
          is_primary: symptom.is_primary,
          display_order: symptom.display_order
        })) || [];
      }

      if (include_treatments === 'true') {
        response.treatments = disease.treatments?.map(treatment => ({
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
          is_organic: treatment.is_organic
        })) || [];
      }

      res.status(200).json({
        success: true,
        data: response
      });

    } catch (error) {
      logger.error('Error fetching disease details:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch disease details'
        }
      });
    }
  }

  /**
   * Get disease statistics
   */
  async getDiseaseStats(req, res) {
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

      // Get disease query statistics
      const { FarmerQuery } = require('../models');
      const diseaseStats = await FarmerQuery.findAll({
        where: {
          detected_disease: { [require('sequelize').Op.ne]: null },
          created_at: { [require('sequelize').Op.gte]: startDate }
        },
        attributes: [
          'detected_disease',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'query_count'],
          [require('sequelize').fn('AVG', require('sequelize').col('confidence_score')), 'avg_confidence']
        ],
        group: ['detected_disease'],
        order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
        limit: 10
      });

      // Get total disease count
      const totalDiseases = await Disease.count({
        where: { is_active: true }
      });

      res.status(200).json({
        success: true,
        data: {
          period,
          total_diseases: totalDiseases,
          most_queried_diseases: diseaseStats.map(stat => ({
            disease: stat.detected_disease,
            query_count: parseInt(stat.dataValues.query_count),
            avg_confidence: parseFloat(stat.dataValues.avg_confidence || 0)
          })),
          period_start: startDate,
          period_end: now
        }
      });

    } catch (error) {
      logger.error('Error fetching disease stats:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch disease statistics'
        }
      });
    }
  }
}

module.exports = new DiseaseController();
