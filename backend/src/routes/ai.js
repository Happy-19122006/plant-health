const express = require('express');
const { body, query } = require('express-validator');
const aiService = require('../services/aiService');
const vectorService = require('../services/vectorService');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many AI requests from this IP, please try again later.'
    }
  }
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
    }
  }
});

// Validation middleware
const validateAIQuery = [
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

const validateVectorSearch = [
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
  query('top_k')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('top_k must be between 1 and 20'),
  query('min_score')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('min_score must be between 0 and 1')
];

// Routes

/**
 * @route POST /api/v1/ai/ask
 * @desc Ask AI agent a question
 * @access Public
 */
router.post('/ask', aiLimiter, validateAIQuery, async (req, res) => {
  try {
    const {
      query_text,
      query_language = 'en',
      region = null,
      include_voice = false
    } = req.body;

    const session_id = req.session_id || req.body.session_id;

    // Process query with AI service
    const result = await aiService.processFarmerQuery({
      query_text,
      query_language,
      session_id,
      region
    });

    // Generate voice response if requested
    let voiceResponse = null;
    if (include_voice) {
      try {
        voiceResponse = await aiService.generateSpeech(result.response, query_language);
      } catch (error) {
        logger.warn('Failed to generate voice response:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        response: result.response,
        language: result.response_language,
        detected_crop: result.detected_crop,
        detected_disease: result.detected_disease,
        confidence_score: result.confidence_score,
        response_time_ms: result.response_time_ms,
        similar_diseases: result.similar_diseases,
        voice_response: voiceResponse
      },
      message: 'AI response generated successfully'
    });

  } catch (error) {
    logger.error('Error in AI ask endpoint:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AI_SERVICE_ERROR',
        message: 'Failed to generate AI response'
      }
    });
  }
});

/**
 * @route GET /api/v1/ai/search
 * @desc Search using vector similarity
 * @access Public
 */
router.get('/search', validateVectorSearch, async (req, res) => {
  try {
    const {
      query,
      language = 'en',
      region = null,
      top_k = 10,
      min_score = 0.7
    } = req.query;

    const searchResults = await vectorService.searchDiseases(query, {
      language,
      region,
      topK: parseInt(top_k),
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
      message: 'Vector search completed successfully'
    });

  } catch (error) {
    logger.error('Error in vector search endpoint:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'VECTOR_SEARCH_ERROR',
        message: 'Failed to perform vector search'
      }
    });
  }
});

/**
 * @route POST /api/v1/ai/voice/process
 * @desc Process voice query and return text and audio response
 * @access Public
 */
router.post('/voice/process', aiLimiter, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_AUDIO_FILE',
          message: 'No audio file provided'
        }
      });
    }

    const { language = 'hi' } = req.body;

    // Here you would integrate with speech-to-text service
    // For now, return a placeholder response
    const transcript = 'Voice processing not yet implemented';
    
    // Process the transcript with AI
    const aiResult = await aiService.processFarmerQuery({
      query_text: transcript,
      query_language: language,
      session_id: req.session_id
    });

    // Generate voice response
    const voiceResponse = await aiService.generateSpeech(aiResult.response, language);

    res.status(200).json({
      success: true,
      data: {
        transcript,
        language,
        response: aiResult.response,
        detected_crop: aiResult.detected_crop,
        detected_disease: aiResult.detected_disease,
        confidence_score: aiResult.confidence_score,
        audio_response_url: voiceResponse?.audio_url,
        duration: voiceResponse?.duration
      },
      message: 'Voice query processed successfully'
    });

  } catch (error) {
    logger.error('Error processing voice query:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'VOICE_PROCESSING_ERROR',
        message: 'Failed to process voice query'
      }
    });
  }
});

/**
 * @route GET /api/v1/ai/similar
 * @desc Find similar queries
 * @access Public
 */
router.get('/similar', validateVectorSearch, async (req, res) => {
  try {
    const {
      query,
      language = 'en',
      top_k = 5,
      min_score = 0.6
    } = req.query;

    const similarQueries = await vectorService.findSimilarQueries(query, {
      language,
      topK: parseInt(top_k),
      minScore: parseFloat(min_score)
    });

    res.status(200).json({
      success: true,
      data: {
        similar_queries: similarQueries,
        total_count: similarQueries.length,
        query,
        language
      },
      message: 'Similar queries found successfully'
    });

  } catch (error) {
    logger.error('Error finding similar queries:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SIMILAR_QUERY_ERROR',
        message: 'Failed to find similar queries'
      }
    });
  }
});

/**
 * @route POST /api/v1/ai/analyze-images
 * @desc Analyze uploaded images for disease detection
 * @access Public
 */
router.post('/analyze-images', aiLimiter, upload.array('images', 5), async (req, res) => {
    try {
        const { images, session_id, language = 'en', region = 'india' } = req.body;

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'NO_IMAGES',
                    message: 'No images provided for analysis'
                }
            });
        }

        const startTime = Date.now();

        // Process images with AI
        const analysisResult = await analyzeImagesWithAI(images, language, region);

        const analysisTime = Date.now() - startTime;

        res.status(200).json({
            success: true,
            data: {
                detected_disease: analysisResult.disease,
                detected_crop: analysisResult.crop,
                confidence_score: analysisResult.confidence,
                detected_symptoms: analysisResult.symptoms,
                treatment_recommendations: analysisResult.treatments,
                analysis_time_ms: analysisTime,
                images_processed: images.length
            },
            message: 'Image analysis completed successfully'
        });

    } catch (error) {
        logger.error('Error analyzing images:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'IMAGE_ANALYSIS_ERROR',
                message: 'Failed to analyze images'
            }
        });
    }
});

