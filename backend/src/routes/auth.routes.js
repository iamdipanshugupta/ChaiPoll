import express from "express";
import {
   loginUser,
   registerUser,
   resendVerification,
   verifyEmail
}
   from "../controllers/auth.controller.js"
import { registerValidation, loginValidation } from "../validations/auth.validation.js"
import validate from "../middleware/validate.middleware.js";
const router = express.Router();

// Register Route 

router.post("/register", registerValidation, validate, registerUser);

// Login Route
router.post("/login", loginValidation, validate,loginUser);

router.get("/verify-email/:token" , verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;