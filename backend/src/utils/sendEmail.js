import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars)
  },
});

// Send verification email
const sendVerificationEmail = async (email, name, token) => {
  const verifyURL = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;

  const mailOptions = {
    from: `"☕ ChaiPoll" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your ChaiPoll account",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#0d0d0d;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:#181818;border-radius:20px;border:1px solid rgba(249,115,22,0.15);overflow:hidden;">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:32px;text-align:center;">
            <div style="font-size:36px;margin-bottom:8px;">☕</div>
            <div style="font-size:24px;font-weight:800;color:#fff;letter-spacing:-0.5px;">ChaiPoll</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">Real-time polling platform</div>
          </div>

          <!-- Body -->
          <div style="padding:32px;">
            <h2 style="color:#f5f5f5;font-size:20px;margin:0 0 12px;">Hey ${name}! 👋</h2>
            <p style="color:#a3a3a3;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Thanks for signing up for ChaiPoll. Please verify your email address to activate your account and start creating polls.
            </p>
            
            <div style="text-align:center;margin:28px 0;">
              <a href="${verifyURL}" 
                 style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">
                ✅ Verify Email Address
              </a>
            </div>

            <p style="color:#737373;font-size:12px;line-height:1.6;margin:0 0 8px;">
              This link expires in <strong style="color:#f97316;">24 hours</strong>. If you didn't create a ChaiPoll account, you can safely ignore this email.
            </p>

            <div style="margin-top:20px;padding:12px 16px;background:#111;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
              <p style="color:#737373;font-size:11px;margin:0 0 4px;">Or copy this link:</p>
              <p style="color:#f97316;font-size:11px;margin:0;word-break:break-all;font-family:monospace;">${verifyURL}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="color:#525252;font-size:11px;margin:0;">☕ Made with ❤️ · ChaiPoll</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendVerificationEmail };
