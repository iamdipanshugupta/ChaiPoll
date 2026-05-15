import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


// register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password

        const hashpassword = await bcrypt.hash(password,10);

        // Create User

        const user = await User.create({
            name,
            email,
            password: hashpassword,
        })

        res.status(201).json({
            message: "User registered successfully",
            token:generateToken(user._id),
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        })
    } 
    
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


// login user

const loginUser = async(req, res)=>{
    try {
        const {email,password} = req.body;

        // check user
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }

        // Copmare password
        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.status(400).json({message:"Invalid email or password"});
        }
        res.status(200).json({
            message:"Login successful",
            token:generateToken(user._id),
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        })

    } 
    
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export {registerUser, loginUser};