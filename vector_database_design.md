# Vector Database Design for Plant Health AI

## Overview
This document outlines the vector database schema for semantic search and AI agent functionality in the Plant Health AI system. We'll use a hybrid approach combining PostgreSQL for structured data with a vector database for embeddings.

## Recommended Vector Database: Pinecone
**Why Pinecone?**
- Managed service with high availability
- Excellent performance for agricultural domain
- Easy integration with AI models
- Cost-effective for production use
- Built-in filtering and metadata support

## Alternative Options
1. **Weaviate** - Open source, good for self-hosting
2. **FAISS** - Facebook's library, good for on-premise
3. **Chroma** - Lightweight, good for development
4. **Qdrant** - High performance, good for large scale

## Vector Database Schema Design

### 1. Disease Knowledge Base Collection

```json
{
  "collection_name": "disease_knowledge",
  "dimensions": 1536, // OpenAI embedding dimensions
  "metric": "cosine",
  "metadata_config": {
    "disease_id": "integer",
    "crop_id": "integer", 
    "disease_name_en": "text",
    "disease_name_hi": "text",
    "symptom_text": "text",
    "treatment_text": "text",
    "severity_level": "integer",
    "language": "text",
    "region": "text",
    "is_organic": "boolean",
    "effectiveness_score": "float"
  }
}
```

### 2. Farmer Query Patterns Collection

```json
{
  "collection_name": "farmer_queries",
  "dimensions": 1536,
  "metric": "cosine", 
  "metadata_config": {
    "query_id": "integer",
    "session_id": "text",
    "query_text": "text",
    "query_language": "text",
    "detected_crop": "text",
    "detected_disease": "text",
    "user_feedback": "text",
    "response_helpfulness": "float",
    "region": "text",
    "timestamp": "datetime"
  }
}
```

### 3. Treatment Recommendations Collection

```json
{
  "collection_name": "treatment_recommendations",
  "dimensions": 1536,
  "metric": "cosine",
  "metadata_config": {
    "treatment_id": "integer",
    "disease_id": "integer",
    "treatment_name_en": "text",
    "treatment_name_hi": "text",
    "active_ingredient": "text",
    "dosage_text": "text",
    "safety_notes": "text",
    "is_organic": "boolean",
    "cost_per_unit": "float",
    "effectiveness_score": "float",
    "waiting_period": "integer"
  }
}
```

## Embedding Generation Strategy

### 1. Text Preprocessing Pipeline

```python
def preprocess_text_for_embedding(text, language='en'):
    """
    Preprocess text for better embedding quality
    """
    # Remove special characters but keep Hindi/regional text
    # Normalize whitespace
    # Handle transliterations
    # Add domain-specific context
    pass

def create_embedding_text(disease_data):
    """
    Create comprehensive text for embedding
    """
    embedding_text = f"""
    Disease: {disease_data['name_en']} ({disease_data['name_hi']})
    Scientific Name: {disease_data['scientific_name']}
    Symptoms: {disease_data['symptoms']}
    Treatment: {disease_data['treatments']}
    Crop: {disease_data['crop_name']}
    Region: {disease_data['region']}
    Severity: {disease_data['severity']}
    """
    return embedding_text
```

### 2. Multi-Language Embedding Strategy

```python
# For Hindi and regional languages
def create_multilingual_embeddings(text_data):
    embeddings = {}
    
    # English embedding
    embeddings['en'] = openai_embedding(text_data['en'])
    
    # Hindi embedding  
    embeddings['hi'] = openai_embedding(text_data['hi'])
    
    # Combined embedding for better cross-language search
    combined_text = f"{text_data['en']} {text_data['hi']}"
    embeddings['combined'] = openai_embedding(combined_text)
    
    return embeddings
```

## Vector Search Implementation

### 1. Semantic Disease Search

