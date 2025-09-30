#!/usr/bin/env node

/**
 * Website Welcome Guide Demo
 * This script demonstrates the AI agent's website welcome and guide functionality
 */

console.log('🌐 Website Welcome Guide Demo\n');

// Simulate Website Welcome Flow
class WebsiteWelcomeDemo {
    constructor() {
        this.step = 0;
        this.isMuted = false;
    }

    async startWelcomeFlow() {
        console.log('='.repeat(60));
        console.log('🌐 User visits CropGuard AI website...');
        console.log('='.repeat(60));
        
        // Step 1: AI Agent Welcome
        await this.aiWelcome();
        
        // Step 2: Website Guide
        await this.websiteGuide();
        
        // Step 3: Quick Start Options
        await this.quickStartOptions();
        
        // Step 4: Mute Demo
        await this.muteDemo();
        
        // Step 5: User Interaction
        await this.userInteraction();
    }

    async aiWelcome() {
        console.log('\n🤖 AI Agent:');
        console.log('🎉 **नमस्ते! आपका स्वागत है CropGuard AI में!**');
        console.log('');
        console.log('मैं आपका AI कृषि डॉक्टर हूं। मैं आपकी फसलों की देखभाल में पूरी मदद करूंगा।');
        
        await this.delay(3000);
    }

    async websiteGuide() {
        console.log('\n🤖 AI Agent:');
        console.log('📱 **Website Guide - यहाँ आप क्या कर सकते हैं:**');
        console.log('');
        console.log('🌱 **Photo Analysis**: अपनी फसल की फोटो upload करें, मैं disease detect करूंगा');
        console.log('💬 **AI Chat**: मुझसे बात करें - Voice या Text में');
        console.log('📸 **Photo Upload**: मुझे फोटो भेजें, मैं scan करके analysis दूंगा');
        console.log('🧮 **Medicine Calculator**: Tanki size बताएं, मैं exact medicine calculate करूंगा');
        console.log('📚 **Disease Database**: सभी diseases और treatments की जानकारी');
        console.log('🔊 **Voice Support**: Hindi/English में बोलकर बात करें');
        console.log('');
        console.log('**कैसे शुरू करें?**');
        console.log('1. मुझे फोटो भेजें या बताएं कि कौन सी फसल में problem है');
        console.log('2. मैं disease detect करूंगा');
        console.log('3. आपकी tanki size बताएं');
        console.log('4. मैं exact medicine और usage guide दूंगा');
        
        await this.delay(4000);
    }

    async quickStartOptions() {
        console.log('\n🤖 AI Agent:');
        console.log('🚀 **Quick Start Options:**');
        console.log('');
        console.log('📸 **Photo भेजें**: \'Photo\' button पर click करें');
        console.log('🎤 **Voice में बात करें**: Microphone button दबाकर बोलें');
        console.log('⌨️ **Text में लिखें**: Type करके question पूछें');
        console.log('🔇 **Mute करें**: अगर voice नहीं चाहिए तो mute button दबाएं');
        console.log('');
        console.log('**Example Questions:**');
        console.log('• \'मेरे टमाटर में काले धब्बे आ रहे हैं\'');
        console.log('• \'Rice blast का treatment क्या है?\'');
        console.log('• \'Chili के लिए organic medicine बताएं\'');
        
        await this.delay(3000);
    }

    async muteDemo() {
        console.log('\n👤 User:');
        console.log('मुझे voice नहीं चाहिए, मैं mute करना चाहता हूं।');
        
        await this.delay(1000);
        
        console.log('\n🤖 AI Agent:');
        console.log('🔇 Voice muted');
        
        this.isMuted = true;
        
        await this.delay(1000);
        
        console.log('\n👤 User:');
        console.log('अब voice चालू कर दो।');
        
        await this.delay(1000);
        
        console.log('\n🤖 AI Agent:');
        console.log('🔊 Voice unmuted');
        
        this.isMuted = false;
        
        await this.delay(2000);
    }

