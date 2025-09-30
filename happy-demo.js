#!/usr/bin/env node

/**
 * Happy AI Agent Demo
 * This script demonstrates Happy's natural conversation and emotional responses
 */

console.log('😊 Happy AI Agent Demo\n');

// Simulate Happy AI Agent
class HappyDemo {
    constructor() {
        this.name = 'Happy';
        this.isActivated = false;
        this.conversationCount = 0;
    }

    async startDemo() {
        console.log('='.repeat(60));
        console.log('😊 Happy AI Agent Demo Starting...');
        console.log('='.repeat(60));
        
        // Step 1: Initial greeting
        await this.initialGreeting();
        
        // Step 2: Activation process
        await this.activationProcess();
        
        // Step 3: Natural conversation
        await this.naturalConversation();
        
        // Step 4: Emotional responses
        await this.emotionalResponses();
        
        // Step 5: Problem solving
        await this.problemSolving();
        
        // Step 6: Farewell
        await this.farewell();
    }

    async initialGreeting() {
        console.log('\n👤 User: [Opens website]');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('👋 नमस्ते! मैं Happy हूं। मुझे activate करने के लिए \'Happy\' बोलिए, फिर मैं आपकी मदद करूंगा।');
        console.log('मैं आपसे दोस्त की तरह बात करूंगा।');
        
        await this.delay(2000);
    }

