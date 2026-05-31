import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendVerificationEmail, sendOTPEmail } from "../utils/sendEmail.js";

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

    // Background mein bhejo — response block nahi hoga
    sendVerificationEmail(user.email, user.name, verificationToken)
      .then(() => console.log("✅ Verification email sent to:", user.email))
      .catch((err) => console.error("❌ Email failed:", err.message));

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

    if (!user)
      return res.redirect(`${process.env.CLIENT_URL}/login?verified=false`);

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

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(200).json({
        message: "If this email is registered, a verification link has been sent.",
      });

    if (user.isVerified)
      return res.status(400).json({ message: "Email is already verified. Please sign in." });

    const tokenToSend = user.emailVerificationToken || crypto.randomBytes(32).toString("hex");

    user.emailVerificationToken = tokenToSend;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hrs extend
    await user.save();

    // Background mein bhejo
    sendVerificationEmail(user.email, user.name, tokenToSend)
      .then(() => console.log("✅ Resend email sent to:", user.email))
      .catch((err) => console.error("❌ Resend email failed:", err.message));

    res.status(200).json({ message: "Verification email sent! Check your inbox." });
  } catch (error) {
    console.error("Resend verification error:", error.message);
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

// ── FORGOT PASSWORD — Send OTP ────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(200).json({
        message: "If this email is registered, an OTP has been sent.",
      });

    if (!user.isVerified)
      return res.status(400).json({
        message: "Please verify your email first before resetting password.",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.resetOtpVerified = false;
    await user.save();

    sendOTPEmail(user.email, user.name, otp)
      .then(() => console.log("✅ OTP sent to:", user.email))
      .catch((err) => console.error("❌ OTP email failed:", err.message));

    res.status(200).json({
      message: "OTP sent to your email address. Valid for 10 minutes.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ── VERIFY OTP ────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: "No account found with this email" });

    if (!user.resetOtp || !user.resetOtpExpires)
      return res.status(400).json({ message: "No OTP request found. Please request a new one." });

    if (new Date(user.resetOtpExpires) < new Date()) {
      user.resetOtp = null;
      user.resetOtpExpires = null;
      user.resetOtpVerified = false;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.resetOtp !== otp.toString())
      return res.status(400).json({ message: "Invalid OTP. Please try again." });

    user.resetOtpVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified! You can now reset your password." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ── RESET PASSWORD ────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: "No account found with this email" });

    if (!user.resetOtpVerified)
      return res.status(400).json({ message: "Please verify OTP first before resetting password." });

    if (!user.resetOtpExpires || new Date(user.resetOtpExpires) < new Date())
      return res.status(400).json({ message: "Session expired. Please start over." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.resetOtpVerified = false;
    await user.save();

    console.log("✅ Password reset for:", user.email);
    res.status(200).json({ message: "Password reset successfully! You can now sign in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  verifyOTP,
  resetPassword,
};