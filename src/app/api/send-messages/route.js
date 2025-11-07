import { connectDatabase } from "@/lib/dbConnect";
import User from "@/models/userModel";
import messageModel from "@/model/messageModel";
import { NextResponse } from "next/server";


export async function POST(request) {

    // connect the database
    await connectDatabase()

    try {

        const reqBody = await request.json()
        const {userName,content} = reqBody

        // check if the user exists or not
        const isUserExists = await User.findOne({userName})

        // if user doesnt exists
        if(!isUserExists){
            return NextResponse.json({
                message:"User doesn't exists or please verify your account",
                success:false,

            },{status:400})
        }

        // check if the user is accepting the messages or not
        if(!isUserExists.isAcceptingMessages){
            return NextResponse.json({
                message:"User is not accepting the messages",
                success:false   
            },{status:403})
        }

        // if user is accepting the messages then create the message and push it to the user's messages array.
        const newMessage = await messageModel.create({content,createdAt:Date.now()})
        isUserExists.messages.push(newMessage)


        return NextResponse.json({
            message:'Successfully created messages',
            success:true,
        },{status:200})


    } catch (error) {
        console.error("Something went wrong : ", error)
        return NextResponse.json({
            message: "Something went wrong.",
            success: false,
        }, { status: 500 })


    }

}