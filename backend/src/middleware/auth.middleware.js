import jwt from "jsonwebtoken"
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // check authorization header

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // get user from the token
            const user = await User.findById(decoded.id).select("-password");

            if(!user){
                return res.status(401).json({
                    message: "Not authorized, user not found"
                })
            }
            req.user = user;

            next();
        }
        else{
            return res.status(401).json({
                message: "Not authorized, no token"
            })
        }
    }

    catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed"
        })
    }
}

export default protect;