-- =====================================================
-- Plant Health AI Database Schema
-- PostgreSQL Database for Agricultural AI System
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search

-- =====================================================
-- CORE AGRICULTURAL DATA TABLES
-- =====================================================

-- Languages table for localization
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) NOT NULL UNIQUE, -- e.g., 'en', 'hi', 'te', 'bn'
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop categories (e.g., Cereals, Vegetables, Fruits, Cash Crops)
CREATE TABLE crop_categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100),
    description_en TEXT,
    description_hi TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crops table with multilingual support
CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES crop_categories(id),
    scientific_name VARCHAR(200) NOT NULL,
    common_name_en VARCHAR(100) NOT NULL,
    common_name_hi VARCHAR(100),
    local_names JSONB, -- Store regional names: {"te": "tomato", "bn": "tomato"}
    description_en TEXT,
    description_hi TEXT,
    growing_season VARCHAR(100), -- e.g., "Kharif", "Rabi", "Zaid"
    climate_requirements TEXT,
    soil_requirements TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease categories (e.g., Fungal, Bacterial, Viral, Nutritional)
CREATE TABLE disease_categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100),
    description_en TEXT,
    description_hi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diseases table
CREATE TABLE diseases (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES disease_categories(id),
    scientific_name VARCHAR(200) NOT NULL,
    common_name_en VARCHAR(100) NOT NULL,
    common_name_hi VARCHAR(100),
    local_names JSONB,
    description_en TEXT,
    description_hi TEXT,
    causal_organism VARCHAR(200),
    severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5), -- 1=Low, 5=Critical
    economic_impact TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop-Disease relationships (many-to-many)
CREATE TABLE crop_diseases (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER REFERENCES crops(id) ON DELETE CASCADE,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    prevalence_score DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
    seasonal_pattern JSONB, -- {"kharif": 0.8, "rabi": 0.3}
    regional_prevalence JSONB, -- {"north": 0.9, "south": 0.6}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(crop_id, disease_id)
);

