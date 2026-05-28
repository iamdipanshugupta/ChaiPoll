import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:true,
            minlength:8
        },
        isVerified:{
            type:Boolean,
            default:false,
        },
        emailVerificationToken:{
            type:String,
            default:null
        },
        emailVerificationExpires:{
            type:Date,
            default:null,
        },
    },
    {
        timestamps:true
    }
)

const User = mongoose.model("User", UserSchema);
export default User;