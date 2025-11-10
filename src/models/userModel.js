/* This code snippet is defining a Mongoose schema for a user in a Node.js application. Here's a
breakdown of what each part is doing: */

import mongoose from "mongoose";
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
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:8,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true,
    },
    messages:[],
    verificationToken:{
        type:String,
    },
    verificationTokenExpiry:{
        type:Date,
    }
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User',userSchema)

export default User;