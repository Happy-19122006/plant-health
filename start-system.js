#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Plant Health AI System...\n');

// Check if backend directory exists
const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
    console.error('❌ Backend directory not found!');
    process.exit(1);
}

// Check if .env file exists in backend
const envPath = path.join(backendPath, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found. Creating from template...');
    const envExample = path.join(backendPath, 'env.example');
    if (fs.existsSync(envExample)) {
        fs.copyFileSync(envExample, envPath);
        console.log('✅ .env file created from template');
        console.log('📝 Please edit backend/.env with your API keys before running again');
        process.exit(0);
    } else {
        console.error('❌ env.example file not found!');
        process.exit(1);
    }
}

// Function to start backend server
function startBackend() {
    console.log('🔧 Starting Backend Server...');
    
    const backendProcess = spawn('npm', ['run', 'dev'], {
        cwd: backendPath,
        stdio: 'inherit',
        shell: true
    });

    backendProcess.on('error', (error) => {
        console.error('❌ Failed to start backend:', error);
    });

    backendProcess.on('exit', (code) => {
        if (code !== 0) {
            console.error(`❌ Backend process exited with code ${code}`);
        }
    });

    return backendProcess;
}

// Function to start frontend server
function startFrontend() {
    console.log('🌐 Starting Frontend Server...');
    
    // Check if we have a simple HTTP server available
    const frontendProcess = spawn('python', ['-m', 'http.server', '3000'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    frontendProcess.on('error', (error) => {
        console.error('❌ Failed to start frontend server:', error);
        console.log('💡 Alternative: Open index.html directly in your browser');
    });

    frontendProcess.on('exit', (code) => {
        if (code !== 0) {
            console.error(`❌ Frontend process exited with code ${code}`);
        }
    });

    return frontendProcess;
}

// Function to setup database
async function setupDatabase() {
    console.log('🗄️  Setting up Database...');
    
    return new Promise((resolve, reject) => {
        const setupProcess = spawn('node', ['scripts/setup-database.js'], {
            cwd: backendPath,
            stdio: 'inherit',
            shell: true
        });

        setupProcess.on('error', (error) => {
            console.error('❌ Database setup failed:', error);
            reject(error);
        });

        setupProcess.on('exit', (code) => {
            if (code === 0) {
                console.log('✅ Database setup completed');
                resolve();
            } else {
                console.error(`❌ Database setup failed with code ${code}`);
                reject(new Error(`Database setup failed with code ${code}`));
            }
        });
    });
}

// Main startup function
async function startSystem() {
    try {
        // Setup database first
        await setupDatabase();
        
        // Start backend server
        const backendProcess = startBackend();
        
        // Wait a bit for backend to start
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Start frontend server
        const frontendProcess = startFrontend();
        
        console.log('\n🎉 Plant Health AI System Started Successfully!');
        console.log('📱 Frontend: http://localhost:3000');
        console.log('🔧 Backend API: http://localhost:8000');
        console.log('🏥 Health Check: http://localhost:8000/health');
        console.log('\n💡 Press Ctrl+C to stop all services\n');
        
        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down services...');
            backendProcess.kill();
            frontendProcess.kill();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Failed to start system:', error);
        process.exit(1);
    }
}

// Check if we're in the right directory
if (!fs.existsSync('index.html')) {
    console.error('❌ Please run this script from the project root directory');
    process.exit(1);
}

// Start the system
startSystem();
