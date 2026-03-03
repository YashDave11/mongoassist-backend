import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend client with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender address — use a verified domain in production,
// or 'onboarding@resend.dev' for testing
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Send OTP email with styled HTML template via Resend (HTTPS, port 443)
 */
export const sendOTP = async (email, otp, fullName) => {
  const { data, error } = await resend.emails.send({
    from: `MongoAssist <${FROM_EMAIL}>`,
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
  });

  if (error) {
    console.error('❌ Resend email error:', error);
    throw new Error(error.message || 'Failed to send email via Resend');
  }

  console.log('✅ Email sent via Resend, id:', data?.id);
  return data;
};
