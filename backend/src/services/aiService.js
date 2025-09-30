const { OpenAI } = require('openai');
const { vectorSearch, generateEmbedding, createDiseaseEmbeddingText, createQueryEmbeddingText } = require('../config/vectorDB');
const { Disease, Symptom, Treatment, Crop } = require('../models');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  /**
   * Process farmer query and generate AI response
   */
  async processFarmerQuery(queryData) {
    try {
      const {
        query_text,
        query_language = 'en',
        session_id,
        region = null
      } = queryData;

      const startTime = Date.now();

      // Step 1: Generate embedding for the query
      const queryEmbedding = await generateEmbedding(query_text);

      // Step 2: Search for similar diseases in vector database
      const vectorResults = await vectorSearch(query_text, {
        topK: 5,
        filter: {
          language: query_language,
          ...(region && { region })
        }
      });

      // Step 3: Get detailed disease information from PostgreSQL
      const diseaseIds = vectorResults.matches?.map(match => match.metadata.disease_id) || [];
      const diseases = await this.getDiseaseDetails(diseaseIds, query_language);

      // Step 4: Find similar farmer queries for context
      const similarQueries = await this.findSimilarQueries(query_text, query_language);

      // Step 5: Generate AI response using RAG
      const aiResponse = await this.generateResponse({
        query: query_text,
        language: query_language,
        diseases,
        similarQueries,
        vectorResults: vectorResults.matches
      });

      const responseTime = Date.now() - startTime;

      // Step 6: Detect crop and disease from response
      const detectedInfo = await this.detectCropAndDisease(query_text, diseases);

      return {
        response: aiResponse,
        detected_crop: detectedInfo.crop,
        detected_disease: detectedInfo.disease,
        confidence_score: detectedInfo.confidence,
        response_time_ms: responseTime,
        similar_diseases: diseases.slice(0, 3),
        response_language: query_language
      };

    } catch (error) {
      logger.error('Error processing farmer query:', error);
      throw new Error('Failed to process farmer query');
    }
  }

  /**
   * Get detailed disease information from database
   */
  async getDiseaseDetails(diseaseIds, language = 'en') {
    if (!diseaseIds.length) return [];

    try {
      const diseases = await Disease.findAll({
        where: {
          id: diseaseIds,
          is_active: true
        },
        include: [
          {
            model: Symptom,
            as: 'symptoms',
            where: { is_active: true },
            required: false,
            order: [['is_primary', 'DESC'], ['display_order', 'ASC']]
          },
          {
            model: Treatment,
            as: 'treatments',
            where: { is_approved: true },
            required: false,
            order: [['effectiveness_score', 'DESC']]
          },
          {
            model: Crop,
            as: 'crops',
            through: { attributes: ['prevalence_score'] },
            required: false
          }
        ],
        order: [['severity_level', 'DESC']]
      });

      return diseases.map(disease => this.formatDiseaseForResponse(disease, language));
    } catch (error) {
      logger.error('Error fetching disease details:', error);
      return [];
    }
  }

  /**
   * Find similar farmer queries for context
   */
  async findSimilarQueries(query, language, limit = 3) {
    try {
      const { FarmerQuery } = require('../models');
      
      // Simple text similarity search (can be enhanced with vector search)
      const similarQueries = await FarmerQuery.findAll({
        where: {
          query_language: language,
          user_feedback: 'helpful'
        },
        order: [['created_at', 'DESC']],
        limit,
        attributes: ['query_text', 'ai_response', 'detected_crop', 'detected_disease']
      });

      return similarQueries;
    } catch (error) {
      logger.error('Error finding similar queries:', error);
      return [];
    }
  }

  /**
   * Generate AI response using RAG with detailed calculations
   */
  async generateResponse(context) {
    try {
      const {
        query,
        language,
        diseases,
        similarQueries,
        vectorResults
      } = context;

      // Build context for AI with detailed treatment information
      const diseaseContext = diseases.map(disease => `
        Disease: ${disease.name_en} (${disease.name_hi || ''})
        Symptoms: ${disease.symptoms?.map(s => s.name_en).join(', ')}
        Severity: ${disease.severity_level}/5
        Treatments: ${disease.treatments?.map(t => this.formatTreatmentDetails(t, language)).join('\n')}
      `).join('\n');

      const similarContext = similarQueries.map(sq => `
        Query: ${sq.query_text}
        Response: ${sq.ai_response}
      `).join('\n');

      const systemPrompt = this.getSystemPrompt(language);
      const userPrompt = this.buildUserPrompt(query, diseaseContext, similarContext, language);

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.9
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Error generating AI response:', error);
      return this.getFallbackResponse(query, language);
    }
  }

  /**
   * Format treatment details with calculations
   */
  formatTreatmentDetails(treatment, language) {
    const isHindi = language === 'hi';
    
    let details = `${treatment.name_en} (${treatment.name_hi || ''})`;
    
    if (treatment.dosage_per_acre) {
      details += isHindi ? 
        `\n- प्रति एकड़: ${treatment.dosage_per_acre} ग्राम/मिली` :
        `\n- Per Acre: ${treatment.dosage_per_acre} grams/ml`;
    }
    
    if (treatment.dosage_per_hectare) {
      details += isHindi ? 
        `\n- प्रति हेक्टेयर: ${treatment.dosage_per_hectare} ग्राम/मिली` :
        `\n- Per Hectare: ${treatment.dosage_per_hectare} grams/ml`;
    }
    
    if (treatment.water_requirement_per_acre) {
      details += isHindi ? 
        `\n- पानी की जरूरत (प्रति एकड़): ${treatment.water_requirement_per_acre} लीटर` :
        `\n- Water Required (per acre): ${treatment.water_requirement_per_acre} liters`;
    }
    
    if (treatment.spray_volume_per_acre) {
      details += isHindi ? 
        `\n- स्प्रे वॉल्यूम (प्रति एकड़): ${treatment.spray_volume_per_acre} लीटर` :
        `\n- Spray Volume (per acre): ${treatment.spray_volume_per_acre} liters`;
    }
    
    if (treatment.reapplication_interval) {
      details += isHindi ? 
        `\n- दोबारा लगाने का समय: ${treatment.reapplication_interval} दिन` :
        `\n- Reapplication Interval: ${treatment.reapplication_interval} days`;
    }
    
    if (treatment.total_applications) {
      details += isHindi ? 
        `\n- कुल उपयोग: ${treatment.total_applications} बार` :
        `\n- Total Applications: ${treatment.total_applications} times`;
    }
    
    return details;
  }

  /**
   * Get system prompt based on language
   */
  getSystemPrompt(language) {
    const prompts = {
      en: `You are an AI agricultural expert helping farmers with crop disease identification and treatment recommendations. 
      
      CRITICAL REQUIREMENTS:
      1. Always provide EXACT calculations for medicine dosage based on field area
      2. Include specific quantities: grams/ml per acre/hectare
      3. Mention water requirements for mixing
      4. Specify spray volume needed
      5. Give exact timing for applications
      6. Include reapplication intervals
      7. Calculate total cost estimates
      8. Always include safety warnings for chemical treatments
      
      CALCULATION FORMAT:
      - For 1 acre: Use X grams/ml of medicine + Y liters of water
      - For 1 hectare: Use X grams/ml of medicine + Y liters of water
      - Spray volume: Z liters per acre/hectare
      - Apply every X days, total Y applications needed
      - Best time: [specific timing]
      - Weather conditions: [suitable conditions]
      
      Be conversational, friendly, and use simple language that farmers can understand. Always provide practical, actionable advice.`,
      
      hi: `आप एक AI कृषि विशेषज्ञ हैं जो किसानों की फसल रोग पहचान और उपचार सुझावों में मदद करते हैं।
      
      महत्वपूर्ण आवश्यकताएं:
      1. हमेशा खेत के क्षेत्र के आधार पर दवा की सटीक गणना दें
      2. विशिष्ट मात्रा शामिल करें: प्रति एकड़/हेक्टेयर ग्राम/मिली
      3. मिश्रण के लिए पानी की आवश्यकता बताएं
      4. आवश्यक स्प्रे वॉल्यूम निर्दिष्ट करें
      5. अनुप्रयोग के लिए सटीक समय दें
      6. पुन: आवेदन अंतराल शामिल करें
      7. कुल लागत अनुमान की गणना करें
      8. रासायनिक उपचार के लिए हमेशा सुरक्षा चेतावनियां शामिल करें
      
      गणना प्रारूप:
      - 1 एकड़ के लिए: X ग्राम/मिली दवा + Y लीटर पानी का उपयोग करें
      - 1 हेक्टेयर के लिए: X ग्राम/मिली दवा + Y लीटर पानी का उपयोग करें
      - स्प्रे वॉल्यूम: प्रति एकड़/हेक्टेयर Z लीटर
      - हर X दिन में लगाएं, कुल Y अनुप्रयोग आवश्यक
      - सबसे अच्छा समय: [विशिष्ट समय]
      - मौसम की स्थिति: [उपयुक्त स्थिति]
      
      बातचीत के तरीके में रहें, दोस्ताना बनें और सरल भाषा का उपयोग करें जिसे किसान समझ सकें। हमेशा व्यावहारिक, क्रियाशील सलाह दें।`
    };

    return prompts[language] || prompts.en;
  }

  /**
   * Build user prompt with context
   */
  buildUserPrompt(query, diseaseContext, similarContext, language) {
    const basePrompt = language === 'hi' ? 
      `किसान का सवाल: ${query}\n\nरोग जानकारी:\n${diseaseContext}\n\nसमान मामले:\n${similarContext}\n\nकृपया सहायक उत्तर दें:` :
      `Farmer's question: ${query}\n\nDisease information:\n${diseaseContext}\n\nSimilar cases:\n${similarContext}\n\nPlease provide a helpful response:`;

    return basePrompt;
  }

  /**
   * Detect crop and disease from query and results
   */
  async detectCropAndDisease(query, diseases) {
    try {
      if (!diseases.length) {
        return { crop: null, disease: null, confidence: 0 };
      }

      const topDisease = diseases[0];
      const topCrop = topDisease.crops?.[0];

      // Simple confidence calculation based on vector similarity
      const confidence = diseases[0]?.vectorScore || 0.5;

      return {
        crop: topCrop?.common_name_en || null,
        disease: topDisease.common_name_en || null,
        confidence: Math.min(confidence, 0.95)
      };
    } catch (error) {
      logger.error('Error detecting crop and disease:', error);
      return { crop: null, disease: null, confidence: 0 };
    }
  }

  /**
   * Format disease data for response
   */
  formatDiseaseForResponse(disease, language) {
    return {
      id: disease.id,
      name_en: disease.common_name_en,
      name_hi: disease.common_name_hi,
      scientific_name: disease.scientific_name,
      severity_level: disease.severity_level,
      description_en: disease.description_en,
      description_hi: disease.description_hi,
      symptoms: disease.symptoms?.map(symptom => ({
        id: symptom.id,
        name_en: symptom.name_en,
        name_hi: symptom.name_hi,
        description_en: symptom.description_en,
        description_hi: symptom.description_hi,
        is_primary: symptom.is_primary
      })) || [],
      treatments: disease.treatments?.map(treatment => ({
        id: treatment.id,
        name_en: treatment.name_en,
        name_hi: treatment.name_hi,
        is_organic: treatment.is_organic,
        effectiveness_score: treatment.effectiveness_score,
        dosage_en: treatment.dosage_en,
        dosage_hi: treatment.dosage_hi
      })) || [],
      crops: disease.crops?.map(crop => ({
        id: crop.id,
        name_en: crop.common_name_en,
        name_hi: crop.common_name_hi,
        prevalence_score: crop.CropDisease?.prevalence_score
      })) || []
    };
  }

  /**
   * Fallback response when AI fails
   */
  getFallbackResponse(query, language) {
    const responses = {
      en: "I apologize, but I'm having trouble processing your query right now. Please try rephrasing your question or contact our support team for assistance.",
      hi: "मुझे खेद है, लेकिन मैं आपके प्रश्न को संसाधित करने में कठिनाई हो रही है। कृपया अपना प्रश्न दोबारा लिखने का प्रयास करें या सहायता के लिए हमारी सहायता टीम से संपर्क करें।"
    };

    return responses[language] || responses.en;
  }

  /**
   * Generate text-to-speech audio
   */
  async generateSpeech(text, language = 'hi') {
    try {
      // This would integrate with gTTS or ElevenLabs
      // For now, return a placeholder
      return {
        audio_url: null,
        duration: 0,
        language
      };
    } catch (error) {
      logger.error('Error generating speech:', error);
      return null;
    }
  }
}

module.exports = new AIService();