    async userInteraction() {
        console.log('\n👤 User:');
        console.log('मेरे टमाटर में काले धब्बे आ रहे हैं।');
        
        await this.delay(1000);
        
        console.log('\n🤖 AI Agent:');
        console.log('मैं आपकी मदद करूंगा! कृपया अपने टमाटर की फोटो भेजें या मुझे बताएं कि:');
        console.log('• कितने दिन से यह problem है?');
        console.log('• कौन से पत्तों पर धब्बे हैं?');
        console.log('• मौसम कैसा है?');
        console.log('• आपने कोई treatment try किया है?');
        
        await this.delay(2000);
        
        console.log('\n👤 User:');
        console.log('मैं फोटो भेज रहा हूं...');
        
        await this.delay(1500);
        
        console.log('\n🤖 AI Agent:');
        console.log('फोटो को scan कर रहा हूं...');
        console.log('मैंने आपकी फोटो देखी है। आपकी टमाटर में लेट ब्लाइट का रोग है।');
        console.log('Confidence: 85%');
        console.log('यह एक गंभीर रोग है जो तुरंत उपचार चाहता है।');
        
        await this.delay(2000);
        
        console.log('\n🤖 AI Agent:');
        console.log('अब मुझे बताइए कि आप कितने लीटर की टंकी का उपयोग करेंगे?');
        console.log('(जैसे 10, 15, 20 लीटर)');
        
        await this.delay(1500);
        
        console.log('\n👤 User:');
        console.log('मेरे पास 15 लीटर की टंकी है।');
        
        await this.delay(1000);
        
        console.log('\n🤖 AI Agent:');
        console.log('बहुत अच्छा! आपकी 15 लीटर टंकी के लिए मैं आपको exact calculation देता हूं:');
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
        
        await this.delay(3000);
        
        console.log('\n🤖 AI Agent:');
        console.log('क्या आपको कोई और सवाल है? या आप किसी और फसल की फोटो भेजना चाहते हैं?');
        
        await this.delay(1500);
        
        console.log('\n👤 User:');
        console.log('धन्यवाद! बहुत helpful है। मैं तुरंत इस treatment को follow करूंगा।');
        
        await this.delay(1000);
        
        console.log('\n🤖 AI Agent:');
        console.log('बहुत अच्छा! मैं आपके साथ हूं। अगर कोई समस्या आए तो मुझसे पूछ सकते हैं।');
        console.log('आपकी फसल जल्दी ठीक हो जाएगी। शुभकामनाएं! 🌱');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Demo different welcome scenarios
async function runWelcomeScenarios() {
    const scenarios = [
        {
            name: 'New User - Hindi',
            language: 'hi',
            userType: 'new'
        },
        {
            name: 'New User - English',
            language: 'en',
            userType: 'new'
        },
        {
            name: 'Returning User',
            language: 'hi',
            userType: 'returning'
        }
    ];

    for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📋 Welcome Scenario ${i + 1}: ${scenario.name}`);
        console.log(`${'='.repeat(60)}`);
        
        await simulateWelcomeScenario(scenario);
        
        if (i < scenarios.length - 1) {
            console.log('\n⏳ Moving to next scenario...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function simulateWelcomeScenario(scenario) {
    const isHindi = scenario.language === 'hi';
    
    console.log(`\n🌐 User visits website (${scenario.language.toUpperCase()})...`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (scenario.userType === 'new') {
        console.log(`\n🤖 AI Agent:`);
        console.log(isHindi ? 
            '🎉 **नमस्ते! आपका स्वागत है CropGuard AI में!**' :
            '🎉 **Welcome to CropGuard AI!**'
        );
        console.log(isHindi ?
            'मैं आपका AI कृषि डॉक्टर हूं। मैं आपकी फसलों की देखभाल में पूरी मदद करूंगा।' :
            'I\'m your AI Agricultural Doctor. I\'ll help you take care of your crops completely.'
        );
    } else {
        console.log(`\n🤖 AI Agent:`);
        console.log(isHindi ?
            'नमस्ते! फिर से आपका स्वागत है। आज कैसे मदद कर सकता हूं?' :
            'Hello! Welcome back. How can I help you today?'
        );
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`\n📱 Website Guide shown in ${scenario.language.toUpperCase()}`);
    console.log(`🔊 Voice support: ${isHindi ? 'Hindi' : 'English'}`);
    console.log(`🔇 Mute option available`);
    console.log(`📸 Photo upload ready`);
    console.log(`💬 Chat interface active`);
}

// Main demo function
async function runDemo() {
    console.log('🚀 Starting Website Welcome Guide Demo...\n');
    
    // Run main welcome flow
    const welcome = new WebsiteWelcomeDemo();
    await welcome.startWelcomeFlow();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Main Welcome Flow Completed!');
    console.log('='.repeat(60));
    
    // Run multiple scenarios
    console.log('\n🔄 Now demonstrating different welcome scenarios...\n');
    await runWelcomeScenarios();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Demo completed successfully!');
    console.log('='.repeat(60));
    
    console.log('\n💡 Key Features Demonstrated:');
    console.log('   ✅ Automatic AI welcome when user visits');
    console.log('   ✅ Complete website guide and features');
    console.log('   ✅ Quick start options and examples');
    console.log('   ✅ Mute/unmute functionality');
    console.log('   ✅ Multilingual support (Hindi/English)');
    console.log('   ✅ User-friendly interface guidance');
    console.log('   ✅ Proactive conversation flow');
    console.log('   ✅ Complete agricultural assistance');
    
    console.log('\n🌐 This AI Agent provides complete website guidance!');
}

// Run demo if called directly
if (require.main === module) {
    runDemo().catch(console.error);
}

module.exports = { WebsiteWelcomeDemo, runDemo };
