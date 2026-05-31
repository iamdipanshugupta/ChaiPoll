import express from "express";
import passport from "passport";
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
import generateToken from "../utils/generateToken.js";

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

//--- google OAuth---
router.get(
   "/google",
   passport.authenticate("google", {
      scope:["profile" , "email"],
      session:false
   })
);

router.get(
   "/google/callback",
   passport.authenticate("google",{
      session:false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
   }),
   (req,res) => {
      try {
         const user = req.user;
         const token = generateToken(user._id);


         const userData = encodeURIComponent(
            JSON.stringify({
               id:user._id,
               name:user.name,
               email:user.email,
               isVerified: user.isVerified,
            })
         );

         res.redirect(
            `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${userData}`
         );
      } catch (error) {
      console.log("Google callback error:" , error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);

      }
   }
);
export default router;