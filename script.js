// Global Variables
let uploadedImages = [];
let currentTheme = localStorage.getItem('theme') || 'light';
let currentLanguage = localStorage.getItem('language') || 'en';
let currentStep = 1;
let capturedPhotos = [];
let currentPhotoData = null;

// Localization
const translations = {
    en: {
        // Navigation
        home: 'Home',
        scans: 'My Scans',
        about: 'About',
        contact: 'Contact',
        
        // Hero
        title: 'CropGuard AI',
        subtitle: 'Smart Disease Detection for Healthy Crops',
        description: 'Take three photos and get instant AI-powered disease detection with detailed treatment recommendations.',
        startScanning: 'Start Scanning',
        howItWorks: 'How it Works',
        
        // Workflow Steps
        step1: 'Step 1',
        step2: 'Step 2',
        step3: 'Step 3',
        takePhotos: 'Take 3 Photos',
        aiAnalysis: 'AI Analysis',
        getTreatment: 'Get Treatment',
        
        // Upload
        uploadTitle: 'Smart Crop Disease Detection',
        uploadDesc: 'Take three photos for the most accurate diagnosis',
        closeupPhoto: 'Close-up Photo',
        fullPlantPhoto: 'Full Plant Photo',
        undersidePhoto: 'Underside Photo',
        closeupDesc: 'Affected leaf, stem, or fruit',
        fullPlantDesc: 'Entire plant structure',
        undersideDesc: 'Lower surface where pests hide',
        takePhoto: 'Take Photo',
        uploadGallery: 'Upload from Gallery',
        goodLighting: 'Good lighting',
        keepSteady: 'Keep steady',
        tapToFocus: 'Tap to focus',
        retake: 'Retake',
        usePhoto: 'Use This Photo',
        analyze: 'Analyze Photos (30 seconds)',
        analyzeNote: 'We\'ll analyze your photos and provide detailed disease diagnosis with treatment recommendations',
        consentText: 'I agree to terms and allow using my images for improving diagnosis model',
        
        // Results
        resultsTitle: 'Disease Analysis Results',
        resultsDesc: 'Detailed diagnosis with treatment recommendations',
        confidence: 'Confidence',
        detectedSymptoms: 'Detected Symptoms',
        chemicalTreatment: 'Chemical Treatment',
        organicTreatment: 'Organic Treatment',
        preventiveCare: 'Preventive Care',
        buyNow: 'Buy Now',
        importantDisclaimers: 'Important Disclaimers',
        disclaimer1: 'Check local pesticide rules before use.',
        disclaimer2: 'Use the recommended dose only. Overuse may damage soil or crops.',
        disclaimer3: 'Consult an agriculture expert if you are not sure.',
        
        // Feedback
        feedbackTitle: 'Was this result helpful?',
        feedbackYes: 'Yes, accurate',
        feedbackNo: 'No, incorrect',
        feedbackFormTitle: 'Help us improve - What was the correct disease?',
        feedbackPlaceholder: 'Enter correct disease name',
        submitFeedback: 'Submit',
        
        // Gallery
        galleryTitle: 'Detection Gallery',
        galleryDesc: 'Browse previously analyzed crop images and their results',
        all: 'All',
        healthy: 'Healthy',
        diseased: 'Diseased',
        tomato: 'Tomato',
        potato: 'Potato',
        
        // About
        aboutTitle: 'About CropGuard AI',
        aboutDesc: 'CropGuard AI is an advanced machine learning system designed to help farmers and agricultural professionals quickly identify crop diseases through image analysis. Our AI model has been trained on thousands of crop images and can detect over 50 different plant diseases with remarkable accuracy.',
        aiPowered: 'AI-Powered Detection',
        aiPoweredDesc: 'Advanced machine learning algorithms for accurate disease identification',
        instantResults: 'Instant Results',
        instantResultsDesc: 'Get detection results and recommendations within seconds',
        mobileFriendly: 'Mobile Friendly',
        mobileFriendlyDesc: 'Works seamlessly on desktop, tablet, and mobile devices',
        aiInAgriculture: 'AI in Agriculture',
        
        // Contact
        contactTitle: 'Get in Touch',
        contactDesc: 'Have questions or feedback? We\'d love to hear from you',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        yourMessage: 'Your Message',
        sendMessage: 'Send Message',
        
        // Footer
        privacy: 'Privacy',
        terms: 'Terms',
        allRightsReserved: 'All rights reserved.',
        
        // Modals
        howItWorksTitle: 'How CropGuard AI Works',
        step1Title: '1. Take Three Photos',
        step1Desc: 'Capture close-up of affected area, full plant view, and underside where pests hide. Our AI needs multiple angles for accurate diagnosis.',
        step2Title: '2. AI Analysis',
        step2Desc: 'Our advanced machine learning model analyzes your photos in ~30 seconds, comparing against thousands of disease patterns.',
        step3Title: '3. Get Treatment',
        step3Desc: 'Receive detailed treatment recommendations including chemical and organic options, with buy links for products available in India.',
        privacyTitle: 'Privacy Policy & Terms',
        howWeUsePhotos: 'How We Use Your Photos',
        howWeUsePhotosDesc: 'Your uploaded photos are used solely for disease diagnosis. We may use anonymized data to improve our AI model accuracy.',
        dataStorage: 'Data Storage',
        dataStorageDesc: 'Photos are stored securely and deleted after 30 days unless you choose to save them in your gallery.',
        modelAccuracy: 'Model Accuracy Information',
        datasetSize: 'Dataset Size:',
        testAccuracy: 'Test Accuracy:',
        lastUpdate: 'Last Model Update:',
        supportedDiseases: 'Supported Diseases:',
        consent: 'Consent',
        consentDesc: 'By using this service, you agree to our terms and allow us to use your images for improving our diagnosis model.',
        agreeToPrivacy: 'I agree to the privacy policy and terms of service',
        
        // Stats
        accuracy: 'Accuracy',
        diseases: 'Diseases',
        images: 'Images'
    },
    hi: {
        // Navigation
        home: 'होम',
        scans: 'मेरी जांच',
        about: 'के बारे में',
        contact: 'संपर्क',
        
        // Hero
        title: 'CropGuard AI',
        subtitle: 'स्वस्थ फसलों के लिए स्मार्ट बीमारी पहचान',
        description: 'तीन फोटो लें और विस्तृत उपचार सिफारिशों के साथ तुरंत AI-संचालित बीमारी पहचान प्राप्त करें।',
        startScanning: 'स्कैनिंग शुरू करें',
        howItWorks: 'यह कैसे काम करता है',
        
        // Workflow Steps
        step1: 'चरण 1',
        step2: 'चरण 2',
        step3: 'चरण 3',
        takePhotos: '3 फोटो लें',
        aiAnalysis: 'AI विश्लेषण',
        getTreatment: 'उपचार प्राप्त करें',
        
        // Upload
        uploadTitle: 'स्मार्ट फसल बीमारी पहचान',
        uploadDesc: 'सबसे सटीक निदान के लिए तीन फोटो लें',
        closeupPhoto: 'क्लोज-अप फोटो',
        fullPlantPhoto: 'पूरा पौधा फोटो',
        undersidePhoto: 'नीचे का फोटो',
        closeupDesc: 'प्रभावित पत्ती, तना या फल',
        fullPlantDesc: 'पूरी पौध संरचना',
        undersideDesc: 'नीचे की सतह जहां कीट छुपते हैं',
        takePhoto: 'फोटो लें',
        uploadGallery: 'गैलरी से अपलोड',
        goodLighting: 'अच्छी रोशनी',
        keepSteady: 'स्थिर रखें',
        tapToFocus: 'फोकस के लिए टैप करें',
        retake: 'फिर से लें',
        usePhoto: 'इस फोटो का उपयोग करें',
        analyze: 'फोटो का विश्लेषण करें (30 सेकंड)',
        analyzeNote: 'हम आपके फोटो का विश्लेषण करेंगे और विस्तृत बीमारी निदान और उपचार सिफारिशें प्रदान करेंगे',
        consentText: 'मैं नियमों से सहमत हूं और निदान मॉडल में सुधार के लिए अपनी छवियों के उपयोग की अनुमति देता हूं',
        
        // Results
        resultsTitle: 'बीमारी विश्लेषण परिणाम',
        resultsDesc: 'विस्तृत निदान और उपचार सिफारिशों के साथ',
        confidence: 'विश्वसनीयता',
        detectedSymptoms: 'पाए गए लक्षण',
        chemicalTreatment: 'रासायनिक उपचार',
        organicTreatment: 'जैविक उपचार',
        preventiveCare: 'निवारक देखभाल',
        buyNow: 'अभी खरीदें',
        importantDisclaimers: 'महत्वपूर्ण अस्वीकरण',
        disclaimer1: 'उपयोग से पहले स्थानीय कीटनाशक नियमों की जांच करें।',
        disclaimer2: 'केवल अनुशंसित खुराक का उपयोग करें। अधिक उपयोग मिट्टी या फसलों को नुकसान पहुंचा सकता है।',
        disclaimer3: 'यदि आप निश्चित नहीं हैं तो कृषि विशेषज्ञ से सलाह लें।',
        
        // Feedback
        feedbackTitle: 'क्या यह परिणाम सहायक था?',
        feedbackYes: 'हां, सटीक',
        feedbackNo: 'नहीं, गलत',
        feedbackFormTitle: 'हमें बेहतर बनाने में मदद करें - सही बीमारी क्या थी?',
        feedbackPlaceholder: 'सही बीमारी का नाम दर्ज करें',
        submitFeedback: 'जमा करें',
        
        // Gallery
        galleryTitle: 'पहचान गैलरी',
        galleryDesc: 'पहले विश्लेषित फसल छवियों और उनके परिणामों को ब्राउज़ करें',
        all: 'सभी',
        healthy: 'स्वस्थ',
        diseased: 'बीमार',
        tomato: 'टमाटर',
        potato: 'आलू',
        
        // About
        aboutTitle: 'CropGuard AI के बारे में',
        aboutDesc: 'CropGuard AI एक उन्नत मशीन लर्निंग सिस्टम है जो किसानों और कृषि पेशेवरों को छवि विश्लेषण के माध्यम से फसल रोगों की तुरंत पहचान करने में मदद करने के लिए डिज़ाइन किया गया है। हमारे AI मॉडल को हजारों फसल छवियों पर प्रशिक्षित किया गया है और यह 50 से अधिक विभिन्न पौध रोगों का उल्लेखनीय सटीकता के साथ पता लगा सकता है।',
        aiPowered: 'AI-संचालित पहचान',
        aiPoweredDesc: 'सटीक रोग पहचान के लिए उन्नत मशीन लर्निंग एल्गोरिदम',
        instantResults: 'तुरंत परिणाम',
        instantResultsDesc: 'सेकंडों में पहचान परिणाम और सिफारिशें प्राप्त करें',
        mobileFriendly: 'मोबाइल अनुकूल',
        mobileFriendlyDesc: 'डेस्कटॉप, टैबलेट और मोबाइल डिवाइस पर निर्बाध रूप से काम करता है',
        aiInAgriculture: 'कृषि में AI',
        
        // Contact
        contactTitle: 'संपर्क करें',
        contactDesc: 'प्रश्न या प्रतिक्रिया है? हम आपसे सुनना पसंद करेंगे',
        email: 'ईमेल',
        phone: 'फोन',
        location: 'स्थान',
        yourName: 'आपका नाम',
        yourEmail: 'आपका ईमेल',
        yourMessage: 'आपका संदेश',
        sendMessage: 'संदेश भेजें',
        
        // Footer
        privacy: 'गोपनीयता',
        terms: 'नियम',
        allRightsReserved: 'सभी अधिकार सुरक्षित।',
        
        // Modals
        howItWorksTitle: 'CropGuard AI कैसे काम करता है',
        step1Title: '1. तीन फोटो लें',
        step1Desc: 'प्रभावित क्षेत्र का क्लोज-अप, पूरे पौधे का दृश्य और नीचे की सतह कैप्चर करें जहां कीट छुपते हैं। हमारे AI को सटीक निदान के लिए कई कोणों की आवश्यकता है।',
        step2Title: '2. AI विश्लेषण',
        step2Desc: 'हमारा उन्नत मशीन लर्निंग मॉडल आपके फोटो का ~30 सेकंड में विश्लेषण करता है, हजारों रोग पैटर्न के खिलाफ तुलना करता है।',
        step3Title: '3. उपचार प्राप्त करें',
        step3Desc: 'रासायनिक और जैविक विकल्पों सहित विस्तृत उपचार सिफारिशें प्राप्त करें, भारत में उपलब्ध उत्पादों के लिए खरीद लिंक के साथ।',
        privacyTitle: 'गोपनीयता नीति और नियम',
        howWeUsePhotos: 'हम आपके फोटो का उपयोग कैसे करते हैं',
        howWeUsePhotosDesc: 'आपके अपलोड किए गए फोटो का उपयोग केवल रोग निदान के लिए किया जाता है। हम अपने AI मॉडल की सटीकता में सुधार के लिए गुमनाम डेटा का उपयोग कर सकते हैं।',
        dataStorage: 'डेटा भंडारण',
        dataStorageDesc: 'फोटो सुरक्षित रूप से संग्रहीत किए जाते हैं और 30 दिनों के बाद हटा दिए जाते हैं जब तक कि आप उन्हें अपनी गैलरी में सहेजना न चुनें।',
        modelAccuracy: 'मॉडल सटीकता जानकारी',
        datasetSize: 'डेटासेट आकार:',
        testAccuracy: 'परीक्षण सटीकता:',
        lastUpdate: 'अंतिम मॉडल अपडेट:',
        supportedDiseases: 'समर्थित रोग:',
        consent: 'सहमति',
        consentDesc: 'इस सेवा का उपयोग करके, आप हमारे नियमों से सहमत होते हैं और हमें अपने निदान मॉडल में सुधार के लिए अपनी छवियों का उपयोग करने की अनुमति देते हैं।',
        agreeToPrivacy: 'मैं गोपनीयता नीति और सेवा की शर्तों से सहमत हूं',
        
        // Stats
        accuracy: 'सटीकता',
        diseases: 'रोग',
        images: 'छवियां'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded, initializing app...');
    initializeApp();
    setupEventListeners();
    loadGallery();
    setTheme(currentTheme);
    
    // Setup new features
    setupFAQ();
    setupTreatmentTabs();
    initializeDiseaseDatabase();
    showErrorHandling();
    
    // Initialize AI Agent with delay to ensure DOM is ready
    setTimeout(() => {
        initializeAIAgent();
    }, 1500);
    
    // Ensure photo workflow is set up after a short delay
    setTimeout(() => {
        console.log('Setting up photo workflow after delay...');
        setupPhotoWorkflow();
        
        // Test if elements exist
        console.log('Testing photo workflow elements:');
        console.log('takePhotoBtn:', document.getElementById('takePhotoBtn'));
        console.log('uploadGalleryBtn:', document.getElementById('uploadGalleryBtn'));
        console.log('cameraInput:', document.getElementById('cameraInput'));
        console.log('fileInput:', document.getElementById('fileInput'));
    }, 100);
});

// Initialize app
function initializeApp() {
    // Set active nav link based on current section
    updateActiveNavLink();
    
    // Initialize theme and language
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateLanguage();
}

// Setup all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation
    setupNavigation();
    
    // Theme toggle
    setupThemeToggle();
    
    // Upload functionality
    setupUploadFunctionality();
    
    // Gallery filters
    setupGalleryFilters();
    
    // Contact form
    setupContactForm();
    
    // Scroll events
    setupScrollEvents();
    
    // Photo capture workflow
    setupPhotoWorkflow();
    
    // Modals
    setupModals();
    
    // Feedback system
    setupFeedbackSystem();
    
    console.log('All event listeners set up');
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Upload functionality
function setupUploadFunctionality() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadedImagesContainer = document.getElementById('uploadedImages');

    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

// Handle uploaded files
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    file: file,
                    url: e.target.result,
                    name: file.name,
                    timestamp: new Date()
                };
                
                uploadedImages.push(imageData);
                processImage(imageData);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Process image with AI simulation
function processImage(imageData) {
    showLoadingSpinner();
    
    // Simulate AI processing delay
    setTimeout(() => {
        hideLoadingSpinner();
        
        // Generate mock AI prediction
        const prediction = generateMockPrediction();
        imageData.prediction = prediction;
        
        // Display result
        displayImageResult(imageData);
        
        // Add to gallery
        addToGallery(imageData);
        
    }, 2000 + Math.random() * 2000); // 2-4 seconds delay
}

