import nodemailer from "nodemailer";

// ── Create transporter lazily (function ke andar) ─────────────
// Module level pe banana dangerous hai — env variables load nahi hote
const createTransporter = () => {
  // Validate required env vars
  const required = ["SMTP_USER", "SMTP_PASS", "SMTP_FROM_EMAIL"];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing env variable: ${key}`);
    }
  }

  return nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Connection timeout
    connectionTimeout: 10000,
    greetingTimeout: 5000,
  });
};

// ── Send Verification Email ────────────────────────────────────
const sendVerificationEmail = async (to, name, token) => {
  const verifyURL = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;

  console.log("📧 Sending verification email to:", to);
  console.log("🔗 Verify URL:", verifyURL);

  const transporter = createTransporter();

  // Test SMTP connection first
  await transporter.verify();
  console.log("✅ SMTP connection verified");

  const info = await transporter.sendMail({
    from: `"☕ ChaiPoll" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject: "Verify your ChaiPoll account ☕",
    html: getEmailHTML(name, verifyURL),
  });

  console.log("✅ Email sent! Message ID:", info.messageId);
  return info;
};

// ── HTML Template ──────────────────────────────────────────────
const getEmailHTML = (name, verifyURL) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:36px 32px;text-align:center;">
      <div style="font-size:40px;margin-bottom:10px;">☕</div>
      <div style="font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;">ChaiPoll</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:5px;">Real-time polling platform</div>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;">
      <h2 style="color:#111827;font-size:20px;margin:0 0 14px;font-weight:700;">
        Hey ${name}! 👋
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
        Thanks for signing up for <strong style="color:#f97316;">ChaiPoll</strong>.
        Click the button below to verify your email address and activate your account.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyURL}"
           style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#ffffff;padding:15px 36px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;box-shadow:0 4px 16px rgba(249,115,22,0.35);">
          ✅ Verify Email Address
        </a>
      </div>

      <!-- Expiry note -->
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
        <p style="color:#c2410c;font-size:13px;margin:0;">
          ⏱ This link expires in <strong>24 hours</strong>.
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>

      <!-- Fallback link -->
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;">
        <p style="color:#9ca3af;font-size:11px;margin:0 0 6px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
          Or copy this link in your browser:
        </p>
        <p style="color:#f97316;font-size:11px;margin:0;word-break:break-all;font-family:monospace;">
          ${verifyURL}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        ☕ Made with ❤️ &nbsp;·&nbsp;
        <a href="https://chai-poll-nine.vercel.app" style="color:#f97316;text-decoration:none;">ChaiPoll</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

export { sendVerificationEmail };
