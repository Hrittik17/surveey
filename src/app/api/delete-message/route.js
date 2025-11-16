import { connectDatabase } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
// import { success } from "zod";

// a handler for the delete the messages
export async function DELETE(request, { params }) {
    const messageId = params.messageId
    await connectDatabase()

    // get the sessions from nextAuth
    const session = await getServerSession(authOptions)
    const user = session?.user

    // check if the user is authenticated or not
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "User is not authenticated",
        }, {
            status: 401
        })
    }

    try {

        // find if the user exists or not, if it exists then delete the messageId from the message array
        const updatedResult = await User.updateOne({ _id: user._id },
            { $pull: { messages: { _id: messageId } } })

        // if the modified count is zero which means nothing changes or messages not found
        if (updatedResult.modifiedCount == 0) {
            return NextResponse.json({
                success: false,
                message: "Messages not found",
            }, {
                status: 404
            })
        }

        // return success
        return NextResponse.json({
            success:true,
            message:"Successfully deleted the messages.",
        },{
            status:200
        })

    } catch (error) {
        console.error("Something went wrong : ", error?.message)
        return NextResponse.json({
            success: false,
            message: "Something went wrong in the server"
        }, { status: 500 })
    }
}