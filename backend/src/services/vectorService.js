const { 
  vectorSearch, 
  generateEmbedding, 
  upsertVectors, 
  deleteVectors,
  createDiseaseEmbeddingText,
  createQueryEmbeddingText
} = require('../config/vectorDB');
const { Disease, Symptom, Treatment, Crop, FarmerQuery } = require('../models');
const logger = require('../utils/logger');

class VectorService {
  /**
   * Search diseases using vector similarity
   */
  async searchDiseases(query, options = {}) {
    try {
      const {
        language = 'en',
        region = null,
        topK = 10,
        minScore = 0.7
      } = options;

      // Perform vector search
      const searchResults = await vectorSearch(query, {
        topK,
        filter: {
          type: 'disease',
          language,
          ...(region && { region })
        },
        includeMetadata: true
      });

      // Filter by minimum score
      const filteredResults = searchResults.matches?.filter(
        match => match.score >= minScore
      ) || [];

      // Get disease IDs
      const diseaseIds = filteredResults.map(match => match.metadata.disease_id);

      // Fetch detailed disease information
      const diseases = await this.getDiseaseDetails(diseaseIds, language);

      // Combine with similarity scores
      const results = diseases.map(disease => {
        const match = filteredResults.find(m => m.metadata.disease_id === disease.id);
        return {
          ...disease,
          similarity_score: match?.score || 0,
          vector_id: match?.id
        };
      });

      return {
        diseases: results,
        total_count: results.length,
        search_time_ms: searchResults.query_time || 0
      };

    } catch (error) {
      logger.error('Error searching diseases:', error);
      throw new Error('Failed to search diseases');
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
            through: { attributes: ['prevalence_score', 'seasonal_pattern', 'regional_prevalence'] },
            required: false
          }
        ]
      });

      return diseases.map(disease => this.formatDiseaseResponse(disease, language));
    } catch (error) {
      logger.error('Error fetching disease details:', error);
      return [];
    }
  }

  /**
   * Update disease embeddings in vector database
   */
  async updateDiseaseEmbeddings(diseaseId) {
    try {
      const disease = await Disease.findByPk(diseaseId, {
        include: [
          {
            model: Symptom,
            as: 'symptoms',
            where: { is_active: true },
            required: false
          },
          {
            model: Treatment,
            as: 'treatments',
            where: { is_approved: true },
            required: false
          },
          {
            model: Crop,
            as: 'crops',
            required: false
          }
        ]
      });

      if (!disease) {
        throw new Error('Disease not found');
      }

      // Create embedding text for English
      const embeddingTextEn = createDiseaseEmbeddingText({
        name_en: disease.common_name_en,
        name_hi: disease.common_name_hi,
        scientific_name: disease.scientific_name,
        description_en: disease.description_en,
        description_hi: disease.description_hi,
        symptoms: disease.symptoms || [],
        treatments: disease.treatments || [],
        crop_name: disease.crops?.[0]?.common_name_en
      });

      // Create embedding text for Hindi
      const embeddingTextHi = createDiseaseEmbeddingText({
        name_en: disease.common_name_en,
        name_hi: disease.common_name_hi,
        scientific_name: disease.scientific_name,
        description_en: disease.description_hi || disease.description_en,
        description_hi: disease.description_hi,
        symptoms: disease.symptoms || [],
        treatments: disease.treatments || [],
        crop_name: disease.crops?.[0]?.common_name_hi || disease.crops?.[0]?.common_name_en
      });

      // Generate embeddings
      const [embeddingEn, embeddingHi] = await Promise.all([
        generateEmbedding(embeddingTextEn),
        generateEmbedding(embeddingTextHi)
      ]);

      // Prepare vectors for upsert
      const vectors = [
        {
          id: `disease_${diseaseId}_en`,
          values: embeddingEn,
          metadata: {
            disease_id: diseaseId,
            type: 'disease',
            language: 'en',
            name_en: disease.common_name_en,
            name_hi: disease.common_name_hi,
            scientific_name: disease.scientific_name,
            severity_level: disease.severity_level,
            crop_id: disease.crops?.[0]?.id,
            crop_name: disease.crops?.[0]?.common_name_en
          }
        },
        {
          id: `disease_${diseaseId}_hi`,
          values: embeddingHi,
          metadata: {
            disease_id: diseaseId,
            type: 'disease',
            language: 'hi',
            name_en: disease.common_name_en,
            name_hi: disease.common_name_hi,
            scientific_name: disease.scientific_name,
            severity_level: disease.severity_level,
            crop_id: disease.crops?.[0]?.id,
            crop_name: disease.crops?.[0]?.common_name_en
          }
        }
      ];

      // Upsert vectors
      await upsertVectors(vectors);

      // Update last_embedding_update timestamp
      await disease.update({ last_embedding_update: new Date() });

      logger.info(`Updated embeddings for disease ${diseaseId}`);
      return true;

    } catch (error) {
      logger.error('Error updating disease embeddings:', error);
      throw error;
    }
  }

  /**
   * Batch update embeddings for multiple diseases
   */
  async batchUpdateDiseaseEmbeddings(diseaseIds) {
    try {
      const results = await Promise.allSettled(
        diseaseIds.map(id => this.updateDiseaseEmbeddings(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info(`Batch update completed: ${successful} successful, ${failed} failed`);
      
      return {
        successful,
        failed,
        total: diseaseIds.length
      };
    } catch (error) {
      logger.error('Error in batch update:', error);
      throw error;
    }
  }

  /**
   * Store farmer query embedding for similarity search
   */
  async storeQueryEmbedding(queryData) {
    try {
      const {
        query_text,
        query_language = 'en',
        detected_crop,
        detected_disease,
        session_id
      } = queryData;

      // Create embedding text
      const embeddingText = createQueryEmbeddingText({
        query_text,
        detected_crop,
        detected_disease,
        language: query_language
      });

      // Generate embedding
      const embedding = await generateEmbedding(embeddingText);

      // Store in vector database
      const vector = {
        id: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        values: embedding,
        metadata: {
          type: 'query',
          language: query_language,
          query_text,
          detected_crop,
          detected_disease,
          session_id,
          timestamp: new Date().toISOString()
        }
      };

      await upsertVectors([vector]);
      return vector.id;

    } catch (error) {
      logger.error('Error storing query embedding:', error);
      throw error;
    }
  }

  /**
   * Find similar farmer queries
   */
  async findSimilarQueries(query, options = {}) {
    try {
      const {
        language = 'en',
        topK = 5,
        minScore = 0.6
      } = options;

      // Perform vector search
      const searchResults = await vectorSearch(query, {
        topK,
        filter: {
          type: 'query',
          language
        },
        includeMetadata: true
      });

      // Filter by minimum score
      const filteredResults = searchResults.matches?.filter(
        match => match.score >= minScore
      ) || [];

      return filteredResults.map(match => ({
        query_text: match.metadata.query_text,
        detected_crop: match.metadata.detected_crop,
        detected_disease: match.metadata.detected_disease,
        similarity_score: match.score,
        timestamp: match.metadata.timestamp
      }));

    } catch (error) {
      logger.error('Error finding similar queries:', error);
      return [];
    }
  }

  /**
   * Delete vectors by IDs
   */
  async deleteVectorsByIds(ids) {
    try {
      await deleteVectors(ids);
      logger.info(`Deleted ${ids.length} vectors`);
      return true;
    } catch (error) {
      logger.error('Error deleting vectors:', error);
      throw error;
    }
  }

  /**
   * Format disease response for API
   */
  formatDiseaseResponse(disease, language) {
    return {
      id: disease.id,
      name_en: disease.common_name_en,
      name_hi: disease.common_name_hi,
      scientific_name: disease.scientific_name,
      description_en: disease.description_en,
      description_hi: disease.description_hi,
      severity_level: disease.severity_level,
      image_url: disease.image_url,
      symptoms: disease.symptoms?.map(symptom => ({
        id: symptom.id,
        name_en: symptom.name_en,
        name_hi: symptom.name_hi,
        description_en: symptom.description_en,
        description_hi: symptom.description_hi,
        is_primary: symptom.is_primary,
        image_url: symptom.image_url
      })) || [],
      treatments: disease.treatments?.map(treatment => ({
        id: treatment.id,
        name_en: treatment.name_en,
        name_hi: treatment.name_hi,
        is_organic: treatment.is_organic,
        effectiveness_score: treatment.effectiveness_score,
        dosage_en: treatment.dosage_en,
        dosage_hi: treatment.dosage_hi,
        safety_precautions_en: treatment.safety_precautions_en,
        safety_precautions_hi: treatment.safety_precautions_hi,
        product_links: treatment.product_links
      })) || [],
      affected_crops: disease.crops?.map(crop => ({
        id: crop.id,
        name_en: crop.common_name_en,
        name_hi: crop.common_name_hi,
        prevalence_score: crop.CropDisease?.prevalence_score
      })) || []
    };
  }

  /**
   * Get vector database statistics
   */
  async getVectorStats() {
    try {
      // This would query Pinecone for statistics
      // For now, return placeholder data
      return {
        total_vectors: 0,
        disease_vectors: 0,
        query_vectors: 0,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting vector stats:', error);
      return null;
    }
  }
}

module.exports = new VectorService();