```python
def search_diseases_by_symptoms(query_text, language='en', top_k=10):
    """
    Search diseases using symptom descriptions
    """
    # Generate query embedding
    query_embedding = generate_embedding(query_text)
    
    # Search in vector database
    results = pinecone.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        filter={
            "language": language,
            "severity_level": {"$gte": 1}
        }
    )
    
    return results

def search_treatments_by_disease(disease_name, organic_preference=False):
    """
    Find treatments for specific disease
    """
    query_embedding = generate_embedding(f"treatment for {disease_name}")
    
    filter_dict = {"disease_name_en": disease_name}
    if organic_preference:
        filter_dict["is_organic"] = True
    
    results = pinecone.query(
        vector=query_embedding,
        top_k=5,
        include_metadata=True,
        filter=filter_dict
    )
    
    return results
```

### 2. Farmer Query Similarity Search

```python
def find_similar_farmer_queries(query_text, region=None):
    """
    Find similar queries from other farmers for context
    """
    query_embedding = generate_embedding(query_text)
    
    filter_dict = {}
    if region:
        filter_dict["region"] = region
    
    results = pinecone.query(
        vector=query_embedding,
        top_k=5,
        include_metadata=True,
        filter=filter_dict
    )
    
    return results
```

## Integration with PostgreSQL

### 1. Hybrid Search Function

```python
def hybrid_search(query_text, language='en', region=None):
    """
    Combine vector search with PostgreSQL filtering
    """
    # Step 1: Vector search for semantic similarity
    vector_results = search_diseases_by_symptoms(query_text, language)
    
    # Step 2: Extract IDs for PostgreSQL query
    disease_ids = [result['metadata']['disease_id'] for result in vector_results]
    
    # Step 3: Get detailed information from PostgreSQL
    detailed_results = db.query("""
        SELECT d.*, c.common_name_en as crop_name, 
               array_agg(s.name_en) as symptoms,
               array_agg(t.name_en) as treatments
        FROM diseases d
        JOIN crop_diseases cd ON d.id = cd.disease_id
        JOIN crops c ON cd.crop_id = c.id
        LEFT JOIN symptoms s ON d.id = s.disease_id
        LEFT JOIN treatments t ON d.id = t.disease_id
        WHERE d.id = ANY(%s)
        GROUP BY d.id, c.common_name_en
        ORDER BY array_position(%s, d.id)
    """, (disease_ids, disease_ids))
    
    return detailed_results
```

### 2. Real-time Embedding Updates

```python
def update_disease_embeddings(disease_id):
    """
    Update embeddings when disease data changes
    """
    # Get updated disease data from PostgreSQL
    disease_data = db.query("""
        SELECT d.*, c.common_name_en as crop_name,
               string_agg(s.name_en, ' ') as symptoms,
               string_agg(t.name_en, ' ') as treatments
        FROM diseases d
        JOIN crop_diseases cd ON d.id = cd.disease_id
        JOIN crops c ON cd.crop_id = c.id
        LEFT JOIN symptoms s ON d.id = s.disease_id
        LEFT JOIN treatments t ON d.id = t.disease_id
        WHERE d.id = %s
        GROUP BY d.id, c.common_name_en
    """, (disease_id,))
    
    # Generate new embeddings
    embedding_text = create_embedding_text(disease_data)
    embedding = generate_embedding(embedding_text)
    
    # Update in Pinecone
    pinecone.upsert(
        vectors=[{
            "id": f"disease_{disease_id}",
            "values": embedding,
            "metadata": {
                "disease_id": disease_id,
                "crop_id": disease_data['crop_id'],
                "disease_name_en": disease_data['common_name_en'],
                "disease_name_hi": disease_data['common_name_hi'],
                "symptom_text": disease_data['symptoms'],
                "treatment_text": disease_data['treatments'],
                "language": "combined"
            }
        }]
    )
```

## AI Agent Integration

### 1. Context-Aware Response Generation

```python
def generate_ai_response(farmer_query, session_context=None):
    """
    Generate AI response using vector search for context
    """
    # Find similar queries and successful responses
    similar_queries = find_similar_farmer_queries(farmer_query)
    
    # Get relevant disease information
    disease_info = search_diseases_by_symptoms(farmer_query)
    
    # Build context for AI model
    context = {
        "similar_cases": similar_queries,
        "disease_info": disease_info,
        "session_history": session_context
    }
    
    # Generate response using LLM with context
    response = llm.generate_response(farmer_query, context)
    
    # Store query-response pair for future learning
    store_farmer_interaction(farmer_query, response, context)
    
    return response
```

