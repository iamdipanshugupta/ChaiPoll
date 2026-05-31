// ✅ Brevo (Sendinblue) HTTP API
// - Free 300 emails/day
// - Koi domain verify nahi chahiye
// - HTTP API use karta hai — Render pe SMTP block nahi hota
// - Node.js built-in fetch use karta hai — koi extra package nahi

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// ── Core send function ─────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) throw new Error("Missing BREVO_API_KEY in environment variables");

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_FROM_NAME || "ChaiPoll",
        email: process.env.BREVO_FROM_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  // Brevo 201 Created bhejta hai success pe
  if (!response.ok) {
    const data = await response.json();
    console.error("Brevo API error:", data);
    throw new Error(data?.message || "Failed to send email via Brevo");
  }

  console.log("✅ Email sent via Brevo | To:", to);
};

// ── 1. Verification Email ──────────────────────────────────────
const sendVerificationEmail = async (to, name, token) => {
  const verifyURL = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;

  await sendEmail({
    to,
    subject: "Verify your ChaiPoll account ☕",
    html: verificationTemplate(name, verifyURL),
  });
};

// ── 2. OTP Email ───────────────────────────────────────────────
const sendOTPEmail = async (to, name, otp) => {
  await sendEmail({
    to,
    subject: `${otp} is your ChaiPoll password reset OTP`,
    html: otpTemplate(name, otp),
  });
};

// ── HTML Templates ─────────────────────────────────────────────

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
        Thanks for signing up for <strong style="color:#f97316;">ChaiPoll</strong>.
        Click below to verify your email and activate your account.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyURL}"
           style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;padding:15px 36px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 4px 16px rgba(249,115,22,0.35);">
          ✅ Verify Email Address
        </a>
      </div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
        <p style="color:#c2410c;font-size:13px;margin:0;">
          ⏱ This link expires in <strong>24 hours</strong>.
          If you didn't create an account, ignore this email.
        </p>
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
    <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:36px 32px;text-align:center;">
      <div style="font-size:40px;margin-bottom:10px;">🔐</div>
      <div style="font-size:26px;font-weight:800;color:#fff;">Password Reset</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:5px;">ChaiPoll · Real-time polling</div>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#111827;font-size:20px;margin:0 0 14px;">Hey ${name}! 👋</h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
        We received a request to reset your ChaiPoll password. Use the OTP below.
      </p>
      <div style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fed7aa;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
        <p style="color:#9a3412;font-size:13px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Your OTP Code</p>
        <div style="font-size:48px;font-weight:900;color:#ea580c;letter-spacing:12px;font-family:'Courier New',monospace;">
          ${otp}
        </div>
        <p style="color:#c2410c;font-size:13px;margin:14px 0 0;">⏱ Expires in <strong>10 minutes</strong></p>
      </div>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 16px;">
        <p style="color:#dc2626;font-size:13px;margin:0;">
          🚨 <strong>Never share this OTP</strong> with anyone.
          If you didn't request this, ignore this email.
        </p>
      </div>
    </div>
    <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">☕ Made with ❤️ · ChaiPoll</p>
    </div>
  </div>
</body>
</html>`;

export { sendVerificationEmail, sendOTPEmail };