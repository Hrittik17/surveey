import { Schema } from "mongoose";

const userSchema = new Schema({
    userName:{
        type:String,
        required:[true,'User name is required'],
        unique:true,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        patern:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:6,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true,
    },
    messages:{
        ref:'Message',
    },
    verificationToken:{
        type:String,
    },
    verificationTokenExpiry:{
        type:Date,
    }
},{timestamps:true})

const userModel = mongoose.models.User || mongoose.model('User',userSchema)
export default userModel;