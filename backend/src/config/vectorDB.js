const { Pinecone } = require('pinecone-client');
const { OpenAI } = require('openai');
const logger = require('../utils/logger');

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Pinecone configuration
let pinecone = null;

const initializePinecone = async () => {
  try {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    // Test connection
    const indexList = await pinecone.listIndexes();
    logger.info('Pinecone connection established successfully.');
    logger.info(`Available indexes: ${indexList.indexes?.map(idx => idx.name).join(', ')}`);
    
    return pinecone;
  } catch (error) {
    logger.error('Failed to initialize Pinecone:', error);
    throw error;
  }
};

// Get Pinecone index
const getIndex = async () => {
  if (!pinecone) {
    await initializePinecone();
  }
  
  const indexName = process.env.PINECONE_INDEX_NAME || 'plant-health-ai';
  return pinecone.index(indexName);
};

// Generate embeddings using OpenAI
const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    logger.error('Error generating embedding:', error);
    throw error;
  }
};

// Vector search function
const vectorSearch = async (query, options = {}) => {
  try {
    const {
      topK = 10,
      filter = {},
      includeMetadata = true,
      includeValues = false
    } = options;

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    
    // Get Pinecone index
    const index = await getIndex();
    
    // Perform vector search
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK,
      filter,
      includeMetadata,
      includeValues
    });

    return searchResponse;
  } catch (error) {
    logger.error('Error performing vector search:', error);
    throw error;
  }
};

// Upsert vectors to Pinecone
const upsertVectors = async (vectors) => {
  try {
    const index = await getIndex();
    
    const response = await index.upsert({
      vectors: vectors
    });

    logger.info(`Successfully upserted ${vectors.length} vectors`);
    return response;
  } catch (error) {
    logger.error('Error upserting vectors:', error);
    throw error;
  }
};

// Delete vectors from Pinecone
const deleteVectors = async (ids) => {
  try {
    const index = await getIndex();
    
    const response = await index.deleteMany({
      ids: ids
    });

    logger.info(`Successfully deleted ${ids.length} vectors`);
    return response;
  } catch (error) {
    logger.error('Error deleting vectors:', error);
    throw error;
  }
};

// Create embedding text for disease data
const createDiseaseEmbeddingText = (diseaseData) => {
  const {
    name_en,
    name_hi,
    scientific_name,
    description_en,
    description_hi,
    symptoms = [],
    treatments = [],
    crop_name
  } = diseaseData;

  const symptomText = symptoms.map(s => `${s.name_en} ${s.name_hi || ''}`).join(' ');
  const treatmentText = treatments.map(t => `${t.name_en} ${t.name_hi || ''}`).join(' ');

  return `
    Disease: ${name_en} (${name_hi || ''})
    Scientific Name: ${scientific_name}
    Description: ${description_en} ${description_hi || ''}
    Symptoms: ${symptomText}
    Treatments: ${treatmentText}
    Crop: ${crop_name || ''}
  `.trim();
};

// Create embedding text for farmer query
const createQueryEmbeddingText = (queryData) => {
  const {
    query_text,
    detected_crop,
    detected_disease,
    language
  } = queryData;

  return `
    Query: ${query_text}
    Language: ${language}
    Crop: ${detected_crop || ''}
    Disease: ${detected_disease || ''}
  `.trim();
};

module.exports = {
  initializePinecone,
  getIndex,
  generateEmbedding,
  vectorSearch,
  upsertVectors,
  deleteVectors,
  createDiseaseEmbeddingText,
  createQueryEmbeddingText,
  openai
};
