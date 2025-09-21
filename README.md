# CropGuard AI - Smart Crop Disease Detection

A modern, interactive, and fully responsive AI-based Crop Disease Detection Web App built with HTML5, CSS3, and JavaScript.

## 🌱 Features

### Core Functionality
- **AI-Powered Disease Detection**: Upload crop images and get instant disease identification
- **Multiple Upload Methods**: Click-to-upload and drag-and-drop functionality
- **Real-time Results**: Get disease name, confidence score, and detailed remedies
- **Interactive Gallery**: Browse previously analyzed images with smooth animations

### Design & User Experience
- **Modern Agriculture Theme**: Clean design with soft green and brown tones
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with persistent preference storage
- **Smooth Animations**: Hover effects, loading spinners, background leaf animations, and slide-up effects

### Navigation & Sections
- **Responsive Navbar**: Home, Upload, Gallery, About, Contact sections
- **Smooth Scrolling**: Seamless navigation between sections
- **Mobile-Friendly Menu**: Hamburger menu for mobile devices

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start using CropGuard AI!

### File Structure
```
cropguard-ai/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🎯 How to Use

### Upload Images
1. Navigate to the **Upload** section
2. Either:
   - Click on the upload area to browse files
   - Drag and drop images directly onto the upload area
3. Wait for AI analysis (2-4 seconds simulation)
4. View detailed results with disease identification and remedies

### Browse Gallery
1. Go to the **Gallery** section
2. Use filter buttons to view:
   - All images
   - Healthy plants only
   - Diseased plants only
   - Specific crop types (Tomato, Potato)
3. Hover over images for smooth animations

### Theme Toggle
- Click the moon/sun icon in the navigation bar
- Switch between light and dark themes
- Your preference is automatically saved

## 🛠️ Technical Features

### Responsive Design
- **Desktop**: Full-width layout with multi-column grids
- **Tablet**: Optimized spacing and touch-friendly interactions
- **Mobile**: Single-column layout with collapsible navigation

### Animations & Effects
- **Leaf Background Animation**: Floating leaves that respond to mouse movement
- **Loading Spinner**: Professional loading animation during AI processing
- **Hover Effects**: Smooth transitions on buttons and cards
- **Slide-up Animations**: Staggered animations for gallery items
- **Smooth Scrolling**: Native smooth scrolling between sections

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎨 Design System

### Color Palette
- **Primary Green**: #4a7c59
- **Secondary Green**: #6b8e5a
- **Accent Green**: #8fbc8f
- **Brown Primary**: #8b4513
- **Brown Secondary**: #a0522d
- **Cream**: #f5f5dc

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Rounded corners with hover effects
- **Cards**: Subtle shadows with smooth transitions
- **Forms**: Clean input styling with focus states
- **Navigation**: Fixed header with backdrop blur

## 🔧 Customization

### Adding New Diseases
Edit the `generateMockPrediction()` function in `script.js` to add more disease types:

```javascript
const diseases = [
    {
        name: "Your Disease Name",
        confidence: 0.85,
        description: "Description of the disease",
        remedies: [
            "Remedy 1",
            "Remedy 2",
            "Remedy 3"
        ]
    }
    // Add more diseases here
];
```

### Modifying Colors
Update CSS custom properties in `styles.css`:

```css
:root {
    --primary-green: #your-color;
    --secondary-green: #your-color;
    /* Modify other colors as needed */
}
```

### Adding New Sections
1. Add HTML structure in `index.html`
2. Add corresponding CSS styles in `styles.css`
3. Update navigation links and JavaScript scroll handling

## 📱 Mobile Optimization

- Touch-friendly button sizes (minimum 44px)
- Optimized image loading and display
- Responsive typography scaling
- Mobile-first CSS approach
- Hamburger menu for navigation

## 🌟 Future Enhancements

- Integration with real AI/ML APIs
- User authentication and profiles
- Image history and favorites
- Export results functionality
- Multi-language support
- Advanced filtering options
- Crop recommendation system

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please contact:
- Email: contact@cropguardai.com
- Phone: +1 (555) 123-4567

---

**CropGuard AI** - Empowering farmers with AI-powered crop disease detection for healthier, more productive agriculture. 🌱
