#!/usr/bin/env node

/**
 * AI Doctor Demo - Complete Conversation Flow
 * This script demonstrates the AI doctor's proactive conversation and calculation abilities
 */

console.log('🤖 AI Agricultural Doctor Demo\n');

// Simulate AI Doctor Conversation
class AIDoctorDemo {
    constructor() {
        this.conversationStep = 0;
        this.farmerProfile = null;
        this.currentDisease = null;
        this.tankiSize = null;
    }

    async startConversation() {
        console.log('='.repeat(60));
        console.log('🤖 AI Doctor: Starting conversation with farmer...');
        console.log('='.repeat(60));
        
        // Step 1: AI Doctor welcomes farmer
        await this.doctorWelcome();
        
        // Step 2: Farmer responds
        await this.farmerResponse();
        
        // Step 3: AI Doctor analyzes photo
        await this.photoAnalysis();
        
        // Step 4: AI Doctor asks for tanki size
        await this.askTankiSize();
        
        // Step 5: AI Doctor provides complete calculation
        await this.provideCalculation();
        
        // Step 6: AI Doctor offers follow-up help
        await this.followUpHelp();
    }

    async doctorWelcome() {
        console.log('\n🤖 AI Doctor:');
        console.log('नमस्ते! मैं आपका AI कृषि डॉक्टर हूं। मैं आपकी फसलों की देखभाल में मदद करूंगा।');
        console.log('बताइए, आज आपकी कौन सी फसल में कोई समस्या है? आप मुझे फोटो भी भेज सकते हैं।');
        
        await this.delay(2000);
    }

    async farmerResponse() {
        console.log('\n👨‍🌾 Farmer:');
        console.log('हैलो डॉक्टर! मेरे टमाटर के पत्तों पर काले धब्बे आ रहे हैं।');
        console.log('मैं आपको फोटो भेज रहा हूं...');
        
        await this.delay(1500);
    }

    async photoAnalysis() {
        console.log('\n🤖 AI Doctor:');
        console.log('फोटो को scan कर रहा हूं...');
        
        await this.delay(2000);
        
        // Simulate photo analysis
        this.currentDisease = {
            disease: 'Late Blight',
            disease_hi: 'लेट ब्लाइट',
            crop: 'Tomato',
            crop_hi: 'टमाटर',
            confidence: 0.85,
            symptoms: ['Dark water-soaked lesions', 'White fungal growth'],
            symptoms_hi: ['काले पानी से भरे घाव', 'सफेद फंगल वृद्धि']
        };
        
        console.log(`मैंने आपकी फोटो देखी है। आपकी ${this.currentDisease.crop_hi} में ${this.currentDisease.disease_hi} का रोग है।`);
        console.log(`Confidence: ${Math.round(this.currentDisease.confidence * 100)}%`);
        console.log('यह एक गंभीर रोग है जो तुरंत उपचार चाहता है।');
        
        await this.delay(2000);
    }

    async askTankiSize() {
        console.log('\n🤖 AI Doctor:');
        console.log('अब मुझे बताइए कि आप कितने लीटर की टंकी का उपयोग करेंगे?');
        console.log('(जैसे 10, 15, 20 लीटर)');
        
        await this.delay(1500);
        
        console.log('\n👨‍🌾 Farmer:');
        console.log('मेरे पास 15 लीटर की टंकी है।');
        
        this.tankiSize = 15;
        await this.delay(1000);
    }

    async provideCalculation() {
        console.log('\n🤖 AI Doctor:');
        console.log('बहुत अच्छा! आपकी 15 लीटर टंकी के लिए मैं आपको exact calculation देता हूं:\n');
        
        // AI's intelligent calculation
        const medicineQuantity = (this.tankiSize * 2.5).toFixed(1); // 2.5 grams per liter
        const cost = (380 * medicineQuantity / 1000).toFixed(2); // ₹380 per 1000g
        
        console.log('💊 **दवा**: क्लोरोथैलोनिल 75% WP');
        console.log(`📏 **मात्रा**: ${medicineQuantity} ग्राम`);
        console.log(`💧 **पानी**: ${this.tankiSize} लीटर`);
        console.log(`💰 **लागत**: ₹${cost}\n`);
        
        console.log('⏰ **उपयोग का तरीका**:');
        console.log(`1. पहले टंकी में ${this.tankiSize} लीटर पानी भरें`);
        console.log(`2. ${medicineQuantity} ग्राम दवा मिलाएं`);
        console.log('3. अच्छी तरह मिलाएं');
        console.log('4. सुबह 6-8 बजे या शाम 5-7 बजे छिड़काव करें');
        console.log('5. हर 7 दिन में दोबारा करें\n');
        
        console.log('⚠️ **सावधानी**: त्वचा और आंखों के संपर्क से बचें');
        console.log('🌤️ **मौसम**: 24 घंटे तक बारिश न हो, तापमान 30°C से कम');
        
        await this.delay(3000);
    }

