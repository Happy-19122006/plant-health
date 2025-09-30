#!/usr/bin/env node

/**
 * Demo script to showcase AI Agent Perfect Calculations
 * This script demonstrates the calculation features for farmers
 */

console.log('🌱 AI Agent Perfect Calculations Demo\n');

// Sample diseases and treatments data
const sampleData = {
    diseases: [
        {
            id: 1,
            name_en: 'Late Blight',
            name_hi: 'लेट ब्लाइट',
            crop: 'Tomato',
            crop_hi: 'टमाटर',
            treatments: [
                {
                    name_en: 'Chlorothalonil 75% WP',
                    name_hi: 'क्लोरोथैलोनिल 75% WP',
                    dosage_per_acre: 500,
                    dosage_per_hectare: 1250,
                    water_requirement_per_acre: 200,
                    water_requirement_per_hectare: 500,
                    spray_volume_per_acre: 200,
                    spray_volume_per_hectare: 500,
                    application_timing: 'Early morning (6-8 AM) or evening (5-7 PM)',
                    weather_conditions: 'No rain for 24 hours, temperature below 30°C',
                    reapplication_interval: 7,
                    total_applications: 3,
                    cost_per_unit: 380,
                    unit: 'g',
                    safety_precautions_en: 'Avoid contact with skin and eyes',
                    safety_precautions_hi: 'त्वचा और आंखों के संपर्क से बचें'
                }
            ]
        },
        {
            id: 2,
            name_en: 'Rice Blast',
            name_hi: 'राइस ब्लास्ट',
            crop: 'Rice',
            crop_hi: 'चावल',
            treatments: [
                {
                    name_en: 'Tricyclazole 75% WP',
                    name_hi: 'ट्राइसाइक्लाजोल 75% WP',
                    dosage_per_acre: 300,
                    dosage_per_hectare: 750,
                    water_requirement_per_acre: 200,
                    water_requirement_per_hectare: 500,
                    spray_volume_per_acre: 200,
                    spray_volume_per_hectare: 500,
                    application_timing: 'Early morning (6-8 AM) or evening (5-7 PM)',
                    weather_conditions: 'No rain for 24 hours, temperature below 32°C',
                    reapplication_interval: 10,
                    total_applications: 2,
                    cost_per_unit: 450,
                    unit: 'g',
                    safety_precautions_en: 'Avoid contact with skin',
                    safety_precautions_hi: 'त्वचा के संपर्क से बचें'
                }
            ]
        }
    ]
};

// Calculation function
function calculateMedicine(disease, area, unit, language = 'hi') {
    const isHindi = language === 'hi';
    const treatment = disease.treatments[0]; // Get first treatment
    
    const dosage = unit === 'acre' ? treatment.dosage_per_acre : treatment.dosage_per_hectare;
    const water = unit === 'acre' ? treatment.water_requirement_per_acre : treatment.water_requirement_per_hectare;
    const sprayVolume = unit === 'acre' ? treatment.spray_volume_per_acre : treatment.spray_volume_per_hectare;
    
    const totalDosage = (dosage * area).toFixed(2);
    const totalWater = (water * area).toFixed(0);
    const totalSpray = (sprayVolume * area).toFixed(0);
    const totalCost = (treatment.cost_per_unit * totalDosage / 1000).toFixed(2);
    
    return {
        disease: disease,
        area: area,
        unit: unit,
        treatment: treatment,
        calculations: {
            totalDosage: totalDosage,
            totalWater: totalWater,
            totalSpray: totalSpray,
            totalCost: totalCost
        },
        language: language
    };
}

