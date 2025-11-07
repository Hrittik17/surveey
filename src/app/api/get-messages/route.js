import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDatabase } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function GET(request){
    
    // connect the database
    await connectDatabase()

    try {
        // get the sessions from the next auth
        const session = await getServerSession(authOptions)
        const user = session?.user

        if (!session || !session.user) {
            return NextResponse.json({
                message: "User not authenticated",
                success: false,
            }, { status: 401 })
        }

        // because we will use aggreration function where we strictly use objectId
        const userId = new mongoose.Types.ObjectId(user._id)

        const userMessages = await User.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}

        ])

        if(!userMessages || userMessages.length == 0){
            return NextResponse.json({
                success:false,
                messages: 'Messages not found'
            },{status:401})
        }

        return NextResponse.json({
            success:true,
            messages:userMessages[0].messages
        },{status:200})
        
    } catch (error) {

        console.error("Something went wrong : ", error)
        return NextResponse.json({
            message: "Something went wrong.",
            success: false,
        }, { status: 500 })
        
    }
}