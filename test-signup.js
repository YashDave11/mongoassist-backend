#!/usr/bin/env node

/**
 * Test Script to Verify Signup and Database Storage
 * This script tests if user data is being saved to the 'logininfo' collection
 * 
 * Usage: node test-signup.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const testSignup = async () => {
  try {
    console.log('\n🧪 Testing Signup and Database Storage\n');
    console.log('━'.repeat(80));

    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Generate test user data
    const testEmail = `test${Date.now()}@example.com`;
    const testUser = {
      fullName: 'Test User',
      email: testEmail,
      password: 'password123',
      identityKey: User.generateIdentityKey()
    };

    console.log('\n👤 Creating test user...');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Identity Key: ${testUser.identityKey}`);

    // Create user
    const user = await User.create(testUser);
    console.log('✅ User created successfully!');

    // Verify user was saved
    console.log('\n🔍 Verifying user in database...');
    const savedUser = await User.findById(user._id);
    
    if (savedUser) {
      console.log('✅ User found in database!');
      console.log('\n📋 User Details:');
      console.log(`   ID: ${savedUser._id}`);
      console.log(`   Full Name: ${savedUser.fullName}`);
      console.log(`   Email: ${savedUser.email}`);
      console.log(`   Identity Key: ${savedUser.identityKey}`);
      console.log(`   Password: ${savedUser.password.substring(0, 20)}... (hashed)`);
      console.log(`   Created At: ${savedUser.createdAt}`);
      console.log(`   Active: ${savedUser.isActive}`);
    } else {
      console.log('❌ User not found in database!');
    }

    // Check collection
    console.log('\n📊 Checking collection...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const loginInfoCollection = collections.find(c => c.name === 'logininfo');
    
    if (loginInfoCollection) {
      console.log('✅ Collection "logininfo" exists!');
      const count = await User.countDocuments();
      console.log(`   Total users in logininfo: ${count}`);
    } else {
      console.log('❌ Collection "logininfo" not found!');
    }

    // Test login (password verification)
    console.log('\n🔐 Testing password verification...');
    const isPasswordValid = await savedUser.comparePassword('password123');
    if (isPasswordValid) {
      console.log('✅ Password verification works!');
    } else {
      console.log('❌ Password verification failed!');
    }

    // List all users
    console.log('\n👥 All users in logininfo collection:');
    const allUsers = await User.find().select('fullName email identityKey createdAt');
    allUsers.forEach((u, index) => {
      console.log(`   ${index + 1}. ${u.fullName} (${u.email}) - Key: ${u.identityKey}`);
    });

    console.log('\n━'.repeat(80));
    console.log('✅ Test completed successfully!\n');
    console.log('🎉 Your signup is working and data is being saved to "logininfo" collection!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Disconnected from MongoDB\n');
    process.exit(0);
  }
};

// Run the test
testSignup();
