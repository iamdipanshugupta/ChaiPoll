import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const initPassPort = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;
                    const name = profile.displayName;

                    let user = await User.findOne({ email: email.toLowerCase() });

                    if (user) {
                        if (!user.isVerified) {
                            user.isVerified = true;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    user = await User.create({
                        name,
                        email: email.toLowerCase(),
                        password: Math.random().toString(36).slice(-16),
                        isVerified: true
                    })
                    return done(null, user);
                } catch (error) {
                    return done(error, null)
                }
            }
        )
    );

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user)
        } catch (err) {
            done(err, null)
        }
    });
};

export default initPassPort;