-- Symptoms table
CREATE TABLE symptoms (
    id SERIAL PRIMARY KEY,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    name_en VARCHAR(200) NOT NULL,
    name_hi VARCHAR(200),
    description_en TEXT,
    description_hi TEXT,
    symptom_type VARCHAR(50), -- 'visual', 'behavioral', 'growth'
    severity_indicator VARCHAR(50), -- 'early', 'moderate', 'severe'
    image_url VARCHAR(255),
    image_alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false, -- Primary vs secondary symptoms
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treatment categories (Chemical, Organic, Biological, Cultural)
CREATE TABLE treatment_categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100),
    description_en TEXT,
    description_hi TEXT,
    safety_level INTEGER CHECK (safety_level BETWEEN 1 AND 5), -- 1=Very Safe, 5=Handle with Care
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treatments table
CREATE TABLE treatments (
    id SERIAL PRIMARY KEY,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES treatment_categories(id),
    name_en VARCHAR(200) NOT NULL,
    name_hi VARCHAR(200),
    active_ingredient VARCHAR(200),
    formulation VARCHAR(100), -- e.g., "EC", "WP", "SC"
    concentration VARCHAR(50), -- e.g., "25%", "500g/kg"
    dosage_en TEXT,
    dosage_hi TEXT,
    application_method TEXT,
    frequency_en TEXT,
    frequency_hi TEXT,
    safety_precautions_en TEXT,
    safety_precautions_hi TEXT,
    waiting_period_days INTEGER,
    effectiveness_score DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
    cost_per_unit DECIMAL(10,2),
    unit VARCHAR(20), -- e.g., "ml", "kg", "liters"
    product_links JSONB, -- Store multiple vendor links
    is_organic BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AI AGENT & USER INTERACTION TABLES
-- =====================================================

-- User sessions (for tracking conversations)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_data JSONB,
    language_preference VARCHAR(5) DEFAULT 'en',
    region VARCHAR(50),
    device_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farmer queries and AI responses
CREATE TABLE farmer_queries (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES user_sessions(id),
    query_text TEXT NOT NULL,
    query_language VARCHAR(5) DEFAULT 'en',
    query_type VARCHAR(50), -- 'disease_identification', 'treatment_advice', 'general'
    detected_crop VARCHAR(100),
    detected_disease VARCHAR(100),
    confidence_score DECIMAL(3,2),
    ai_response TEXT,
    response_language VARCHAR(5),
    response_time_ms INTEGER,
    user_feedback VARCHAR(20), -- 'helpful', 'not_helpful', 'partially_helpful'
    feedback_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI model performance tracking
CREATE TABLE ai_performance (
    id SERIAL PRIMARY KEY,
    model_version VARCHAR(50),
    query_type VARCHAR(50),
    accuracy_score DECIMAL(3,2),
    response_time_avg INTEGER,
    user_satisfaction_score DECIMAL(3,2),
    total_queries INTEGER,
    date_recorded DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SEARCH & ANALYTICS TABLES
-- =====================================================

-- Search analytics
CREATE TABLE search_analytics (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES user_sessions(id),
    search_query TEXT,
    search_type VARCHAR(50), -- 'text', 'voice', 'image'
    results_returned INTEGER,
    click_through_rate DECIMAL(3,2),
    time_spent_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Popular searches and trends
CREATE TABLE search_trends (
    id SERIAL PRIMARY KEY,
    query_text VARCHAR(255),
    query_language VARCHAR(5),
    search_count INTEGER DEFAULT 1,
    last_searched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trend_score DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(query_text, query_language)
);

-- =====================================================
-- REGIONAL & CLIMATE DATA
-- =====================================================

-- Indian states and regions
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100),
    state_code VARCHAR(10),
    climate_zone VARCHAR(50),
    soil_type VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regional crop recommendations
CREATE TABLE regional_crop_data (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    crop_id INTEGER REFERENCES crops(id),
    suitability_score DECIMAL(3,2), -- 0.0 to 1.0
    best_season VARCHAR(50),
    yield_potential VARCHAR(50),
    common_challenges TEXT,
    local_varieties JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(region_id, crop_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Primary search indexes
CREATE INDEX idx_crops_name_en ON crops USING gin(to_tsvector('english', common_name_en));
CREATE INDEX idx_crops_name_hi ON crops USING gin(to_tsvector('hindi', common_name_hi));
CREATE INDEX idx_diseases_name_en ON diseases USING gin(to_tsvector('english', common_name_en));
CREATE INDEX idx_diseases_name_hi ON diseases USING gin(to_tsvector('hindi', common_name_hi));
CREATE INDEX idx_symptoms_name_en ON symptoms USING gin(to_tsvector('english', name_en));
CREATE INDEX idx_symptoms_name_hi ON symptoms USING gin(to_tsvector('hindi', name_hi));

-- Fuzzy search indexes
CREATE INDEX idx_crops_fuzzy_en ON crops USING gin(common_name_en gin_trgm_ops);
CREATE INDEX idx_crops_fuzzy_hi ON crops USING gin(common_name_hi gin_trgm_ops);
CREATE INDEX idx_diseases_fuzzy_en ON diseases USING gin(common_name_en gin_trgm_ops);
CREATE INDEX idx_diseases_fuzzy_hi ON diseases USING gin(common_name_hi gin_trgm_ops);

-- Relationship indexes
CREATE INDEX idx_crop_diseases_crop_id ON crop_diseases(crop_id);
CREATE INDEX idx_crop_diseases_disease_id ON crop_diseases(disease_id);
CREATE INDEX idx_symptoms_disease_id ON symptoms(disease_id);
CREATE INDEX idx_treatments_disease_id ON treatments(disease_id);
CREATE INDEX idx_treatments_category_id ON treatments(category_id);

-- Performance indexes
CREATE INDEX idx_farmer_queries_session_id ON farmer_queries(session_id);
CREATE INDEX idx_farmer_queries_created_at ON farmer_queries(created_at);
CREATE INDEX idx_farmer_queries_feedback ON farmer_queries(user_feedback) WHERE user_feedback IS NOT NULL;
CREATE INDEX idx_search_trends_query ON search_trends(query_text);
CREATE INDEX idx_search_trends_count ON search_trends(search_count DESC);

-- JSONB indexes for flexible queries
CREATE INDEX idx_crops_local_names ON crops USING gin(local_names);
CREATE INDEX idx_diseases_local_names ON diseases USING gin(local_names);
CREATE INDEX idx_treatments_product_links ON treatments USING gin(product_links);
CREATE INDEX idx_crop_diseases_seasonal ON crop_diseases USING gin(seasonal_pattern);
CREATE INDEX idx_crop_diseases_regional ON crop_diseases USING gin(regional_prevalence);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_crops_updated_at BEFORE UPDATE ON crops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON diseases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Complete disease information view
CREATE VIEW disease_complete_info AS
SELECT 
    d.id,
    d.scientific_name,
    d.common_name_en,
    d.common_name_hi,
    dc.name_en as category_name_en,
    dc.name_hi as category_name_hi,
    d.severity_level,
    d.description_en,
    d.description_hi,
    d.image_url,
    COUNT(s.id) as symptom_count,
    COUNT(t.id) as treatment_count
FROM diseases d
LEFT JOIN disease_categories dc ON d.category_id = dc.id
LEFT JOIN symptoms s ON d.id = s.disease_id AND s.is_active = true
LEFT JOIN treatments t ON d.id = t.disease_id AND t.is_approved = true
WHERE d.is_active = true
GROUP BY d.id, dc.name_en, dc.name_hi;

-- Crop-disease-treatment summary view
CREATE VIEW crop_treatment_summary AS
SELECT 
    c.id as crop_id,
    c.common_name_en as crop_name_en,
    c.common_name_hi as crop_name_hi,
    d.id as disease_id,
    d.common_name_en as disease_name_en,
    d.common_name_hi as disease_name_hi,
    t.id as treatment_id,
    t.name_en as treatment_name_en,
    t.name_en as treatment_name_hi,
    tc.name_en as treatment_category,
    t.is_organic,
    t.effectiveness_score,
    cd.prevalence_score
FROM crops c
JOIN crop_diseases cd ON c.id = cd.crop_id
JOIN diseases d ON cd.disease_id = d.id
JOIN treatments t ON d.id = t.disease_id
JOIN treatment_categories tc ON t.category_id = tc.id
WHERE c.is_active = true 
  AND d.is_active = true 
  AND t.is_approved = true
  AND cd.is_active = true;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert languages
INSERT INTO languages (code, name, native_name) VALUES
('en', 'English', 'English'),
('hi', 'Hindi', 'हिंदी'),
('te', 'Telugu', 'తెలుగు'),
('bn', 'Bengali', 'বাংলা'),
('ta', 'Tamil', 'தமிழ்'),
('gu', 'Gujarati', 'ગુજરાતી'),
('mr', 'Marathi', 'मराठी'),
('kn', 'Kannada', 'ಕನ್ನಡ'),
('ml', 'Malayalam', 'മലയാളം'),
('pa', 'Punjabi', 'ਪੰਜਾਬੀ');

-- Insert crop categories
INSERT INTO crop_categories (name_en, name_hi, description_en, description_hi) VALUES
('Cereals', 'अनाज', 'Staple food crops like rice, wheat, maize', 'चावल, गेहूं, मक्का जैसी मुख्य खाद्य फसलें'),
('Vegetables', 'सब्जियां', 'Leafy and root vegetables', 'पत्तेदार और जड़ वाली सब्जियां'),
('Fruits', 'फल', 'Tree and vine fruits', 'पेड़ और बेल के फल'),
('Cash Crops', 'नकदी फसलें', 'Commercial crops for income', 'आय के लिए व्यावसायिक फसलें'),
('Pulses', 'दालें', 'Leguminous crops for protein', 'प्रोटीन के लिए दलहनी फसलें');

-- Insert disease categories
INSERT INTO disease_categories (name_en, name_hi, description_en, description_hi) VALUES
('Fungal Diseases', 'फंगल रोग', 'Diseases caused by fungi', 'कवक के कारण होने वाले रोग'),
('Bacterial Diseases', 'जीवाणु रोग', 'Diseases caused by bacteria', 'जीवाणुओं के कारण होने वाले रोग'),
('Viral Diseases', 'वायरल रोग', 'Diseases caused by viruses', 'वायरस के कारण होने वाले रोग'),
('Nutritional Disorders', 'पोषण संबंधी विकार', 'Deficiency or excess of nutrients', 'पोषक तत्वों की कमी या अधिकता'),
('Pest Damage', 'कीट क्षति', 'Damage caused by insects', 'कीटों के कारण होने वाली क्षति');

-- Insert treatment categories
INSERT INTO treatment_categories (name_en, name_hi, description_en, description_hi, safety_level) VALUES
('Chemical Fungicides', 'रासायनिक कवकनाशी', 'Synthetic chemical treatments', 'सिंथेटिक रासायनिक उपचार', 4),
('Organic Treatments', 'जैविक उपचार', 'Natural and organic solutions', 'प्राकृतिक और जैविक समाधान', 2),
('Biological Control', 'जैविक नियंत्रण', 'Using beneficial organisms', 'लाभकारी जीवों का उपयोग', 1),
('Cultural Practices', 'सांस्कृतिक प्रथाएं', 'Farming practices and techniques', 'कृषि प्रथाएं और तकनीकें', 1),
('Preventive Measures', 'निवारक उपाय', 'Prevention and protection methods', 'रोकथाम और सुरक्षा के तरीके', 1);

-- Insert regions
INSERT INTO regions (name_en, name_hi, state_code, climate_zone, soil_type) VALUES
('Punjab', 'पंजाब', 'PB', 'Semi-arid', 'Alluvial'),
('Haryana', 'हरियाणा', 'HR', 'Semi-arid', 'Alluvial'),
('Uttar Pradesh', 'उत्तर प्रदेश', 'UP', 'Subtropical', 'Alluvial'),
('West Bengal', 'पश्चिम बंगाल', 'WB', 'Tropical', 'Alluvial'),
('Tamil Nadu', 'तमिलनाडु', 'TN', 'Tropical', 'Red and Black'),
('Karnataka', 'कर्नाटक', 'KA', 'Tropical', 'Red and Black'),
('Maharashtra', 'महाराष्ट्र', 'MH', 'Tropical', 'Black and Red'),
('Gujarat', 'गुजरात', 'GJ', 'Arid', 'Black and Alluvial'),
('Rajasthan', 'राजस्थान', 'RJ', 'Arid', 'Desert and Sandy'),
('Bihar', 'बिहार', 'BR', 'Subtropical', 'Alluvial');

-- Insert sample crops
INSERT INTO crops (category_id, scientific_name, common_name_en, common_name_hi, local_names, description_en, description_hi, growing_season, image_url) VALUES
(1, 'Oryza sativa', 'Rice', 'चावल', '{"te": "వరి", "bn": "ধান", "ta": "அரிசி"}', 'Staple food crop, main source of carbohydrates', 'मुख्य खाद्य फसल, कार्बोहाइड्रेट का मुख्य स्रोत', 'Kharif', '/images/crops/rice.jpg'),
(1, 'Triticum aestivum', 'Wheat', 'गेहूं', '{"te": "గోధుమలు", "bn": "গম", "ta": "கோதுமை"}', 'Winter cereal crop, high protein content', 'सर्दियों की अनाज फसल, उच्च प्रोटीन सामग्री', 'Rabi', '/images/crops/wheat.jpg'),
(2, 'Solanum lycopersicum', 'Tomato', 'टमाटर', '{"te": "టమాట", "bn": "টমেটো", "ta": "தக்காளி"}', 'Popular vegetable crop, rich in vitamins', 'लोकप्रिय सब्जी फसल, विटामिन से भरपूर', 'Year-round', '/images/crops/tomato.jpg'),
(2, 'Capsicum annuum', 'Chili', 'मिर्च', '{"te": "మిరపకాయ", "bn": "কাঁচা মরিচ", "ta": "மிளகாய்"}', 'Spice crop, high commercial value', 'मसाला फसल, उच्च व्यावसायिक मूल्य', 'Year-round', '/images/crops/chili.jpg'),
(3, 'Mangifera indica', 'Mango', 'आम', '{"te": "మామిడి", "bn": "আম", "ta": "மாம்பழம்"}', 'King of fruits, tropical tree crop', 'फलों का राजा, उष्णकटिबंधीय पेड़ फसल', 'Summer', '/images/crops/mango.jpg');

-- Insert sample diseases
INSERT INTO diseases (category_id, scientific_name, common_name_en, common_name_hi, local_names, description_en, description_hi, causal_organism, severity_level, image_url) VALUES
(1, 'Magnaporthe oryzae', 'Rice Blast', 'चावल का ब्लास्ट', '{"te": "వరి బ్లాస్ట్", "bn": "ধান ব্লাস্ট", "ta": "அரிசி பிளாஸ்ட்"}', 'Devastating fungal disease affecting rice plants', 'चावल के पौधों को प्रभावित करने वाला विनाशकारी फंगल रोग', 'Magnaporthe oryzae', 5, '/images/diseases/rice_blast.jpg'),
(1, 'Phytophthora infestans', 'Late Blight', 'लेट ब्लाइट', '{"te": "లేట్ బ్లైట్", "bn": "লেট ব্লাইট", "ta": "லேட் பிளைட்"}', 'Serious fungal disease affecting tomatoes and potatoes', 'टमाटर और आलू को प्रभावित करने वाला गंभीर फंगल रोग', 'Phytophthora infestans', 4, '/images/diseases/late_blight.jpg'),
(1, 'Puccinia triticina', 'Wheat Rust', 'गेहूं का रस्ट', '{"te": "గోధుమల రస్ట్", "bn": "গম রাস্ট", "ta": "கோதுமை ரஸ்ட்"}', 'Fungal disease causing orange pustules on wheat leaves', 'गेहूं के पत्तों पर नारंगी फुंसी पैदा करने वाला फंगल रोग', 'Puccinia triticina', 4, '/images/diseases/wheat_rust.jpg'),
(1, 'Colletotrichum capsici', 'Chili Anthracnose', 'मिर्च का एंथ्रेक्नोज़', '{"te": "మిరపకాయ ఆంథ్రాక్నోస్", "bn": "কাঁচা মরিচ অ্যানথ্রাকনোজ", "ta": "மிளகாய் ஆந்த்ராக்னோஸ்"}', 'Fungal disease causing fruit rot in chili plants', 'मिर्च के पौधों में फल सड़न पैदा करने वाला फंगल रोग', 'Colletotrichum capsici', 3, '/images/diseases/chili_anthracnose.jpg'),
(1, 'Colletotrichum gloeosporioides', 'Mango Anthracnose', 'आम का एंथ्रेक्नोज़', '{"te": "మామిడి ఆంథ్రాక్నోస్", "bn": "আম অ্যানথ্রাকনোজ", "ta": "மாம்பழம் ஆந்த்ராக்னோஸ்"}', 'Fungal disease affecting mango fruits and leaves', 'आम के फलों और पत्तों को प्रभावित करने वाला फंगल रोग', 'Colletotrichum gloeosporioides', 3, '/images/diseases/mango_anthracnose.jpg');

-- Insert crop-disease relationships
INSERT INTO crop_diseases (crop_id, disease_id, prevalence_score, seasonal_pattern, regional_prevalence) VALUES
(1, 1, 0.85, '{"kharif": 0.9, "rabi": 0.1}', '{"north": 0.8, "east": 0.9, "south": 0.7}'),
(3, 2, 0.75, '{"kharif": 0.8, "rabi": 0.6}', '{"north": 0.7, "south": 0.8, "east": 0.6}'),
(2, 3, 0.70, '{"rabi": 0.9, "kharif": 0.2}', '{"north": 0.8, "west": 0.7}'),
(4, 4, 0.65, '{"year_round": 0.7}', '{"south": 0.8, "east": 0.7, "west": 0.6}'),
(5, 5, 0.60, '{"summer": 0.8, "monsoon": 0.9}', '{"north": 0.7, "south": 0.8, "east": 0.6}');

-- Insert symptoms
INSERT INTO symptoms (disease_id, name_en, name_hi, description_en, description_hi, symptom_type, severity_indicator, is_primary, display_order) VALUES
(1, 'Spindle-shaped lesions on leaves', 'पत्तों पर धुरी के आकार के घाव', 'Elongated, spindle-shaped spots with gray centers and brown borders', 'ग्रे केंद्र और भूरे किनारों के साथ लम्बे, धुरी के आकार के धब्बे', 'visual', 'early', true, 1),
(1, 'White to gray spots on panicles', 'पैनिकल्स पर सफेद से ग्रे धब्बे', 'Discolored spots on rice panicles affecting grain formation', 'चावल के पैनिकल्स पर रंगहीन धब्बे जो अनाज के निर्माण को प्रभावित करते हैं', 'visual', 'moderate', true, 2),
(1, 'Stem rot at base', 'आधार पर तना सड़न', 'Rotting of stem at the base of the plant', 'पौधे के आधार पर तने का सड़ना', 'visual', 'severe', false, 3),
(2, 'Dark, water-soaked lesions on leaves', 'पत्तों पर काले, पानी से भरे घाव', 'Dark spots that appear water-soaked on tomato leaves', 'टमाटर के पत्तों पर काले धब्बे जो पानी से भरे दिखते हैं', 'visual', 'early', true, 1),
(2, 'White fungal growth on underside', 'नीचे की तरफ सफेद फंगल वृद्धि', 'White, cottony fungal growth on the underside of leaves', 'पत्तों के नीचे की तरफ सफेद, रूई जैसी फंगल वृद्धि', 'visual', 'moderate', true, 2),
(3, 'Orange to reddish-brown pustules', 'नारंगी से लाल-भूरे रंग के फुंसी', 'Small, raised spots that release orange spores', 'छोटे, उभरे हुए धब्बे जो नारंगी बीजाणु छोड़ते हैं', 'visual', 'early', true, 1),
(3, 'Yellow halos around lesions', 'घावों के चारों ओर पीले हेलो', 'Yellow discoloration around the rust pustules', 'रस्ट फुंसी के चारों ओर पीला रंगहीनता', 'visual', 'moderate', false, 2);

-- Insert treatments
INSERT INTO treatments (disease_id, category_id, name_en, name_hi, active_ingredient, formulation, concentration, dosage_en, dosage_hi, application_method, frequency_en, frequency_hi, safety_precautions_en, safety_precautions_hi, waiting_period_days, effectiveness_score, cost_per_unit, unit, product_links, is_organic) VALUES
(1, 1, 'Propiconazole 25% EC', 'प्रोपिकोनाज़ोल 25% EC', 'Propiconazole', 'EC', '25%', '1-2 ml per liter of water', 'पानी के प्रति लीटर 1-2 मिली', 'Foliar spray', 'Apply at 10-15 day intervals', '10-15 दिन के अंतराल पर लगाएं', 'Use protective gear, avoid during flowering', 'सुरक्षात्मक गियर का उपयोग करें, फूल के दौरान बचें', 21, 0.85, 450.00, 'ml', '{"bighaat": "https://bighaat.com/propiconazole", "agriplex": "https://agriplex.in/propiconazole"}', false),
(1, 2, 'Neem Oil Spray', 'नीम तेल स्प्रे', 'Azadirachtin', 'Oil', '5%', '2-3 ml per liter of water', 'पानी के प्रति लीटर 2-3 मिली', 'Foliar spray', 'Apply weekly', 'साप्ताहिक लगाएं', 'Safe for beneficial insects', 'लाभकारी कीटों के लिए सुरक्षित', 0, 0.70, 280.00, 'ml', '{"bighaat": "https://bighaat.com/neem-oil", "agriplex": "https://agriplex.in/neem-oil"}', true),
(2, 1, 'Chlorothalonil 75% WP', 'क्लोरोथैलोनिल 75% WP', 'Chlorothalonil', 'WP', '75%', '2-3 grams per liter of water', 'पानी के प्रति लीटर 2-3 ग्राम', 'Foliar spray', 'Apply every 7-10 days', 'हर 7-10 दिन में लगाएं', 'Avoid contact with skin and eyes', 'त्वचा और आंखों के संपर्क से बचें', 14, 0.80, 380.00, 'g', '{"bighaat": "https://bighaat.com/chlorothalonil", "agriplex": "https://agriplex.in/chlorothalonil"}', false),
(2, 2, 'Bordeaux Mixture', 'बोर्डो मिश्रण', 'Copper sulfate + Lime', 'Mixture', '1%', '100g copper sulfate + 100g lime + 10L water', '100 ग्राम कॉपर सल्फेट + 100 ग्राम चूना + 10 लीटर पानी', 'Foliar spray', 'Apply immediately after mixing', 'मिलाने के तुरंत बाद लगाएं', 'Do not mix with alkaline solutions', 'क्षारीय समाधान के साथ मिलाएं नहीं', 7, 0.75, 120.00, 'kg', '{"local": "Available at local agricultural stores"}', true),
(3, 1, 'Tebuconazole 25% EC', 'टेबुकोनाज़ोल 25% EC', 'Tebuconazole', 'EC', '25%', '1-2 ml per liter of water', 'पानी के प्रति लीटर 1-2 मिली', 'Foliar spray', 'Apply at 15-20 day intervals', '15-20 दिन के अंतराल पर लगाएं', 'Rotate with other fungicides', 'अन्य कवकनाशी के साथ रोटेशन करें', 21, 0.82, 420.00, 'ml', '{"bighaat": "https://bighaat.com/tebuconazole", "agriplex": "https://agriplex.in/tebuconazole"}', false);

-- Insert sample farmer queries (for AI training data)
INSERT INTO user_sessions (session_data, language_preference, region) VALUES
('{"device": "mobile", "browser": "chrome"}', 'hi', 'Punjab'),
('{"device": "desktop", "browser": "firefox"}', 'en', 'Tamil Nadu'),
('{"device": "mobile", "browser": "safari"}', 'hi', 'Uttar Pradesh');

INSERT INTO farmer_queries (session_id, query_text, query_language, query_type, detected_crop, detected_disease, confidence_score, ai_response, response_language, response_time_ms, user_feedback) VALUES
((SELECT id FROM user_sessions LIMIT 1), 'Tomato mein patte pe kale dhabbe aa rahe hain', 'hi', 'disease_identification', 'Tomato', 'Late Blight', 0.85, 'आपके टमाटर में Late Blight का लक्षण है। Chlorothalonil 75% WP (2-3 ग्राम प्रति लीटर) का उपयोग करें। साथ ही Bordeaux mixture भी effective है।', 'hi', 1200, 'helpful'),
((SELECT id FROM user_sessions LIMIT 1 OFFSET 1), 'Rice blast treatment in Tamil Nadu', 'en', 'treatment_advice', 'Rice', 'Rice Blast', 0.90, 'For Rice Blast in Tamil Nadu, use Tricyclazole 75% WP (1-2 grams per liter) or Propiconazole 25% EC. Apply during early morning hours for better effectiveness.', 'en', 950, 'helpful'),
((SELECT id FROM user_sessions LIMIT 1 OFFSET 2), 'Wheat mein orange color ke spots', 'hi', 'disease_identification', 'Wheat', 'Wheat Rust', 0.88, 'यह Wheat Rust का लक्षण है। Tebuconazole 25% EC (1-2 मिली प्रति लीटर) का उपयोग करें। Resistant varieties भी लगाएं।', 'hi', 1100, 'partially_helpful');

-- Insert search trends
INSERT INTO search_trends (query_text, query_language, search_count, trend_score) VALUES
('tomato disease', 'en', 150, 8.5),
('चावल का रोग', 'hi', 200, 9.2),
('rice blast treatment', 'en', 120, 7.8),
('मिर्च में धब्बे', 'hi', 180, 8.9),
('wheat rust', 'en', 90, 6.5);

-- =====================================================
-- SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Query to get complete disease information
/*
SELECT 
    c.common_name_en as crop,
    d.common_name_en as disease,
    d.common_name_hi as disease_hindi,
    s.name_en as symptom,
    t.name_en as treatment,
    t.is_organic,
    t.effectiveness_score
FROM crops c
JOIN crop_diseases cd ON c.id = cd.crop_id
JOIN diseases d ON cd.disease_id = d.id
JOIN symptoms s ON d.id = s.disease_id
JOIN treatments t ON d.id = t.disease_id
WHERE c.common_name_en ILIKE '%tomato%'
  AND t.is_approved = true
ORDER BY t.effectiveness_score DESC;
*/

-- Query for AI agent response generation
/*
SELECT 
    d.common_name_en,
    d.common_name_hi,
    d.description_hi,
    s.name_hi as symptom,
    t.name_hi as treatment,
    t.dosage_hi,
    t.safety_precautions_hi
FROM diseases d
JOIN symptoms s ON d.id = s.disease_id
JOIN treatments t ON d.id = t.disease_id
WHERE d.common_name_en ILIKE '%blast%'
  AND t.is_approved = true
  AND s.is_primary = true;
*/
