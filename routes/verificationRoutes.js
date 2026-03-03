import express from 'express';
import {
  verifyKey,
  sendOTPToUser,
  verifyOTP,
  checkVerificationStatus,
} from '../controllers/verificationController.js';

const router = express.Router();

// POST /api/verify/key          — Validate identity key
router.post('/key', verifyKey);

// POST /api/verify/send-otp     — Generate & send OTP to user's email
router.post('/send-otp', sendOTPToUser);

// POST /api/verify/verify-otp   — Validate OTP & mark as verified
router.post('/verify-otp', verifyOTP);

// POST /api/verify/status       — Check verification status
router.post('/status', checkVerificationStatus);

export default router;
