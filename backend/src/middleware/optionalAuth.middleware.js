import jwt from "jsonwebtoken";
import User from "../models/User.js";


const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password");

            if (user) {
                req.user = user; // user mila toh set karo
            }
        }
        // Token nahi hai — req.user undefined rahega — next() call hoga
        next();
    } catch (error) {
        // Token invalid/expired — ignore karo, bina user ke next karo
        next();
    }
};

export default optionalAuth;