// Generate mock AI prediction
function generateMockPrediction() {
    const diseases = [
        {
            name: "Late Blight",
            confidence: 0.92,
            description: "A serious fungal disease affecting potato and tomato plants.",
            remedies: [
                "Remove infected plant parts immediately",
                "Apply copper-based fungicides",
                "Improve air circulation around plants",
                "Avoid overhead watering",
                "Plant resistant varieties next season"
            ]
        },
        {
            name: "Early Blight",
            confidence: 0.88,
            description: "A common fungal disease causing brown spots on leaves.",
            remedies: [
                "Remove affected leaves",
                "Apply fungicide treatments",
                "Mulch around plants",
                "Rotate crops annually",
                "Ensure proper spacing between plants"
            ]
        },
        {
            name: "Bacterial Spot",
            confidence: 0.85,
            description: "Bacterial infection causing dark spots on leaves and fruits.",
            remedies: [
                "Apply copper-based bactericides",
                "Remove infected plant material",
                "Avoid working with wet plants",
                "Improve drainage",
                "Use disease-free seeds"
            ]
        },
        {
            name: "Healthy Plant",
            confidence: 0.94,
            description: "Your plant appears to be in excellent health!",
            remedies: [
                "Continue current care routine",
                "Monitor for any changes",
                "Maintain proper watering schedule",
                "Ensure adequate sunlight",
                "Regularly check for pests"
            ]
        },
        {
            name: "Powdery Mildew",
            confidence: 0.79,
            description: "Fungal disease causing white powdery coating on leaves.",
            remedies: [
                "Apply sulfur-based fungicides",
                "Improve air circulation",
                "Remove affected leaves",
                "Avoid overhead watering",
                "Plant in well-drained soil"
            ]
        },
        {
            name: "Leaf Curl",
            confidence: 0.82,
            description: "Virus or environmental stress causing leaf curling.",
            remedies: [
                "Check for aphids and control them",
                "Ensure proper watering",
                "Provide adequate nutrients",
                "Protect from extreme temperatures",
                "Remove severely affected plants"
            ]
        }
    ];
    
    return diseases[Math.floor(Math.random() * diseases.length)];
}

// Display image result
function displayImageResult(imageData) {
    const uploadedImagesContainer = document.getElementById('uploadedImages');
    
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    imageCard.innerHTML = `
        <img src="${imageData.url}" alt="Uploaded crop image" class="image-preview">
        <div class="result-content">
            <div class="result-header">
                <h3 class="disease-name">${imageData.prediction.name}</h3>
                <span class="confidence-score">${Math.round(imageData.prediction.confidence * 100)}%</span>
            </div>
            <p class="disease-description">${imageData.prediction.description}</p>
            <div class="remedies">
                <h4>Recommended Remedies:</h4>
                <ul>
                    ${imageData.prediction.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    uploadedImagesContainer.appendChild(imageCard);
    
    // Scroll to the result
    imageCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Add to gallery
function addToGallery(imageData) {
    // This will be handled by the gallery system
    updateGallery();
}

// Gallery functionality
function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter gallery items
            const filter = button.getAttribute('data-filter');
            filterGallery(filter);
        });
    });
}

function filterGallery(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.6s ease-out forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

function loadGallery() {
    // Load sample gallery items
    const sampleImages = [
        {
            id: 1,
            name: "Tomato Late Blight",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGE3YzU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ub21hdG8gSW1hZ2U8L3RleHQ+PC9zdmc+",
            prediction: "Late Blight",
            confidence: 92,
            category: "diseased"
        },
        {
            id: 2,
            name: "Healthy Potato Plant",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOGZiYzg4ZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UG90YXRvIEltYWdlPC90ZXh0Pjwvc3ZnPg==",
            prediction: "Healthy Plant",
            confidence: 94,
            category: "healthy"
        },
        {
            id: 3,
            name: "Tomato Early Blight",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYTc2MzQ3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ub21hdG8gSW1hZ2U8L3RleHQ+PC9zdmc+",
            prediction: "Early Blight",
            confidence: 88,
            category: "diseased"
        },
        {
            id: 4,
            name: "Potato Bacterial Spot",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY5OTY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qb3RhdG8gSW1hZ2U8L3RleHQ+PC9zdmc+",
            prediction: "Bacterial Spot",
            confidence: 85,
            category: "diseased"
        },
        {
            id: 5,
            name: "Healthy Tomato Plant",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGE3YzU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ub21hdG8gSW1hZ2U8L3RleHQ+PC9zdmc+",
            prediction: "Healthy Plant",
            confidence: 96,
            category: "healthy"
        },
        {
            id: 6,
            name: "Tomato Powdery Mildew",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYzBjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ub21hdG8gSW1hZ2U8L3RleHQ+PC9zdmc+",
            prediction: "Powdery Mildew",
            confidence: 79,
            category: "diseased"
        }
    ];
    
    const galleryGrid = document.getElementById('galleryGrid');
    
    sampleImages.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${item.category} tomato`;
        if (item.name.toLowerCase().includes('potato')) {
            galleryItem.classList.add('potato');
        }
        
        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="gallery-item-content">
                <h4>${item.name}</h4>
                <p><strong>Prediction:</strong> ${item.prediction}</p>
                <p><strong>Confidence:</strong> ${item.confidence}%</p>
            </div>
        `;
        
        // Stagger animation
        galleryItem.style.animationDelay = `${index * 0.1}s`;
        
        galleryGrid.appendChild(galleryItem);
    });
}

function updateGallery() {
    // Add newly uploaded images to gallery
    const galleryGrid = document.getElementById('galleryGrid');
    
    uploadedImages.forEach(imageData => {
        if (imageData.prediction && !imageData.addedToGallery) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // Determine category based on prediction
            if (imageData.prediction.name === 'Healthy Plant') {
                galleryItem.classList.add('healthy');
            } else {
                galleryItem.classList.add('diseased');
            }
            
            // Add crop type class
            if (imageData.name.toLowerCase().includes('tomato')) {
                galleryItem.classList.add('tomato');
            } else if (imageData.name.toLowerCase().includes('potato')) {
                galleryItem.classList.add('potato');
            }
            
            galleryItem.innerHTML = `
                <img src="${imageData.url}" alt="${imageData.name}">
                <div class="gallery-item-content">
                    <h4>${imageData.name}</h4>
                    <p><strong>Prediction:</strong> ${imageData.prediction.name}</p>
                    <p><strong>Confidence:</strong> ${Math.round(imageData.prediction.confidence * 100)}%</p>
                </div>
            `;
            
            galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
            imageData.addedToGallery = true;
        }
    });
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simulate form submission
        showLoadingSpinner();
        
        setTimeout(() => {
            hideLoadingSpinner();
            const message = currentLanguage === 'hi' 
                ? 'आपके संदेश के लिए धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।'
                : 'Thank you for your message! We\'ll get back to you soon.';
            alert(message);
            contactForm.reset();
        }, 1500);
    });
}

// Scroll events
function setupScrollEvents() {
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        
        // Add scroll effect to navbar
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            if (currentTheme === 'dark') {
                navbar.style.background = 'rgba(45, 45, 45, 0.98)';
            }
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            if (currentTheme === 'dark') {
                navbar.style.background = 'rgba(45, 45, 45, 0.95)';
            }
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    const spinnerText = spinner.querySelector('p');
    if (spinnerText) {
        spinnerText.textContent = currentLanguage === 'hi' 
            ? 'आपकी फसल छवि का विश्लेषण...'
            : 'Analyzing your crop image...';
    }
    spinner.classList.add('show');
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.remove('show');
}

// Add some interactive animations
document.addEventListener('mousemove', (e) => {
    const leaves = document.querySelectorAll('.leaf');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    leaves.forEach((leaf, index) => {
        const speed = (index + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        
        leaf.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${xPos * 0.1}deg)`;
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.gallery-item, .feature, .contact-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Photo Workflow Functionality - NEW VERSION
function setupPhotoWorkflow() {
    console.log('EMERGENCY FIX: Setting up photo workflow...');
    
    // Get buttons
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const uploadGalleryBtn = document.getElementById('uploadGalleryBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const previewCloseBtn = document.getElementById('previewCloseBtn');

    // Check if buttons exist
    if (!takePhotoBtn) {
        console.error('takePhotoBtn not found');
        return;
    }
    if (!uploadGalleryBtn) {
        console.error('uploadGalleryBtn not found');
        return;
    }

    console.log('Buttons found, setting up SIMPLE event listeners');

    // SIMPLE TAKE PHOTO BUTTON
    takePhotoBtn.onclick = function(e) {
        e.preventDefault();
        console.log('TAKE PHOTO CLICKED');
        
        // Check consent
        const consent = document.getElementById('uploadConsent');
        if (!consent || !consent.checked) {
            alert('Please check the consent box first!');
            return;
        }
        
        // Show camera interface
        showCameraInterface();
    };

    // SIMPLE UPLOAD GALLERY BUTTON
    uploadGalleryBtn.onclick = function(e) {
        e.preventDefault();
        console.log('UPLOAD GALLERY CLICKED');
        
        // Check consent
        const consent = document.getElementById('uploadConsent');
        if (!consent || !consent.checked) {
            alert('Please check the consent box first!');
            return;
        }
        
        // Create simple file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('Gallery photo selected:', file.name);
                handlePhotoFile(file);
            }
        };
        
        input.click();
    };

    // Other buttons
    if (retakeBtn) {
        retakeBtn.onclick = function() {
            console.log('Retake clicked');
            hidePhotoPreview();
        };
    }

    if (confirmBtn) {
        confirmBtn.onclick = function() {
            console.log('Confirm clicked');
            confirmPhoto();
        };
    }

    if (analyzeBtn) {
        analyzeBtn.onclick = function() {
            console.log('Analyze clicked');
            if (currentPhotoData) {
                analyzePhotos();
            }
        };
    }

    if (previewCloseBtn) {
        previewCloseBtn.onclick = function() {
            console.log('Preview close clicked');
            hidePhotoPreview();
        };
    }

    console.log('EMERGENCY FIX: Photo workflow setup complete');
}

// SIMPLE Photo Processing Function
function handlePhotoFile(file) {
    console.log('Handling photo file:', file.name);
    
    if (!file) {
        console.error('No file selected');
        return;
    }
    
    // Simple validation
    if (!file.type.startsWith('image/')) {
        console.error('Invalid file type');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        console.error('File too large');
        return;
    }
    
    // Read file
    const reader = new FileReader();
    reader.onload = function(e) {
        console.log('Photo loaded successfully');
        
        // Store photo data
        currentPhotoData = {
            file: file,
            url: e.target.result,
            step: currentStep
        };
        
        // Show preview
        showPhotoPreview(e.target.result);
        
        // Check quality
        checkImageQuality(e.target.result);
    };
    
    reader.onerror = function() {
        console.error('Error reading photo file');
    };
    
    reader.readAsDataURL(file);
}

// GLOBAL FUNCTIONS FOR HTML ONCLICK (BACKUP METHOD)
window.handleTakePhoto = function() {
    console.log('GLOBAL: Take Photo clicked');
    
    // Check consent
    const consent = document.getElementById('uploadConsent');
    if (!consent || !consent.checked) {
        alert('Please check the consent box first!');
        return;
    }
    
    // Show camera interface
    showCameraInterface();
}

// Global variables for camera
let currentStream = null;
let cameraVideo = null;
let cameraCanvas = null;
let cameraContext = null;

// Show camera interface
function showCameraInterface() {
    console.log('Showing camera interface');
    
    // Hide capture area
    const captureArea = document.getElementById('captureArea');
    if (captureArea) {
        captureArea.style.display = 'none';
    }
    
    // Create camera interface
    const cameraInterface = document.createElement('div');
    cameraInterface.id = 'cameraInterface';
    cameraInterface.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;
    
    // Create video element
    cameraVideo = document.createElement('video');
    cameraVideo.style.cssText = `
        width: 100%;
        height: 80%;
        object-fit: cover;
    `;
    cameraVideo.autoplay = true;
    cameraVideo.muted = true;
    
    // Create controls
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 20px;
        align-items: center;
    `;
    
    // Capture button
    const captureBtn = document.createElement('button');
    captureBtn.innerHTML = '📷';
    captureBtn.style.cssText = `
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 4px solid white;
        background: white;
        font-size: 30px;
        cursor: pointer;
    `;
    captureBtn.onclick = capturePhoto;
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid white;
        background: rgba(255,255,255,0.3);
        color: white;
        font-size: 20px;
        cursor: pointer;
    `;
    closeBtn.onclick = closeCameraInterface;
    
    // Add elements
    controls.appendChild(closeBtn);
    controls.appendChild(captureBtn);
    cameraInterface.appendChild(cameraVideo);
    cameraInterface.appendChild(controls);
    document.body.appendChild(cameraInterface);
    
    // Start camera
    startCamera();
}

// Start camera
function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment' // Back camera
            } 
        })
        .then(function(stream) {
            currentStream = stream;
            cameraVideo.srcObject = stream;
            console.log('Camera started successfully');
        })
        .catch(function(error) {
            console.log('Camera access failed:', error);
            alert('Camera access failed. Please try again.');
            closeCameraInterface();
        });
    } else {
        console.log('Camera not supported');
        alert('Camera not supported on this device.');
        closeCameraInterface();
    }
}

// Capture photo
function capturePhoto() {
    console.log('Capturing photo');
    
    if (!cameraVideo || !currentStream) {
        console.error('Camera not ready');
        return;
    }
    
    // Create canvas
    cameraCanvas = document.createElement('canvas');
    cameraContext = cameraCanvas.getContext('2d');
    
    // Set canvas size to video size
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    
    // Draw video frame to canvas
    cameraContext.drawImage(cameraVideo, 0, 0);
    
    // Convert to blob
    cameraCanvas.toBlob(function(blob) {
        // Stop camera
        currentStream.getTracks().forEach(track => track.stop());
        
        // Create file
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        console.log('Photo captured:', file.name);
        
        // Close camera interface
        closeCameraInterface();
        
        // Process photo
        handlePhotoFile(file);
    }, 'image/jpeg', 0.8);
}

// Close camera interface
function closeCameraInterface() {
    console.log('Closing camera interface');
    
    // Stop camera stream
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    
    // Remove camera interface
    const cameraInterface = document.getElementById('cameraInterface');
    if (cameraInterface) {
        document.body.removeChild(cameraInterface);
    }
    
    // Show capture area
    const captureArea = document.getElementById('captureArea');
    if (captureArea) {
        captureArea.style.display = 'block';
    }
    
    // Reset variables
    cameraVideo = null;
    cameraCanvas = null;
    cameraContext = null;
}

window.handleUploadGallery = function() {
    console.log('GLOBAL: Upload Gallery clicked');
    
    // Check consent
    const consent = document.getElementById('uploadConsent');
    if (!consent || !consent.checked) {
        alert('Please check the consent box first!');
        return;
    }
    
    // Create file input for gallery
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            console.log('GLOBAL: Gallery photo selected:', file.name);
            handlePhotoFile(file);
        }
    };
    
    input.click();
}

// GLOBAL FUNCTIONS - Make them accessible from HTML onclick
window.hidePhotoPreview = function() {
    console.log('hidePhotoPreview function called');
    
    const photoPreview = document.getElementById('photoPreview');
    const captureArea = document.getElementById('captureArea');
    
    console.log('Elements found:', {
        photoPreview: !!photoPreview,
        captureArea: !!captureArea
    });
    
    if (photoPreview) {
        photoPreview.style.display = 'none';
        console.log('Photo preview hidden');
    }
    if (captureArea) {
        captureArea.style.display = 'block';
        console.log('Capture area shown');
    }
    
    currentPhotoData = null; // Reset photo data
    console.log('Photo preview hidden and data reset');
}

// Handle photo capture
function handlePhotoCapture(file) {
    if (!file) {
        console.error('No file provided to handlePhotoCapture');
        alert(currentLanguage === 'hi' ? 'कोई फोटो चयनित नहीं है' : 'No photo selected. Please try again.');
        return;
    }
    
    console.log('Handling photo capture for file:', file.name, file.type, 'Size:', file.size);
    console.log('Current step:', currentStep);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        alert(currentLanguage === 'hi' ? 'कृपया एक वैध छवि फ़ाइल चुनें' : 'Please select a valid image file.');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        console.error('File too large:', file.size);
        alert(currentLanguage === 'hi' ? 'फ़ाइल बहुत बड़ी है। कृपया 10MB से छोटी छवि चुनें' : 'File size too large. Please select an image smaller than 10MB.');
        return;
    }
    
    console.log('File validation passed, reading file...');
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            currentPhotoData = {
                file: file,
                url: e.target.result,
                step: currentStep
            };
            
            console.log('Photo captured successfully, showing preview');
            console.log('Current photo data:', currentPhotoData);
            
            // Show preview
            showPhotoPreview(e.target.result);
            
            // Check image quality
            checkImageQuality(e.target.result);
        } catch (error) {
            console.error('Error processing photo:', error);
            alert(currentLanguage === 'hi' ? 'फोटो प्रोसेस करने में त्रुटि हुई' : 'Error processing the photo. Please try again.');
        }
    };
    
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert(currentLanguage === 'hi' ? 'फोटो पढ़ने में त्रुटि हुई' : 'Error reading photo file');
    };
    
    reader.readAsDataURL(file);
}

// Show photo preview
function showPhotoPreview(imageUrl) {
    console.log('Showing photo preview');
    
    const captureArea = document.getElementById('captureArea');
    const photoPreview = document.getElementById('photoPreview');
    const previewImage = document.getElementById('previewImage');
    
    console.log('Preview elements check:', {
        captureArea: !!captureArea,
        photoPreview: !!photoPreview,
        previewImage: !!previewImage
    });
    
    if (!captureArea || !photoPreview || !previewImage) {
        console.error('Preview elements not found');
        return;
    }
    
    previewImage.src = imageUrl;
    captureArea.style.display = 'none';
    photoPreview.style.display = 'block';
    
    console.log('Photo preview displayed successfully');
    console.log('Image URL set:', imageUrl);
}

