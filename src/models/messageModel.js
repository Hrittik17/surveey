/* This code snippet is defining a Mongoose schema for a message with a single field `content` of type
String. The `content` field is required, meaning it must be provided when creating a new message
document. The schema also includes timestamps to automatically track the creation and update times
of each message. */

import { Schema } from "mongoose";

const messageSchema = new Schema({
    content:{
        type:String,
        required:[true,'Message content is required'],
    }
},{timestamps:true})

const messageModel = mongoose.models.Messages || mongoose.model('Messages',messageSchema)

export default messageModel;