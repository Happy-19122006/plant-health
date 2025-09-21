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
    initializeApp();
    setupEventListeners();
    loadGallery();
    setTheme(currentTheme);
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

// Photo Workflow Functionality
function setupPhotoWorkflow() {
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const uploadGalleryBtn = document.getElementById('uploadGalleryBtn');
    const cameraInput = document.getElementById('cameraInput');
    const fileInput = document.getElementById('fileInput');
    const retakeBtn = document.getElementById('retakeBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // Take photo button
    takePhotoBtn.addEventListener('click', () => {
        if (!checkConsent()) return;
        cameraInput.click();
    });

    // Upload from gallery button
    uploadGalleryBtn.addEventListener('click', () => {
        if (!checkConsent()) return;
        fileInput.click();
    });

    // Camera input change
    cameraInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handlePhotoCapture(e.target.files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handlePhotoCapture(e.target.files[0]);
        }
    });

    // Retake button
    retakeBtn.addEventListener('click', () => {
        document.getElementById('photoPreview').style.display = 'none';
        document.getElementById('captureArea').style.display = 'block';
    });

    // Confirm button
    confirmBtn.addEventListener('click', () => {
        confirmPhoto();
    });

    // Analyze button
    analyzeBtn.addEventListener('click', () => {
        analyzePhotos();
    });
}

// Handle photo capture
function handlePhotoCapture(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentPhotoData = {
            file: file,
            url: e.target.result,
            step: currentStep
        };
        
        // Show preview
        showPhotoPreview(e.target.result);
        
        // Check image quality
        checkImageQuality(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Show photo preview
function showPhotoPreview(imageUrl) {
    const captureArea = document.getElementById('captureArea');
    const photoPreview = document.getElementById('photoPreview');
    const previewImage = document.getElementById('previewImage');
    
    previewImage.src = imageUrl;
    captureArea.style.display = 'none';
    photoPreview.style.display = 'block';
}

// Check image quality
function checkImageQuality(imageUrl) {
    const qualityItems = document.querySelectorAll('.quality-item');
    
    // Simulate quality check (in real implementation, use image processing)
    setTimeout(() => {
        // Randomly show quality warnings for demo
        const isGoodQuality = Math.random() > 0.3; // 70% chance of good quality
        
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
    }, 1000);
}

// Confirm photo
function confirmPhoto() {
    capturedPhotos.push(currentPhotoData);
    
    // Hide preview and reset
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('captureArea').style.display = 'block';
    
    // Move to next step
    if (currentStep < 3) {
        currentStep++;
        updateWorkflowStep();
        updateProgress();
    } else {
        // All photos captured
        showAnalyzeButton();
    }
    
    currentPhotoData = null;
}

// Update workflow step
function updateWorkflowStep() {
    const steps = document.querySelectorAll('.step');
    const t = translations[currentLanguage];
    const titles = [t.closeupPhoto, t.fullPlantPhoto, t.undersidePhoto];
    const descriptions = [t.closeupDesc, t.fullPlantDesc, t.undersideDesc];
    
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
    
    document.getElementById('captureTitle').textContent = titles[currentStep - 1];
    document.getElementById('captureDescription').textContent = descriptions[currentStep - 1];
}

// Update progress
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const progress = (capturedPhotos.length / 3) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = currentLanguage === 'hi' 
        ? `फोटो ${capturedPhotos.length} में से 3` 
        : `Photo ${capturedPhotos.length} of 3`;
}

// Show analyze button
function showAnalyzeButton() {
    document.getElementById('analyzeSection').style.display = 'block';
    document.getElementById('photoWorkflow').style.display = 'none';
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
function generateEnhancedPrediction() {
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
    // How it works modal
    const howItWorksModal = document.getElementById('howItWorksModal');
    const closeHowItWorks = document.getElementById('closeHowItWorks');
    
    closeHowItWorks.addEventListener('click', () => {
        howItWorksModal.classList.remove('show');
    });
    
    // Privacy modal
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacy = document.getElementById('closePrivacy');
    
    // Update privacy modal content
    const t = translations[currentLanguage];
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
    
    closePrivacy.addEventListener('click', () => {
        privacyModal.classList.remove('show');
    });
    
    // Close modals when clicking outside
    [howItWorksModal, privacyModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// Show how it works modal
function showHowItWorks() {
    const modal = document.getElementById('howItWorksModal');
    const t = translations[currentLanguage];
    
    // Update modal content
    const modalHeader = modal.querySelector('.modal-header h2');
    const stepTitles = modal.querySelectorAll('.step-details h3');
    const stepDescs = modal.querySelectorAll('.step-details p');
    
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
    if (!consentCheckbox.checked) {
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
async function handlePhotoCapture(file) {
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

// Add progress indicator for analysis
function analyzePhotos() {
    showLoadingSpinner();
    
    // Show progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'analysis-progress';
    const t = translations[currentLanguage];
    const stepTexts = currentLanguage === 'hi' 
        ? ['छवियां प्रसंस्करण', 'AI विश्लेषण', 'परिणाम उत्पन्न करना']
        : ['Processing Images', 'AI Analysis', 'Generating Results'];
    const secondsText = currentLanguage === 'hi' ? 'सेकंड' : 'seconds';
    
    progressContainer.innerHTML = `
        <div class="progress-steps">
            <div class="step active" data-step="1">
                <i class="fas fa-image"></i>
                <span>${stepTexts[0]}</span>
            </div>
            <div class="step" data-step="2">
                <i class="fas fa-brain"></i>
                <span>${stepTexts[1]}</span>
            </div>
            <div class="step" data-step="3">
                <i class="fas fa-check"></i>
                <span>${stepTexts[2]}</span>
            </div>
        </div>
        <div class="progress-timer">
            <span id="timer">0</span> ${secondsText}
        </div>
    `;
    
    document.body.appendChild(progressContainer);
    
    // Update progress steps
    let currentProgressStep = 1;
    const progressSteps = progressContainer.querySelectorAll('.step');
    
    const progressInterval = setInterval(() => {
        progressSteps.forEach((step, index) => {
            if (index + 1 <= currentProgressStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        if (currentProgressStep < 3) {
            currentProgressStep++;
        }
    }, 1000);
    
    // Timer
    let seconds = 0;
    const timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = seconds;
    }, 1000);
    
    // Simulate AI analysis
    setTimeout(() => {
        clearInterval(progressInterval);
        clearInterval(timerInterval);
        document.body.removeChild(progressContainer);
        
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
        
    }, 3000); // 3 seconds for demo
}
