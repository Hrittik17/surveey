/**
 * The function handles a POST request to verify a user's token sent via email and updates the user's
 * verification status accordingly.
 * @param request - The `request` parameter in the code snippet represents the incoming HTTP request
 * that triggers the POST request handler. It contains information such as the request body, headers,
 * method, and other details sent by the client to the server. In this case, the handler is expecting a
 * JSON payload in the request body
 * @returns The code is a post request handler function that verifies a token sent to a user via email.
 * Depending on the conditions checked in the code, the function returns a JSON response with different
 * messages and status codes.
 */


import { connectDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

// a post request handler to verify the token sent to the user via email
export async function POST(request){

    // connect to the database
    await connectDatabase();
    
    try{

        // parse the request body
        const reqBody = await request.json();
        const {userName,verificationToken} = reqBody;

        // check if the user exists with the given username and verification token
        const isUserExists = await User.findOne({userName});

        // if user does not exist
        if(!isUserExists){
            return NextResponse.json({
                message:"Invalid username",
                success:false,
            },{
                status:400
            })
        }

        // check if the verification token is valid and not expired
        const isVerificationTokenValid = isUserExists.verificationToken === verificationToken;
        const isVerificationTokenExpired = new Date(isUserExists.verificationTokenExpiry) > new Date();

        // check if token is valid and not expired
        if(isVerificationTokenValid && isVerificationTokenExpired){
            // update the user as verified
            isUserExists.isVerified = true
            isUserExists.verificationToken = null;
            isUserExists.verificationTokenExpiry = null;
            await isUserExists.save();
            
            // respond with success
            return NextResponse.json({
                message:"User verified successfully",
                success:true,
            },{status:200})
        }else{

            // invalid or expired token
            return NextResponse.json({
                message:"Invalid or expired verification token, Please Sign up again",
                success:false,
            },{status:400})
        }


    }catch(error){

        // log the error for debugging purpose
        console.error("Error in verifying token: ",error);

        // respond with internal server error
        return NextResponse.json({
            message:"Internal Server Error",
            success:false,
        },{
            status:500
        })
    }
}