    async followUpHelp() {
        console.log('\n🤖 AI Doctor:');
        console.log('क्या आपको कोई और सवाल है? या आप किसी और फसल की फोटो भेजना चाहते हैं?');
        
        await this.delay(1500);
        
        console.log('\n👨‍🌾 Farmer:');
        console.log('धन्यवाद डॉक्टर! आपकी सलाह बहुत helpful है।');
        console.log('मैं तुरंत इस treatment को follow करूंगा।');
        
        await this.delay(1000);
        
        console.log('\n🤖 AI Doctor:');
        console.log('बहुत अच्छा! मैं आपके साथ हूं। अगर कोई समस्या आए तो मुझसे पूछ सकते हैं।');
        console.log('आपकी फसल जल्दी ठीक हो जाएगी। शुभकामनाएं! 🌱');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Demo different scenarios
async function runMultipleScenarios() {
    const scenarios = [
        {
            name: 'Tomato Late Blight - 15L Tank',
            disease: 'Late Blight',
            crop: 'Tomato',
            tankiSize: 15
        },
        {
            name: 'Rice Blast - 20L Tank',
            disease: 'Rice Blast',
            crop: 'Rice',
            tankiSize: 20
        },
        {
            name: 'Chili Anthracnose - 10L Tank',
            disease: 'Chili Anthracnose',
            crop: 'Chili',
            tankiSize: 10
        }
    ];

    for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📋 Scenario ${i + 1}: ${scenario.name}`);
        console.log(`${'='.repeat(60)}`);
        
        // Simulate quick calculation for each scenario
        await simulateQuickCalculation(scenario);
        
        if (i < scenarios.length - 1) {
            console.log('\n⏳ Moving to next scenario...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function simulateQuickCalculation(scenario) {
    console.log(`\n🤖 AI Doctor: Analyzing ${scenario.crop} ${scenario.disease}...`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const medicineQuantity = (scenario.tankiSize * 2.5).toFixed(1);
    const cost = (380 * medicineQuantity / 1000).toFixed(2);
    
    console.log(`\n📊 Quick Calculation for ${scenario.tankiSize}L tank:`);
    console.log(`💊 Medicine: ${scenario.disease} Treatment`);
    console.log(`📏 Quantity: ${medicineQuantity} grams`);
    console.log(`💧 Water: ${scenario.tankiSize} liters`);
    console.log(`💰 Cost: ₹${cost}`);
    console.log(`⏰ Frequency: Every 7 days`);
    console.log(`🔄 Total Applications: 3 times`);
}

// Main demo function
async function runDemo() {
    console.log('🚀 Starting AI Agricultural Doctor Demo...\n');
    
    // Run main conversation
    const doctor = new AIDoctorDemo();
    await doctor.startConversation();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Main Conversation Completed!');
    console.log('='.repeat(60));
    
    // Run multiple scenarios
    console.log('\n🔄 Now demonstrating multiple scenarios...\n');
    await runMultipleScenarios();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Demo completed successfully!');
    console.log('='.repeat(60));
    
    console.log('\n💡 Key Features Demonstrated:');
    console.log('   ✅ Proactive AI Doctor conversation');
    console.log('   ✅ Photo analysis and disease detection');
    console.log('   ✅ Tanki size-based calculations');
    console.log('   ✅ Complete medicine usage guide');
    console.log('   ✅ Multilingual support (Hindi/English)');
    console.log('   ✅ AI mind calculations (no external calculator)');
    console.log('   ✅ Safety precautions and timing');
    console.log('   ✅ Cost estimates and follow-up help');
    
    console.log('\n🌱 This AI Doctor provides complete agricultural guidance!');
}

// Run demo if called directly
if (require.main === module) {
    runDemo().catch(console.error);
}

module.exports = { AIDoctorDemo, runDemo };
