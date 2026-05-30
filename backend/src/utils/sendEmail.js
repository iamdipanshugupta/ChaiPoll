import nodemailer from "nodemailer";

// ── Transporter ────────────────────────────────────────────────
const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Missing SMTP_USER or SMTP_PASS in .env");
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ── 1. Send Verification Email ─────────────────────────────────
const sendVerificationEmail = async (to, name, token) => {
  const verifyURL = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"☕ ChaiPoll" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject: "Verify your ChaiPoll account ☕",
    html: verificationTemplate(name, verifyURL),
  });

  console.log("✅ Verification email sent to:", to);
};

// ── 2. Send OTP Email ──────────────────────────────────────────
const sendOTPEmail = async (to, name, otp) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"☕ ChaiPoll" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject: `${otp} is your ChaiPoll password reset OTP`,
    html: otpTemplate(name, otp),
  });

  console.log("✅ OTP email sent to:", to, "| OTP:", otp);
};

// ── Email Templates ────────────────────────────────────────────

const verificationTemplate = (name, verifyURL) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:36px 32px;text-align:center;">
      <div style="font-size:40px;margin-bottom:10px;">☕</div>
      <div style="font-size:26px;font-weight:800;color:#fff;">ChaiPoll</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:5px;">Real-time polling platform</div>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#111827;font-size:20px;margin:0 0 14px;">Hey ${name}! 👋</h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
        Thanks for signing up. Click below to verify your email and activate your account.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyURL}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;padding:15px 36px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          ✅ Verify Email Address
        </a>
      </div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
        <p style="color:#c2410c;font-size:13px;margin:0;">⏱ This link expires in <strong>24 hours</strong>.</p>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;">
        <p style="color:#9ca3af;font-size:11px;margin:0 0 4px;font-weight:600;text-transform:uppercase;">Or copy this link:</p>
        <p style="color:#f97316;font-size:11px;margin:0;word-break:break-all;font-family:monospace;">${verifyURL}</p>
      </div>
    </div>
    <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">☕ Made with ❤️ · ChaiPoll</p>
    </div>
  </div>
</body>
</html>`;

const otpTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:36px 32px;text-align:center;">
      <div style="font-size:40px;margin-bottom:10px;">🔐</div>
      <div style="font-size:26px;font-weight:800;color:#fff;">Password Reset</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:5px;">ChaiPoll · Real-time polling</div>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;">
      <h2 style="color:#111827;font-size:20px;margin:0 0 14px;">Hey ${name}! 👋</h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
        We received a request to reset your ChaiPoll password. Use the OTP below to proceed.
      </p>

      <!-- OTP Box -->
      <div style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fed7aa;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
        <p style="color:#9a3412;font-size:13px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">
          Your OTP Code
        </p>
        <div style="font-size:48px;font-weight:900;color:#ea580c;letter-spacing:12px;font-family:'Courier New',monospace;">
          ${otp}
        </div>
        <p style="color:#c2410c;font-size:13px;margin:14px 0 0;">
          ⏱ Expires in <strong>10 minutes</strong>
        </p>
      </div>

      <!-- Warning -->
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
        <p style="color:#dc2626;font-size:13px;margin:0;">
          🚨 <strong>Never share this OTP</strong> with anyone. ChaiPoll will never ask for your OTP.
          If you didn't request this, please ignore this email — your password won't change.
        </p>
      </div>

      <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0;">
        This OTP is valid for one-time use only and will expire in 10 minutes.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">☕ Made with ❤️ · ChaiPoll</p>
    </div>
  </div>
</body>
</html>`;

export { sendVerificationEmail, sendOTPEmail };
