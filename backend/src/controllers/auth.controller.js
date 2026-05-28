import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

// register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password

        const hashpassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create User

        const user = await User.create({
            name,
            email,
            password: hashpassword,
            isVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationTokenExpiry: verificationTokenExpiry
        })

        // Send verfivation email 
        try {
            await sendVerificationEmail(email, name, verificationToken);
        } catch (emailError) {
            console.error("Email send failed:", emailError.message)
        }

        res.status(201).json({
            message: "User registered successfully! Please check your email to verify your account.",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        })
    }

    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// ------------ Verify Email-------------------------

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpiry: { $gt: new Date() },
        });
        if (!user) {
            return res.redirect(
                `${process.env.CLIENT_URL}/login?verified=false&message=Invalid or expired verification link`
            );
        }

        user.isVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationTokenExpiry = null;
        await user.save()



    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.CLIENT_URL}/login?verified=false`)
    }
}

// --- Resend Verifivcation---

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found" })

        }
        if (user.isVerified) {
            return res.status(400).json({ message: "email already verified" })
        }

        const verificationToken = crypto.randomBytes(32).toString("hex")
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        await sendVerificationEmail(email, user.name, verificationToken);
        res.status(200).json({ message: "Verification email resent" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}


// login user

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Copmare password
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Plese verify your email before logging in",
                needsVerification: true,
                email: user.email,
            })
        }
        res.status(200).json({
            message: "Login successful",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified : user.isVerified
            }
        })

    }

    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export { registerUser, loginUser, verifyEmail , resendVerification };