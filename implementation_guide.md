# Plant Health AI - Complete Implementation Guide

## 🚀 Quick Start

### 1. Database Setup

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb plant_health_ai

# Run schema
psql -U postgres -d plant_health_ai -f database_schema.sql
```

### 2. Vector Database Setup (Pinecone)

```bash
# Install Pinecone client
pip install pinecone-client

# Set up environment
export PINECONE_API_KEY="your_api_key"
export PINECONE_ENVIRONMENT="us-west1-gcp"
```

### 3. Python Dependencies

```bash
pip install -r requirements.txt
```

## 📊 Sample Data Examples

### Complete Disease Entry Example

```sql
-- Insert Rice Blast Disease with all related data
INSERT INTO diseases (category_id, scientific_name, common_name_en, common_name_hi, local_names, description_en, description_hi, causal_organism, severity_level, image_url) VALUES
(1, 'Magnaporthe oryzae', 'Rice Blast', 'चावल का ब्लास्ट', '{"te": "వరి బ్లాస్ట్", "bn": "ধান ব্লাস্ট", "ta": "அரிசி பிளாஸ்ட்"}', 
'Devastating fungal disease affecting rice plants worldwide, causing significant yield losses', 
'चावल के पौधों को प्रभावित करने वाला विनाशकारी फंगल रोग, जो दुनिया भर में महत्वपूर्ण उपज हानि का कारण बनता है', 
'Magnaporthe oryzae', 5, '/images/diseases/rice_blast.jpg');

-- Insert symptoms for Rice Blast
INSERT INTO symptoms (disease_id, name_en, name_hi, description_en, description_hi, symptom_type, severity_indicator, is_primary, display_order) VALUES
(1, 'Spindle-shaped lesions on leaves', 'पत्तों पर धुरी के आकार के घाव', 
'Elongated, spindle-shaped spots with gray centers and brown borders, 1-2 cm long', 
'ग्रे केंद्र और भूरे किनारों के साथ लम्बे, धुरी के आकार के धब्बे, 1-2 सेमी लंबे', 
'visual', 'early', true, 1),

(1, 'White to gray spots on panicles', 'पैनिकल्स पर सफेद से ग्रे धब्बे', 
'Discolored spots on rice panicles affecting grain formation and quality', 
'चावल के पैनिकल्स पर रंगहीन धब्बे जो अनाज के निर्माण और गुणवत्ता को प्रभावित करते हैं', 
'visual', 'moderate', true, 2),

(1, 'Stem rot at base', 'आधार पर तना सड़न', 
'Rotting of stem at the base of the plant, causing lodging', 
'पौधे के आधार पर तने का सड़ना, जिससे पौधा गिर जाता है', 
'visual', 'severe', false, 3);

-- Insert treatments for Rice Blast
INSERT INTO treatments (disease_id, category_id, name_en, name_hi, active_ingredient, formulation, concentration, dosage_en, dosage_hi, application_method, frequency_en, frequency_hi, safety_precautions_en, safety_precautions_hi, waiting_period_days, effectiveness_score, cost_per_unit, unit, product_links, is_organic) VALUES
(1, 1, 'Tricyclazole 75% WP', 'ट्राइसाइक्लाज़ोल 75% WP', 'Tricyclazole', 'WP', '75%', 
'1-2 grams per liter of water', 'पानी के प्रति लीटर 1-2 ग्राम', 
'Foliar spray during early morning hours', 'सुबह के समय पत्तों पर छिड़काव', 
'Apply at 10-15 day intervals starting from tillering stage', 'कल्ले निकलने की अवस्था से 10-15 दिन के अंतराल पर लगाएं', 
'Use protective gear, avoid during flowering, do not mix with alkaline solutions', 
'सुरक्षात्मक गियर का उपयोग करें, फूल के दौरान बचें, क्षारीय समाधान के साथ मिलाएं नहीं', 
21, 0.90, 380.00, 'g', 
'{"bighaat": "https://bighaat.com/tricyclazole-75-wp", "agriplex": "https://agriplex.in/tricyclazole", "amazon": "https://amazon.in/tricyclazole"}', 
false),