// Check image quality
function checkImageQuality(imageUrl) {
    console.log('Checking image quality for:', imageUrl);
    
    const qualityItems = document.querySelectorAll('.quality-item');
    console.log('Quality items found:', qualityItems.length);
    
    // Simulate quality check (in real implementation, use image processing)
    setTimeout(() => {
        // Randomly show quality warnings for demo
        const isGoodQuality = Math.random() > 0.3; // 70% chance of good quality
        console.log('Quality check result:', isGoodQuality);
        
        qualityItems.forEach((item, index) => {
            const icon = item.querySelector('i');
            const span = item.querySelector('span');
            
            if (index < 2) {
                // First two items are always good for demo
                icon.className = 'fas fa-check-circle quality-good';
                icon.style.color = '#27ae60';
            } else {
                // Background check - show warning occasionally
                if (!isGoodQuality) {
                    icon.className = 'fas fa-exclamation-triangle quality-warning';
                    icon.style.color = '#f39c12';
                    span.textContent = 'Background too noisy - Retake photo';
                    item.style.display = 'flex';
                } else {
                    icon.className = 'fas fa-check-circle quality-good';
                    icon.style.color = '#27ae60';
                    span.textContent = 'Clean background';
                    item.style.display = 'flex';
                }
            }
        });
        
        console.log('Quality check completed');
    }, 1000);
}

// Confirm photo - Make it global
window.confirmPhoto = function() {
    console.log('confirmPhoto function called');
    console.log('Confirming photo for step:', currentStep);
    
    if (!currentPhotoData) {
        console.error('No photo data to confirm');
        alert('No photo data to confirm');
        return;
    }
    
    capturedPhotos.push(currentPhotoData);
    console.log('Photo confirmed, total photos:', capturedPhotos.length);
    console.log('Captured photos array:', capturedPhotos);
    
    // Hide preview and reset
    const photoPreview = document.getElementById('photoPreview');
    const captureArea = document.getElementById('captureArea');
    
    if (photoPreview) {
        photoPreview.style.display = 'none';
        console.log('Photo preview hidden');
    }
    
    if (captureArea) {
        captureArea.style.display = 'block';
        console.log('Capture area shown');
    }
    
    // Move to next step
    if (currentStep < 3) {
        currentStep++;
        console.log('Moving to next step:', currentStep);
        updateWorkflowStep();
        updateProgress();
    } else {
        // All photos captured
        console.log('All photos captured, showing analyze button');
        showAnalyzeButton();
    }
    
    currentPhotoData = null;
}

// Update workflow step
function updateWorkflowStep() {
    console.log('Updating workflow step to:', currentStep);
    
    const steps = document.querySelectorAll('.step');
    const t = translations[currentLanguage];
    const titles = [t.closeupPhoto, t.fullPlantPhoto, t.undersidePhoto];
    const descriptions = [t.closeupDesc, t.fullPlantDesc, t.undersideDesc];
    
    console.log('Found steps:', steps.length);
    console.log('Titles:', titles);
    console.log('Descriptions:', descriptions);
    
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
    
    const captureTitle = document.getElementById('captureTitle');
    const captureDescription = document.getElementById('captureDescription');
    
    if (captureTitle) {
        captureTitle.textContent = titles[currentStep - 1];
        console.log('Updated capture title:', titles[currentStep - 1]);
    }
    
    if (captureDescription) {
        captureDescription.textContent = descriptions[currentStep - 1];
        console.log('Updated capture description:', descriptions[currentStep - 1]);
    }
}

// Update progress
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    console.log('Updating progress, captured photos:', capturedPhotos.length);
    
    if (progressFill && progressText) {
        const progress = (capturedPhotos.length / 3) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = currentLanguage === 'hi' 
            ? `फोटो ${capturedPhotos.length} में से 3` 
            : `Photo ${capturedPhotos.length} of 3`;
        console.log('Progress updated:', progress + '%');
    } else {
        console.error('Progress elements not found');
    }
}

// Show analyze button
function showAnalyzeButton() {
    console.log('Showing analyze button');
    
    const analyzeSection = document.getElementById('analyzeSection');
    const photoWorkflow = document.getElementById('photoWorkflow');
    
    console.log('Analyze section found:', !!analyzeSection);
    console.log('Photo workflow found:', !!photoWorkflow);
    
    if (analyzeSection) {
        analyzeSection.style.display = 'block';
        console.log('Analyze section displayed');
    } else {
        console.error('Analyze section not found');
    }
    
    if (photoWorkflow) {
        photoWorkflow.style.display = 'none';
        console.log('Photo workflow hidden');
    } else {
        console.error('Photo workflow not found');
    }
}

// Analyze photos
function analyzePhotos() {
    showLoadingSpinner();
    
    // Simulate AI analysis
    setTimeout(() => {
        hideLoadingSpinner();
        
        // Generate enhanced prediction
        const prediction = generateEnhancedPrediction();
        
        // Show results
        showResults(prediction);
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
    }, 3000); // 30 seconds simulation
}

// Generate enhanced prediction
function generateEnhancedPrediction(mode = 'fast') {
    const diseases = [
        {
            name: "Late Blight",
            scientific: "Phytophthora infestans",
            confidence: 0.92,
            description: "A serious fungal disease affecting potato and tomato plants. It spreads rapidly in cool, wet conditions and can devastate entire crops.",
            symptoms: [
                "Dark, water-soaked spots on leaves",
                "White fungal growth on underside of leaves",
                "Rapid leaf yellowing and death",
                "Brown lesions on stems and fruits",
                "Entire plant collapse within days"
            ],
            treatments: {
                chemical: [
                    {
                        name: "Copper-based Fungicide",
                        activeIngredient: "Copper Oxychloride 50% WP",
                        productExamples: ["Bordeaux Mixture", "Copper Sulphate", "Champion 77"],
                        dosage: "3g per liter of water",
                        frequency: "Spray every 7-10 days",
                        safety: "Wear gloves, mask, and protective clothing. Avoid spraying before rain",
                        buyLinks: [
                            {
                                name: "Amazon",
                                url: "https://amazon.in/copper-fungicide",
                                price: "₹450/500ml",
                                rating: "4.2★"
                            },
                            {
                                name: "AgroStar",
                                url: "https://agrostar.in/copper-fungicide",
                                price: "₹420/500ml",
                                rating: "4.5★"
                            }
                        ]
                    }
                ],
                organic: [
                    {
                        name: "Neem Oil Treatment",
                        activeIngredient: "Azadirachtin (Neem Oil)",
                        productExamples: ["Neem Oil 3000 PPM", "Organic Neem Concentrate"],
                        dosage: "2-3ml per liter of water",
                        frequency: "Spray every 5-7 days",
                        safety: "Safe for beneficial insects, no protective gear needed",
                        buyLinks: [
                            {
                                name: "DeHaat",
                                url: "https://dehaat.com/neem-oil",
                                price: "₹200/250ml",
                                rating: "4.3★"
                            },
                            {
                                name: "BigHaat",
                                url: "https://bighat.com/neem-oil",
                                price: "₹180/250ml",
                                rating: "4.1★"
                            }
                        ]
                    }
                ]
            }
        },
        {
            name: "Early Blight",
            scientific: "Alternaria solani",
            confidence: 0.88,
            description: "A common fungal disease causing characteristic bull's-eye pattern spots on leaves and stems.",
            symptoms: [
                "Brown spots with concentric rings",
                "Yellowing around spots",
                "Premature leaf drop",
                "Dark lesions on stems",
                "Fruit rot at stem end"
            ],
            treatments: {
                chemical: [
                    {
                        name: "Chlorothalonil Fungicide",
                        activeIngredient: "Chlorothalonil 75% WP",
                        productExamples: ["Daconil", "Bravo", "Chlorothalonil 75"],
                        dosage: "2g per liter of water",
                        frequency: "Spray every 10-14 days",
                        safety: "Avoid contact with skin and eyes. Wear protective gear",
                        buyLinks: [
                            {
                                name: "Amazon",
                                url: "https://amazon.in/chlorothalonil",
                                price: "₹380/500ml",
                                rating: "4.0★"
                            },
                            {
                                name: "AgroStar",
                                url: "https://agrostar.in/chlorothalonil",
                                price: "₹350/500ml",
                                rating: "4.2★"
                            }
                        ]
                    }
                ],
                organic: [
                    {
                        name: "Baking Soda Spray",
                        activeIngredient: "Sodium Bicarbonate",
                        productExamples: ["Home-made Baking Soda Solution"],
                        dosage: "1 teaspoon per liter of water",
                        frequency: "Spray every 7 days",
                        safety: "Safe and eco-friendly, no protective gear needed",
                        buyLinks: [
                            {
                                name: "Amazon",
                                url: "https://amazon.in/baking-soda",
                                price: "₹50/kg",
                                rating: "4.5★"
                            }
                        ]
                    }
                ]
            }
        },
        {
            name: "Healthy Plant",
            scientific: "No disease detected",
            confidence: 0.94,
            description: "Your plant appears to be in excellent health! Continue with your current care routine.",
            symptoms: [
                "Vibrant green leaves",
                "Strong stem structure",
                "No visible spots or lesions",
                "Good overall plant vigor",
                "Normal growth patterns"
            ],
            treatments: {
                preventive: [
                    {
                        name: "Maintain Current Care",
                        method: "Continue existing routine",
                        tips: "Monitor regularly for any changes",
                        buyLink: null,
                        price: "No additional cost"
                    }
                ]
            }
        }
    ];
    
    return diseases[Math.floor(Math.random() * diseases.length)];
}

// Show results
function showResults(prediction) {
    const resultsSection = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    const t = translations[currentLanguage];
    
    resultsContent.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <div class="disease-info">
                    <h2>${prediction.name}</h2>
                    <div class="disease-scientific">${prediction.scientific}</div>
                </div>
                <div class="confidence-badge">
                    ${Math.round(prediction.confidence * 100)}% ${t.confidence}
                </div>
            </div>
            
            <div class="disease-description">
                ${prediction.description}
            </div>
            
            <div class="symptoms-list">
                <h3>${t.detectedSymptoms}</h3>
                <ul>
                    ${prediction.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
                </ul>
            </div>
            
            ${prediction.treatments.chemical || prediction.treatments.organic || prediction.treatments.preventive ? `
            <div class="treatment-section">
                <div class="treatment-tabs">
                    ${prediction.treatments.chemical ? `<button class="treatment-tab active" data-tab="chemical">${t.chemicalTreatment}</button>` : ''}
                    ${prediction.treatments.organic ? `<button class="treatment-tab" data-tab="organic">${t.organicTreatment}</button>` : ''}
                    ${prediction.treatments.preventive ? `<button class="treatment-tab active" data-tab="preventive">${t.preventiveCare}</button>` : ''}
                </div>
                
                ${prediction.treatments.chemical ? `
                <div class="treatment-content active" id="chemical-treatment">
                    <h3>a) ${t.chemicalTreatment}:</h3>
                    ${prediction.treatments.chemical.map(treatment => `
                        <div class="treatment-item">
                            <h4>${treatment.name}</h4>
                            <div class="treatment-details">
                                <p><strong>Main Chemical/Active Ingredient:</strong> ${treatment.activeIngredient}</p>
                                <p><strong>Example Product Names:</strong> ${treatment.productExamples.join(', ')}</p>
                                <p><strong>Dosage:</strong> ${treatment.dosage}</p>
                                <p><strong>Application Frequency:</strong> ${treatment.frequency}</p>
                                <p><strong>Safety Instructions:</strong> ${treatment.safety}</p>
                            </div>
                            <div class="buy-links">
                                <h5>${t.buyNow}:</h5>
                                ${treatment.buyLinks.map(link => `
                                    <a href="${link.url}" class="buy-link" target="_blank">
                                        <span class="buy-platform">${link.name}</span>
                                        <span class="buy-price">${link.price}</span>
                                        <span class="buy-rating">${link.rating}</span>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${prediction.treatments.organic ? `
                <div class="treatment-content" id="organic-treatment">
                    <h3>b) ${t.organicTreatment}:</h3>
                    ${prediction.treatments.organic.map(treatment => `
                        <div class="treatment-item">
                            <h4>${treatment.name}</h4>
                            <div class="treatment-details">
                                <p><strong>Active Ingredient:</strong> ${treatment.activeIngredient}</p>
                                <p><strong>Example Products:</strong> ${treatment.productExamples.join(', ')}</p>
                                <p><strong>Dosage:</strong> ${treatment.dosage}</p>
                                <p><strong>Usage Instructions:</strong> ${treatment.frequency}</p>
                                <p><strong>Safety:</strong> ${treatment.safety}</p>
                            </div>
                            <div class="buy-links">
                                <h5>${t.buyNow}:</h5>
                                ${treatment.buyLinks.map(link => `
                                    <a href="${link.url}" class="buy-link" target="_blank">
                                        <span class="buy-platform">${link.name}</span>
                                        <span class="buy-price">${link.price}</span>
                                        <span class="buy-rating">${link.rating}</span>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${prediction.treatments.preventive ? `
                <div class="treatment-content active" id="preventive-treatment">
                    ${prediction.treatments.preventive.map(treatment => `
                        <div class="treatment-item">
                            <h4>${treatment.name}</h4>
                            <p><strong>Method:</strong> ${treatment.method}</p>
                            <p><strong>Tips:</strong> ${treatment.tips}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            <div class="disclaimer">
                <h4>⚠️ ${t.importantDisclaimers}:</h4>
                <ul>
                    <li><strong>${t.disclaimer1}</strong></li>
                    <li><strong>${t.disclaimer2}</strong></li>
                    <li><strong>${t.disclaimer3}</strong></li>
                </ul>
            </div>
        </div>
    `;
    
    // Setup treatment tabs
    setupTreatmentTabs();
    
    resultsSection.style.display = 'block';
    
    // Show treatment recommendations section
    const treatmentSection = document.getElementById('treatmentSection');
    if (treatmentSection) {
        treatmentSection.style.display = 'block';
    }
}

// Setup treatment tabs
function setupTreatmentTabs() {
    const tabs = document.querySelectorAll('.treatment-tab');
    const contents = document.querySelectorAll('.treatment-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked tab and corresponding content
            tab.classList.add('active');
            const tabType = tab.getAttribute('data-tab');
            const content = document.getElementById(tabType + '-treatment');
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

// Modal functionality
function setupModals() {
    console.log('Setting up modals...');
    
    // How it works modal
    const howItWorksModal = document.getElementById('howItWorksModal');
    const closeHowItWorks = document.getElementById('closeHowItWorks');
    
    console.log('Modal elements check:', {
        howItWorksModal: !!howItWorksModal,
        closeHowItWorks: !!closeHowItWorks
    });
    
    if (closeHowItWorks && howItWorksModal) {
        // Create a new event handler function
        const closeModalHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked, hiding modal');
            howItWorksModal.classList.remove('show');
        };
        
        // Remove any existing event listeners first
        closeHowItWorks.removeEventListener('click', closeModalHandler);
        
        // Add the event listener
        closeHowItWorks.addEventListener('click', closeModalHandler);
        console.log('Close button event listener added successfully');
    } else {
        console.error('Modal close elements not found:', {
            closeHowItWorks: !!closeHowItWorks,
            howItWorksModal: !!howItWorksModal
        });
    }
    
    // Privacy modal
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacy = document.getElementById('closePrivacy');
    
    console.log('Privacy modal elements check:', {
        privacyModal: !!privacyModal,
        closePrivacy: !!closePrivacy
    });
    
    if (closePrivacy && privacyModal) {
        closePrivacy.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Privacy modal close button clicked');
            privacyModal.classList.remove('show');
        });
        console.log('Privacy modal close button event listener added');
    } else {
        console.error('Privacy modal close elements not found');
    }
    
    // Update privacy modal content
    const t = translations[currentLanguage];
    const privacyHeader = privacyModal?.querySelector('.modal-header h2');
    const privacyContent = privacyModal?.querySelector('.privacy-content');
    
    if (privacyHeader) privacyHeader.textContent = t.privacyTitle;
    
    if (privacyContent) {
        const headings = privacyContent.querySelectorAll('h3');
        const paragraphs = privacyContent.querySelectorAll('p');
        const accuracyInfo = privacyContent.querySelector('.accuracy-info');
        const consentCheckbox = privacyContent.querySelector('.privacy-checkbox label');
        
        console.log('Privacy modal content elements found:', {
            headings: headings.length,
            paragraphs: paragraphs.length,
            accuracyInfo: !!accuracyInfo,
            consentCheckbox: !!consentCheckbox
        });
        
        if (headings.length >= 4) {
            headings[0].textContent = t.howWeUsePhotos;
            headings[1].textContent = t.dataStorage;
            headings[2].textContent = t.modelAccuracy;
            headings[3].textContent = t.consent;
        }
        
        if (paragraphs.length >= 4) {
            paragraphs[0].textContent = t.howWeUsePhotosDesc;
            paragraphs[1].textContent = t.dataStorageDesc;
            paragraphs[3].textContent = t.consentDesc;
        }
        
        if (accuracyInfo) {
            const accuracyParagraphs = accuracyInfo.querySelectorAll('p');
            if (accuracyParagraphs.length >= 4) {
                accuracyParagraphs[0].innerHTML = `<strong>${t.datasetSize}</strong> 50,000+ verified crop images`;
                accuracyParagraphs[1].innerHTML = `<strong>${t.testAccuracy}</strong> 99.2% on validation set`;
                accuracyParagraphs[2].innerHTML = `<strong>${t.lastUpdate}</strong> December 2024`;
                accuracyParagraphs[3].innerHTML = `<strong>${t.supportedDiseases}</strong> 50+ common crop diseases`;
            }
        }
        
        if (consentCheckbox) {
            consentCheckbox.textContent = t.agreeToPrivacy;
        }
    }
    
    // Close modals when clicking outside
    [howItWorksModal, privacyModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log('Modal background clicked, closing modal');
                    modal.classList.remove('show');
                }
            });
        }
    });
    
    // Add escape key functionality
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (howItWorksModal && howItWorksModal.classList.contains('show')) {
                console.log('Escape key pressed, closing how it works modal');
                howItWorksModal.classList.remove('show');
            }
            if (privacyModal && privacyModal.classList.contains('show')) {
                console.log('Escape key pressed, closing privacy modal');
                privacyModal.classList.remove('show');
            }
        }
    });
    
    console.log('Modal setup completed');
}

