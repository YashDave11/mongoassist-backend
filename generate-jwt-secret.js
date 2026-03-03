#!/usr/bin/env node

/**
 * JWT Secret Generator
 * Run this script to generate a secure JWT secret key
 * 
 * Usage: node generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔑 JWT Secret Key Generator\n');
console.log('━'.repeat(80));

// Generate a 64-byte random string
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ Your JWT Secret Key:\n');
console.log(secret);
console.log('\n━'.repeat(80));
console.log('\n📋 Copy this key and paste it in your backend/.env file:\n');
console.log(`JWT_SECRET=${secret}`);
console.log('\n⚠️  Keep this secret safe and never commit it to version control!\n');
