#!/usr/bin/env node

/**
 * Environment Setup Helper
 * This script helps you set up your .env file
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 MongoDB Assistant - Environment Setup\n');
console.log('━'.repeat(80));
console.log('\nThis script will help you create your .env file.\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('✅ Generated JWT Secret Key automatically!\n');

rl.question('📋 Paste your MongoDB connection string here:\n', (mongoUri) => {
  if (!mongoUri || mongoUri.trim() === '') {
    console.log('\n❌ MongoDB URI is required!');
    console.log('\nGet it from: https://cloud.mongodb.com/');
    console.log('1. Click "Connect" on your cluster');
    console.log('2. Choose "Connect your application"');
    console.log('3. Copy the connection string\n');
    rl.close();
    return;
  }

  // Create .env content
  const envContent = `# MongoDB Connection String
MONGODB_URI=${mongoUri.trim()}

# JWT Secret Key (auto-generated)
JWT_SECRET=${jwtSecret}

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
`;

  // Write to .env file
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ .env file created successfully!\n');
  console.log('━'.repeat(80));
  console.log('\n📁 File location:', envPath);
  console.log('\n🔑 Your configuration:');
  console.log('   MongoDB URI: ✓ Set');
  console.log('   JWT Secret:  ✓ Generated');
  console.log('   Port:        5000');
  console.log('   Frontend:    http://localhost:5173');
  console.log('\n✅ You can now start the server with: npm run dev\n');
  
  rl.close();
});