(1, 2, 'Neem Oil + Trichoderma', 'नीम तेल + ट्राइकोडर्मा', 'Azadirachtin + Trichoderma viride', 'Bio-formulation', '5% + 2%', 
'2-3 ml neem oil + 5g trichoderma per liter', 'प्रति लीटर 2-3 मिली नीम तेल + 5 ग्राम ट्राइकोडर्मा', 
'Soil drenching and foliar spray', 'मिट्टी में डालना और पत्तों पर छिड़काव', 
'Apply weekly during disease season', 'रोग के मौसम में साप्ताहिक लगाएं', 
'Safe for beneficial insects and environment', 'लाभकारी कीटों और पर्यावरण के लिए सुरक्षित', 
0, 0.75, 450.00, 'ml', 
'{"bighaat": "https://bighaat.com/neem-trichoderma", "organic_store": "https://organicstore.in/neem-trichoderma"}', 
true);
```

### Farmer Query Example

```sql
-- Sample farmer interaction
INSERT INTO farmer_queries (session_id, query_text, query_language, query_type, detected_crop, detected_disease, confidence_score, ai_response, response_language, response_time_ms, user_feedback) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
'मेरे चावल के पत्तों पर लंबे काले धब्बे आ रहे हैं, क्या करूं?', 
'hi', 'disease_identification', 'Rice', 'Rice Blast', 0.88, 
'आपके चावल में Rice Blast का लक्षण है। तुरंत Tricyclazole 75% WP (1-2 ग्राम प्रति लीटर) का उपयोग करें। सुबह के समय छिड़काव करें और 10-15 दिन के अंतराल पर दोहराएं। साथ ही नीम तेल + ट्राइकोडर्मा का भी उपयोग कर सकते हैं। ⚠️ सुरक्षात्मक गियर पहनें और स्थानीय कृषि विशेषज्ञ से सलाह लें।', 
'hi', 1200, 'helpful');
```

## 🔍 Search Examples

### 1. Text Search Queries

```sql
-- Search diseases by symptoms (using full-text search)
SELECT d.common_name_en, d.common_name_hi, s.name_en as symptom
FROM diseases d
JOIN symptoms s ON d.id = s.disease_id
WHERE to_tsvector('english', s.name_en || ' ' || s.description_en) 
      @@ plainto_tsquery('english', 'black spots leaves');

-- Search in Hindi
SELECT d.common_name_en, d.common_name_hi, s.name_hi as symptom
FROM diseases d
JOIN symptoms s ON d.id = s.disease_id
WHERE to_tsvector('hindi', s.name_hi || ' ' || s.description_hi) 
      @@ plainto_tsquery('hindi', 'काले धब्बे पत्ते');
```

### 2. Vector Search Examples

```python
# Python code for vector search
import pinecone
from openai import OpenAI

def search_diseases_by_symptoms(query_text, language='en'):
    # Generate embedding
    client = OpenAI()
    response = client.embeddings.create(
        input=query_text,
        model="text-embedding-ada-002"
    )
    query_embedding = response.data[0].embedding
    
    # Search in Pinecone
    pinecone.init(api_key="your_key", environment="us-west1-gcp")
    index = pinecone.Index("plant-health-ai")
    
    results = index.query(
        vector=query_embedding,
        top_k=10,
        include_metadata=True,
        filter={"language": language}
    )
    
    return results

# Example usage
results = search_diseases_by_symptoms("tomato leaves turning yellow with spots")
print(f"Found {len(results['matches'])} similar diseases")
```

### 3. Hybrid Search Implementation

```python
def hybrid_disease_search(query_text, language='en', region=None):
    """
    Combine vector search with PostgreSQL filtering
    """
    # Step 1: Vector search for semantic similarity
    vector_results = search_diseases_by_symptoms(query_text, language)
    
    # Step 2: Get disease IDs
    disease_ids = [match['metadata']['disease_id'] for match in vector_results['matches']]
    
    # Step 3: Detailed PostgreSQL query
    detailed_query = """
        SELECT 
            d.id,
            d.common_name_en,
            d.common_name_hi,
            d.scientific_name,
            d.severity_level,
            c.common_name_en as crop_name,
            array_agg(DISTINCT s.name_en) as symptoms,
            array_agg(DISTINCT t.name_en) as treatments,
            array_agg(DISTINCT t.is_organic) as organic_treatments
        FROM diseases d
        JOIN crop_diseases cd ON d.id = cd.disease_id
        JOIN crops c ON cd.crop_id = c.id
        LEFT JOIN symptoms s ON d.id = s.disease_id AND s.is_active = true
        LEFT JOIN treatments t ON d.id = t.disease_id AND t.is_approved = true
        WHERE d.id = ANY(%s)
        GROUP BY d.id, c.common_name_en
        ORDER BY array_position(%s, d.id)
    """
    
    # Execute query
    results = db.execute(detailed_query, (disease_ids, disease_ids))
    
    return results