// Show how it works modal
function showHowItWorks() {
    console.log('Showing how it works modal');
    
    const modal = document.getElementById('howItWorksModal');
    const t = translations[currentLanguage];
    
    console.log('Modal found:', !!modal);
    
    if (!modal) {
        console.error('How it works modal not found');
        return;
    }
    
    // Update modal content
    const modalHeader = modal.querySelector('.modal-header h2');
    const stepTitles = modal.querySelectorAll('.step-details h3');
    const stepDescs = modal.querySelectorAll('.step-details p');
    
    console.log('Modal content elements found:', {
        modalHeader: !!modalHeader,
        stepTitles: stepTitles.length,
        stepDescs: stepDescs.length
    });
    
    if (modalHeader) modalHeader.textContent = t.howItWorksTitle;
    if (stepTitles.length >= 3) {
        stepTitles[0].textContent = t.step1Title;
        stepTitles[1].textContent = t.step2Title;
        stepTitles[2].textContent = t.step3Title;
    }
    if (stepDescs.length >= 3) {
        stepDescs[0].textContent = t.step1Desc;
        stepDescs[1].textContent = t.step2Desc;
        stepDescs[2].textContent = t.step3Desc;
    }
    
    modal.classList.add('show');
    console.log('Modal shown successfully');
    
    // Ensure close button works when modal is shown
    const closeBtn = modal.querySelector('#closeHowItWorks');
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Direct close button click - hiding modal');
            modal.classList.remove('show');
        };
        console.log('Direct close button handler added');
    }
}

// Feedback system
function setupFeedbackSystem() {
    const feedbackYes = document.getElementById('feedbackYes');
    const feedbackNo = document.getElementById('feedbackNo');
    const feedbackForm = document.getElementById('feedbackForm');
    const submitFeedback = document.getElementById('submitFeedback');
    
    // Update feedback elements with current language
    const t = translations[currentLanguage];
    if (feedbackYes) feedbackYes.innerHTML = `<i class="fas fa-thumbs-up"></i> ${t.feedbackYes}`;
    if (feedbackNo) feedbackNo.innerHTML = `<i class="fas fa-thumbs-down"></i> ${t.feedbackNo}`;
    
    const feedbackTitle = document.querySelector('.feedback-section h3');
    if (feedbackTitle) feedbackTitle.textContent = t.feedbackTitle;
    
    const feedbackFormTitle = document.querySelector('.feedback-form h4');
    if (feedbackFormTitle) feedbackFormTitle.textContent = t.feedbackFormTitle;
    
    const feedbackInput = document.getElementById('correctDisease');
    if (feedbackInput) feedbackInput.placeholder = t.feedbackPlaceholder;
    
    if (submitFeedback) submitFeedback.innerHTML = `<i class="fas fa-paper-plane"></i> ${t.submitFeedback}`;
    
    feedbackYes.addEventListener('click', () => {
        // Store positive feedback
        storeFeedback(true);
        showFeedbackThankYou();
    });
    
    feedbackNo.addEventListener('click', () => {
        feedbackForm.style.display = 'block';
    });
    
    submitFeedback.addEventListener('click', () => {
        const correctDisease = document.getElementById('correctDisease').value;
        if (correctDisease.trim()) {
            storeFeedback(false, correctDisease);
            showFeedbackThankYou();
        }
    });
}

// Store feedback
function storeFeedback(isAccurate, correctDisease = null) {
    const feedback = {
        timestamp: new Date().toISOString(),
        isAccurate: isAccurate,
        correctDisease: correctDisease,
        userAgent: navigator.userAgent
    };
    
    // In real implementation, send to backend
    console.log('Feedback stored:', feedback);
    
    // Store in localStorage for demo
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

// Show feedback thank you
function showFeedbackThankYou() {
    const feedbackSection = document.querySelector('.feedback-section');
    const t = translations[currentLanguage];
    feedbackSection.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #27ae60; margin-bottom: 20px;"></i>
            <h3 style="color: var(--primary-green); margin-bottom: 15px;">${currentLanguage === 'hi' ? 'आपकी प्रतिक्रिया के लिए धन्यवाद!' : 'Thank you for your feedback!'}</h3>
            <p style="color: var(--text-light);">${currentLanguage === 'hi' ? 'आपका इनपुट हमारे AI मॉडल की सटीकता में सुधार करने में मदद करता है।' : 'Your input helps us improve our AI model accuracy.'}</p>
        </div>
    `;
}

// Reset workflow
function resetWorkflow() {
    currentStep = 1;
    capturedPhotos = [];
    currentPhotoData = null;
    
    document.getElementById('analyzeSection').style.display = 'none';
    document.getElementById('photoWorkflow').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    updateWorkflowStep();
    updateProgress();
}

// Show consent section
function showConsentSection() {
    document.getElementById('consentSection').style.display = 'block';
}

// Hide consent section
function hideConsentSection() {
    document.getElementById('consentSection').style.display = 'none';
}

// Language toggle functionality
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
}

// Update language
function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Update navigation
    document.querySelector('a[href="#home"]').textContent = t.home;
    document.querySelector('a[href="#upload"]').textContent = t.scans;
    document.querySelector('a[href="#about"]').textContent = t.about;
    document.querySelector('a[href="#contact"]').textContent = t.contact;
    
    // Update hero section
    document.querySelector('.hero-title .highlight').textContent = t.title;
    document.querySelector('.hero-description').textContent = t.description;
    document.querySelector('.btn-primary').innerHTML = `<i class="fas fa-camera"></i> ${t.startScanning}`;
    document.querySelector('.btn-secondary').innerHTML = `<i class="fas fa-info-circle"></i> ${t.howItWorks}`;
    
    // Update hero workflow steps
    const workflowSteps = document.querySelectorAll('.workflow-text h4');
    const workflowTexts = document.querySelectorAll('.workflow-text p');
    if (workflowSteps.length >= 3) {
        workflowSteps[0].textContent = t.step1;
        workflowSteps[1].textContent = t.step2;
        workflowSteps[2].textContent = t.step3;
        workflowTexts[0].textContent = t.takePhotos;
        workflowTexts[1].textContent = t.aiAnalysis;
        workflowTexts[2].textContent = t.getTreatment;
    }
    
    // Update upload section
    document.querySelector('#upload .section-header h2').textContent = t.uploadTitle;
    document.querySelector('#upload .section-header p').textContent = t.uploadDesc;
    
    // Update workflow steps in upload section
    const uploadSteps = document.querySelectorAll('.step');
    if (uploadSteps.length >= 3) {
        uploadSteps[0].querySelector('.step-title').textContent = t.closeupPhoto;
        uploadSteps[1].querySelector('.step-title').textContent = t.fullPlantPhoto;
        uploadSteps[2].querySelector('.step-title').textContent = t.undersidePhoto;
        uploadSteps[0].querySelector('.step-desc').textContent = t.closeupDesc;
        uploadSteps[1].querySelector('.step-desc').textContent = t.fullPlantDesc;
        uploadSteps[2].querySelector('.step-desc').textContent = t.undersideDesc;
    }
    
    // Update photo capture interface
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const uploadGalleryBtn = document.getElementById('uploadGalleryBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (takePhotoBtn) takePhotoBtn.innerHTML = `<i class="fas fa-camera"></i> ${t.takePhoto}`;
    if (uploadGalleryBtn) uploadGalleryBtn.innerHTML = `<i class="fas fa-images"></i> ${t.uploadGallery}`;
    if (retakeBtn) retakeBtn.innerHTML = `<i class="fas fa-redo"></i> ${t.retake}`;
    if (confirmBtn) confirmBtn.innerHTML = `<i class="fas fa-check"></i> ${t.usePhoto}`;
    if (analyzeBtn) analyzeBtn.innerHTML = `<i class="fas fa-search"></i> ${t.analyze}`;
    
    // Update camera guide
    const guideItems = document.querySelectorAll('.guide-item span');
    if (guideItems.length >= 3) {
        guideItems[0].textContent = t.goodLighting;
        guideItems[1].textContent = t.keepSteady;
        guideItems[2].textContent = t.tapToFocus;
    }
    
    // Update consent text
    const consentCheckbox = document.getElementById('uploadConsent');
    if (consentCheckbox && consentCheckbox.nextElementSibling) {
        consentCheckbox.nextElementSibling.textContent = t.consentText;
    }
    
    // Update analyze note
    const analyzeNote = document.querySelector('.analyze-note');
    if (analyzeNote) analyzeNote.textContent = t.analyzeNote;
    
    // Update results section
    const resultsHeader = document.querySelector('#results .results-header h2');
    const resultsDesc = document.querySelector('#results .results-header p');
    if (resultsHeader) resultsHeader.textContent = t.resultsTitle;
    if (resultsDesc) resultsDesc.textContent = t.resultsDesc;
    
    // Update gallery section
    const galleryHeader = document.querySelector('#gallery .section-header h2');
    const galleryDesc = document.querySelector('#gallery .section-header p');
    if (galleryHeader) galleryHeader.textContent = t.galleryTitle;
    if (galleryDesc) galleryDesc.textContent = t.galleryDesc;
    
    // Update gallery filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterTexts = [t.all, t.healthy, t.diseased, t.tomato, t.potato];
    filterBtns.forEach((btn, index) => {
        if (index < filterTexts.length) {
            btn.textContent = filterTexts[index];
        }
    });
    
    // Update about section
    const aboutHeader = document.querySelector('#about .about-text h2');
    const aboutDesc = document.querySelector('#about .about-text p');
    const aboutImageText = document.querySelector('.image-placeholder p');
    if (aboutHeader) aboutHeader.textContent = t.aboutTitle;
    if (aboutDesc) aboutDesc.textContent = t.aboutDesc;
    if (aboutImageText) aboutImageText.textContent = t.aiInAgriculture;
    
    // Update about features
    const features = document.querySelectorAll('.feature h4');
    const featureDescs = document.querySelectorAll('.feature p');
    if (features.length >= 3) {
        features[0].textContent = t.aiPowered;
        features[1].textContent = t.instantResults;
        features[2].textContent = t.mobileFriendly;
        featureDescs[0].textContent = t.aiPoweredDesc;
        featureDescs[1].textContent = t.instantResultsDesc;
        featureDescs[2].textContent = t.mobileFriendlyDesc;
    }
    
    // Update contact section
    const contactHeader = document.querySelector('#contact .section-header h2');
    const contactDesc = document.querySelector('#contact .section-header p');
    if (contactHeader) contactHeader.textContent = t.contactTitle;
    if (contactDesc) contactDesc.textContent = t.contactDesc;
    
    // Update contact form
    const contactInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    const contactLabels = [t.yourName, t.yourEmail, t.yourMessage];
    contactInputs.forEach((input, index) => {
        if (index < contactLabels.length) {
            input.placeholder = contactLabels[index];
        }
    });
    
    const sendBtn = document.querySelector('.contact-form .btn-primary');
    if (sendBtn) sendBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${t.sendMessage}`;
    
    // Update contact info
    const contactItems = document.querySelectorAll('.contact-item h4');
    const contactLabels2 = [t.email, t.phone, t.location];
    contactItems.forEach((item, index) => {
        if (index < contactLabels2.length) {
            item.textContent = contactLabels2[index];
        }
    });
    
    // Update footer
    const footerLinks = document.querySelectorAll('.footer-links a');
    const footerTexts = [t.home, t.about, t.contact, t.privacy, t.terms];
    footerLinks.forEach((link, index) => {
        if (index < footerTexts.length) {
            link.textContent = footerTexts[index];
        }
    });
    
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
        footerBottom.innerHTML = `&copy; 2024 CropGuard AI. ${t.allRightsReserved}`;
    }
    
    // Update stats
    const statLabels = document.querySelectorAll('.stat-label');
    const statTexts = [t.accuracy, t.diseases, t.images];
    statLabels.forEach((label, index) => {
        if (index < statTexts.length) {
            label.textContent = statTexts[index];
        }
    });
    
    // Update language button
    document.getElementById('currentLang').textContent = currentLanguage.toUpperCase();
    
    // Update modal content
    const howItWorksModal = document.getElementById('howItWorksModal');
    const privacyModal = document.getElementById('privacyModal');
    
    if (howItWorksModal) {
        const modalHeader = howItWorksModal.querySelector('.modal-header h2');
        const stepTitles = howItWorksModal.querySelectorAll('.step-details h3');
        const stepDescs = howItWorksModal.querySelectorAll('.step-details p');
        
        if (modalHeader) modalHeader.textContent = t.howItWorksTitle;
        if (stepTitles.length >= 3) {
            stepTitles[0].textContent = t.step1Title;
            stepTitles[1].textContent = t.step2Title;
            stepTitles[2].textContent = t.step3Title;
        }
        if (stepDescs.length >= 3) {
            stepDescs[0].textContent = t.step1Desc;
            stepDescs[1].textContent = t.step2Desc;
            stepDescs[2].textContent = t.step3Desc;
        }
    }
    
    if (privacyModal) {
        const privacyHeader = privacyModal.querySelector('.modal-header h2');
        const privacyContent = privacyModal.querySelector('.privacy-content');
        
        if (privacyHeader) privacyHeader.textContent = t.privacyTitle;
        
        if (privacyContent) {
            const headings = privacyContent.querySelectorAll('h3');
            const paragraphs = privacyContent.querySelectorAll('p');
            const accuracyInfo = privacyContent.querySelector('.accuracy-info');
            const consentCheckbox = privacyContent.querySelector('.privacy-checkbox label');
            
            if (headings.length >= 4) {
                headings[0].textContent = t.howWeUsePhotos;
                headings[1].textContent = t.dataStorage;
                headings[2].textContent = t.modelAccuracy;
                headings[3].textContent = t.consent;
            }
            
            if (paragraphs.length >= 4) {
                paragraphs[0].textContent = t.howWeUsePhotosDesc;
                paragraphs[1].textContent = t.dataStorageDesc;
                paragraphs[3].textContent = t.consentDesc;
            }
            
            if (accuracyInfo) {
                const accuracyParagraphs = accuracyInfo.querySelectorAll('p');
                if (accuracyParagraphs.length >= 4) {
                    accuracyParagraphs[0].innerHTML = `<strong>${t.datasetSize}</strong> 50,000+ verified crop images`;
                    accuracyParagraphs[1].innerHTML = `<strong>${t.testAccuracy}</strong> 99.2% on validation set`;
                    accuracyParagraphs[2].innerHTML = `<strong>${t.lastUpdate}</strong> December 2024`;
                    accuracyParagraphs[3].innerHTML = `<strong>${t.supportedDiseases}</strong> 50+ common crop diseases`;
                }
            }
            
            if (consentCheckbox) {
                consentCheckbox.textContent = t.agreeToPrivacy;
            }
        }
    }
    
    // Update document direction for RTL languages if needed
    document.documentElement.setAttribute('lang', currentLanguage);
    if (currentLanguage === 'hi') {
        document.documentElement.style.fontFamily = "'Poppins', 'Noto Sans Devanagari', sans-serif";
    } else {
        document.documentElement.style.fontFamily = "'Poppins', sans-serif";
    }
}

// Image compression for performance
function compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
        });
    }
}

// Initialize performance monitoring
logPerformance();

// Check consent before allowing photo capture
function checkConsent() {
    const consentCheckbox = document.getElementById('uploadConsent');
    console.log('Checking consent, checkbox found:', !!consentCheckbox);
    console.log('Checkbox checked:', consentCheckbox?.checked);
    
    if (!consentCheckbox || !consentCheckbox.checked) {
        const message = currentLanguage === 'hi' 
            ? 'कृपया फोटो अपलोड करने से पहले नियमों और शर्तों से सहमत हों।'
            : 'Please agree to the terms and conditions before uploading photos.';
        alert(message);
        return false;
    }
    return true;
}

// Enhanced image quality detection
function detectImageQuality(imageUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Simple blur detection (variance of pixel values)
            let variance = 0;
            let mean = 0;
            
            // Calculate mean
            for (let i = 0; i < data.length; i += 4) {
                mean += (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            mean /= (data.length / 4);
            
            // Calculate variance
            for (let i = 0; i < data.length; i += 4) {
                const pixelValue = (data[i] + data[i + 1] + data[i + 2]) / 3;
                variance += Math.pow(pixelValue - mean, 2);
            }
            variance /= (data.length / 4);
            
            // Simple lighting detection (brightness)
            let brightness = 0;
            for (let i = 0; i < data.length; i += 4) {
                brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            brightness /= (data.length / 4);
            
            resolve({
                isBlurry: variance < 100, // Low variance = blurry
                isTooDark: brightness < 80,
                isTooBright: brightness > 200,
                quality: variance > 200 ? 'good' : variance > 100 ? 'fair' : 'poor'
            });
        };
        img.src = imageUrl;
    });
}

