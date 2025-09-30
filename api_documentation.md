# Plant Health AI - API Documentation

## Overview
This document describes the REST API endpoints for the Plant Health AI system, including disease identification, treatment recommendations, and AI agent interactions.

## Base URL
```
Production: https://plant-health-ai.com/api/v1
Development: http://localhost:8000/api/v1
```

## Authentication
```http
Authorization: Bearer <your_api_token>
```

## Response Format
All responses follow this format:
```json
{
  "success": true,
  "data": {...},
  "message": "Success message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Format
```json
{
  "success": false,
  "error": {
    "code": "DISEASE_NOT_FOUND",
    "message": "Disease not found",
    "details": {...}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔍 Search Endpoints

### Search Diseases
Search for diseases by symptoms, crop, or description.

```http
POST /search/diseases
```

**Request Body:**
```json
{
  "query": "tomato leaves turning yellow with spots",
  "language": "en",
  "region": "north",
  "limit": 10,
  "include_treatments": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "diseases": [
      {
        "id": 1,
        "name_en": "Late Blight",
        "name_hi": "लेट ब्लाइट",
        "scientific_name": "Phytophthora infestans",
        "severity_level": 4,
        "symptoms": [
          {
            "name_en": "Dark water-soaked lesions",
            "name_hi": "काले पानी से भरे घाव",
            "description_en": "Dark spots that appear water-soaked",
            "is_primary": true
          }
        ],
        "treatments": [
          {
            "name_en": "Chlorothalonil 75% WP",
            "name_hi": "क्लोरोथैलोनिल 75% WP",
            "is_organic": false,
            "effectiveness_score": 0.80,
            "dosage_en": "2-3 grams per liter",
            "dosage_hi": "प्रति लीटर 2-3 ग्राम"
          }
        ],
        "similarity_score": 0.92
      }
    ],
    "total_count": 1,
    "search_time_ms": 150
  }
}
```

### Search Treatments
Find treatments for specific diseases.

```http
POST /search/treatments
```

**Request Body:**
```json
{
  "disease_id": 1,
  "organic_only": false,
  "language": "hi",
  "region": "punjab"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "treatments": [
      {
        "id": 1,
        "name_en": "Chlorothalonil 75% WP",
        "name_hi": "क्लोरोथैलोनिल 75% WP",
        "active_ingredient": "Chlorothalonil",
        "formulation": "WP",
        "concentration": "75%",
        "dosage_en": "2-3 grams per liter of water",
        "dosage_hi": "पानी के प्रति लीटर 2-3 ग्राम",
        "application_method": "Foliar spray",
        "frequency_en": "Apply every 7-10 days",
        "frequency_hi": "हर 7-10 दिन में लगाएं",
        "safety_precautions_en": "Avoid contact with skin and eyes",
        "safety_precautions_hi": "त्वचा और आंखों के संपर्क से बचें",
        "waiting_period_days": 14,
        "effectiveness_score": 0.80,
        "cost_per_unit": 380.00,
        "unit": "g",
        "is_organic": false,
        "product_links": {
          "bighaat": "https://bighaat.com/chlorothalonil",
          "agriplex": "https://agriplex.in/chlorothalonil"
        }
      }
    ]
  }
}
```

---

## 🤖 AI Agent Endpoints

### Ask AI Agent
Send a question to the AI agent and get a response.

```http
POST /ai/ask
```

**Request Body:**
```json
{
  "question": "मेरे टमाटर के पत्तों पर काले धब्बे आ रहे हैं",
  "language": "hi",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "include_voice": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "आपके टमाटर में Late Blight का लक्षण है। तुरंत Chlorothalonil 75% WP (2-3 ग्राम प्रति लीटर) का उपयोग करें। सुबह के समय छिड़काव करें और 10-15 दिन के अंतराल पर दोहराएं। ⚠️ सुरक्षात्मक गियर पहनें और स्थानीय कृषि विशेषज्ञ से सलाह लें।",
    "language": "hi",
    "detected_crop": "Tomato",
    "detected_disease": "Late Blight",
    "confidence_score": 0.88,
    "response_time_ms": 1200,
    "voice_url": "https://api.plant-health-ai.com/audio/response_123.mp3",
    "suggested_actions": [
      {
        "action": "apply_treatment",
        "treatment_id": 1,
        "priority": "high"
      },
      {
        "action": "consult_expert",
        "reason": "Chemical treatment requires expert guidance"
      }
    ]
  }
}
```

### Voice Query Processing
Process voice queries and return text and audio responses.

```http
POST /ai/voice/process
```

**Request:**
- Content-Type: `multipart/form-data`
- Body: `audio` file (WAV, MP3, M4A)
- Form data: `language` (optional, defaults to 'hi')

**Response:**
```json
{
  "success": true,
  "data": {
    "transcript": "मेरे चावल में काले धब्बे आ रहे हैं",
    "language": "hi",
    "response": "आपके चावल में Rice Blast का लक्षण है...",
    "audio_response_url": "https://api.plant-health-ai.com/audio/response_456.mp3",
    "confidence_score": 0.85
  }
}
```

### Get Conversation History
Retrieve conversation history for a session.

```http
GET /ai/conversation/{session_id}
```

**Query Parameters:**
- `limit`: Number of messages to return (default: 50)
- `offset`: Offset for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "messages": [
      {
        "id": 1,
        "type": "user",
        "content": "मेरे टमाटर के पत्तों पर काले धब्बे आ रहे हैं",
        "timestamp": "2024-01-15T10:30:00Z",
        "language": "hi"
      },
      {
        "id": 2,
        "type": "agent",
        "content": "आपके टमाटर में Late Blight का लक्षण है...",
        "timestamp": "2024-01-15T10:30:02Z",
        "language": "hi",
        "confidence_score": 0.88
      }
    ],
    "total_count": 2
  }
}
```

---

## 📊 Data Endpoints

### Get Disease Details
Get detailed information about a specific disease.

```http
GET /diseases/{disease_id}
```

**Query Parameters:**
- `language`: Response language (default: 'en')
- `include_treatments`: Include treatment information (default: true)
- `include_symptoms`: Include symptom information (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "scientific_name": "Phytophthora infestans",
    "common_name_en": "Late Blight",
    "common_name_hi": "लेट ब्लाइट",
    "local_names": {
      "te": "లేట్ బ్లైట్",
      "bn": "লেট ব্লাইট"
    },
    "description_en": "Serious fungal disease affecting tomatoes and potatoes",
    "description_hi": "टमाटर और आलू को प्रभावित करने वाला गंभीर फंगल रोग",
    "causal_organism": "Phytophthora infestans",
    "severity_level": 4,
    "economic_impact": "Can cause 50-80% yield loss if not treated",
    "image_url": "/images/diseases/late_blight.jpg",
    "category": {
      "id": 1,
      "name_en": "Fungal Diseases",
      "name_hi": "फंगल रोग"
    },
    "affected_crops": [
      {
        "id": 3,
        "name_en": "Tomato",
        "name_hi": "टमाटर",
        "prevalence_score": 0.75
      }
    ],
    "symptoms": [
      {
        "id": 1,
        "name_en": "Dark water-soaked lesions",
        "name_hi": "काले पानी से भरे घाव",
        "description_en": "Dark spots that appear water-soaked on leaves",
        "description_hi": "पत्तों पर काले धब्बे जो पानी से भरे दिखते हैं",
        "symptom_type": "visual",
        "severity_indicator": "early",
        "is_primary": true,
        "image_url": "/images/symptoms/dark_lesions.jpg"
      }
    ],
    "treatments": [
      {
        "id": 1,
        "name_en": "Chlorothalonil 75% WP",
        "name_hi": "क्लोरोथैलोनिल 75% WP",
        "category": {
          "name_en": "Chemical Fungicides",
          "name_hi": "रासायनिक कवकनाशी"
        },
        "active_ingredient": "Chlorothalonil",
        "formulation": "WP",
        "concentration": "75%",
        "dosage_en": "2-3 grams per liter of water",
        "dosage_hi": "पानी के प्रति लीटर 2-3 ग्राम",
        "application_method": "Foliar spray",
        "frequency_en": "Apply every 7-10 days",
        "frequency_hi": "हर 7-10 दिन में लगाएं",
        "safety_precautions_en": "Avoid contact with skin and eyes",
        "safety_precautions_hi": "त्वचा और आंखों के संपर्क से बचें",
        "waiting_period_days": 14,
        "effectiveness_score": 0.80,
        "cost_per_unit": 380.00,
        "unit": "g",
        "is_organic": false,
        "product_links": {
          "bighaat": "https://bighaat.com/chlorothalonil",
          "agriplex": "https://agriplex.in/chlorothalonil"
        }
      }
    ]
  }
}
```

