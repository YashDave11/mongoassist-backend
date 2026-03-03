import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter using SMTP config from env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send OTP email with styled HTML template
 */
export const sendOTP = async (email, otp, fullName) => {
  const mailOptions = {
    from: `"MongoAssist" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '🔐 MongoAssist — Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto;
                  background: #0a0a0a; border: 1px solid #1a1a2e; border-radius: 12px; overflow: hidden;">
        
        <div style="background: linear-gradient(135deg, #00ed64 0%, #00b84d 100%);
                    padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; color: #0a0a0a; font-size: 22px; font-weight: 700;">
            🍃 MongoAssist
          </h1>
          <p style="margin: 4px 0 0; color: #0a0a0a; font-size: 13px; opacity: 0.8;">
            Docker Verification
          </p>
        </div>

        <div style="padding: 32px;">
          <p style="color: #e0e0e0; font-size: 14px; margin: 0 0 8px;">
            Hi ${fullName || 'there'},
          </p>
          <p style="color: #a0a0a0; font-size: 13px; margin: 0 0 24px;">
            Use this code to verify your Docker container:
          </p>

          <div style="background: #111; border: 1px solid #222; border-radius: 8px;
                      padding: 20px; text-align: center; margin: 0 0 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px;
                         color: #00ed64; font-family: 'Courier New', monospace;">
              ${otp}
            </span>
          </div>

          <p style="color: #666; font-size: 12px; margin: 0 0 4px;">
            ⏰ This code expires in <strong style="color: #a0a0a0;">10 minutes</strong>.
          </p>
          <p style="color: #666; font-size: 12px; margin: 0;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>

        <div style="border-top: 1px solid #1a1a2e; padding: 16px 32px; text-align: center;">
          <p style="color: #444; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} MongoAssist • AI Database Assistant
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Verify SMTP connection is working
 */
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return false;
  }
};