```

## 🤖 AI Agent Integration

### 1. Response Generation

```python
def generate_ai_response(farmer_query, session_context=None):
    """
    Generate contextual AI response using database and vector search
    """
    # Detect language
    language = detect_language(farmer_query)
    
    # Find similar cases
    similar_queries = find_similar_farmer_queries(farmer_query, language)
    
    # Get disease information
    disease_info = hybrid_disease_search(farmer_query, language)
    
    # Build context
    context = {
        "query": farmer_query,
        "language": language,
        "similar_cases": similar_queries,
        "disease_info": disease_info,
        "session_history": session_context
    }
    
    # Generate response using LLM
    response = generate_llm_response(context)
    
    # Store interaction
    store_farmer_interaction(farmer_query, response, context)
    
    return response

def generate_llm_response(context):
    """
    Generate response using OpenAI GPT or similar
    """
    prompt = f"""
    You are an AI agricultural expert helping Indian farmers. 
    
    Farmer Query: {context['query']}
    Language: {context['language']}
    
    Disease Information: {context['disease_info']}
    Similar Cases: {context['similar_cases']}
    
    Provide a helpful, accurate response in {context['language']} that includes:
    1. Disease identification
    2. Treatment recommendations (both chemical and organic)
    3. Dosage and application instructions
    4. Safety precautions
    5. When to consult local experts
    
    Be conversational and use simple language that farmers can understand.
    """
    
    # Call OpenAI API
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.7
    )
    
    return response.choices[0].message.content
```

### 2. Voice Integration

```python
def process_voice_query(audio_file, language='hi'):
    """
    Process voice query and generate response
    """
    # Convert speech to text
    transcript = speech_to_text(audio_file, language)
    
    # Generate AI response
    response = generate_ai_response(transcript)
    
    # Convert response to speech
    audio_response = text_to_speech(response, language)
    
    return {
        "transcript": transcript,
        "response": response,
        "audio_response": audio_response
    }
```

## 📱 Frontend Integration

### 1. JavaScript API Calls

```javascript
// Search diseases
async function searchDiseases(query, language = 'en') {
    const response = await fetch('/api/search/diseases', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            language: language
        })
    });
    
    return await response.json();
}

// AI Agent interaction
async function askAI(question, sessionId) {
    const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: question,
            session_id: sessionId
        })
    });
    
    return await response.json();
}

// Voice query processing
async function processVoiceQuery(audioBlob, language = 'hi') {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);
    
    const response = await fetch('/api/voice/process', {
        method: 'POST',
        body: formData
    });
    
    return await response.json();
}
```

### 2. Real-time Updates

```javascript
// WebSocket for real-time AI responses
const socket = new WebSocket('ws://localhost:8000/ws');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'ai_response') {
        displayAIResponse(data.response);
        speakResponse(data.response, data.language);
    }
};

function sendQuery(query) {
    socket.send(JSON.stringify({
        type: 'farmer_query',
        query: query,
        session_id: getSessionId()
    }));
}
```

## 🔧 Performance Optimization

### 1. Database Indexing

```sql
-- Create additional indexes for better performance
CREATE INDEX CONCURRENTLY idx_diseases_severity ON diseases(severity_level);
CREATE INDEX CONCURRENTLY idx_treatments_organic ON treatments(is_organic);
CREATE INDEX CONCURRENTLY idx_treatments_effectiveness ON treatments(effectiveness_score DESC);
CREATE INDEX CONCURRENTLY idx_farmer_queries_feedback ON farmer_queries(user_feedback) WHERE user_feedback IS NOT NULL;

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY idx_active_diseases ON diseases(id) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_approved_treatments ON treatments(id) WHERE is_approved = true;
```

### 2. Caching Strategy

```python
# Redis caching for frequent queries
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cached_disease_search(query, language='en'):
    cache_key = f"disease_search:{hash(query)}:{language}"
    
    # Check cache
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Perform search
    results = hybrid_disease_search(query, language)
    
    # Cache for 1 hour
    redis_client.setex(cache_key, 3600, json.dumps(results))
    
    return results
