# Plant Health AI - API Examples

## Base URL
```
Development: http://localhost:8000/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication
```http
Authorization: Bearer <your_jwt_token>
```

---

## 🌾 Farmer Query Examples

### 1. Process Farmer Query
```http
POST /api/v1/farmer/query
Content-Type: application/json

{
  "query_text": "मेरे टमाटर के पत्तों पर काले धब्बे आ रहे हैं",
  "query_language": "hi",
  "region": "punjab",
  "include_voice": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "query_id": 123,
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "response": "आपके टमाटर में Late Blight का लक्षण है। तुरंत Chlorothalonil 75% WP (2-3 ग्राम प्रति लीटर) का उपयोग करें। सुबह के समय छिड़काव करें और 10-15 दिन के अंतराल पर दोहराएं। ⚠️ सुरक्षात्मक गियर पहनें और स्थानीय कृषि विशेषज्ञ से सलाह लें।",
    "language": "hi",
    "detected_crop": "Tomato",
    "detected_disease": "Late Blight",
    "confidence_score": 0.88,
    "response_time_ms": 1200,
    "similar_diseases": [
      {
        "id": 2,
        "name_en": "Late Blight",
        "name_hi": "लेट ब्लाइट",
        "severity_level": 4,
        "similarity_score": 0.92
      }
    ],
    "voice_response": {
      "audio_url": "https://api.example.com/audio/response_123.mp3",
      "duration": 15.5,
      "language": "hi"
    },
    "suggested_actions": [
      {
        "action": "view_treatment",
        "treatment_id": 1,
        "priority": "high",
        "title": "View Treatment Details"
      }
    ]
  },
  "message": "Query processed successfully"
}
```

### 2. Get Query History
```http
GET /api/v1/farmer/history?session_id=550e8400-e29b-41d4-a716-446655440000&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "queries": [
      {
        "id": 123,
        "query_text": "मेरे टमाटर के पत्तों पर काले धब्बे आ रहे हैं",
        "query_language": "hi",
        "detected_crop": "Tomato",
        "detected_disease": "Late Blight",
        "confidence_score": 0.88,
        "ai_response": "आपके टमाटर में Late Blight का लक्षण है...",
        "response_language": "hi",
        "user_feedback": "helpful",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total_count": 1,
    "limit": 10,
    "offset": 0
  }
}
```

### 3. Submit Feedback
```http
POST /api/v1/farmer/feedback/123
Content-Type: application/json

