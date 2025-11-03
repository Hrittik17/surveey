import { Schema } from "mongoose";
import { Content } from "next/font/google";

const messageSchema = new Schema({
    Content:{
        type:String,
        required:[true,'Message content is required'],
    },
},{timestamps:true})

const messageModel = mongoose.models.Messages || mongoose.model('Messages',messageSchema)
export default messageModel;