```

### 3. Batch Processing

```python
def batch_update_embeddings():
    """
    Update embeddings in batches for better performance
    """
    # Get diseases that need embedding updates
    diseases = db.query("""
        SELECT d.*, c.common_name_en as crop_name,
               string_agg(s.name_en, ' ') as symptoms,
               string_agg(t.name_en, ' ') as treatments
        FROM diseases d
        JOIN crop_diseases cd ON d.id = cd.disease_id
        JOIN crops c ON cd.crop_id = c.id
        LEFT JOIN symptoms s ON d.id = s.disease_id
        LEFT JOIN treatments t ON d.id = t.disease_id
        WHERE d.updated_at > COALESCE(d.last_embedding_update, '1900-01-01')
        GROUP BY d.id, c.common_name_en
    """)
    
    # Process in batches
    batch_size = 100
    for i in range(0, len(diseases), batch_size):
        batch = diseases[i:i+batch_size]
        update_batch_embeddings(batch)
        
        # Update last_embedding_update timestamp
        disease_ids = [d['id'] for d in batch]
        db.execute("""
            UPDATE diseases 
            SET last_embedding_update = NOW() 
            WHERE id = ANY(%s)
        """, (disease_ids,))
```

## 📊 Analytics and Monitoring

### 1. Query Analytics

```sql
-- Most searched diseases
SELECT 
    detected_disease,
    query_language,
    COUNT(*) as search_count,
    AVG(confidence_score) as avg_confidence,
    COUNT(CASE WHEN user_feedback = 'helpful' THEN 1 END) as helpful_count
FROM farmer_queries 
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY detected_disease, query_language
ORDER BY search_count DESC;

-- Treatment effectiveness analysis
SELECT 
    t.name_en as treatment,
    t.is_organic,
    AVG(t.effectiveness_score) as avg_effectiveness,
    COUNT(fq.id) as usage_count,
    COUNT(CASE WHEN fq.user_feedback = 'helpful' THEN 1 END) as helpful_count
FROM treatments t
JOIN diseases d ON t.disease_id = d.id
LEFT JOIN farmer_queries fq ON d.common_name_en = fq.detected_disease
WHERE t.is_approved = true
GROUP BY t.id, t.name_en, t.is_organic
ORDER BY avg_effectiveness DESC;
```

### 2. Performance Monitoring

```python
def monitor_system_performance():
    """
    Monitor system performance metrics
    """
    metrics = {
        "database_queries_per_second": get_db_query_rate(),
        "vector_search_latency": get_vector_search_latency(),
        "ai_response_time": get_ai_response_time(),
        "cache_hit_rate": get_cache_hit_rate(),
        "user_satisfaction": get_user_satisfaction_score(),
        "error_rate": get_error_rate()
    }
    
    # Store in monitoring system
    store_metrics(metrics)
    
    # Alert if metrics are poor
    if metrics["ai_response_time"] > 5000:  # 5 seconds
        send_alert("AI response time is too high")
    
    if metrics["user_satisfaction"] < 0.7:  # 70%
        send_alert("User satisfaction is below threshold")
```

## 🚀 Deployment

### 1. Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/plant_health_ai
      - REDIS_URL=redis://redis:6379
      - PINECONE_API_KEY=${PINECONE_API_KEY}
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=plant_health_ai
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Environment Configuration

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/plant_health_ai
REDIS_URL=redis://localhost:6379
PINECONE_API_KEY=your_pinecone_api_key
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key
DEBUG=False
```

## 📈 Scaling Considerations

### 1. Database Scaling

```sql
-- Read replicas for better performance
-- Partition large tables by date
CREATE TABLE farmer_queries_2024 PARTITION OF farmer_queries
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Connection pooling
-- Use PgBouncer for connection management
```

### 2. Vector Database Scaling

```python
# Scale Pinecone index
def scale_pinecone_index():
    pinecone.configure_index(
        index_name="plant-health-ai",
        replicas=3,  # Increase replicas for better performance
        pod_type="p1.x2"  # Upgrade pod type for more capacity
    )
```

### 3. Caching Strategy

```python
# Multi-level caching
def get_cached_response(query):
    # Level 1: In-memory cache
    if query in memory_cache:
        return memory_cache[query]
    
    # Level 2: Redis cache
    cached = redis_client.get(f"query:{hash(query)}")
    if cached:
        memory_cache[query] = json.loads(cached)
        return memory_cache[query]
    
    # Level 3: Database/Vector search
    result = perform_search(query)
    
    # Cache at all levels
    memory_cache[query] = result
    redis_client.setex(f"query:{hash(query)}", 3600, json.dumps(result))
    
    return result
```

This implementation guide provides everything needed to build a production-ready Plant Health AI system with comprehensive database design, vector search capabilities, and AI agent integration.
