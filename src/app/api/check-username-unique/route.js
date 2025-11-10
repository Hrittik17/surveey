/**
 * The above function is a GET endpoint in a Next.js API route that checks the uniqueness of a username
 * provided in the query parameters against a database of verified users.
 * @param request - The code snippet you provided is a function that handles a GET request to check the
 * uniqueness of a username in a database. Let me explain the key points in the code:
 * @returns The code snippet is a Next.js API route function that handles a GET request to check the
 * uniqueness of a username.
 */


import { connectDatabase } from "@/lib/dbConnect";
import User from "../../../models/userModel";
import { NextResponse } from "next/server";
import { userNameValidation } from "@/schemas/signUpSchema";
import {z} from "zod";

// for validating query parameters
const userNameQuerySchema = z.object({
    userName: userNameValidation,
})


export async function GET(request){

    // check if the method ois GET
    if(request.method !== "GET"){
        return NextResponse.json({
            message:"Only GET method is allowed",
            success:false,
        },{
            status:405
        })
    }

    // connect with the database
    await connectDatabase();

    try{
        // destructure search params from the url of the request
        const {searchParams} = new URL(request.url)
        const queryParams = {
            userName:searchParams.get('userName')
        }

        // validate it with zod 
        const result = userNameQuerySchema.safeParse(queryParams)
        console.log(result) // for testing purpose

        if(!result.success){
            const userNameErrors = result.error.format().userName?._errors || []
            return NextResponse.json({
                message: "Invalid query parameters",
                success:false,
            },{
                status:400
            })
        }

        const {userName} = result?.data

        // check if the username already exists or not in the database
        const isUserNameValid = await User.findOne({userName,isVerifed:true})

        // if the username is already taken 
        if(isUserNameValid){
            return NextResponse.json({
                message: "Username is already taken",
                success:false,
            },{
                status:400
            })
        }else{

            // if username is unique
            return NextResponse.json({
                message: "Username is available",
                success:true,
            },{
                status:200
            })
        }

    }catch(error){
        // generic error
        console.error("Error checking username uniqueness: ", error);
        return NextResponse.json({ message: "Internal Server Error", success:false }, { status: 500 });
    }
}