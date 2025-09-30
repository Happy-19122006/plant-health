const { sequelize } = require('../src/config/database');
const { 
    Language, 
    CropCategory, 
    Crop, 
    DiseaseCategory, 
    Disease, 
    Symptom, 
    TreatmentCategory, 
    Treatment, 
    Region, 
    CropDisease 
} = require('../src/models');
const logger = require('../src/utils/logger');

async function setupDatabase() {
    try {
        console.log('🚀 Setting up Plant Health AI Database...');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        
        // Sync database models
        await sequelize.sync({ force: true });
        console.log('✅ Database models synchronized.');
        
        // Seed initial data
        await seedInitialData();
        console.log('✅ Initial data seeded successfully.');
        
        console.log('🎉 Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

async function seedInitialData() {
    console.log('📊 Seeding initial data...');
    
    // Create languages
    await Language.bulkCreate([
        { code: 'en', name: 'English', native_name: 'English' },
        { code: 'hi', name: 'Hindi', native_name: 'हिन्दी' },
        { code: 'te', name: 'Telugu', native_name: 'తెలుగు' },
        { code: 'bn', name: 'Bengali', native_name: 'বাংলা' },
        { code: 'ta', name: 'Tamil', native_name: 'தமிழ்' },
        { code: 'gu', name: 'Gujarati', native_name: 'ગુજરાતી' },
        { code: 'mr', name: 'Marathi', native_name: 'मराठी' },
        { code: 'kn', name: 'Kannada', native_name: 'ಕನ್ನಡ' },
        { code: 'ml', name: 'Malayalam', native_name: 'മലയാളം' },
        { code: 'pa', name: 'Punjabi', native_name: 'ਪੰਜਾਬੀ' }
    ]);
    console.log('✅ Languages created');
    
    // Create regions
    await Region.bulkCreate([
        { name_en: 'North India', name_hi: 'उत्तर भारत', state_code: 'IN-N', climate_zone: 'Temperate' },
        { name_en: 'South India', name_hi: 'दक्षिण भारत', state_code: 'IN-S', climate_zone: 'Tropical' },
        { name_en: 'East India', name_hi: 'पूर्व भारत', state_code: 'IN-E', climate_zone: 'Subtropical' },
        { name_en: 'West India', name_hi: 'पश्चिम भारत', state_code: 'IN-W', climate_zone: 'Arid' },
        { name_en: 'Central India', name_hi: 'मध्य भारत', state_code: 'IN-C', climate_zone: 'Semi-arid' }
    ]);
    console.log('✅ Regions created');
    
    // Create crop categories
    const cropCategories = await CropCategory.bulkCreate([
        { name_en: 'Cereals', name_hi: 'अनाज', description_en: 'Grain crops', description_hi: 'अनाज की फसलें' },
        { name_en: 'Vegetables', name_hi: 'सब्जियां', description_en: 'Vegetable crops', description_hi: 'सब्जी की फसलें' },
        { name_en: 'Fruits', name_hi: 'फल', description_en: 'Fruit crops', description_hi: 'फल की फसलें' },
        { name_en: 'Spices', name_hi: 'मसाले', description_en: 'Spice crops', description_hi: 'मसाला की फसलें' },
        { name_en: 'Pulses', name_hi: 'दालें', description_en: 'Pulse crops', description_hi: 'दाल की फसलें' }
    ]);
    console.log('✅ Crop categories created');
    
    // Create crops
    const crops = await Crop.bulkCreate([
        {
            category_id: cropCategories[0].id, // Cereals
            scientific_name: 'Oryza sativa',
            common_name_en: 'Rice',
            common_name_hi: 'चावल',
            description_en: 'Staple food crop of India',
            description_hi: 'भारत की मुख्य खाद्य फसल',
            growing_season: 'Kharif',
            climate_requirements: 'Warm and humid',
            soil_requirements: 'Clay loam soil'
        },
        {
            category_id: cropCategories[0].id, // Cereals
            scientific_name: 'Triticum aestivum',
            common_name_en: 'Wheat',
            common_name_hi: 'गेहूं',
            description_en: 'Winter cereal crop',
            description_hi: 'सर्दियों की अनाज फसल',
            growing_season: 'Rabi',
            climate_requirements: 'Cool and dry',
            soil_requirements: 'Well-drained loamy soil'
        },
        {
            category_id: cropCategories[1].id, // Vegetables
            scientific_name: 'Solanum lycopersicum',
            common_name_en: 'Tomato',
            common_name_hi: 'टमाटर',
            description_en: 'Popular vegetable crop',
            description_hi: 'लोकप्रिय सब्जी फसल',
            growing_season: 'Year-round',
            climate_requirements: 'Warm and sunny',
            soil_requirements: 'Well-drained fertile soil'
        },
        {
            category_id: cropCategories[2].id, // Fruits
            scientific_name: 'Mangifera indica',
            common_name_en: 'Mango',
            common_name_hi: 'आम',
            description_en: 'King of fruits',
            description_hi: 'फलों का राजा',
            growing_season: 'Summer',
            climate_requirements: 'Tropical and subtropical',
            soil_requirements: 'Deep, well-drained soil'
        },
        {
            category_id: cropCategories[3].id, // Spices
            scientific_name: 'Capsicum annuum',
            common_name_en: 'Chili',
            common_name_hi: 'मिर्च',
            description_en: 'Hot spice crop',
            description_hi: 'तीखी मसाला फसल',
            growing_season: 'Year-round',
            climate_requirements: 'Warm and dry',
            soil_requirements: 'Well-drained sandy loam'
        }
    ]);
    console.log('✅ Crops created');
    
    // Create disease categories
    const diseaseCategories = await DiseaseCategory.bulkCreate([
        { name_en: 'Fungal Diseases', name_hi: 'फंगल रोग', description_en: 'Diseases caused by fungi', description_hi: 'फंगस से होने वाले रोग' },
        { name_en: 'Bacterial Diseases', name_hi: 'बैक्टीरियल रोग', description_en: 'Diseases caused by bacteria', description_hi: 'बैक्टीरिया से होने वाले रोग' },
        { name_en: 'Viral Diseases', name_hi: 'वायरल रोग', description_en: 'Diseases caused by viruses', description_hi: 'वायरस से होने वाले रोग' },
        { name_en: 'Nutritional Disorders', name_hi: 'पोषण संबंधी विकार', description_en: 'Nutritional deficiency diseases', description_hi: 'पोषण की कमी से होने वाले रोग' }
    ]);
    console.log('✅ Disease categories created');
    
    // Create diseases
    const diseases = await Disease.bulkCreate([
        {
            category_id: diseaseCategories[0].id, // Fungal
            scientific_name: 'Phytophthora infestans',
            common_name_en: 'Late Blight',
            common_name_hi: 'लेट ब्लाइट',
            description_en: 'Serious fungal disease affecting tomatoes and potatoes',
            description_hi: 'टमाटर और आलू को प्रभावित करने वाला गंभीर फंगल रोग',
            causal_organism: 'Phytophthora infestans',
            severity_level: 4,
            economic_impact: 'Can cause 100% crop loss if not controlled'
        },
        {
            category_id: diseaseCategories[0].id, // Fungal
            scientific_name: 'Magnaporthe oryzae',
            common_name_en: 'Rice Blast',
            common_name_hi: 'राइस ब्लास्ट',
            description_en: 'Most destructive disease of rice',
            description_hi: 'चावल का सबसे विनाशकारी रोग',
            causal_organism: 'Magnaporthe oryzae',
            severity_level: 5,
            economic_impact: 'Can cause up to 50% yield loss'
        },
        {
            category_id: diseaseCategories[0].id, // Fungal
            scientific_name: 'Puccinia triticina',
            common_name_en: 'Wheat Rust',
            common_name_hi: 'गेहूं रस्ट',
            description_en: 'Fungal disease affecting wheat leaves',
            description_hi: 'गेहूं के पत्तों को प्रभावित करने वाला फंगल रोग',
            causal_organism: 'Puccinia triticina',
            severity_level: 3,
            economic_impact: 'Can reduce yield by 20-30%'
        },
        {
            category_id: diseaseCategories[0].id, // Fungal
            scientific_name: 'Colletotrichum capsici',
            common_name_en: 'Chili Anthracnose',
            common_name_hi: 'मिर्च एंथ्रेक्नोज',
            description_en: 'Fungal disease causing fruit rot in chili',
            description_hi: 'मिर्च में फल सड़न का कारण बनने वाला फंगल रोग',
            causal_organism: 'Colletotrichum capsici',
            severity_level: 3,
            economic_impact: 'Can cause significant post-harvest losses'
        },
        {
            category_id: diseaseCategories[0].id, // Fungal
            scientific_name: 'Colletotrichum gloeosporioides',
            common_name_en: 'Mango Anthracnose',
            common_name_hi: 'आम एंथ्रेक्नोज',
            description_en: 'Fungal disease affecting mango fruits and leaves',
            description_hi: 'आम के फल और पत्तों को प्रभावित करने वाला फंगल रोग',
            causal_organism: 'Colletotrichum gloeosporioides',
            severity_level: 3,
            economic_impact: 'Can cause fruit rot and reduce market value'
        }
    ]);
    console.log('✅ Diseases created');
    
    // Create crop-disease relationships
    await CropDisease.bulkCreate([
        { crop_id: crops[2].id, disease_id: diseases[0].id, prevalence_score: 0.8, seasonal_pattern: { monsoon: 0.9, winter: 0.3 } },
        { crop_id: crops[0].id, disease_id: diseases[1].id, prevalence_score: 0.7, seasonal_pattern: { monsoon: 0.8, summer: 0.2 } },
        { crop_id: crops[1].id, disease_id: diseases[2].id, prevalence_score: 0.6, seasonal_pattern: { winter: 0.7, spring: 0.5 } },
        { crop_id: crops[4].id, disease_id: diseases[3].id, prevalence_score: 0.5, seasonal_pattern: { monsoon: 0.6, summer: 0.4 } },
        { crop_id: crops[3].id, disease_id: diseases[4].id, prevalence_score: 0.6, seasonal_pattern: { monsoon: 0.8, summer: 0.3 } }
    ]);
    console.log('✅ Crop-disease relationships created');
    
    // Create symptoms
    await Symptom.bulkCreate([
        {
            disease_id: diseases[0].id,
            name_en: 'Dark water-soaked lesions',
            name_hi: 'काले पानी से भरे घाव',
            description_en: 'Dark spots that appear water-soaked on leaves',
            description_hi: 'पत्तों पर दिखने वाले काले पानी से भरे धब्बे',
            symptom_type: 'Visual',
            severity_indicator: 'High',
            is_primary: true,
            display_order: 1
        },
        {
            disease_id: diseases[0].id,
            name_en: 'White fungal growth',
            name_hi: 'सफेद फंगल वृद्धि',
            description_en: 'White cottony growth on underside of leaves',
            description_hi: 'पत्तों के नीचे सफेद रुई जैसी वृद्धि',
            symptom_type: 'Visual',
            severity_indicator: 'Medium',
            is_primary: false,
            display_order: 2
        },
        {
            disease_id: diseases[1].id,
            name_en: 'Spindle-shaped lesions',
            name_hi: 'तकली के आकार के घाव',
            description_en: 'Elongated lesions with pointed ends',
            description_hi: 'नुकीले सिरों के साथ लम्बे घाव',
            symptom_type: 'Visual',
            severity_indicator: 'High',
            is_primary: true,
            display_order: 1
        },
        {
            disease_id: diseases[2].id,
            name_en: 'Orange to reddish-brown pustules',
            name_hi: 'नारंगी से लाल-भूरे पुस्ट्यूल',
            description_en: 'Small raised spots with orange to brown color',
            description_hi: 'नारंगी से भूरे रंग के छोटे उभरे हुए धब्बे',
            symptom_type: 'Visual',
            severity_indicator: 'High',
            is_primary: true,
            display_order: 1
        }
    ]);
    console.log('✅ Symptoms created');
    
    // Create treatment categories
    const treatmentCategories = await TreatmentCategory.bulkCreate([
        { name_en: 'Chemical Fungicides', name_hi: 'रासायनिक कवकनाशी', safety_level: 4 },
        { name_en: 'Organic Treatments', name_hi: 'जैविक उपचार', safety_level: 2 },
        { name_en: 'Biological Control', name_hi: 'जैविक नियंत्रण', safety_level: 1 },
        { name_en: 'Cultural Practices', name_hi: 'सांस्कृतिक प्रथाएं', safety_level: 1 }
    ]);
    console.log('✅ Treatment categories created');
    
    // Create treatments with detailed calculations
    await Treatment.bulkCreate([
        {
            disease_id: diseases[0].id,
            category_id: treatmentCategories[0].id,
            name_en: 'Chlorothalonil 75% WP',
            name_hi: 'क्लोरोथैलोनिल 75% WP',
            active_ingredient: 'Chlorothalonil',
            formulation: 'WP',
            concentration: '75%',
            dosage_en: '2-3 grams per liter of water',
            dosage_hi: 'पानी के प्रति लीटर 2-3 ग्राम',
            dosage_per_acre: 500.00,
            dosage_per_hectare: 1250.00,
            water_requirement_per_acre: 200,
            water_requirement_per_hectare: 500,
            spray_volume_per_acre: 200,
            spray_volume_per_hectare: 500,
            application_timing: 'Early morning (6-8 AM) or evening (5-7 PM)',
            weather_conditions: 'No rain for 24 hours, temperature below 30°C',
            reapplication_interval: 7,
            total_applications: 3,
            application_method: 'Foliar spray',
            frequency_en: 'Apply every 7-10 days',
            frequency_hi: 'हर 7-10 दिन में लगाएं',
            safety_precautions_en: 'Avoid contact with skin and eyes',
            safety_precautions_hi: 'त्वचा और आंखों के संपर्क से बचें',
            waiting_period_days: 14,
            effectiveness_score: 0.80,
            cost_per_unit: 380.00,
            unit: 'g',
            is_organic: false,
            product_links: {
                bighaat: 'https://bighaat.com/chlorothalonil',
                agriplex: 'https://agriplex.in/chlorothalonil'
            }
        },
        {
            disease_id: diseases[0].id,
            category_id: treatmentCategories[1].id,
            name_en: 'Copper Fungicide',
            name_hi: 'कॉपर फंगीसाइड',
            active_ingredient: 'Copper oxychloride',
            formulation: 'WP',
            concentration: '50%',
            dosage_en: '2-3 grams per liter of water',
            dosage_hi: 'पानी के प्रति लीटर 2-3 ग्राम',
            dosage_per_acre: 400.00,
            dosage_per_hectare: 1000.00,
            water_requirement_per_acre: 200,
            water_requirement_per_hectare: 500,
            spray_volume_per_acre: 200,
            spray_volume_per_hectare: 500,
            application_timing: 'Early morning (6-8 AM) or evening (5-7 PM)',
            weather_conditions: 'No rain for 12 hours, temperature below 35°C',
            reapplication_interval: 10,
            total_applications: 2,
            application_method: 'Foliar spray',
            frequency_en: 'Apply every 10-15 days',
            frequency_hi: 'हर 10-15 दिन में लगाएं',
            safety_precautions_en: 'Use protective equipment',
            safety_precautions_hi: 'सुरक्षात्मक उपकरण का उपयोग करें',
            waiting_period_days: 7,
            effectiveness_score: 0.70,
            cost_per_unit: 250.00,
            unit: 'g',
            is_organic: true,
            product_links: {
                bighaat: 'https://bighaat.com/copper-fungicide',
                agriplex: 'https://agriplex.in/copper-fungicide'
            }
        },
        {
            disease_id: diseases[1].id,
            category_id: treatmentCategories[0].id,
            name_en: 'Tricyclazole 75% WP',
            name_hi: 'ट्राइसाइक्लाजोल 75% WP',
            active_ingredient: 'Tricyclazole',
            formulation: 'WP',
            concentration: '75%',
            dosage_en: '1-2 grams per liter of water',
            dosage_hi: 'पानी के प्रति लीटर 1-2 ग्राम',
            dosage_per_acre: 300.00,
            dosage_per_hectare: 750.00,
            water_requirement_per_acre: 200,
            water_requirement_per_hectare: 500,
            spray_volume_per_acre: 200,
            spray_volume_per_hectare: 500,
            application_timing: 'Early morning (6-8 AM) or evening (5-7 PM)',
            weather_conditions: 'No rain for 24 hours, temperature below 32°C',
            reapplication_interval: 10,
            total_applications: 2,
            application_method: 'Foliar spray',
            frequency_en: 'Apply every 10-15 days',
            frequency_hi: 'हर 10-15 दिन में लगाएं',
            safety_precautions_en: 'Avoid contact with skin',
            safety_precautions_hi: 'त्वचा के संपर्क से बचें',
            waiting_period_days: 21,
            effectiveness_score: 0.85,
            cost_per_unit: 450.00,
            unit: 'g',
            is_organic: false,
            product_links: {
                bighaat: 'https://bighaat.com/tricyclazole',
                agriplex: 'https://agriplex.in/tricyclazole'
            }
        },
        {
            disease_id: diseases[2].id,
            category_id: treatmentCategories[0].id,
            name_en: 'Tebuconazole 25% EC',
            name_hi: 'टेबुकोनाजोल 25% EC',
            active_ingredient: 'Tebuconazole',
            formulation: 'EC',
            concentration: '25%',
            dosage_en: '1 ml per liter of water',
            dosage_hi: 'पानी के प्रति लीटर 1 मिली',
            dosage_per_acre: 200.00,
            dosage_per_hectare: 500.00,
            water_requirement_per_acre: 200,
            water_requirement_per_hectare: 500,
            spray_volume_per_acre: 200,
            spray_volume_per_hectare: 500,
            application_timing: 'Early morning (6-8 AM) or evening (5-7 PM)',
            weather_conditions: 'No rain for 24 hours, temperature below 30°C',
            reapplication_interval: 14,
            total_applications: 2,
            application_method: 'Foliar spray',
            frequency_en: 'Apply every 14 days',
            frequency_hi: 'हर 14 दिन में लगाएं',
            safety_precautions_en: 'Use protective equipment, avoid contact with skin',
            safety_precautions_hi: 'सुरक्षात्मक उपकरण का उपयोग करें, त्वचा के संपर्क से बचें',
            waiting_period_days: 30,
            effectiveness_score: 0.88,
            cost_per_unit: 520.00,
            unit: 'ml',
            is_organic: false,
            product_links: {
                bighaat: 'https://bighaat.com/tebuconazole',
                agriplex: 'https://agriplex.in/tebuconazole'
            }
        },
        {
            disease_id: diseases[3].id,
            category_id: treatmentCategories[0].id,
            name_en: 'Carbendazim 50% WP',
            name_hi: 'कार्बेन्डाजिम 50% WP',
            active_ingredient: 'Carbendazim',
            formulation: 'WP',
            concentration: '50%',
            dosage_en: '2 grams per liter of water',
            dosage_hi: 'पानी के प्रति लीटर 2 ग्राम',
            dosage_per_acre: 400.00,
            dosage_per_hectare: 1000.00,
            water_requirement_per_acre: 200,
            water_requirement_per_hectare: 500,
            spray_volume_per_acre: 200,
            spray_volume_per_hectare: 500,
            application_timing: 'Early morning (6-8 AM) or evening (5-7 PM)',
            weather_conditions: 'No rain for 12 hours, temperature below 35°C',
            reapplication_interval: 7,
            total_applications: 3,
            application_method: 'Foliar spray',
            frequency_en: 'Apply every 7 days',
            frequency_hi: 'हर 7 दिन में लगाएं',
            safety_precautions_en: 'Avoid contact with skin and eyes',
            safety_precautions_hi: 'त्वचा और आंखों के संपर्क से बचें',
            waiting_period_days: 14,
            effectiveness_score: 0.82,
            cost_per_unit: 320.00,
            unit: 'g',
            is_organic: false,
            product_links: {
                bighaat: 'https://bighaat.com/carbendazim',
                agriplex: 'https://agriplex.in/carbendazim'
            }
        }
    ]);
    console.log('✅ Treatments created');
    
    console.log('🎉 Database seeding completed successfully!');
}

// Run setup if called directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase, seedInitialData };