### 2. Continuous Learning Pipeline

```python
def update_ai_knowledge_base():
    """
    Regularly update embeddings and improve AI responses
    """
    # Get new farmer queries with feedback
    new_queries = db.query("""
        SELECT * FROM farmer_queries 
        WHERE user_feedback IS NOT NULL 
        AND created_at > NOW() - INTERVAL '7 days'
    """)
    
    # Update embeddings for successful interactions
    for query in new_queries:
        if query['user_feedback'] == 'helpful':
            update_query_embedding(query)
    
    # Retrain AI model with new data
    retrain_ai_model(new_queries)
```

## Performance Optimization

### 1. Caching Strategy

```python
# Redis cache for frequent queries
def cached_vector_search(query_text, language='en'):
    cache_key = f"vector_search:{hash(query_text)}:{language}"
    
    # Check cache first
    cached_result = redis.get(cache_key)
    if cached_result:
        return json.loads(cached_result)
    
    # Perform vector search
    result = search_diseases_by_symptoms(query_text, language)
    
    # Cache for 1 hour
    redis.setex(cache_key, 3600, json.dumps(result))
    
    return result
```

### 2. Batch Processing

```python
def batch_update_embeddings():
    """
    Batch update embeddings for better performance
    """
    # Get all diseases that need embedding updates
    diseases = db.query("""
        SELECT d.* FROM diseases d
        WHERE d.updated_at > d.last_embedding_update
        OR d.last_embedding_update IS NULL
    """)
    
    # Process in batches of 100
    batch_size = 100
    for i in range(0, len(diseases), batch_size):
        batch = diseases[i:i+batch_size]
        update_batch_embeddings(batch)
```

## Monitoring and Analytics

### 1. Search Performance Metrics

```python
def track_search_metrics():
    """
    Track vector search performance
    """
    metrics = {
        "search_latency": measure_search_time(),
        "result_relevance": calculate_relevance_score(),
        "user_satisfaction": get_feedback_scores(),
        "cache_hit_rate": get_cache_statistics()
    }
    
    # Store in analytics database
    store_analytics(metrics)
```

### 2. Embedding Quality Assessment

```python
def assess_embedding_quality():
    """
    Assess quality of embeddings using test queries
    """
    test_queries = [
        "tomato leaves turning yellow",
        "चावल में काले धब्बे",
        "wheat rust treatment"
    ]
    
    for query in test_queries:
        results = search_diseases_by_symptoms(query)
        relevance_score = calculate_relevance(query, results)
        print(f"Query: {query}, Relevance: {relevance_score}")
```

## Deployment Configuration

### 1. Pinecone Configuration

```yaml
# pinecone_config.yaml
pinecone:
  api_key: "${PINECONE_API_KEY}"
  environment: "us-west1-gcp"
  index_name: "plant-health-ai"
  dimension: 1536
  metric: "cosine"
  pods: 1
  replicas: 1
  pod_type: "p1.x1"
```

### 2. Environment Variables

```bash
# .env
PINECONE_API_KEY=your_pinecone_api_key
OPENAI_API_KEY=your_openai_api_key
POSTGRES_URL=postgresql://user:pass@localhost/plant_health_db
REDIS_URL=redis://localhost:6379
```

## Cost Estimation

### Pinecone Costs (Monthly)
- **Starter Plan**: $70/month for 1M vectors
- **Production Plan**: $200/month for 5M vectors
- **Enterprise**: Custom pricing for large scale

### Alternative: Self-hosted FAISS
- **Server Costs**: $100-500/month depending on scale
- **Maintenance**: Requires DevOps expertise
- **Scalability**: Manual scaling required

## Conclusion

This vector database design provides:

1. **Semantic Search**: Find diseases by symptoms, not just keywords
2. **Multilingual Support**: Hindi, English, and regional language queries
3. **Context Awareness**: Learn from farmer interactions
4. **Scalability**: Handle millions of queries efficiently
5. **Cost Effectiveness**: Optimized for agricultural domain

The hybrid approach combines the best of both worlds: structured data in PostgreSQL and semantic search in vector databases.