// Display results function
function displayResults(result) {
    const isHindi = result.language === 'hi';
    const disease = result.disease;
    const treatment = result.treatment;
    const calc = result.calculations;
    
    console.log('='.repeat(60));
    console.log(`🌱 ${isHindi ? 'AI Agent गणना परिणाम' : 'AI Agent Calculation Results'}`);
    console.log('='.repeat(60));
    
    console.log(`\n📊 ${isHindi ? 'रोग जानकारी' : 'Disease Information'}:`);
    console.log(`   ${isHindi ? 'रोग' : 'Disease'}: ${disease.name_en} (${disease.name_hi})`);
    console.log(`   ${isHindi ? 'फसल' : 'Crop'}: ${disease.crop} (${disease.crop_hi})`);
    
    console.log(`\n💊 ${isHindi ? 'उपचार सुझाव' : 'Treatment Recommendation'}:`);
    console.log(`   ${treatment.name_en} (${treatment.name_hi})`);
    
    console.log(`\n📏 ${isHindi ? 'क्षेत्रफल' : 'Field Area'}:`);
    console.log(`   ${result.area} ${result.unit === 'acre' ? (isHindi ? 'एकड़' : 'acres') : (isHindi ? 'हेक्टेयर' : 'hectares')}`);
    
    console.log(`\n🧮 ${isHindi ? 'गणना परिणाम' : 'Calculation Results'}:`);
    console.log(`   ${isHindi ? 'दवा की मात्रा' : 'Medicine Quantity'}: ${calc.totalDosage} ${treatment.unit}`);
    console.log(`   ${isHindi ? 'पानी की जरूरत' : 'Water Required'}: ${calc.totalWater} ${isHindi ? 'लीटर' : 'liters'}`);
    console.log(`   ${isHindi ? 'स्प्रे वॉल्यूम' : 'Spray Volume'}: ${calc.totalSpray} ${isHindi ? 'लीटर' : 'liters'}`);
    console.log(`   ${isHindi ? 'अनुमानित लागत' : 'Estimated Cost'}: ₹${calc.totalCost}`);
    
    console.log(`\n⏰ ${isHindi ? 'अनुप्रयोग विवरण' : 'Application Details'}:`);
    console.log(`   ${isHindi ? 'सबसे अच्छा समय' : 'Best Time'}: ${treatment.application_timing}`);
    console.log(`   ${isHindi ? 'मौसम की स्थिति' : 'Weather Conditions'}: ${treatment.weather_conditions}`);
    console.log(`   ${isHindi ? 'पुन: आवेदन' : 'Reapplication'}: ${isHindi ? 'हर' : 'Every'} ${treatment.reapplication_interval} ${isHindi ? 'दिन' : 'days'}`);
    console.log(`   ${isHindi ? 'कुल अनुप्रयोग' : 'Total Applications'}: ${treatment.total_applications} ${isHindi ? 'बार' : 'times'}`);
    
    console.log(`\n⚠️  ${isHindi ? 'सुरक्षा सावधानियां' : 'Safety Precautions'}:`);
    console.log(`   ${isHindi ? treatment.safety_precautions_hi : treatment.safety_precautions_en}`);
    
    console.log('\n' + '='.repeat(60));
}

// Demo scenarios
function runDemo() {
    console.log('🚀 Starting AI Agent Perfect Calculations Demo...\n');
    
    // Scenario 1: Tomato Late Blight - 2 acres (Hindi)
    console.log('📝 Scenario 1: Tomato Late Blight - 2 acres (Hindi)');
    const result1 = calculateMedicine(sampleData.diseases[0], 2, 'acre', 'hi');
    displayResults(result1);
    
    // Scenario 2: Rice Blast - 1 hectare (English)
    console.log('\n📝 Scenario 2: Rice Blast - 1 hectare (English)');
    const result2 = calculateMedicine(sampleData.diseases[1], 1, 'hectare', 'en');
    displayResults(result2);
    
    // Scenario 3: Tomato Late Blight - 0.5 acres (Hindi)
    console.log('\n📝 Scenario 3: Tomato Late Blight - 0.5 acres (Hindi)');
    const result3 = calculateMedicine(sampleData.diseases[0], 0.5, 'acre', 'hi');
    displayResults(result3);
    
    // Scenario 4: Rice Blast - 2.5 hectares (English)
    console.log('\n📝 Scenario 4: Rice Blast - 2.5 hectares (English)');
    const result4 = calculateMedicine(sampleData.diseases[1], 2.5, 'hectare', 'en');
    displayResults(result4);
    
    console.log('\n🎉 Demo completed successfully!');
    console.log('\n💡 Key Features Demonstrated:');
    console.log('   ✅ Exact dosage calculations per acre/hectare');
    console.log('   ✅ Water requirement calculations');
    console.log('   ✅ Spray volume calculations');
    console.log('   ✅ Cost estimates');
    console.log('   ✅ Application timing and frequency');
    console.log('   ✅ Safety precautions');
    console.log('   ✅ Multilingual support (Hindi/English)');
    console.log('   ✅ Multiple field sizes and units');
    
    console.log('\n🌱 This AI Agent provides perfect calculations to help farmers make informed decisions!');
}

// Run demo if called directly
if (require.main === module) {
    runDemo();
}

module.exports = { calculateMedicine, displayResults, sampleData };