{
  "feedback": "helpful"
}
```

---

## 🔍 Disease Search Examples

### 1. Search Diseases by Symptoms
```http
GET /api/v1/diseases/search?query=tomato%20leaves%20yellow%20spots&language=en&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "diseases": [
      {
        "id": 2,
        "name_en": "Late Blight",
        "name_hi": "लेट ब्लाइट",
        "scientific_name": "Phytophthora infestans",
        "severity_level": 4,
        "similarity_score": 0.92,
        "symptoms": [
          {
            "id": 4,
            "name_en": "Dark water-soaked lesions",
            "name_hi": "काले पानी से भरे घाव",
            "is_primary": true
          }
        ],
        "treatments": [
          {
            "id": 3,
            "name_en": "Chlorothalonil 75% WP",
            "name_hi": "क्लोरोथैलोनिल 75% WP",
            "is_organic": false,
            "effectiveness_score": 0.80
          }
        ]
      }
    ],
    "total_count": 1,
    "search_time_ms": 150
  }
}
```

### 2. Get Diseases for Specific Crop
```http
GET /api/v1/diseases/crop/3?language=en
```

**Response:**
```json
{
  "success": true,
  "data": {
    "crop": {
      "id": 3,
      "name_en": "Tomato",
      "name_hi": "टमाटर"
    },
    "diseases": [
      {
        "id": 2,
        "name_en": "Late Blight",
        "name_hi": "लेट ब्लाइट",
        "scientific_name": "Phytophthora infestans",
        "severity_level": 4,
        "prevalence_score": 0.75,
        "primary_symptoms": [
          {
            "id": 4,
            "name_en": "Dark water-soaked lesions",
            "name_hi": "काले पानी से भरे घाव",
            "is_primary": true
          }
        ]
      }
    ],
    "total_count": 1
  }
}
```

### 3. Get Disease Details
```http
GET /api/v1/diseases/2?language=en&include_treatments=true&include_symptoms=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "scientific_name": "Phytophthora infestans",
    "common_name_en": "Late Blight",
    "common_name_hi": "लेट ब्लाइट",
    "description_en": "Serious fungal disease affecting tomatoes and potatoes",
    "description_hi": "टमाटर और आलू को प्रभावित करने वाला गंभीर फंगल रोग",
    "severity_level": 4,
    "symptoms": [
      {
        "id": 4,
        "name_en": "Dark water-soaked lesions",
        "name_hi": "काले पानी से भरे घाव",
        "description_en": "Dark spots that appear water-soaked on leaves",
        "is_primary": true
      }
    ],
    "treatments": [
      {
        "id": 3,
        "name_en": "Chlorothalonil 75% WP",
        "name_hi": "क्लोरोथैलोनिल 75% WP",
        "active_ingredient": "Chlorothalonil",
        "formulation": "WP",
        "concentration": "75%",
        "dosage_en": "2-3 grams per liter of water",
        "dosage_hi": "पानी के प्रति लीटर 2-3 ग्राम",
        "safety_precautions_en": "Avoid contact with skin and eyes",
        "safety_precautions_hi": "त्वचा और आंखों के संपर्क से बचें",
        "waiting_period_days": 14,
        "effectiveness_score": 0.80,
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

## 🌱 Crop Examples

### 1. Get All Crops
```http
GET /api/v1/crops?limit=10&language=en
```

**Response:**
```json
{
  "success": true,
  "data": {
    "crops": [
      {
        "id": 3,
        "scientific_name": "Solanum lycopersicum",
        "common_name_en": "Tomato",
        "common_name_hi": "टमाटर",
        "description_en": "Popular vegetable crop, rich in vitamins",
        "growing_season": "Year-round",
        "image_url": "/images/crops/tomato.jpg",
        "category": {
          "id": 2,
          "name_en": "Vegetables",
          "name_hi": "सब्जियां"
        }
      }
    ],
    "total_count": 1,
    "limit": 10,
    "offset": 0
  }
}
```

### 2. Search Crops
```http
GET /api/v1/crops/search?query=tomato&language=en&limit=5
```

### 3. Get Crop Details
```http
GET /api/v1/crops/3?language=en&include_diseases=true
```

---

## 💊 Treatment Examples

### 1. Get Treatment Recommendations
```http
GET /api/v1/treatments/recommend/2?organic_only=false&language=en&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "disease": {
      "id": 2,
      "name_en": "Late Blight",
      "name_hi": "लेट ब्लाइट",
      "scientific_name": "Phytophthora infestans"
    },
    "treatments": [
      {
        "id": 3,
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
        },
        "category": {
          "id": 1,
          "name_en": "Chemical Fungicides",
          "name_hi": "रासायनिक कवकनाशी",
          "safety_level": 4
        }
      }
    ],
    "total_count": 1,
    "organic_only": false
  }
}
```

### 2. Search Treatments
```http
GET /api/v1/treatments/search?query=chlorothalonil&language=en&limit=5
```

---

## 🤖 AI Agent Examples

### 1. Ask AI Agent
```http
POST /api/v1/ai/ask
Content-Type: application/json

{
  "query_text": "What is the best treatment for rice blast?",
  "query_language": "en",
  "include_voice": false
}
```

### 2. Vector Search
```http
GET /api/v1/ai/search?query=rice%20blast%20treatment&language=en&top_k=5
```

### 3. Voice Processing
```http
POST /api/v1/ai/voice/process
Content-Type: multipart/form-data

audio: [audio file]
language: hi
```

---

## 📊 Analytics Examples

### 1. Get Analytics Overview
```http
GET /api/v1/analytics/overview?period=30d&language=hi
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "total_queries": 1250,
    "satisfaction_rate": 0.68,
    "avg_response_time_ms": 1200,
    "avg_confidence_score": 0.82,
    "feedback_distribution": [
      {
        "feedback": "helpful",
        "count": 850
      },
      {
        "feedback": "not_helpful",
        "count": 200
      },
      {
        "feedback": "partially_helpful",
        "count": 200
      }
    ]
  }
}
```

### 2. Get Search Trends
```http
GET /api/v1/analytics/trends?period=7d&language=hi&limit=10
```

### 3. Get Performance Metrics
```http
GET /api/v1/analytics/performance?period=30d
```

---

## 🔐 Authentication Examples

### 1. Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "phone": "+1234567890",
  "region": "punjab",
  "language_preference": "hi"
}
```

### 2. Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "farmer@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "region": "punjab",
      "language_preference": "hi",
      "is_verified": false,
      "is_active": true
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🚨 Error Examples

### 1. Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "query_text",
        "message": "Query text must be between 3 and 1000 characters"
      }
    ]
  }
}
```

### 2. Rate Limit Error
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests from this IP, please try again later."
  }
}
```

### 3. Authentication Error
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Access token required"
  }
}
```

---

## 📱 Mobile App Integration

### React Native Example
```javascript
// API client setup
const API_BASE_URL = 'https://your-domain.com/api/v1';

const apiClient = {
  async processQuery(query, language = 'en') {
    const response = await fetch(`${API_BASE_URL}/farmer/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query_text: query,
        query_language: language,
        include_voice: true
      })
    });
    
    return await response.json();
  }
};

// Usage
const result = await apiClient.processQuery('मेरे टमाटर में क्या रोग है?', 'hi');
console.log(result.data.response);
```

### Flutter Example
```dart
// API service
class PlantHealthAPI {
  static const String baseUrl = 'https://your-domain.com/api/v1';
  
  Future<Map<String, dynamic>> processQuery(String query, String language) async {
    final response = await http.post(
      Uri.parse('$baseUrl/farmer/query'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'query_text': query,
        'query_language': language,
        'include_voice': true
      })
    );
    
    return jsonDecode(response.body);
  }
}
```

---

## 🔧 Testing with cURL

### Test Health Endpoint
```bash
curl -X GET http://localhost:8000/health
```

### Test Farmer Query
```bash
curl -X POST http://localhost:8000/api/v1/farmer/query \
  -H "Content-Type: application/json" \
  -d '{
    "query_text": "tomato leaves turning yellow",
    "query_language": "en",
    "include_voice": false
  }'
```

### Test Disease Search
```bash
curl -X GET "http://localhost:8000/api/v1/diseases/search?query=tomato%20disease&language=en&limit=5"
```

### Test with Authentication
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
