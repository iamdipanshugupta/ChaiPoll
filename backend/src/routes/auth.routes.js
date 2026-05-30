import express from "express";
import {
   forgotPassword,
   loginUser,
   registerUser,
   resendVerification,
   resetPassword,
   verifyEmail,
   verifyOTP
}
   from "../controllers/auth.controller.js"
import { registerValidation, loginValidation } from "../validations/auth.validation.js"
import validate from "../middleware/validate.middleware.js";
const router = express.Router();

// Register Route 

router.post("/register", registerValidation, validate, registerUser);

// Login Route
router.post("/login", loginValidation, validate, loginUser);


// Email verification

router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword)
export default router;