/**
 * @route GET /api/v1/ai/stats
 * @desc Get AI service statistics
 * @access Public
 */
router.get('/stats', async (req, res) => {
    try {
        const vectorStats = await vectorService.getVectorStats();

        res.status(200).json({
            success: true,
            data: {
                vector_database: vectorStats,
                ai_model: process.env.OPENAI_MODEL || 'gpt-4',
                embedding_model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002',
                supported_languages: ['en', 'hi', 'te', 'bn', 'ta', 'gu', 'mr', 'kn', 'ml', 'pa']
            },
            message: 'AI statistics retrieved successfully'
        });

    } catch (error) {
        logger.error('Error getting AI stats:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'AI_STATS_ERROR',
                message: 'Failed to get AI statistics'
            }
        });
    }
});

// Helper function to analyze images with AI
async function analyzeImagesWithAI(images, language, region) {
    try {
        // For now, simulate AI analysis with realistic results
        // In production, this would integrate with computer vision models
        
        const diseases = [
            {
                name: 'Late Blight',
                name_hi: 'लेट ब्लाइट',
                crop: 'Tomato',
                crop_hi: 'टमाटर',
                confidence: 0.85,
                symptoms: ['Dark water-soaked lesions', 'White fungal growth', 'Rapid plant collapse'],
                symptoms_hi: ['काले पानी से भरे घाव', 'सफेद फंगल वृद्धि', 'तेजी से पौधे का गिरना']
            },
            {
                name: 'Rice Blast',
                name_hi: 'राइस ब्लास्ट',
                crop: 'Rice',
                crop_hi: 'चावल',
                confidence: 0.78,
                symptoms: ['Spindle-shaped lesions', 'Gray centers with brown borders', 'White spots on panicles'],
                symptoms_hi: ['तकली के आकार के घाव', 'भूरे किनारों के साथ ग्रे केंद्र', 'पैनिकल्स पर सफेद धब्बे']
            },
            {
                name: 'Wheat Rust',
                name_hi: 'गेहूं रस्ट',
                crop: 'Wheat',
                crop_hi: 'गेहूं',
                confidence: 0.82,
                symptoms: ['Orange to reddish-brown pustules', 'Yellow halos around lesions', 'Stunted growth'],
                symptoms_hi: ['नारंगी से लाल-भूरे पुस्ट्यूल', 'घावों के आसपास पीले हेलो', 'अवरुद्ध वृद्धि']
            }
        ];

        // Simulate analysis by selecting a random disease
        const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
        
        // Get treatments for the disease
        const treatments = await getTreatmentsForDisease(selectedDisease.name, language);

        return {
            disease: selectedDisease.name,
            disease_hi: selectedDisease.name_hi,
            crop: selectedDisease.crop,
            crop_hi: selectedDisease.crop_hi,
            confidence: selectedDisease.confidence,
            symptoms: language === 'hi' ? selectedDisease.symptoms_hi : selectedDisease.symptoms,
            treatments: treatments
        };

    } catch (error) {
        logger.error('Error in image analysis:', error);
        throw error;
    }
}

// Helper function to get treatments for a disease
async function getTreatmentsForDisease(diseaseName, language) {
    try {
        // This would query the database for treatments
        // For now, return sample treatments
        
        const treatments = {
            'Late Blight': {
                chemical: ['Chlorothalonil 75% WP', 'Mancozeb 75% WP'],
                chemical_hi: ['क्लोरोथैलोनिल 75% WP', 'मैंकोज़ेब 75% WP'],
                organic: ['Copper fungicide', 'Baking soda spray'],
                organic_hi: ['कॉपर फंगीसाइड', 'बेकिंग सोडा स्प्रे'],
                dosage: '2-3 grams per liter of water',
                dosage_hi: 'पानी के प्रति लीटर 2-3 ग्राम'
            },
            'Rice Blast': {
                chemical: ['Tricyclazole 75% WP', 'Propiconazole 25% EC'],
                chemical_hi: ['ट्राइसाइक्लाजोल 75% WP', 'प्रोपिकोनाजोल 25% EC'],
                organic: ['Neem oil spray', 'Bordeaux mixture'],
                organic_hi: ['नीम तेल स्प्रे', 'बोर्डो मिश्रण'],
                dosage: '1-2 grams per liter of water',
                dosage_hi: 'पानी के प्रति लीटर 1-2 ग्राम'
            },
            'Wheat Rust': {
                chemical: ['Tebuconazole 25% EC', 'Propiconazole 25% EC'],
                chemical_hi: ['टेबुकोनाजोल 25% EC', 'प्रोपिकोनाजोल 25% EC'],
                organic: ['Sulfur dust', 'Garlic extract spray'],
                organic_hi: ['सल्फर डस्ट', 'लहसुन निकालने का स्प्रे'],
                dosage: '1 ml per liter of water',
                dosage_hi: 'पानी के प्रति लीटर 1 मिली'
            }
        };

        const diseaseTreatments = treatments[diseaseName] || treatments['Late Blight'];
        
        return {
            chemical: language === 'hi' ? diseaseTreatments.chemical_hi : diseaseTreatments.chemical,
            organic: language === 'hi' ? diseaseTreatments.organic_hi : diseaseTreatments.organic,
            dosage: language === 'hi' ? diseaseTreatments.dosage_hi : diseaseTreatments.dosage
        };

    } catch (error) {
        logger.error('Error getting treatments:', error);
        return {
            chemical: ['Consult local expert'],
            organic: ['Use organic methods'],
            dosage: 'Follow package instructions'
        };
    }
}

module.exports = router;
