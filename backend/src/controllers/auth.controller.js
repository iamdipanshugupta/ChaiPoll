import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

// ── REGISTER ──────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashpassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashpassword,
      isVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Send email — don't block registration if email fails
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
      console.log("✅ Verification email sent to:", user.email);
    } catch (emailErr) {
      console.error("❌ Email send failed:", emailErr.message);
      // Still let user register — they can resend later
    }

    res.status(201).json({
      message: "Account created! Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ── VERIFY EMAIL ──────────────────────────────────────────────
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?verified=false`
      );
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (error) {
    console.error("Verify email error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/login?verified=false`);
  }
};

// ── RESEND VERIFICATION ───────────────────────────────────────
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Security: don't reveal if email exists
      return res.status(200).json({
        message: "If this email is registered, a verification link has been sent.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified. Please sign in." });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Send email
    await sendVerificationEmail(user.email, user.name, verificationToken);
    console.log("✅ Resend verification email sent to:", user.email);

    res.status(200).json({ message: "Verification email sent! Check your inbox." });
  } catch (error) {
    console.error("Resend verification error:", error.message);

    // Specific error messages
    if (error.message.includes("Missing env variable")) {
      return res.status(500).json({
        message: "Email service not configured. Contact support.",
        debug: error.message,
      });
    }

    if (error.message.includes("SMTP") || error.message.includes("connect")) {
      return res.status(500).json({
        message: "Email service temporarily unavailable. Please try again.",
        debug: error.message,
      });
    }

    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        needsVerification: true,
        email: user.email,
      });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export { registerUser, loginUser, verifyEmail, resendVerification };