### Get Crop Information
Get information about crops and their common diseases.

```http
GET /crops/{crop_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "scientific_name": "Solanum lycopersicum",
    "common_name_en": "Tomato",
    "common_name_hi": "टमाटर",
    "local_names": {
      "te": "టమాట",
      "bn": "টমেটো"
    },
    "description_en": "Popular vegetable crop, rich in vitamins",
    "description_hi": "लोकप्रिय सब्जी फसल, विटामिन से भरपूर",
    "growing_season": "Year-round",
    "climate_requirements": "Warm climate, 20-30°C",
    "soil_requirements": "Well-drained, fertile soil",
    "image_url": "/images/crops/tomato.jpg",
    "category": {
      "id": 2,
      "name_en": "Vegetables",
      "name_hi": "सब्जियां"
    },
    "common_diseases": [
      {
        "id": 2,
        "name_en": "Late Blight",
        "name_hi": "लेट ब्लाइट",
        "prevalence_score": 0.75,
        "severity_level": 4
      }
    ]
  }
}
```

---

## 📈 Analytics Endpoints

### Get Search Trends
Get popular search queries and trends.

```http
GET /analytics/trends
```

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d, 1y)
- `language`: Filter by language
- `region`: Filter by region
- `limit`: Number of results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "query": "tomato disease",
        "language": "en",
        "search_count": 150,
        "trend_score": 8.5,
        "last_searched": "2024-01-15T10:30:00Z"
      },
      {
        "query": "चावल का रोग",
        "language": "hi",
        "search_count": 200,
        "trend_score": 9.2,
        "last_searched": "2024-01-15T09:45:00Z"
      }
    ],
    "period": "30d",
    "total_searches": 15420
  }
}
```

### Get User Feedback
Get user feedback statistics.

```http
GET /analytics/feedback
```

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d)
- `disease_id`: Filter by disease
- `treatment_id`: Filter by treatment

**Response:**
```json
{
  "success": true,
  "data": {
    "total_responses": 1250,
    "feedback_distribution": {
      "helpful": 850,
      "not_helpful": 200,
      "partially_helpful": 200
    },
    "satisfaction_rate": 0.68,
    "average_confidence": 0.82,
    "top_helpful_responses": [
      {
        "disease": "Rice Blast",
        "treatment": "Tricyclazole 75% WP",
        "helpfulness_rate": 0.92
      }
    ]
  }
}
```

---

## 🔧 Utility Endpoints

### Health Check
Check API health and status.

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "database": "connected",
    "vector_db": "connected",
    "ai_service": "operational",
    "uptime": "5d 12h 30m",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Get Supported Languages
Get list of supported languages.

```http
GET /languages
```

**Response:**
```json
{
  "success": true,
  "data": {
    "languages": [
      {
        "code": "en",
        "name": "English",
        "native_name": "English",
        "is_active": true
      },
      {
        "code": "hi",
        "name": "Hindi",
        "native_name": "हिंदी",
        "is_active": true
      },
      {
        "code": "te",
        "name": "Telugu",
        "native_name": "తెలుగు",
        "is_active": true
      }
    ]
  }
}
```

### Get Regions
Get list of supported regions.

```http
GET /regions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "regions": [
      {
        "id": 1,
        "name_en": "Punjab",
        "name_hi": "पंजाब",
        "state_code": "PB",
        "climate_zone": "Semi-arid",
        "soil_type": "Alluvial"
      },
      {
        "id": 2,
        "name_en": "Tamil Nadu",
        "name_hi": "तमिलनाडु",
        "state_code": "TN",
        "climate_zone": "Tropical",
        "soil_type": "Red and Black"
      }
    ]
  }
}
```

---

## 🚨 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `DISEASE_NOT_FOUND` | 404 | Disease not found |
| `TREATMENT_NOT_FOUND` | 404 | Treatment not found |
| `CROP_NOT_FOUND` | 404 | Crop not found |
| `INVALID_LANGUAGE` | 400 | Unsupported language |
| `INVALID_REGION` | 400 | Unsupported region |
| `QUERY_TOO_SHORT` | 400 | Query text too short |
| `QUERY_TOO_LONG` | 400 | Query text too long |
| `AUDIO_FORMAT_NOT_SUPPORTED` | 400 | Unsupported audio format |
| `AUDIO_TOO_LARGE` | 400 | Audio file too large |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `AUTHENTICATION_FAILED` | 401 | Invalid API key |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |
| `DATABASE_ERROR` | 500 | Database connection error |
| `VECTOR_DB_ERROR` | 500 | Vector database error |
| `AI_SERVICE_ERROR` | 500 | AI service unavailable |

---

## 📝 Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Search endpoints | 100 requests | 1 hour |
| AI agent endpoints | 50 requests | 1 hour |
| Voice processing | 20 requests | 1 hour |
| Data endpoints | 200 requests | 1 hour |
| Analytics endpoints | 10 requests | 1 hour |

---

## 🔐 Authentication

### API Key Authentication
Include your API key in the Authorization header:

```http
Authorization: Bearer your_api_key_here
```

### Getting an API Key
1. Register at https://plant-health-ai.com/register
2. Verify your email
3. Generate API key from dashboard
4. Use key in Authorization header

### API Key Permissions
- **Free Tier**: 100 requests/day
- **Pro Tier**: 1000 requests/day
- **Enterprise**: Unlimited requests

---

## 📚 SDKs and Libraries

### Python SDK
```bash
pip install plant-health-ai
```

```python
from plant_health_ai import PlantHealthAI

client = PlantHealthAI(api_key="your_api_key")

# Search diseases
diseases = client.search_diseases("tomato leaves yellow spots")

# Ask AI agent
response = client.ask_ai("मेरे टमाटर में क्या रोग है?")
```

### JavaScript SDK
```bash
npm install plant-health-ai
```

```javascript
import PlantHealthAI from 'plant-health-ai';

const client = new PlantHealthAI('your_api_key');

// Search diseases
const diseases = await client.searchDiseases('tomato leaves yellow spots');

// Ask AI agent
const response = await client.askAI('मेरे टमाटर में क्या रोग है?');
```

---

## 📞 Support

- **Documentation**: https://docs.plant-health-ai.com
- **Status Page**: https://status.plant-health-ai.com
- **Support Email**: support@plant-health-ai.com
- **Community Forum**: https://community.plant-health-ai.com