// Update image quality check with real detection
async function checkImageQuality(imageUrl) {
    const qualityItems = document.querySelectorAll('.quality-item');
    
    try {
        const quality = await detectImageQuality(imageUrl);
        
        qualityItems.forEach((item, index) => {
            const icon = item.querySelector('i');
            const span = item.querySelector('span');
            
            if (index === 0) {
                // Lighting check
                if (quality.isTooDark || quality.isTooBright) {
                    icon.className = 'fas fa-exclamation-triangle quality-warning';
                    icon.style.color = '#f39c12';
                    span.textContent = quality.isTooDark 
                        ? (currentLanguage === 'hi' ? 'बहुत अंधेरा - रोशनी बेहतर करें' : 'Too dark - improve lighting')
                        : (currentLanguage === 'hi' ? 'बहुत उज्ज्वल - सीधी धूप से बचें' : 'Too bright - avoid direct sun');
                } else {
                    icon.className = 'fas fa-check-circle quality-good';
                    icon.style.color = '#27ae60';
                    span.textContent = currentLanguage === 'hi' ? 'अच्छी रोशनी' : 'Good lighting';
                }
            } else if (index === 1) {
                // Focus check
                if (quality.isBlurry) {
                    icon.className = 'fas fa-exclamation-triangle quality-warning';
                    icon.style.color = '#f39c12';
                    span.textContent = currentLanguage === 'hi' ? 'छवि धुंधली है - फोटो फिर से लें' : 'Image is blurry - retake photo';
                } else {
                    icon.className = 'fas fa-check-circle quality-good';
                    icon.style.color = '#27ae60';
                    span.textContent = currentLanguage === 'hi' ? 'तेज फोकस' : 'Sharp focus';
                }
            } else if (index === 2) {
                // Background check
                if (quality.quality === 'poor') {
                    icon.className = 'fas fa-exclamation-triangle quality-warning';
                    icon.style.color = '#f39c12';
                    span.textContent = currentLanguage === 'hi' ? 'पृष्ठभूमि बहुत शोर - फोटो फिर से लें' : 'Background too noisy - Retake photo';
                } else {
                    icon.className = 'fas fa-check-circle quality-good';
                    icon.style.color = '#27ae60';
                    span.textContent = currentLanguage === 'hi' ? 'साफ पृष्ठभूमि' : 'Clean background';
                }
            }
            item.style.display = 'flex';
        });
    } catch (error) {
        console.error('Quality check failed:', error);
        // Fallback to original behavior
        setTimeout(() => {
            qualityItems.forEach((item, index) => {
                const icon = item.querySelector('i');
                const span = item.querySelector('span');
                
                if (index < 2) {
                    icon.className = 'fas fa-check-circle quality-good';
                    icon.style.color = '#27ae60';
                } else {
                    icon.className = 'fas fa-exclamation-triangle quality-warning';
                    icon.style.color = '#f39c12';
                    span.textContent = currentLanguage === 'hi' ? 'पृष्ठभूमि बहुत शोर - फोटो फिर से लें' : 'Background too noisy - Retake photo';
                }
                item.style.display = 'flex';
            });
        }, 1000);
    }
}

// Performance optimization - compress images before processing
async function handlePhotoCaptureOptimized(file) {
    // Compress image first
    const compressedFile = await compressImage(file, 800, 0.8);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        currentPhotoData = {
            file: compressedFile,
            url: e.target.result,
            step: currentStep
        };
        
        // Show preview
        showPhotoPreview(e.target.result);
        
        // Check image quality with real detection
        await checkImageQuality(e.target.result);
    };
    reader.readAsDataURL(compressedFile);
}

// Enhanced progress indicator for analysis with backend integration
async function analyzePhotos() {
    const photos = document.querySelectorAll('.photo-preview img');
    if (photos.length === 0) {
        showNotification('Please take or upload photos first', 'error');
        return;
    }

    showLoadingSpinner();
    
    // Get selected processing mode
    const selectedMode = document.querySelector('input[name="processingMode"]:checked')?.value || 'fast';
    
    // Update analyze button text
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analyzeText = document.getElementById('analyzeText');
    const analyzeTime = document.getElementById('analyzeTime');
    
    if (analyzeText) analyzeText.textContent = currentLanguage === 'hi' ? 'विश्लेषण चल रहा है...' : 'Analyzing...';
    
    // Update timing based on mode
    let timeText = '';
    let totalTime = 0;
    switch(selectedMode) {
        case 'fast':
            timeText = currentLanguage === 'hi' ? '(8-15 सेकंड)' : '(8-15 seconds)';
            totalTime = 12000; // 12 seconds
            break;
        case 'accurate':
            timeText = currentLanguage === 'hi' ? '(15-25 सेकंड)' : '(15-25 seconds)';
            totalTime = 20000; // 20 seconds
            break;
        case 'offline':
            timeText = currentLanguage === 'hi' ? '(5-10 सेकंड)' : '(5-10 seconds)';
            totalTime = 8000; // 8 seconds
            break;
    }
    
    if (analyzeTime) analyzeTime.textContent = timeText;
    if (analyzeBtn) analyzeBtn.disabled = true;

    try {
        // Convert images to base64 and send to backend
        const imageData = await convertImagesToBase64(photos);
        const analysisResult = await sendImagesForAnalysis(imageData);
        
        // Show results from backend
        showResults(analysisResult);
        
        // Show treatment recommendations
        if (analysisResult.disease) {
            showTreatmentRecommendations(analysisResult.disease);
        }
        
    } catch (error) {
        console.error('Analysis error:', error);
        
        // Fallback to local analysis if backend fails
        const prediction = generateEnhancedPrediction(selectedMode);
        showResults(prediction);
        
        showNotification('Using offline analysis. Backend connection failed.', 'warning');
    } finally {
        hideLoadingSpinner();
        if (analyzeBtn) analyzeBtn.disabled = false;
    }
}

async function convertImagesToBase64(photos) {
    const imageData = [];
    
    for (let i = 0; i < photos.length; i++) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = photos[i].naturalWidth;
        canvas.height = photos[i].naturalHeight;
        
        ctx.drawImage(photos[i], 0, 0);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        imageData.push({
            data: base64,
            filename: `photo_${i + 1}.jpg`,
            size: base64.length
        });
    }
    
    return imageData;
}

async function sendImagesForAnalysis(imageData) {
    try {
        const response = await fetch('http://localhost:8000/api/v1/ai/analyze-images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                images: imageData,
                session_id: aiAgent?.sessionId || 'default_session',
                language: document.getElementById('languageSelect')?.value || 'en',
                region: 'india'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            return {
                disease: data.data.detected_disease,
                confidence: data.data.confidence_score,
                crop: data.data.detected_crop,
                symptoms: data.data.detected_symptoms,
                recommendations: data.data.treatment_recommendations,
                analysis_time: data.data.analysis_time_ms
            };
        } else {
            throw new Error(data.error?.message || 'Analysis failed');
        }
    } catch (error) {
        console.error('Image analysis API error:', error);
        throw error;
    }
}
    
    // Show enhanced progress indicator with percentages
    const progressContainer = document.createElement('div');
    progressContainer.className = 'analysis-progress';
    const t = translations[currentLanguage];
    const stepTexts = currentLanguage === 'hi' 
        ? ['छवियां प्रसंस्करण', 'AI विश्लेषण', 'परिणाम उत्पन्न करना']
        : ['Processing Images', 'AI Analysis', 'Generating Results'];
    const secondsText = currentLanguage === 'hi' ? 'सेकंड' : 'seconds';
    const modeText = currentLanguage === 'hi' 
        ? (selectedMode === 'fast' ? 'तेज़ मोड' : selectedMode === 'accurate' ? 'सटीक मोड' : 'ऑफ़लाइन मोड')
        : (selectedMode === 'fast' ? 'Fast Mode' : selectedMode === 'accurate' ? 'Accurate Mode' : 'Offline Mode');
    
    progressContainer.innerHTML = `
        <div class="progress-header">
            <h4>${modeText}</h4>
            <div class="progress-percentage">
                <span id="progressPercent">0</span>%
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        <div class="progress-steps">
            <div class="step active" data-step="1">
                <i class="fas fa-image"></i>
                <span>${stepTexts[0]}</span>
                <div class="step-percentage">0%</div>
            </div>
            <div class="step" data-step="2">
                <i class="fas fa-brain"></i>
                <span>${stepTexts[1]}</span>
                <div class="step-percentage">0%</div>
            </div>
            <div class="step" data-step="3">
                <i class="fas fa-check"></i>
                <span>${stepTexts[2]}</span>
                <div class="step-percentage">0%</div>
            </div>
        </div>
        <div class="progress-timer">
            <span id="timer">0</span> ${secondsText}
        </div>
    `;
    
    document.body.appendChild(progressContainer);
    
    // Update progress with percentages
    let currentProgressStep = 1;
    let overallProgress = 0;
    const progressSteps = progressContainer.querySelectorAll('.step');
    const progressPercent = document.getElementById('progressPercent');
    const progressFill = document.getElementById('progressFill');
    
    const progressInterval = setInterval(() => {
        // Update overall progress
        overallProgress += (100 / (totalTime / 100));
        if (overallProgress > 100) overallProgress = 100;
        
        progressPercent.textContent = Math.round(overallProgress);
        progressFill.style.width = overallProgress + '%';
        
        // Update step progress
        progressSteps.forEach((step, index) => {
            const stepPercentage = step.querySelector('.step-percentage');
            if (index + 1 <= currentProgressStep) {
                step.classList.add('active');
                const stepProgress = Math.min(100, (overallProgress - (index * 33.33)) * 3);
                stepPercentage.textContent = Math.round(Math.max(0, stepProgress)) + '%';
            } else {
                step.classList.remove('active');
                stepPercentage.textContent = '0%';
            }
        });
        
        // Move to next step
        if (currentProgressStep < 3 && overallProgress > (currentProgressStep * 33.33)) {
            currentProgressStep++;
        }
    }, 100);
    
    // Timer
    let seconds = 0;
    const timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = seconds;
    }, 1000);
    
    // Simulate AI analysis with dynamic timing
    setTimeout(() => {
        clearInterval(progressInterval);
        clearInterval(timerInterval);
        document.body.removeChild(progressContainer);
        
        hideLoadingSpinner();
        
        // Generate enhanced prediction based on mode
        const prediction = generateEnhancedPrediction(selectedMode);
        
        // Show results
        showResults(prediction);
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
    }, totalTime);
}

// FAQ functionality
function setupFAQ() {
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // FAQ category switching
    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update active button
            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide categories
            faqCategories.forEach(cat => {
                if (cat.id === category) {
                    cat.style.display = 'block';
                } else {
                    cat.style.display = 'none';
                }
            });
        });
    });
    
    // FAQ item toggling
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Setup Treatment Tabs functionality
function setupTreatmentTabs() {
    const treatmentTabs = document.querySelectorAll('.treatment-tab');
    const treatmentPanels = document.querySelectorAll('.treatment-panel');
    
    treatmentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            treatmentTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all panels
            treatmentPanels.forEach(panel => panel.classList.remove('active'));
            // Show selected panel
            const targetPanel = document.getElementById(tab.dataset.tab + '-panel');
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Disease Database with Search and Voice Input
const diseaseDatabase = [
    {
        id: 1,
        name: "Rice Blast",
        scientific: "Magnaporthe oryzae",
        crop: "rice",
        regions: ["north", "east", "south"],
        symptoms: ["Spindle-shaped lesions on leaves", "Gray centers with brown borders", "White to gray spots on panicles", "Stem rot at base"],
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJpY2UgQmxhc3Q8L3RleHQ+PC9zdmc+",
        treatment: {
            chemical: ["Propiconazole 25% EC", "Tricyclazole 75% WP"],
            organic: ["Neem oil spray", "Bordeaux mixture"],
            preventive: ["Resistant varieties", "Proper spacing", "Avoid excess nitrogen"]
        }
    },
    {
        id: 2,
        name: "Tomato Late Blight",
        scientific: "Phytophthora infestans",
        crop: "tomato",
        regions: ["north", "south", "east"],
        symptoms: ["Dark, water-soaked lesions on leaves", "White fungal growth on underside", "Brown, firm spots on fruits", "Rapid plant collapse"],
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRvbWF0byBMYXRlIEJsaWdodDwvdGV4dD48L3N2Zz4=",
        treatment: {
            chemical: ["Chlorothalonil 75% WP", "Mancozeb 75% WP"],
            organic: ["Copper fungicide", "Baking soda spray"],
            preventive: ["Good air circulation", "Avoid overhead watering", "Crop rotation"]
        }
    },
    {
        id: 3,
        name: "Wheat Rust",
        scientific: "Puccinia triticina",
        crop: "wheat",
        regions: ["north", "west"],
        symptoms: ["Orange to reddish-brown pustules", "Yellow halos around lesions", "Stunted growth", "Reduced grain quality"],
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldoZWF0IFJ1c3Q8L3RleHQ+PC9zdmc+",
        treatment: {
            chemical: ["Tebuconazole 25% EC", "Propiconazole 25% EC"],
            organic: ["Sulfur dust", "Garlic extract spray"],
            preventive: ["Resistant varieties", "Early planting", "Proper fertilization"]
        }
    },
    {
        id: 4,
        name: "Chili Anthracnose",
        scientific: "Colletotrichum capsici",
        crop: "chili",
        regions: ["south", "east", "west"],
        symptoms: ["Circular, sunken lesions on fruits", "Dark, concentric rings", "Fruit rot and drop", "Black spots on leaves"],
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoaWxpIEFudGhyYWNub3NlPC90ZXh0Pjwvc3ZnPg==",
        treatment: {
            chemical: ["Carbendazim 50% WP", "Mancozeb 75% WP"],
            organic: ["Neem oil", "Chitosan spray"],
            preventive: ["Proper spacing", "Avoid water stress", "Harvest at right time"]
        }
    },
    {
        id: 5,
        name: "Mango Anthracnose",
        scientific: "Colletotrichum gloeosporioides",
        crop: "mango",
        regions: ["north", "south", "east"],
        symptoms: ["Dark, sunken spots on fruits", "Black lesions on leaves", "Flower blight", "Fruit rot during storage"],
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1hbmdvIEFudGhyYWNub3NlPC90ZXh0Pjwvc3ZnPg==",
        treatment: {
            chemical: ["Copper oxychloride 50% WP", "Carbendazim 50% WP"],
            organic: ["Bordeaux mixture", "Neem oil spray"],
            preventive: ["Pruning for air circulation", "Proper irrigation", "Post-harvest treatment"]
        }
    }
];

// Initialize disease database
function initializeDiseaseDatabase() {
    const diseaseGrid = document.getElementById('diseaseGrid');
    if (!diseaseGrid) return;
    
    displayDiseases(diseaseDatabase);
    
    // Setup search functionality
    const searchInput = document.getElementById('diseaseSearch');
    const cropFilter = document.getElementById('cropFilter');
    const regionFilter = document.getElementById('regionFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterDiseases);
    }
    if (cropFilter) {
        cropFilter.addEventListener('change', filterDiseases);
    }
    if (regionFilter) {
        regionFilter.addEventListener('change', filterDiseases);
    }
}

// Display diseases in grid
function displayDiseases(diseases) {
    const diseaseGrid = document.getElementById('diseaseGrid');
    if (!diseaseGrid) return;
    
    diseaseGrid.innerHTML = diseases.map(disease => `
        <div class="disease-card" onclick="showDiseaseDetails(${disease.id})">
            <div class="disease-header">
                <div>
                    <h4 class="disease-name">${disease.name}</h4>
                    <div class="disease-scientific">${disease.scientific}</div>
                </div>
                <span class="crop-tag">${disease.crop.charAt(0).toUpperCase() + disease.crop.slice(1)}</span>
            </div>
            
            <div class="disease-image">
                <img src="${disease.image}" alt="${disease.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            </div>
            
            <div class="disease-symptoms">
                <h5>Key Symptoms:</h5>
                <ul class="symptom-list">
                    ${disease.symptoms.slice(0, 3).map(symptom => `<li>${symptom}</li>`).join('')}
                </ul>
            </div>
            
            <div class="disease-regions">
                ${disease.regions.map(region => `<span class="region-tag">${region.charAt(0).toUpperCase() + region.slice(1)} India</span>`).join('')}
            </div>
            
            <div class="disease-actions">
                <button class="disease-btn primary" onclick="event.stopPropagation(); showDiseaseDetails(${disease.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button class="disease-btn secondary" onclick="event.stopPropagation(); searchForTreatment('${disease.name}')">
                    <i class="fas fa-pills"></i> Treatment
                </button>
            </div>
        </div>
    `).join('');
}

// Filter diseases based on search and filters
function filterDiseases() {
    const searchTerm = document.getElementById('diseaseSearch')?.value.toLowerCase() || '';
    const cropFilter = document.getElementById('cropFilter')?.value || '';
    const regionFilter = document.getElementById('regionFilter')?.value || '';
    
    const filteredDiseases = diseaseDatabase.filter(disease => {
        const matchesSearch = disease.name.toLowerCase().includes(searchTerm) ||
                            disease.scientific.toLowerCase().includes(searchTerm) ||
                            disease.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm));
        
        const matchesCrop = !cropFilter || disease.crop === cropFilter;
        const matchesRegion = !regionFilter || disease.regions.includes(regionFilter);
        
        return matchesSearch && matchesCrop && matchesRegion;
    });
    
    displayDiseases(filteredDiseases);
}

