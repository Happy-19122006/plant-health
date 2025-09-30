const { validationResult } = require('express-validator');
const aiService = require('../services/aiService');
const vectorService = require('../services/vectorService');
const { FarmerQuery, UserSession } = require('../models');
const logger = require('../utils/logger');

class FarmerController {
  /**
   * Process farmer query and return AI response
   */
  async processQuery(req, res) {
    try {
      // Validate request
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
        query_text,
        query_language = 'en',
        region = null,
        include_voice = false
      } = req.body;

      const session_id = req.session_id || req.body.session_id;

      // Create or get session
      let session;
      if (session_id) {
        session = await UserSession.findByPk(session_id);
      }
      
      if (!session) {
        session = await UserSession.create({
          session_data: {
            device_info: req.headers['user-agent'],
            ip_address: req.ip
          },
          language_preference: query_language,
          region
        });
      } else {
        // Update last activity
        await session.update({ last_activity: new Date() });
      }

      // Process query with AI service
      const aiResult = await aiService.processFarmerQuery({
        query_text,
        query_language,
        session_id: session.id,
        region
      });

      // Store query in database
      const farmerQuery = await FarmerQuery.create({
        session_id: session.id,
        user_id: req.user?.id,
        query_text,
        query_language,
        query_type: 'disease_identification',
        detected_crop: aiResult.detected_crop,
        detected_disease: aiResult.detected_disease,
        confidence_score: aiResult.confidence_score,
        ai_response: aiResult.response,
        response_language: aiResult.response_language,
        response_time_ms: aiResult.response_time_ms,
        metadata: {
          similar_diseases: aiResult.similar_diseases?.map(d => d.id) || [],
          region,
          user_agent: req.headers['user-agent']
        }
      });

      // Store query embedding for future similarity search
      try {
        await vectorService.storeQueryEmbedding({
          query_text,
          query_language,
          detected_crop: aiResult.detected_crop,
          detected_disease: aiResult.detected_disease,
          session_id: session.id
        });
      } catch (error) {
        logger.warn('Failed to store query embedding:', error);
      }

      // Generate voice response if requested
      let voiceResponse = null;
      if (include_voice) {
        try {
          voiceResponse = await aiService.generateSpeech(aiResult.response, query_language);
        } catch (error) {
          logger.warn('Failed to generate voice response:', error);
        }
      }

      // Return response
      res.status(200).json({
        success: true,
        data: {
          query_id: farmerQuery.id,
          session_id: session.id,
          response: aiResult.response,
          language: aiResult.response_language,
          detected_crop: aiResult.detected_crop,
          detected_disease: aiResult.detected_disease,
          confidence_score: aiResult.confidence_score,
          response_time_ms: aiResult.response_time_ms,
          similar_diseases: aiResult.similar_diseases,
          voice_response: voiceResponse,
          suggested_actions: this.generateSuggestedActions(aiResult)
        },
        message: 'Query processed successfully'
      });

    } catch (error) {
      logger.error('Error processing farmer query:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process query'
        }
      });
    }
  }

  /**
   * Get farmer query history
   */
  async getQueryHistory(req, res) {
    try {
      const { session_id, user_id } = req.query;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      if (!session_id && !user_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Either session_id or user_id is required'
          }
        });
      }

      let queries;
      if (session_id) {
        queries = await FarmerQuery.findBySession(session_id, limit, offset);
      } else {
        queries = await FarmerQuery.findByUser(user_id, limit, offset);
      }

      res.status(200).json({
        success: true,
        data: {
          queries: queries.map(query => ({
            id: query.id,
            query_text: query.query_text,
            query_language: query.query_language,
            detected_crop: query.detected_crop,
            detected_disease: query.detected_disease,
            confidence_score: query.confidence_score,
            ai_response: query.ai_response,
            response_language: query.response_language,
            user_feedback: query.user_feedback,
            created_at: query.created_at
          })),
          total_count: queries.length,
          limit,
          offset
        }
      });

    } catch (error) {
      logger.error('Error fetching query history:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch query history'
        }
      });
    }
  }

  /**
   * Submit user feedback for a query
   */
  async submitFeedback(req, res) {
    try {
      const { query_id } = req.params;
      const { feedback } = req.body;

      if (!['helpful', 'not_helpful', 'partially_helpful'].includes(feedback)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FEEDBACK',
            message: 'Feedback must be one of: helpful, not_helpful, partially_helpful'
          }
        });
      }

      const query = await FarmerQuery.findByPk(query_id);
      if (!query) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'QUERY_NOT_FOUND',
            message: 'Query not found'
          }
        });
      }

      await query.update({
        user_feedback: feedback,
        feedback_timestamp: new Date()
      });

      res.status(200).json({
        success: true,
        message: 'Feedback submitted successfully'
      });

    } catch (error) {
      logger.error('Error submitting feedback:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to submit feedback'
        }
      });
    }
  }

  /**
   * Generate suggested actions based on AI response
   */
  generateSuggestedActions(aiResult) {
    const actions = [];

    if (aiResult.detected_disease) {
      actions.push({
        action: 'view_treatment',
        treatment_id: aiResult.similar_diseases?.[0]?.treatments?.[0]?.id,
        priority: 'high',
        title: 'View Treatment Details'
      });
    }

    if (aiResult.confidence_score < 0.7) {
      actions.push({
        action: 'consult_expert',
        priority: 'medium',
        title: 'Consult Local Expert',
        reason: 'Low confidence in diagnosis'
      });
    }

    actions.push({
      action: 'search_similar',
      priority: 'low',
      title: 'Search Similar Cases'
    });

    return actions;
  }

  /**
   * Get session information
   */
  async getSession(req, res) {
    try {
      const { session_id } = req.params;

      const session = await UserSession.findByPk(session_id, {
        include: [{
          model: FarmerQuery,
          as: 'queries',
          limit: 10,
          order: [['created_at', 'DESC']]
        }]
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Session not found'
          }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          session_id: session.id,
          language_preference: session.language_preference,
          region: session.region,
          created_at: session.created_at,
          last_activity: session.last_activity,
          query_count: session.queries?.length || 0,
          recent_queries: session.queries?.map(query => ({
            id: query.id,
            query_text: query.query_text,
            detected_disease: query.detected_disease,
            created_at: query.created_at
          })) || []
        }
      });

    } catch (error) {
      logger.error('Error fetching session:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch session'
        }
      });
    }
  }
}

module.exports = new FarmerController();
