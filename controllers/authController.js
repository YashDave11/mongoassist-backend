import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    console.log('📝 Signup request received');
    console.log('📋 Request body:', { ...req.body, password: '***' });
    
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ User already exists');
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate unique identity key
    console.log('🔑 Generating identity key...');
    let identityKey;
    let isUnique = false;
    
    while (!isUnique) {
      identityKey = User.generateIdentityKey();
      const existingKey = await User.findOne({ identityKey });
      if (!existingKey) {
        isUnique = true;
      }
    }
    console.log('✅ Identity key generated:', identityKey);

    // Create user
    console.log('💾 Creating user in database...');
    const user = await User.create({
      fullName,
      email,
      password,
      identityKey
    });
    console.log('✅ User created successfully:', user._id);

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      console.log('🎉 Signup successful for:', email);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            identityKey: user.identityKey,
            createdAt: user.createdAt
          },
          token
        }
      });
    } else {
      console.log('❌ Failed to create user');
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          identityKey: user.identityKey,
          lastLogin: user.lastLogin
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          identityKey: user.identityKey,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
};