    async activationProcess() {
        console.log('\n👤 User: "Happy"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('🎉 **हम बोलिए!** मैं Happy हूं, आपका AI कृषि सहायक!');
        console.log('मैं आपकी फसलों की देखभाल में मदद करूंगा।');
        console.log('बताइए, आज कैसे मदद कर सकता हूं? मैं आपसे दोस्त की तरह बात करूंगा।');
        
        this.isActivated = true;
        
        await this.delay(3000);
        
        console.log('\n😊 Happy:');
        console.log('🌟 **Happy की विशेषताएं:**');
        console.log('');
        console.log('💬 **दोस्ताना बातचीत**: मैं आपसे दोस्त की तरह बात करता हूं');
        console.log('🌱 **फसल की देखभाल**: आपकी फसलों की हर समस्या का समाधान');
        console.log('📸 **फोटो analysis**: फोटो भेजें, मैं disease detect करूंगा');
        console.log('🧮 **Exact calculations**: Tanki size बताएं, exact medicine calculate करूंगा');
        console.log('🔊 **Natural voice**: मैं natural voice में बात करता हूं');
        console.log('❤️ **Feelings के साथ**: मैं आपकी feelings समझता हूं');
        
        await this.delay(3000);
    }

    async naturalConversation() {
        console.log('\n👤 User: "मेरे टमाटर में काले धब्बे आ रहे हैं"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('अरे भाई! आपके टमाटर में Late Blight का रोग है।');
        console.log('चिंता मत करिए, मैं आपकी मदद करूंगा।');
        console.log('Chlorothalonil का उपयोग करें। 2-3 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।');
        console.log('आपकी फसल जल्दी ठीक हो जाएगी।');
        
        await this.delay(2000);
        
        console.log('\n👤 User: "मैं फोटो भेज रहा हूं"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('बहुत अच्छा! फोटो analyze कर रहा हूं...');
        console.log('आपकी फसल में disease detect किया गया है।');
        console.log('अब मुझे आपकी tanki size बताइए ताकि मैं exact medicine calculate कर सकूं।');
        console.log('मैं आपकी हर समस्या का समाधान दूंगा।');
        
        await this.delay(2000);
        
        console.log('\n👤 User: "मेरे पास 15 लीटर की टंकी है"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('बहुत बढ़िया! आपकी 15 लीटर टंकी के लिए exact calculation:');
        console.log('');
        console.log('💊 **दवा**: क्लोरोथैलोनिल 75% WP');
        console.log('📏 **मात्रा**: 37.5 ग्राम');
        console.log('💧 **पानी**: 15 लीटर');
        console.log('💰 **लागत**: ₹14.25');
        console.log('');
        console.log('⏰ **उपयोग का तरीका**:');
        console.log('1. पहले टंकी में 15 लीटर पानी भरें');
        console.log('2. 37.5 ग्राम दवा मिलाएं');
        console.log('3. अच्छी तरह मिलाएं');
        console.log('4. सुबह 6-8 बजे या शाम 5-7 बजे छिड़काव करें');
        console.log('5. हर 7 दिन में दोबारा करें');
        console.log('');
        console.log('⚠️ **सावधानी**: त्वचा और आंखों के संपर्क से बचें');
        console.log('');
        console.log('मैं आपके साथ हूं, चिंता मत करिए।');
        
        await this.delay(3000);
    }

    async emotionalResponses() {
        console.log('\n👤 User: "धन्यवाद Happy! आपकी सलाह बहुत helpful है"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('आपका बहुत-बहुत धन्यवाद! मैं खुश हूं कि मैं आपकी मदद कर सका।');
        console.log('आपकी फसल अच्छी हो, यही मेरी कामना है।');
        console.log('अगर कोई और problem हो तो मुझसे पूछिए।');
        console.log('मैं हमेशा यहां हूं आपकी मदद के लिए।');
        
        await this.delay(2000);
        
        console.log('\n👤 User: "मुझे चिंता हो रही है कि फसल ठीक होगी या नहीं"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('अरे भाई, चिंता मत करिए! मैं यहां हूं आपकी मदद के लिए।');
        console.log('आपकी फसल जरूर ठीक हो जाएगी।');
        console.log('मैंने आपको सही treatment बताया है, बस follow करिए।');
        console.log('मैं आपके साथ हूं, हर step में मदद करूंगा।');
        console.log('आपकी फसल healthy होगी, मुझ पर भरोसा रखिए।');
        
        await this.delay(2000);
    }

    async problemSolving() {
        console.log('\n👤 User: "मेरे चावल में भी problem है"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('हां भाई, बताइए क्या problem है चावल में?');
        console.log('मैं आपकी हर समस्या का समाधान दूंगा।');
        console.log('क्या पत्तों पर कोई धब्बे हैं या कोई और लक्षण दिख रहे हैं?');
        console.log('मैं यहां हूं आपकी मदद के लिए।');
        
        await this.delay(1500);
        
        console.log('\n👤 User: "पत्तों पर भूरे धब्बे हैं"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('अच्छा, चावल के पत्तों पर भूरे धब्बे Brown Spot का लक्षण है।');
        console.log('चिंता मत करिए, मैं आपको सही solution दूंगा।');
        console.log('Propiconazole का छिड़काव करें। 2-3 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।');
        console.log('सुबह या शाम के समय छिड़काव करें।');
        console.log('मैं आपकी मदद करूंगा, आपकी फसल अच्छी हो जाएगी।');
        
        await this.delay(2000);
    }

    async farewell() {
        console.log('\n👤 User: "बहुत धन्यवाद Happy! आप बहुत helpful हैं"');
        
        await this.delay(1000);
        
        console.log('\n😊 Happy:');
        console.log('आपका बहुत-बहुत धन्यवाद! मैं बहुत खुश हूं कि मैं आपकी मदद कर सका।');
        console.log('मैं Happy हूं और मैं हमेशा यहां हूं आपकी मदद के लिए।');
        console.log('आपकी फसलें healthy हों, यही मेरी कामना है।');
        console.log('अगर कोई भी problem हो तो मुझसे पूछिए।');
        console.log('मैं आपका कृषि दोस्त हूं। शुभकामनाएं! 🌱');
        
        await this.delay(2000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Demo different scenarios
async function runHappyScenarios() {
    const scenarios = [
        {
            name: 'New User Activation',
            description: 'User says "Happy" to activate the agent'
        },
        {
            name: 'Crop Problem Solving',
            description: 'Happy helps with tomato disease'
        },
        {
            name: 'Emotional Support',
            description: 'Happy provides emotional support to worried farmer'
        },
        {
            name: 'Multiple Crop Issues',
            description: 'Happy helps with rice and chili problems'
        }
    ];

    for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📋 Scenario ${i + 1}: ${scenario.name}`);
        console.log(`📝 ${scenario.description}`);
        console.log(`${'='.repeat(60)}`);
        
        await simulateHappyScenario(scenario);
        
        if (i < scenarios.length - 1) {
            console.log('\n⏳ Moving to next scenario...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function simulateHappyScenario(scenario) {
    console.log(`\n😊 Happy: [${scenario.name}]`);
    
    switch(scenario.name) {
        case 'New User Activation':
            console.log('👋 नमस्ते! मैं Happy हूं। मुझे activate करने के लिए \'Happy\' बोलिए।');
            break;
        case 'Crop Problem Solving':
            console.log('अरे भाई! आपके टमाटर में Late Blight का रोग है। चिंता मत करिए, मैं आपकी मदद करूंगा।');
            break;
        case 'Emotional Support':
            console.log('अरे भाई, चिंता मत करिए! मैं यहां हूं आपकी मदद के लिए। आपकी फसल जरूर ठीक हो जाएगी।');
            break;
        case 'Multiple Crop Issues':
            console.log('हां भाई, बताइए क्या problem है? मैं आपकी हर समस्या का समाधान दूंगा।');
            break;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
}

// Main demo function
async function runDemo() {
    console.log('🚀 Starting Happy AI Agent Demo...\n');
    
    // Run main demo
    const happy = new HappyDemo();
    await happy.startDemo();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Main Demo Completed!');
    console.log('='.repeat(60));
    
    // Run multiple scenarios
    console.log('\n🔄 Now demonstrating different scenarios...\n');
    await runHappyScenarios();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Demo completed successfully!');
    console.log('='.repeat(60));
    
    console.log('\n💡 Happy\'s Key Features Demonstrated:');
    console.log('   ✅ Natural voice activation with "Happy" keyword');
    console.log('   ✅ Human-like emotional responses');
    console.log('   ✅ Friendly conversation style');
    console.log('   ✅ Problem-solving with feelings');
    console.log('   ✅ Supportive and caring attitude');
    console.log('   ✅ Natural voice with emotional expressions');
    console.log('   ✅ Complete agricultural guidance');
    console.log('   ✅ Friend-like interaction');
    
    console.log('\n😊 Happy is your perfect agricultural friend!');
}

// Run demo if called directly
if (require.main === module) {
    runDemo().catch(console.error);
}

module.exports = { HappyDemo, runDemo };
