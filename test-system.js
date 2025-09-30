#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Plant Health AI System...\n');

// Test configuration
const config = {
    frontend: {
        host: 'localhost',
        port: 3000,
        path: '/'
    },
    backend: {
        host: 'localhost',
        port: 8000,
        path: '/health'
    }
};

// Test functions
function testBackendHealth() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: config.backend.host,
            port: config.backend.port,
            path: config.backend.path,
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.success) {
                        console.log('✅ Backend Health Check: PASSED');
                        console.log(`   Status: ${response.data.status}`);
                        console.log(`   Environment: ${response.data.environment}`);
                        resolve(true);
                    } else {
                        console.log('❌ Backend Health Check: FAILED');
                        console.log(`   Error: ${response.error?.message || 'Unknown error'}`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log('❌ Backend Health Check: FAILED');
                    console.log(`   Parse Error: ${error.message}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Backend Health Check: FAILED');
            console.log(`   Connection Error: ${error.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log('❌ Backend Health Check: FAILED');
            console.log('   Timeout Error: Request timed out');
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

function testBackendAPI() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            query_text: 'मेरे टमाटर में क्या रोग है?',
            query_language: 'hi',
            include_voice: false
        });

        const options = {
            hostname: config.backend.host,
            port: config.backend.port,
            path: '/api/v1/farmer/query',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 10000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.success) {
                        console.log('✅ Backend API Test: PASSED');
                        console.log(`   Response: ${response.data.response.substring(0, 100)}...`);
                        console.log(`   Language: ${response.data.language}`);
                        console.log(`   Confidence: ${response.data.confidence_score}`);
                        resolve(true);
                    } else {
                        console.log('❌ Backend API Test: FAILED');
                        console.log(`   Error: ${response.error?.message || 'Unknown error'}`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log('❌ Backend API Test: FAILED');
                    console.log(`   Parse Error: ${error.message}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Backend API Test: FAILED');
            console.log(`   Connection Error: ${error.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log('❌ Backend API Test: FAILED');
            console.log('   Timeout Error: Request timed out');
            req.destroy();
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

function testFrontend() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: config.frontend.host,
            port: config.frontend.port,
            path: config.frontend.path,
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200 && data.includes('Plant Health AI')) {
                    console.log('✅ Frontend Test: PASSED');
                    console.log(`   Status Code: ${res.statusCode}`);
                    console.log(`   Content Length: ${data.length} bytes`);
                    resolve(true);
                } else {
                    console.log('❌ Frontend Test: FAILED');
                    console.log(`   Status Code: ${res.statusCode}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Frontend Test: FAILED');
            console.log(`   Connection Error: ${error.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log('❌ Frontend Test: FAILED');
            console.log('   Timeout Error: Request timed out');
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

function testFileStructure() {
    console.log('📁 Testing File Structure...');
    
    const requiredFiles = [
        'index.html',
        'script.js',
        'styles.css',
        'backend/package.json',
        'backend/src/server.js',
        'backend/.env',
        'package.json'
    ];

    let allFilesExist = true;

    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}: EXISTS`);
        } else {
            console.log(`❌ ${file}: MISSING`);
            allFilesExist = false;
        }
    });

    return allFilesExist;
}

function testEnvironmentVariables() {
    console.log('🔧 Testing Environment Variables...');
    
    const envPath = path.join(__dirname, 'backend', '.env');
    
    if (!fs.existsSync(envPath)) {
        console.log('❌ .env file: MISSING');
        return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
        'DATABASE_URL',
        'OPENAI_API_KEY',
        'JWT_SECRET'
    ];

    let allVarsExist = true;

    requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
            console.log(`✅ ${varName}: CONFIGURED`);
        } else {
            console.log(`❌ ${varName}: MISSING`);
            allVarsExist = false;
        }
    });

    return allVarsExist;
}

// Main test function
async function runTests() {
    console.log('🚀 Starting System Tests...\n');

    let passedTests = 0;
    let totalTests = 0;

    // Test 1: File Structure
    totalTests++;
    if (testFileStructure()) {
        passedTests++;
    }
    console.log('');

    // Test 2: Environment Variables
    totalTests++;
    if (testEnvironmentVariables()) {
        passedTests++;
    }
    console.log('');

    // Test 3: Backend Health
    totalTests++;
    if (await testBackendHealth()) {
        passedTests++;
    }
    console.log('');

    // Test 4: Backend API
    totalTests++;
    if (await testBackendAPI()) {
        passedTests++;
    }
    console.log('');

    // Test 5: Frontend
    totalTests++;
    if (await testFrontend()) {
        passedTests++;
    }
    console.log('');

    // Results
    console.log('📊 Test Results:');
    console.log(`   Passed: ${passedTests}/${totalTests}`);
    console.log(`   Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! System is ready to use.');
        console.log('\n🌐 Access your system:');
        console.log('   Frontend: http://localhost:3000');
        console.log('   Backend: http://localhost:8000');
        console.log('   Health Check: http://localhost:8000/health');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the issues above.');
        console.log('\n💡 Troubleshooting tips:');
        console.log('   1. Make sure backend is running: cd backend && npm run dev');
        console.log('   2. Make sure frontend is running: python -m http.server 3000');
        console.log('   3. Check environment variables in backend/.env');
        console.log('   4. Check database connection');
    }

    return passedTests === totalTests;
}

// Run tests if called directly
if (require.main === module) {
    runTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = { runTests };
