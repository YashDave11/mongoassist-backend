#!/usr/bin/env node

/**
 * Setup MongoDB Collection Structure
 * This script creates the logininfo collection with proper schema
 * and adds a sample document to show the structure
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const setupCollection = async () => {
  try {
    console.log('\n🔧 Setting up MongoDB Collection Structure\n');
    console.log('━'.repeat(80));

    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Create indexes for the collection
    console.log('\n🔨 Creating indexes...');
    await User.createIndexes();
    console.log('✅ Indexes created');

    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const loginInfoExists = collections.find(c => c.name === 'logininfo');

    if (loginInfoExists) {
      console.log('✅ Collection "logininfo" already exists');
    } else {
      console.log('📝 Collection "logininfo" will be created on first insert');
    }

    // Display the schema structure
    console.log('\n📋 Collection Structure for "logininfo":\n');
    console.log('━'.repeat(80));
    console.log('\n  Field Name       | Type      | Description');
    console.log('  ' + '─'.repeat(76));
    console.log('  fullName         | String    | User\'s full name');
    console.log('  email            | String    | User\'s email (unique, lowercase)');
    console.log('  password         | String    | Encrypted password (bcrypt hashed)');
    console.log('  identityKey      | String    | Auto-generated 16-char key (unique)');
    console.log('  createdAt        | Date      | Account creation timestamp');
    console.log('  lastLogin        | Date      | Last login timestamp');
    console.log('  isActive         | Boolean   | Account status (default: true)');
    console.log('  updatedAt        | Date      | Last update timestamp');
    console.log('  __v              | Number    | Version key (Mongoose internal)');
    console.log('\n' + '━'.repeat(80));

    // Create a sample document to show structure
    console.log('\n📝 Creating sample document to establish collection structure...\n');
    
    const sampleEmail = `sample_${Date.now()}@example.com`;
    const sampleIdentityKey = User.generateIdentityKey();
    
    const sampleUser = await User.create({
      fullName: 'Sample User',
      email: sampleEmail,
      password: 'SamplePassword123',
      identityKey: sampleIdentityKey
    });

    console.log('✅ Sample document created!\n');
    console.log('📄 Sample Document Structure:');
    console.log('━'.repeat(80));
    console.log(JSON.stringify({
      _id: sampleUser._id,
      fullName: sampleUser.fullName,
      email: sampleUser.email,
      password: sampleUser.password.substring(0, 30) + '... (encrypted)',
      identityKey: sampleUser.identityKey,
      createdAt: sampleUser.createdAt,
      lastLogin: sampleUser.lastLogin,
      isActive: sampleUser.isActive,
      updatedAt: sampleUser.updatedAt,
      __v: sampleUser.__v
    }, null, 2));
    console.log('━'.repeat(80));

    // Show collection stats
    console.log('\n📊 Collection Statistics:');
    const count = await User.countDocuments();
    console.log(`   Total documents: ${count}`);

    console.log('\n✅ Collection setup complete!\n');
    console.log('🎯 Next Steps:');
    console.log('   1. Go to MongoDB Atlas → Browse Collections');
    console.log('   2. Find database: mongodb-assistant');
    console.log('   3. Find collection: logininfo');
    console.log('   4. You will see the sample document with all fields');
    console.log('   5. When users sign up, new documents will be added here\n');

    console.log('📝 Field Details:');
    console.log('   • fullName: Stores user\'s full name from signup');
    console.log('   • email: Unique email address (used for login)');
    console.log('   • password: Encrypted with bcrypt (NOT plain text)');
    console.log('   • identityKey: Auto-generated 16-character unique key');
    console.log('   • createdAt: Automatically set when user signs up');
    console.log('   • lastLogin: Updated each time user logs in');
    console.log('   • isActive: Account status (true by default)');
    console.log('   • updatedAt: Automatically updated on changes\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Disconnected from MongoDB\n');
    process.exit(0);
  }
};

// Run the setup
setupCollection();
