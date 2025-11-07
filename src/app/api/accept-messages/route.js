import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDatabase } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { NextResponse } from "next/server";


/**
 * This JavaScript function handles a POST request to update a user's status of accepting messages in a
 * database after authentication.
 * @param request - The code you provided is an example of a POST request handler in a serverless
 * function. It connects to a database, retrieves the user session, and updates the user's status of
 * accepting messages based on the request body.
 * @returns The code snippet is an asynchronous function that handles a POST request. It connects to a
 * database, retrieves the user session, and updates the user's status of accepting messages based on
 * the request body.
 */
export async function POST(request) {

    // connecting the database
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

        const userId = user?._id

        // destructuring the data from the body
        const reqBody = await request.json()
        const { acceptMessage } = reqBody


        // find the user is exists in the db, if yes then update the isAcceptingMessages.
        const updatedUser = await User.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessage }, { new: true })

        // if the user is not found
        if (!updatedUser) {
            return NextResponse.json({
                message: 'failed to update the status of accepting messages of user',
                success: false,
            }, { status: 404 })
        }

        //if the user is found
        return NextResponse.json({
            message: 'Successfully updated the status',
            success: true
        }, { status: 200 })


    } catch (error) {
        console.error("Something went wrong : ", error)
        return NextResponse.json({
            message: "Something went wrong.",
            success: false,
        }, { status: 500 })

    }
}




/**
 * This function retrieves user information and checks if the user is authenticated, exists in the
 * database, and returns their message acceptance status.
 * @param request - The code snippet you provided is an asynchronous function that handles a GET
 * request. It connects to a database, retrieves the user session using next auth, and then checks if
 * the user is authenticated. If the user is authenticated, it retrieves the user ID and checks if the
 * user exists in the database. If
 * @returns The code is returning a JSON response with different messages and status codes based on the
 * conditions:
 */

export async function GET(request) {
    // connecting the database
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

        const userId = user?._id

        // find the user exists or not
        const isUserExists = await User.findById(userId)

        //if the user is not exists
        if (!isUserExists) {
            return NextResponse.json({
                message:'User not found',
                success: false
            },{status:400})
        }

        // if the user is found then return the isAcceptingMessages Status
        return NextResponse.json({
            success:true,
            isAcceptingMessages:isUserExists?.isAcceptingMessages
        },{status:200})

    } catch (error) {
        console.error("Something went wrong : ", error)
        return NextResponse.json({
            message: "Something went wrong.",
            success: false,
        }, { status: 500 })
    }
}