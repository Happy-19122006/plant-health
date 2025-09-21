// Global Variables
let uploadedImages = [];
let currentTheme = localStorage.getItem('theme') || 'light';

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
    
    // Initialize theme
    document.documentElement.setAttribute('data-theme', currentTheme);
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
            alert('Thank you for your message! We\'ll get back to you soon.');
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
