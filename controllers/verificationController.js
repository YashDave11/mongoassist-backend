import User from '../models/User.js';
import { sendOTP } from '../services/emailService.js';

/**
 * Mask email: "yash@gmail.com" → "y***@gmail.com"
 */
const maskEmail = (email) => {
  const [local, domain] = email.split('@');
  return `${local[0]}***@${domain}`;
};

/**
 * Generate a 6-digit numeric OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ─────────────────────────────────────────────────────
// POST /api/verify/key
// Validate identity key, return masked email
// ─────────────────────────────────────────────────────
export const verifyKey = async (req, res) => {
  try {
    const { identityKey } = req.body;

    if (!identityKey) {
      return res.status(400).json({
        success: false,
        message: 'Identity key is required',
      });
    }

    const user = await User.findOne({ identityKey });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid identity key. Please check and try again.',
      });
    }

    res.status(200).json({
      success: true,
      maskedEmail: maskEmail(user.email),
      alreadyVerified: user.dockerVerified || false,
    });
  } catch (error) {
    console.error('Key verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during key verification',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────
// POST /api/verify/send-otp
// Generate OTP, store in DB, send via email
// ─────────────────────────────────────────────────────
export const sendOTPToUser = async (req, res) => {
  try {
    const { identityKey } = req.body;

    if (!identityKey) {
      return res.status(400).json({
        success: false,
        message: 'Identity key is required',
      });
    }

    const user = await User.findOne({ identityKey });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid identity key',
      });
    }

    // Generate OTP with 10-minute expiry
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP via email
    await sendOTP(user.email, otp, user.fullName);

    console.log(`📧 OTP sent to ${maskEmail(user.email)}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      maskedEmail: maskEmail(user.email),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Check SMTP configuration.',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────
// POST /api/verify/verify-otp
// Validate OTP, mark user as dockerVerified
// ─────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { identityKey, otp } = req.body;

    if (!identityKey || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Identity key and OTP are required',
      });
    }

    const user = await User.findOne({ identityKey });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid identity key',
      });
    }

    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check if OTP is expired
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      // Clear expired OTP
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
        expired: true,
      });
    }

    // Verify OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
      });
    }

    // OTP is valid — mark as verified
    user.dockerVerified = true;
    user.lastVerifiedAt = new Date();
    user.otp = undefined;          // Clear OTP after use
    user.otpExpiresAt = undefined;
    await user.save();

    console.log(`✅ Docker verified: ${maskEmail(user.email)}`);

    res.status(200).json({
      success: true,
      message: 'Verification successful! You can now use MongoAssist.',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────
// POST /api/verify/status
// Check if a key is already verified
// ─────────────────────────────────────────────────────
export const checkVerificationStatus = async (req, res) => {
  try {
    const { identityKey } = req.body;

    if (!identityKey) {
      return res.status(400).json({
        success: false,
        message: 'Identity key is required',
      });
    }

    const user = await User.findOne({ identityKey });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid identity key',
      });
    }

    res.status(200).json({
      success: true,
      dockerVerified: user.dockerVerified || false,
      lastVerifiedAt: user.lastVerifiedAt || null,
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