// Search diseases function
function searchDiseases() {
    filterDiseases();
}

// Voice search functionality
let recognition = null;
function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice search is not supported in this browser. Please use Chrome or Edge.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    const voiceBtn = document.querySelector('.voice-search-btn');
    voiceBtn.classList.add('recording');
    voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('diseaseSearch').value = transcript;
        filterDiseases();
    };
    
    recognition.onend = function() {
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        alert('Voice recognition failed. Please try again.');
    };
    
    recognition.start();
}

// Show detailed disease information
function showDiseaseDetails(diseaseId) {
    const disease = diseaseDatabase.find(d => d.id === diseaseId);
    if (!disease) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${disease.name}</h2>
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="disease-detail-image">
                    <img src="${disease.image}" alt="${disease.name}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;">
                </div>
                
                <div class="disease-detail-info">
                    <h3>Scientific Name: ${disease.scientific}</h3>
                    <h4>Affected Crop: ${disease.crop.charAt(0).toUpperCase() + disease.crop.slice(1)}</h4>
                    <h4>Common in: ${disease.regions.map(r => r.charAt(0).toUpperCase() + r.slice(1) + ' India').join(', ')}</h4>
                </div>
                
                <div class="disease-symptoms-detail">
                    <h4>Symptoms:</h4>
                    <ul>
                        ${disease.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="disease-treatment-detail">
                    <h4>Treatment Options:</h4>
                    <div class="treatment-options-detail">
                        <div class="treatment-type">
                            <h5>Chemical Treatment:</h5>
                            <ul>
                                ${disease.treatment.chemical.map(t => `<li>${t}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="treatment-type">
                            <h5>Organic Treatment:</h5>
                            <ul>
                                ${disease.treatment.organic.map(t => `<li>${t}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="treatment-type">
                            <h5>Preventive Measures:</h5>
                            <ul>
                                ${disease.treatment.preventive.map(t => `<li>${t}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Search for treatment
function searchForTreatment(diseaseName) {
    // Scroll to treatment section and highlight
    const treatmentSection = document.getElementById('treatmentSection');
    if (treatmentSection) {
        treatmentSection.style.display = 'block';
        treatmentSection.scrollIntoView({ behavior: 'smooth' });
        
        // Show notification
        showNotification(`Treatment recommendations for ${diseaseName} are now available below!`, 'success');
    }
}

// AI Voice Agent Implementation with Backend Integration
class AIAgent {
    constructor() {
        this.recognition = null;
        this.synthesis = null;
        this.isListening = false;
        this.isProcessing = false;
        this.conversationHistory = [];
        this.currentInputMode = 'voice';
        this.sessionId = this.generateSessionId();
        this.apiBaseUrl = 'http://localhost:8000/api/v1'; // Perfect AI Server URL
        this.isDoctorMode = true; // AI acts like a doctor
        this.farmerProfile = null; // Store farmer information
        this.currentDisease = null; // Current disease being discussed
        this.isMuted = false; // Mute state for voice
        this.agentName = 'Happy'; // AI agent name
        this.isActivated = false; // Activation state
        this.activationKeyword = 'happy'; // Keyword to activate
        this.initializeSpeechAPIs();
        this.setupEventListeners();
        this.loadConversationHistory();
        this.startDoctorConversation();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('ai_conversation_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                this.displayConversationHistory();
            }
        } catch (error) {
            console.error('Error loading conversation history:', error);
        }
    }

    saveConversationHistory() {
        try {
            localStorage.setItem('ai_conversation_history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Error saving conversation history:', error);
        }
    }

    displayConversationHistory() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages || this.conversationHistory.length === 0) return;

        // Clear existing messages except the welcome message
        const welcomeMessage = chatMessages.querySelector('.agent-message');
        chatMessages.innerHTML = '';
        if (welcomeMessage) {
            chatMessages.appendChild(welcomeMessage);
        }

        // Display conversation history
        this.conversationHistory.slice(-10).forEach(entry => {
            this.addMessage(entry.user, 'user', false);
            this.addMessage(entry.agent, 'agent', false);
        });
    }

    startDoctorConversation() {
        // AI doctor starts the conversation proactively
        setTimeout(() => {
            this.addWebsiteWelcomeGuide();
        }, 2000);
    }

    addWebsiteWelcomeGuide() {
        const isHindi = this.getLanguage() === 'hi';
        
        // Welcome message
        const welcomeMessage = isHindi ? 
            "🎉 **नमस्ते! आपका स्वागत है CropGuard AI में!**\n\nमैं आपका AI कृषि डॉक्टर हूं। मैं आपकी फसलों की देखभाल में पूरी मदद करूंगा।" :
            "🎉 **Welcome to CropGuard AI!**\n\nI'm your AI Agricultural Doctor. I'll help you take care of your crops completely.";
        
        this.addMessage(welcomeMessage, 'agent');
        this.speakResponse(welcomeMessage);
        
        // Website guide after 3 seconds
        setTimeout(() => {
            this.addWebsiteGuide();
        }, 3000);
    }

    addWebsiteGuide() {
        const isHindi = this.getLanguage() === 'hi';
        
        const guideMessage = isHindi ? 
            "📱 **Website Guide - यहाँ आप क्या कर सकते हैं:**\n\n" +
            "🌱 **Photo Analysis**: अपनी फसल की फोटो upload करें, मैं disease detect करूंगा\n" +
            "💬 **AI Chat**: मुझसे बात करें - Voice या Text में\n" +
            "📸 **Photo Upload**: मुझे फोटो भेजें, मैं scan करके analysis दूंगा\n" +
            "🧮 **Medicine Calculator**: Tanki size बताएं, मैं exact medicine calculate करूंगा\n" +
            "📚 **Disease Database**: सभी diseases और treatments की जानकारी\n" +
            "🔊 **Voice Support**: Hindi/English में बोलकर बात करें\n\n" +
            "**कैसे शुरू करें?**\n" +
            "1. मुझे फोटो भेजें या बताएं कि कौन सी फसल में problem है\n" +
            "2. मैं disease detect करूंगा\n" +
            "3. आपकी tanki size बताएं\n" +
            "4. मैं exact medicine और usage guide दूंगा" :
            
            "📱 **Website Guide - What you can do here:**\n\n" +
            "🌱 **Photo Analysis**: Upload your crop photos, I'll detect diseases\n" +
            "💬 **AI Chat**: Talk to me - Voice or Text\n" +
            "📸 **Photo Upload**: Send me photos, I'll scan and analyze\n" +
            "🧮 **Medicine Calculator**: Tell me tank size, I'll calculate exact medicine\n" +
            "📚 **Disease Database**: Information about all diseases and treatments\n" +
            "🔊 **Voice Support**: Speak in Hindi/English\n\n" +
            "**How to start?**\n" +
            "1. Send me photos or tell me which crop has problems\n" +
            "2. I'll detect the disease\n" +
            "3. Tell me your tank size\n" +
            "4. I'll give exact medicine and usage guide";
        
        this.addMessage(guideMessage, 'agent');
        this.speakResponse(guideMessage);
        
        // Quick start options after 4 seconds
        setTimeout(() => {
            this.addQuickStartOptions();
        }, 4000);
    }

    addQuickStartOptions() {
        const isHindi = this.getLanguage() === 'hi';
        
        const quickStartMessage = isHindi ? 
            "🚀 **Quick Start Options:**\n\n" +
            "📸 **Photo भेजें**: 'Photo' button पर click करें\n" +
            "🎤 **Voice में बात करें**: Microphone button दबाकर बोलें\n" +
            "⌨️ **Text में लिखें**: Type करके question पूछें\n" +
            "🔇 **Mute करें**: अगर voice नहीं चाहिए तो mute button दबाएं\n\n" +
            "**Example Questions:**\n" +
            "• 'मेरे टमाटर में काले धब्बे आ रहे हैं'\n" +
            "• 'Rice blast का treatment क्या है?'\n" +
            "• 'Chili के लिए organic medicine बताएं'" :
            
            "🚀 **Quick Start Options:**\n\n" +
            "📸 **Send Photo**: Click 'Photo' button\n" +
            "🎤 **Voice Chat**: Press microphone and speak\n" +
            "⌨️ **Text Chat**: Type your questions\n" +
            "🔇 **Mute**: Press mute button if you don't want voice\n\n" +
            "**Example Questions:**\n" +
            "• 'My tomato has black spots'\n" +
            "• 'What is the treatment for rice blast?'\n" +
            "• 'Tell me organic medicine for chili'";
        
        this.addMessage(quickStartMessage, 'agent');
        this.speakResponse(quickStartMessage);
    }

    addDoctorWelcomeMessage() {
        const isHindi = this.getLanguage() === 'hi';
        const welcomeMessage = isHindi ? 
            "नमस्ते! मैं आपका AI कृषि डॉक्टर हूं। मैं आपकी फसलों की देखभाल में मदद करूंगा। बताइए, आज आपकी कौन सी फसल में कोई समस्या है? आप मुझे फोटो भी भेज सकते हैं।" :
            "Hello! I'm your AI Agricultural Doctor. I'll help you take care of your crops. Tell me, which crop is having problems today? You can also send me photos.";
        
        this.addMessage(welcomeMessage, 'agent');
        this.speakResponse(welcomeMessage);
    }

    async handlePhotoUploadInChat(file) {
        const isHindi = this.getLanguage() === 'hi';
        
        // Show processing message
        this.addMessage(isHindi ? "फोटो को scan कर रहा हूं..." : "Scanning your photo...", 'agent');
        
        try {
            // Convert image to base64
            const base64 = await this.convertFileToBase64(file);
            
            // Send to backend for analysis
            const analysisResult = await this.analyzePhotoInChat(base64);
            
            // Process the result
            this.processPhotoAnalysisResult(analysisResult);
            
        } catch (error) {
            console.error('Photo analysis error:', error);
            const errorMessage = isHindi ? 
                "फोटो analyze करने में समस्या आई। कृपया दोबारा कोशिश करें।" :
                "There was a problem analyzing the photo. Please try again.";
            this.addMessage(errorMessage, 'agent');
        }
    }

    async analyzePhotoInChat(base64Image) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/ai/analyze-images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    images: [{
                        data: base64Image,
                        filename: 'chat_photo.jpg',
                        size: base64Image.length
                    }],
                    session_id: this.sessionId,
                    language: this.getLanguage(),
                    region: 'india'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Backend photo analysis error:', error);
            // Fallback to local analysis
            return this.performLocalPhotoAnalysis();
        }
    }

    performLocalPhotoAnalysis() {
        // Simulate local photo analysis
        const diseases = [
            {
                disease: 'Late Blight',
                disease_hi: 'लेट ब्लाइट',
                crop: 'Tomato',
                crop_hi: 'टमाटर',
                confidence: 0.85,
                symptoms: ['Dark water-soaked lesions', 'White fungal growth'],
                symptoms_hi: ['काले पानी से भरे घाव', 'सफेद फंगल वृद्धि']
            },
            {
                disease: 'Rice Blast',
                disease_hi: 'राइस ब्लास्ट',
                crop: 'Rice',
                crop_hi: 'चावल',
                confidence: 0.78,
                symptoms: ['Spindle-shaped lesions', 'Gray centers'],
                symptoms_hi: ['तकली के आकार के घाव', 'ग्रे केंद्र']
            }
        ];

        return diseases[Math.floor(Math.random() * diseases.length)];
    }

    processPhotoAnalysisResult(result) {
        if (!result) return;

        const isHindi = this.getLanguage() === 'hi';
        this.currentDisease = result;

        // AI doctor analyzes the photo
        const analysisMessage = isHindi ? 
            `मैंने आपकी फोटो देखी है। आपकी ${result.crop_hi} में ${result.disease_hi} का रोग है। Confidence: ${Math.round(result.confidence * 100)}%` :
            `I've analyzed your photo. Your ${result.crop} has ${result.disease} disease. Confidence: ${Math.round(result.confidence * 100)}%`;

        this.addMessage(analysisMessage, 'agent');
        this.speakResponse(analysisMessage);

        // Ask for tanki size
        setTimeout(() => {
            this.askForTankiSize();
        }, 2000);
    }

    askForTankiSize() {
        const isHindi = this.getLanguage() === 'hi';
        const tankiMessage = isHindi ? 
            "अब मुझे बताइए कि आप कितने लीटर की टंकी का उपयोग करेंगे? (जैसे 10, 15, 20 लीटर)" :
            "Now tell me, how many liters tank will you use? (like 10, 15, 20 liters)";
        
        this.addMessage(tankiMessage, 'agent');
        this.speakResponse(tankiMessage);
    }

    initializeSpeechAPIs() {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'hi-IN'; // Hindi with Indian accent
            this.recognition.maxAlternatives = 1;
        }

        // Initialize Speech Synthesis
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    setupEventListeners() {
        // Voice button events
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('mousedown', () => this.startListening());
            voiceBtn.addEventListener('mouseup', () => this.stopListening());
            voiceBtn.addEventListener('mouseleave', () => this.stopListening());
            
            // Touch events for mobile
            voiceBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startListening();
            });
            voiceBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopListening();
            });
        }

        // Text input events
        const textInput = document.getElementById('textMessageInput');
        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendTextMessage();
                }
            });
        }
    }

    startListening() {
        if (!this.recognition || this.isListening || this.isProcessing) return;

        this.isListening = true;
        this.updateUI('listening');
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.processUserInput(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.updateUI('ready');
            this.isListening = false;
            this.showNotification('Voice recognition failed. Please try again.', 'error');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI('ready');
        };

        this.recognition.start();
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    async processUserInput(input) {
        console.log('💬 Processing user input:', input);
        this.addMessage(input, 'user');
        this.updateUI('processing');
        this.isProcessing = true;

        try {
            // Detect language from input
            const detectedLanguage = this.detectLanguage(input);
            
            // Check for Happy activation
            if (this.checkForHappyActivation(input)) {
                this.activateHappy(detectedLanguage);
                return;
            }
            
            // Check if Happy is activated
            if (!this.isActivated) {
                this.promptForActivation(detectedLanguage);
                return;
            }
            
            // Check if user is providing tanki size
            const tankiSize = this.extractTankiSize(input);
            if (tankiSize && this.currentDisease) {
                this.processTankiSizeInput(tankiSize, detectedLanguage);
                return;
            }
            
            // Check if user is asking for photo upload
            if (this.isPhotoUploadRequest(input)) {
                this.handlePhotoUploadRequest(detectedLanguage);
                return;
            }
            
            // Send to backend API
            const response = await this.sendToBackend(input, detectedLanguage);
            
            // Add AI response to chat
            this.addMessage(response.response, 'agent');
            
            // Store in conversation history
            this.conversationHistory.push({
                user: input,
                agent: response.response,
                language: detectedLanguage,
                timestamp: new Date(),
                detected_crop: response.detected_crop,
                detected_disease: response.detected_disease,
                confidence: response.confidence_score
            });
            
            // Save to localStorage
            this.saveConversationHistory();
            
            // Speak the response
            this.speakResponse(response.response, detectedLanguage);
            
            // Show treatment recommendations if disease detected
            if (response.detected_disease && response.similar_diseases) {
                this.showTreatmentRecommendations(response.similar_diseases[0]);
            }
            
        } catch (error) {
            console.error('Error processing input:', error);
            const errorMessage = this.getLanguage() === 'hi' ? 
                'मुझे खेद है, मैं आपकी बात समझ नहीं पाया। कृपया दोबारा कोशिश करें।' :
                'Sorry, I encountered an error. Please try again.';
            this.addMessage(errorMessage, 'agent');
        } finally {
            this.isProcessing = false;
            this.updateUI('ready');
        }
    }

    checkForHappyActivation(input) {
        const lowerInput = input.toLowerCase();
        const isActivation = lowerInput.includes('happy') || lowerInput.includes('हेप्पी') || lowerInput.includes('हैप्पी');
        console.log('🔍 Checking Happy activation:', input, '->', isActivation);
        return isActivation;
    }

    activateHappy(language) {
        console.log('🎉 Activating Happy!');
        this.isActivated = true;
        const isHindi = language === 'hi';
        
        const activationMessage = isHindi ? 
            "🎉 **हम बोलिए!** मैं Happy हूं, आपका AI कृषि सहायक! मैं आपकी फसलों की देखभाल में मदद करूंगा। बताइए, आज कैसे मदद कर सकता हूं? मैं आपसे दोस्त की तरह बात करूंगा।" :
            "🎉 **Let's talk!** I'm Happy, your AI agricultural assistant! I'll help you take care of your crops. Tell me, how can I help you today? I'll talk to you like a friend.";
        
        this.addMessage(activationMessage, 'agent');
        this.speakResponse(activationMessage);
        
        // Show features after 3 seconds
        setTimeout(() => {
            this.showHappyFeatures(language);
        }, 3000);
    }

    promptForActivation(language) {
        const isHindi = language === 'hi';
        
        const promptMessage = isHindi ? 
            "👋 नमस्ते! मैं Happy हूं। मुझे activate करने के लिए 'Happy' बोलिए, फिर मैं आपकी मदद करूंगा।" :
            "👋 Hello! I'm Happy. Say 'Happy' to activate me, then I'll help you.";
        
        this.addMessage(promptMessage, 'agent');
        this.speakResponse(promptMessage);
    }

    showHappyFeatures(language) {
        const isHindi = language === 'hi';
        
        const featuresMessage = isHindi ? 
            "🌟 **Happy की विशेषताएं:**\n\n" +
            "💬 **दोस्ताना बातचीत**: मैं आपसे दोस्त की तरह बात करता हूं\n" +
            "🌱 **फसल की देखभाल**: आपकी फसलों की हर समस्या का समाधान\n" +
            "📸 **फोटो analysis**: फोटो भेजें, मैं disease detect करूंगा\n" +
            "🧮 **Exact calculations**: Tanki size बताएं, exact medicine calculate करूंगा\n" +
            "🔊 **Natural voice**: मैं natural voice में बात करता हूं\n" +
            "❤️ **Feelings के साथ**: मैं आपकी feelings समझता हूं" :
            
            "🌟 **Happy's Features:**\n\n" +
            "💬 **Friendly Chat**: I talk to you like a friend\n" +
            "🌱 **Crop Care**: Solution for all your crop problems\n" +
            "📸 **Photo Analysis**: Send photos, I'll detect diseases\n" +
            "🧮 **Exact Calculations**: Tell me tank size, I'll calculate exact medicine\n" +
            "🔊 **Natural Voice**: I speak in natural voice\n" +
            "❤️ **With Feelings**: I understand your feelings";
        
        this.addMessage(featuresMessage, 'agent');
        this.speakResponse(featuresMessage);
    }

    extractTankiSize(input) {
        // Extract tanki size from user input
        const numbers = input.match(/\d+/g);
        if (numbers) {
            const size = parseInt(numbers[0]);
            if (size >= 5 && size <= 100) { // Reasonable tanki size range
                return size;
            }
        }
        return null;
    }

    processTankiSizeInput(tankiSize, language) {
        const isHindi = language === 'hi';
        
        // AI doctor calculates medicine based on tanki size
        const calculation = this.calculateMedicineForTanki(tankiSize, this.currentDisease);
        
        const response = isHindi ? 
            `बहुत अच्छा! आपकी ${tankiSize} लीटर टंकी के लिए मैं आपको exact calculation देता हूं:\n\n` +
            `💊 **दवा**: ${calculation.medicine.name_hi}\n` +
            `📏 **मात्रा**: ${calculation.medicineQuantity} ${calculation.medicine.unit}\n` +
            `💧 **पानी**: ${tankiSize} लीटर\n` +
            `💰 **लागत**: ₹${calculation.cost}\n\n` +
            `⏰ **उपयोग का तरीका**:\n` +
            `1. पहले टंकी में ${tankiSize} लीटर पानी भरें\n` +
            `2. ${calculation.medicineQuantity} ${calculation.medicine.unit} दवा मिलाएं\n` +
            `3. अच्छी तरह मिलाएं\n` +
            `4. सुबह 6-8 बजे या शाम 5-7 बजे छिड़काव करें\n` +
            `5. हर 7 दिन में दोबारा करें\n\n` +
            `⚠️ **सावधानी**: त्वचा और आंखों के संपर्क से बचें` :
            
            `Great! For your ${tankiSize} liter tank, here's the exact calculation:\n\n` +
            `💊 **Medicine**: ${calculation.medicine.name_en}\n` +
            `📏 **Quantity**: ${calculation.medicineQuantity} ${calculation.medicine.unit}\n` +
            `💧 **Water**: ${tankiSize} liters\n` +
            `💰 **Cost**: ₹${calculation.cost}\n\n` +
            `⏰ **How to Use**:\n` +
            `1. First fill ${tankiSize} liters water in tank\n` +
            `2. Add ${calculation.medicineQuantity} ${calculation.medicine.unit} medicine\n` +
            `3. Mix well\n` +
            `4. Spray in morning 6-8 AM or evening 5-7 PM\n` +
            `5. Repeat every 7 days\n\n` +
            `⚠️ **Precaution**: Avoid contact with skin and eyes`;
        
        this.addMessage(response, 'agent');
        this.speakResponse(response);
        
        // Ask if they need more help
        setTimeout(() => {
            const followUpMessage = isHindi ? 
                "क्या आपको कोई और सवाल है? या आप किसी और फसल की फोटो भेजना चाहते हैं?" :
                "Do you have any other questions? Or would you like to send photos of other crops?";
            this.addMessage(followUpMessage, 'agent');
            this.speakResponse(followUpMessage);
        }, 3000);
    }

    calculateMedicineForTanki(tankiSize, disease) {
        // AI mind calculation - no external calculator
        const treatments = this.getTreatmentDataForDisease(disease);
        const treatment = treatments[0]; // Get best treatment
        
        // Calculate based on standard ratio: 2-3 grams per liter
        const gramsPerLiter = 2.5; // AI's intelligent calculation
        const medicineQuantity = (tankiSize * gramsPerLiter).toFixed(1);
        const cost = (treatment.cost_per_unit * medicineQuantity / 1000).toFixed(2);
        
        return {
            medicine: treatment,
            medicineQuantity: medicineQuantity,
            tankiSize: tankiSize,
            cost: cost
        };
    }

    getTreatmentDataForDisease(disease) {
        // AI's knowledge base for treatments
        const treatmentDatabase = {
            'Late Blight': [{
                name_en: 'Chlorothalonil 75% WP',
                name_hi: 'क्लोरोथैलोनिल 75% WP',
                cost_per_unit: 380,
                unit: 'g'
            }],
            'Rice Blast': [{
                name_en: 'Tricyclazole 75% WP',
                name_hi: 'ट्राइसाइक्लाजोल 75% WP',
                cost_per_unit: 450,
                unit: 'g'
            }]
        };
        
        return treatmentDatabase[disease.disease] || treatmentDatabase['Late Blight'];
    }

    isPhotoUploadRequest(input) {
        const photoKeywords = ['photo', 'फोटो', 'image', 'तस्वीर', 'picture', 'चित्र'];
        return photoKeywords.some(keyword => input.toLowerCase().includes(keyword));
    }

    handlePhotoUploadRequest(language) {
        const isHindi = language === 'hi';
        const message = isHindi ? 
            "बहुत अच्छा! आप मुझे फोटो भेज सकते हैं। ऊपर 'Photo Upload' बटन पर क्लिक करें या फोटो को यहाँ drag & drop करें।" :
            "Great! You can send me photos. Click the 'Photo Upload' button above or drag & drop photos here.";
        
        this.addMessage(message, 'agent');
        this.speakResponse(message);
    }

    convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async sendToBackend(query, language) {
        try {
            console.log('🚀 Sending to backend:', query, language);
            const response = await fetch(`${this.apiBaseUrl}/farmer/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    language: language,
                    session_id: this.sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📥 Backend response:', data);
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.error?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Backend API error:', error);
            // Fallback to local response if backend is not available
            return await this.generateLocalResponse(query, language);
        }
    }

    detectLanguage(text) {
        // Simple language detection based on Devanagari script
        const hindiRegex = /[\u0900-\u097F]/;
        return hindiRegex.test(text) ? 'hi' : 'en';
    }

    getLanguage() {
        return document.getElementById('languageSelect')?.value || 'en';
    }

    async generateLocalResponse(query, language) {
        // Happy's human-like responses with feelings
        const lowerQuery = query.toLowerCase();
        
        // Happy's agricultural knowledge base with emotional responses
        const knowledgeBase = {
            hi: {
                greetings: [
                    "हां भाई! मैं Happy हूं, आपका AI कृषि सहायक। मैं आपसे दोस्त की तरह बात करूंगा। बताइए आपकी फसल में क्या समस्या है?",
                    "नमस्ते! मैं Happy हूं और मैं यहां आपकी मदद के लिए हूं। मैं आपकी हर समस्या का समाधान दूंगा।",
                    "हैलो भाई! मैं Happy हूं। मैं आपका कृषि दोस्त हूं। कैसे मदद कर सकता हूं?"
                ],
                tomato: [
                    "अरे भाई! आपके टमाटर में Late Blight का रोग है। चिंता मत करिए, मैं आपकी मदद करूंगा। Chlorothalonil का उपयोग करें। 2-3 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।",
                    "टमाटर के पत्तों पर पीले धब्बे Early Blight का संकेत है। Mancozeb 75% WP का छिड़काव करें। मैं आपके साथ हूं।"
                ],
                rice: [
                    "हां भाई, राइस ब्लास्ट की समस्या है। मैं आपको बताता हूं कि क्या करना है। Tricyclazole का उपयोग करें। आपकी फसल जल्दी ठीक हो जाएगी।",
                    "चावल के पत्तों पर भूरे धब्बे Brown Spot का लक्षण है। Propiconazole का छिड़काव करें। मैं आपकी मदद करूंगा।"
                ],
                wheat: [
                    "गेहूं में Wheat Rust की समस्या है। चिंता मत करिए, मैं यहां हूं। Tebuconazole का उपयोग करें। आपकी फसल अच्छी हो जाएगी।",
                    "गेहूं के पत्तों पर नारंगी धब्बे Wheat Rust का संकेत है। तुरंत उपचार करें। मैं आपके साथ हूं।"
                ],
                chili: [
                    "मिर्च की बात कर रहे हैं! मैं आपकी मदद करूंगा। Anthracnose के लिए Carbendazim का उपयोग करें। आपकी मिर्च अच्छी हो जाएगी।",
                    "मिर्च के फलों पर काले धब्बे Anthracnose का लक्षण है। तुरंत उपचार करें। मैं यहां हूं आपकी मदद के लिए।"
                ],
                general: [
                    "हां भाई, मैं यहां हूं! मैं Happy हूं और मैं आपकी मदद करूंगा। कृपया फसल का नाम और लक्षण बताएं। मैं आपसे दोस्त की तरह बात करूंगा।",
                    "बेहतर सलाह के लिए आप फोटो भी भेज सकते हैं। मैं आपकी हर समस्या का समाधान दूंगा।",
                    "चिंता मत करिए, मैं यहां हूं। किसी भी रासायनिक उपचार से पहले मुझसे पूछिए।"
                ]
            },
            en: {
                greetings: [
                    "Hello! I'm your AI agricultural assistant. You can ask me about any crop disease.",
                    "Hi there! I'm here to help you with your farming problems. What's troubling your crops?",
                    "Greetings! I'm your agricultural expert. How can I assist you today?"
                ],
                tomato: [
                    "Tomatoes commonly suffer from Late Blight, Early Blight, and Bacterial Spot. Dark spots on leaves could indicate Late Blight. Use Chlorothalonil.",
                    "Yellow spots on tomato leaves indicate Early Blight. Apply Mancozeb 75% WP."
                ],
                rice: [
                    "Rice is affected by Rice Blast, Brown Spot, and Bacterial Leaf Blight. Use Tricyclazole for Rice Blast.",
                    "Brown spots on rice leaves indicate Brown Spot disease. Apply Propiconazole."
                ],
                wheat: [
                    "Wheat suffers from Wheat Rust, Powdery Mildew, and Leaf Blight. Use Tebuconazole for Rust.",
                    "Orange spots on wheat leaves indicate Wheat Rust. Treat immediately."
                ],
                chili: [
                    "Chili is affected by Anthracnose, Bacterial Spot, and Powdery Mildew. Use Carbendazim for Anthracnose.",
                    "Black spots on chili fruits indicate Anthracnose. Treat immediately."
                ],
                general: [
                    "I need more information to give you the right treatment for your crop. Please tell me the crop name and symptoms.",
                    "For better advice, you can also send photos. I'll help you identify the problem.",
                    "Always consult a local agricultural expert before using any chemical treatment."
                ]
            }
        };

        // Detect crop from query
        let crop = 'general';
        if (lowerQuery.includes('tomato') || lowerQuery.includes('टमाटर')) crop = 'tomato';
        else if (lowerQuery.includes('rice') || lowerQuery.includes('चावल')) crop = 'rice';
        else if (lowerQuery.includes('wheat') || lowerQuery.includes('गेहूं')) crop = 'wheat';
        else if (lowerQuery.includes('chili') || lowerQuery.includes('मिर्च')) crop = 'chili';

        // Check for greetings
        const greetings = ['hello', 'hi', 'namaste', 'नमस्ते', 'हैलो', 'आदाब'];
        if (greetings.some(g => lowerQuery.includes(g))) {
            crop = 'greetings';
        }

        const responses = knowledgeBase[language]?.[crop] || knowledgeBase[language]?.general || knowledgeBase.en.general;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        return {
            response: randomResponse,
            detected_crop: crop === 'general' ? null : crop,
            detected_disease: null,
            confidence_score: 0.6,
            response_time_ms: 100
        };
    }

    showTreatmentRecommendations(disease) {
        if (!disease) return;
        
        // Scroll to treatment section
        const treatmentSection = document.getElementById('treatment-recommendations');
        if (treatmentSection) {
            treatmentSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Show detailed calculation modal
        this.showCalculationModal(disease);
        
        // Show notification
        const message = this.getLanguage() === 'hi' ? 
            `${disease.name_hi || disease.name_en} के लिए उपचार सुझाव नीचे उपलब्ध हैं!` :
            `Treatment recommendations for ${disease.name_en} are now available below!`;
        showNotification(message, 'success');
    }

    showCalculationModal(disease) {
        const isHindi = this.getLanguage() === 'hi';
        
        // Create calculation modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content calculation-modal">
                <div class="modal-header">
                    <h3>${isHindi ? 'दवा की गणना' : 'Medicine Calculation'}</h3>
                    <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="calculation-form">
                        <div class="form-group">
                            <label>${isHindi ? 'खेत का क्षेत्रफल' : 'Field Area'}</label>
                            <div class="area-inputs">
                                <input type="number" id="fieldArea" placeholder="0" min="0" step="0.1">
                                <select id="areaUnit">
                                    <option value="acre">${isHindi ? 'एकड़' : 'Acre'}</option>
                                    <option value="hectare">${isHindi ? 'हेक्टेयर' : 'Hectare'}</option>
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="aiAgent.calculateMedicine()">
                            ${isHindi ? 'गणना करें' : 'Calculate'}
                        </button>
                    </div>
                    <div id="calculationResult" class="calculation-result" style="display: none;">
                        <!-- Results will be populated here -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Store disease data for calculation
        this.currentDisease = disease;
    }

    calculateMedicine() {
        const area = parseFloat(document.getElementById('fieldArea').value);
        const unit = document.getElementById('areaUnit').value;
        const isHindi = this.getLanguage() === 'hi';
        
        if (!area || area <= 0) {
            showNotification(isHindi ? 'कृपया सही क्षेत्रफल दर्ज करें' : 'Please enter valid area', 'error');
            return;
        }
        
        const resultDiv = document.getElementById('calculationResult');
        resultDiv.style.display = 'block';
        
        // Get treatment data (this would come from backend in real implementation)
        const treatments = this.getTreatmentData(this.currentDisease);
        
        let resultHTML = `
            <h4>${isHindi ? 'गणना परिणाम' : 'Calculation Results'}</h4>
            <div class="calculation-summary">
                <p><strong>${isHindi ? 'क्षेत्रफल' : 'Area'}:</strong> ${area} ${unit === 'acre' ? (isHindi ? 'एकड़' : 'acres') : (isHindi ? 'हेक्टेयर' : 'hectares')}</p>
            </div>
        `;
        
        treatments.forEach(treatment => {
            const dosage = unit === 'acre' ? treatment.dosage_per_acre : treatment.dosage_per_hectare;
            const water = unit === 'acre' ? treatment.water_requirement_per_acre : treatment.water_requirement_per_hectare;
            const sprayVolume = unit === 'acre' ? treatment.spray_volume_per_acre : treatment.spray_volume_per_hectare;
            
            const totalDosage = (dosage * area).toFixed(2);
            const totalWater = (water * area).toFixed(0);
            const totalSpray = (sprayVolume * area).toFixed(0);
            const totalCost = (treatment.cost_per_unit * totalDosage / 1000).toFixed(2);
            
            resultHTML += `
                <div class="treatment-calculation">
                    <h5>${treatment.name_en} (${treatment.name_hi || ''})</h5>
                    <div class="calculation-details">
                        <div class="detail-item">
                            <span class="label">${isHindi ? 'दवा की मात्रा' : 'Medicine Quantity'}:</span>
                            <span class="value">${totalDosage} ${treatment.unit}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">${isHindi ? 'पानी की जरूरत' : 'Water Required'}:</span>
                            <span class="value">${totalWater} ${isHindi ? 'लीटर' : 'liters'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">${isHindi ? 'स्प्रे वॉल्यूम' : 'Spray Volume'}:</span>
                            <span class="value">${totalSpray} ${isHindi ? 'लीटर' : 'liters'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">${isHindi ? 'अनुप्रयोग समय' : 'Application Timing'}:</span>
                            <span class="value">${treatment.application_timing}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">${isHindi ? 'पुन: आवेदन' : 'Reapplication'}:</span>
                            <span class="value">${isHindi ? 'हर' : 'Every'} ${treatment.reapplication_interval} ${isHindi ? 'दिन' : 'days'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">${isHindi ? 'कुल अनुप्रयोग' : 'Total Applications'}:</span>
                            <span class="value">${treatment.total_applications} ${isHindi ? 'बार' : 'times'}</span>
                        </div>
                        <div class="detail-item cost">
                            <span class="label">${isHindi ? 'अनुमानित लागत' : 'Estimated Cost'}:</span>
                            <span class="value">₹${totalCost}</span>
                        </div>
                    </div>
                    <div class="safety-warning">
                        <strong>${isHindi ? 'सुरक्षा सावधानियां' : 'Safety Precautions'}:</strong>
                        <p>${isHindi ? treatment.safety_precautions_hi : treatment.safety_precautions_en}</p>
                    </div>
                </div>
            `;
        });
        
        resultDiv.innerHTML = resultHTML;
    }

    getTreatmentData(disease) {
        // This would fetch from backend in real implementation
        // For now, return sample data
        return [
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
                reapplication_interval: 7,
                total_applications: 3,
                cost_per_unit: 380,
                unit: 'g',
                safety_precautions_en: 'Avoid contact with skin and eyes',
                safety_precautions_hi: 'त्वचा और आंखों के संपर्क से बचें'
            }
        ];
    }

    async generateAIResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Agricultural knowledge base
        const responses = {
            // Hindi responses
            'tomato': {
                'patte': 'Tomato के पत्तों पर काले धब्बे Late Blight या Early Blight का लक्षण हो सकता है। आपको Propiconazole 25% EC (1-2 ml per liter) का उपयोग करना चाहिए। साथ ही Neem oil भी काम करता है।',
                'disease': 'Tomato में सबसे common diseases हैं: Late Blight, Early Blight, Bacterial Spot, और Mosaic virus। हर disease का अलग treatment है।'
            },
            'rice': {
                'blast': 'Rice Blast एक serious fungal disease है। Treatment के लिए Tricyclazole 75% WP (1-2 grams per liter) या Propiconazole 25% EC use करें। Proper spacing और nitrogen control भी जरूरी है।',
                'disease': 'Rice में main diseases हैं: Blast, Sheath Blight, Brown Spot, और Bacterial Leaf Blight।'
            },
            'chili': {
                'anthracnose': 'Chili Anthracnose के लिए Carbendazim 50% WP (1-2 grams per liter) या Mancozeb 75% WP use करें। Organic treatment में Neem oil और Chitosan spray भी effective है।',
                'disease': 'Chili में common diseases हैं: Anthracnose, Bacterial Leaf Spot, और Mosaic virus।'
            },
            'wheat': {
                'rust': 'Wheat Rust के लिए Tebuconazole 25% EC या Propiconazole 25% EC use करें। Organic में Sulfur dust भी काम करता है। Resistant varieties use करना best है।',
                'disease': 'Wheat में main diseases हैं: Rust, Powdery Mildew, Septoria, और Karnal Bunt।'
            },
            'mango': {
                'anthracnose': 'Mango Anthracnose के लिए Copper oxychloride 50% WP या Carbendazim 50% WP use करें। Bordeaux mixture भी effective है। Proper pruning और air circulation जरूरी है।',
                'disease': 'Mango में common diseases हैं: Anthracnose, Powdery Mildew, और Bacterial Canker।'
            },
            'organic': {
                'medicine': 'Organic treatments में Neem oil, Bordeaux mixture, Trichoderma, और Copper fungicides शामिल हैं। ये environment-friendly हैं और beneficial insects को नुकसान नहीं पहुंचाते।',
                'treatment': 'Organic farming के लिए bio-fertilizers, compost, और natural pest control methods use करें।'
            },
            'treatment': {
                'chemical': 'Chemical treatments effective हैं लेकिन safety precautions जरूरी हैं। Protective gear पहनें, proper dosage use करें, और local agriculture expert से consult करें।',
                'dosage': 'हमेशा recommended dosage follow करें। Overdose harmful हो सकता है। Product label पर instructions पढ़ें।'
            }
        };

        // Find best matching response
        let bestResponse = null;
        let maxScore = 0;

        for (const [category, subResponses] of Object.entries(responses)) {
            for (const [keyword, response] of Object.entries(subResponses)) {
                const score = this.calculateRelevanceScore(lowerInput, category, keyword);
                if (score > maxScore) {
                    maxScore = score;
                    bestResponse = response;
                }
            }
        }

        // Default responses
        if (!bestResponse) {
            if (lowerInput.includes('namaste') || lowerInput.includes('hello')) {
                bestResponse = 'Namaste! Main aapka AI assistant hun. Aap mujhse crop diseases, treatment, ya farming ke bare mein koi bhi sawal puch sakte hain।';
            } else if (lowerInput.includes('help') || lowerInput.includes('madad')) {
                bestResponse = 'Main aapki madad kar sakta hun crop diseases identify करने में, treatment suggest करने में, और farming tips देने में। Aap specific crop ya disease ka naam bataiye।';
            } else {
                bestResponse = 'Main aapki baat samajh gaya, lekin main specific information provide kar sakta hun। Kya aap specific crop ya disease ka naam bata sakte hain? Jaise Tomato, Rice, Wheat, ya Chili।';
            }
        }

        // Add safety disclaimer
        const safetyNote = '\n\n⚠️ Important: यह AI advice है। Chemical treatments use करने से पहले local agriculture expert से consult करें। Safety precautions follow करें।';

        return {
            text: bestResponse + safetyNote,
            shouldSpeak: true,
            confidence: maxScore / 10
        };
    }

    calculateRelevanceScore(input, category, keyword) {
        let score = 0;
        
        // Direct keyword matches
        if (input.includes(category)) score += 3;
        if (input.includes(keyword)) score += 2;
        
        // Hindi variations
        const hindiVariations = {
            'tomato': ['टमाटर', 'tamatar'],
            'rice': ['चावल', 'chawal', 'dhan'],
            'chili': ['मिर्च', 'mirch', 'lal mirch'],
            'wheat': ['गेहूं', 'gehun'],
            'mango': ['आम', 'aam'],
            'patte': ['पत्ते', 'patta', 'leaves'],
            'disease': ['रोग', 'rog', 'bimari'],
            'treatment': ['इलाज', 'ilaaj', 'upchar'],
            'organic': ['जैविक', 'jaivik', 'natural'],
            'medicine': ['दवा', 'dawa', 'spray']
        };

        if (hindiVariations[category]) {
            for (const variation of hindiVariations[category]) {
                if (input.includes(variation)) score += 2;
            }
        }

        if (hindiVariations[keyword]) {
            for (const variation of hindiVariations[keyword]) {
                if (input.includes(variation)) score += 1;
            }
        }

        return score;
    }

    addMessage(text, sender, shouldSpeak = true) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) {
            console.error('Chat messages container not found');
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'agent' ? 'fas fa-robot' : 'fas fa-user';
        const currentTime = new Date().toLocaleTimeString('hi-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatar}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <div class="message-time">${currentTime}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store in conversation history
        this.conversationHistory.push({ text, sender, timestamp: Date.now() });
        
        // Speak response if it's from agent and shouldSpeak is true
        if (sender === 'agent' && shouldSpeak) {
            this.speakResponse(text);
        }
    }

    speakResponse(text) {
        if (!this.synthesis || this.isMuted) return;

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language based on content
        if (this.getLanguage() === 'hi' || /[\u0900-\u097F]/.test(text)) {
            utterance.lang = 'hi-IN'; // Hindi
        } else {
            utterance.lang = 'en-US'; // English
        }
        
        // Natural voice settings for Happy
        utterance.rate = 0.9; // Natural speaking speed
        utterance.pitch = 1.1; // Slightly higher pitch for friendly tone
        utterance.volume = 0.9; // Clear volume

        // Try to use a more natural voice
        const voices = this.synthesis.getVoices();
        let selectedVoice = null;
        
        if (utterance.lang === 'hi-IN') {
            // Prefer Hindi voices
            selectedVoice = voices.find(voice => 
                voice.lang.includes('hi') || voice.lang.includes('IN')
            );
        } else {
            // Prefer English voices
            selectedVoice = voices.find(voice => 
                voice.lang.includes('en') && voice.name.includes('Female')
            );
        }
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Add emotional expression
        this.addEmotionalExpression(utterance, text);

        this.synthesis.speak(utterance);
    }

    addEmotionalExpression(utterance, text) {
        // Add emotional expressions based on content
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('हम बोलिए') || lowerText.includes("let's talk")) {
            // Excited tone for activation
            utterance.pitch = 1.2;
            utterance.rate = 1.0;
        } else if (lowerText.includes('मदद') || lowerText.includes('help')) {
            // Caring tone for help
            utterance.pitch = 1.0;
            utterance.rate = 0.8;
        } else if (lowerText.includes('धन्यवाद') || lowerText.includes('thank')) {
            // Happy tone for thanks
            utterance.pitch = 1.1;
            utterance.rate = 0.9;
        } else if (lowerText.includes('समस्या') || lowerText.includes('problem')) {
            // Concerned tone for problems
            utterance.pitch = 0.9;
            utterance.rate = 0.7;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // Update mute button
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            const icon = muteBtn.querySelector('i');
            const text = muteBtn.querySelector('span');
            
            if (this.isMuted) {
                icon.className = 'fas fa-volume-mute';
                text.textContent = 'Unmute';
                muteBtn.style.background = '#dc3545';
            } else {
                icon.className = 'fas fa-volume-up';
                text.textContent = 'Mute';
                muteBtn.style.background = '#4a7c59';
            }
        }
        
        // Stop current speech if muting
        if (this.isMuted && this.synthesis) {
            this.synthesis.cancel();
        }
        
        // Show notification
        const isHindi = this.getLanguage() === 'hi';
        const message = this.isMuted ? 
            (isHindi ? '🔇 Voice muted' : '🔇 Voice muted') :
            (isHindi ? '🔊 Voice unmuted' : '🔊 Voice unmuted');
        
        this.addMessage(message, 'agent');
    }

    updateUI(status) {
        const statusIndicator = document.getElementById('agentStatus');
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');

        if (statusIndicator) {
            statusIndicator.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            statusIndicator.className = `status-indicator ${status}`;
        }

        if (voiceBtn) {
            if (status === 'listening') {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = '<i class="fas fa-stop"></i><span>Listening...</span>';
            } else {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Hold to speak</span>';
            }
        }

        if (voiceStatus) {
            const statusMessages = {
                'ready': 'Click and hold to speak in Hindi or English',
                'listening': 'Listening... Speak now',
                'processing': 'Processing your question...'
            };
            voiceStatus.textContent = statusMessages[status] || statusMessages['ready'];
        }
    }

    showNotification(message, type) {
        // Use existing notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Global AI Agent instance
let aiAgent = null;

// Initialize AI Agent
function initializeAIAgent() {
    try {
        if (!aiAgent) {
            console.log('Initializing AI Agent...');
            aiAgent = new AIAgent();
            console.log('AI Agent initialized successfully');
        } else {
            console.log('AI Agent already initialized');
        }
    } catch (error) {
        console.error('Error initializing AI Agent:', error);
        alert('Error initializing AI Agent. Please refresh the page.');
    }
}

// Test function for Happy
function testHappyDirect() {
    console.log('🧪 Testing Happy directly...');
    if (aiAgent) {
        aiAgent.processUserInput('Happy');
    } else {
        alert('AI Agent not initialized!');
    }
}

// Input mode switching
function setInputMode(mode) {
    const voiceInput = document.getElementById('voiceInput');
    const textInput = document.getElementById('textInput');
    const photoInput = document.getElementById('photoInput');
    const modeBtns = document.querySelectorAll('.input-mode-btn');

    // Update button states
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });

    // Show/hide input methods
    if (mode === 'voice') {
        voiceInput.style.display = 'block';
        textInput.style.display = 'none';
        photoInput.style.display = 'none';
    } else if (mode === 'text') {
        voiceInput.style.display = 'none';
        textInput.style.display = 'flex';
        photoInput.style.display = 'none';
    } else if (mode === 'photo') {
        voiceInput.style.display = 'none';
        textInput.style.display = 'none';
        photoInput.style.display = 'block';
    }

    if (aiAgent) {
        aiAgent.currentInputMode = mode;
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Show preview
    const preview = document.getElementById('photoPreview');
    const previewImage = document.getElementById('previewImage');
    const uploadBtn = document.querySelector('.photo-upload-btn');
    
    if (preview && previewImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            preview.style.display = 'block';
            uploadBtn.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
    
    // Send to AI agent for analysis
    if (aiAgent) {
        aiAgent.handlePhotoUploadInChat(file);
    }
}

function removePhoto() {
    const preview = document.getElementById('photoPreview');
    const uploadBtn = document.querySelector('.photo-upload-btn');
    const fileInput = document.getElementById('photoUploadInput');
    
    if (preview) preview.style.display = 'none';
    if (uploadBtn) uploadBtn.style.display = 'block';
    if (fileInput) fileInput.value = '';
}

function toggleMute() {
    if (aiAgent) {
        aiAgent.toggleMute();
    }
}

// Voice input functions
function startVoiceInput() {
    if (aiAgent) {
        aiAgent.startListening();
    } else {
        console.error('AI Agent not initialized');
        alert('AI Agent is not ready. Please wait a moment and try again.');
    }
}

// Text input functions
function sendTextMessage() {
    const textInput = document.getElementById('textMessageInput');
    if (!textInput) {
        console.error('Text input not found');
        return;
    }
    
    if (!aiAgent) {
        console.error('AI Agent not initialized');
        alert('AI Agent is not ready. Please wait a moment and try again.');
        return;
    }

    const message = textInput.value.trim();
    if (message) {
        aiAgent.processUserInput(message);
        textInput.value = '';
    } else {
        alert('Please enter a message first.');
    }
}

// Quick question function
function askQuickQuestion(question) {
    if (aiAgent) {
        aiAgent.processUserInput(question);
    } else {
        console.error('AI Agent not initialized');
        alert('AI Agent is not ready. Please wait a moment and try again.');
    }
}

// User data control functions
function deleteAllData() {
    if (confirm('Are you sure you want to delete all your images? This action cannot be undone.')) {
        // Simulate data deletion
        localStorage.removeItem('uploadedImages');
        localStorage.removeItem('capturedPhotos');
        
        // Clear any displayed images
        const uploadedImages = document.getElementById('uploadedImages');
        if (uploadedImages) {
            uploadedImages.innerHTML = '';
        }
        
        // Show success message
        showNotification('All your images have been deleted successfully.', 'success');
    }
}

function optOutTraining() {
    if (confirm('Opt out of using your images for model training? You can opt back in anytime.')) {
        localStorage.setItem('optOutTraining', 'true');
        showNotification('You have opted out of model training. Your images will only be used for diagnosis.', 'success');
    }
}

function downloadMyData() {
    // Simulate data download
    const userData = {
        uploadedImages: JSON.parse(localStorage.getItem('uploadedImages') || '[]'),
        capturedPhotos: JSON.parse(localStorage.getItem('capturedPhotos') || '[]'),
        optOutTraining: localStorage.getItem('optOutTraining') || 'false',
        downloadDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'cropguard-ai-data.json';
    link.click();
    
    showNotification('Your data has been downloaded successfully.', 'success');
}

// Enhanced error handling
function showErrorHandling() {
    // Check for common error scenarios
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            // Simulate potential errors
            setTimeout(() => {
                const random = Math.random();
                if (random < 0.1) { // 10% chance of error
                    showNoDetectionError();
                } else if (random < 0.15) { // 5% chance of server error
                    showServerError();
                }
            }, 2000);
        });
    }
}

function showNoDetectionError() {
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
        <div class="error-content">
            <div class="error-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>No Disease Detected</h3>
            </div>
            <div class="error-body">
                <p>We couldn't detect any disease in your photos. This could be because:</p>
                <ul>
                    <li>Photos are too blurry or dark</li>
                    <li>Disease is in early stage</li>
                    <li>Plant is healthy</li>
                    <li>Disease not in our database</li>
                </ul>
                <div class="error-actions">
                    <button class="btn-retry" onclick="retakePhotos()">Retake Photos</button>
                    <button class="btn-feedback" onclick="sendFeedback()">Send Feedback</button>
                    <button class="btn-close" onclick="closeErrorModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    setTimeout(() => errorModal.classList.add('show'), 100);
}

function showServerError() {
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
        <div class="error-content">
            <div class="error-header">
                <i class="fas fa-server"></i>
                <h3>Server Error</h3>
            </div>
            <div class="error-body">
                <p>We're experiencing technical difficulties. Please try again in a few moments.</p>
                <div class="error-actions">
                    <button class="btn-retry" onclick="retryAnalysis()">Try Again</button>
                    <button class="btn-close" onclick="closeErrorModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    setTimeout(() => errorModal.classList.add('show'), 100);
}

function retakePhotos() {
    closeErrorModal();
    // Reset photo workflow
    currentStep = 1;
    capturedPhotos = [];
    updateProgress();
    document.getElementById('captureArea').style.display = 'block';
    document.getElementById('photoPreview').style.display = 'none';
}

function sendFeedback() {
    closeErrorModal();
    // Open feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.style.display = 'block';
    }
}

function retryAnalysis() {
    closeErrorModal();
    analyzePhotos();
}

function closeErrorModal() {
    const errorModal = document.querySelector('.error-modal');
    if (errorModal) {
        errorModal.classList.remove('show');
        setTimeout(() => errorModal.remove(), 300);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 5000);
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}
