/**
 * The function handles user signup requests by checking if the user already exists, generating
 * verification tokens, and saving user data to the database.
 * @param request - The `request` parameter in the code snippet represents the incoming request object
 * from the client side. It is used to extract data sent by the client, such as the user's `userName`,
 * `email`, and `password` during the signup process. The `request.json()` method is used to parse
 * @returns a JSON response with a message indicating the outcome of the signup process. If the signup
 * is successful, it returns `{ message: 'User signed up successfully', success: true }` with a status
 * code of 201. If there are errors during the signup process, it returns `{ message: 'Internal Server
 * Error', success: false }` with a status code of 500.
 */


import { connectDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


// a function to handle the signup request by the client side

export async function POST(request) {
    try {

        // check if the methos is POST
        if(request.method !== "POST"){
            return NextResponse.json({
                message:"Only POST method is allowed",
                success:false,
            },{
                status:405
            })
        }

        // connect to the database
        await connectDatabase()

        const reqBody = await request.json()
        const { userName, email, password } = reqBody

        // check if the user is already signed up or not
        const isUserAlreadyExistsAndVerified = await User.findOne({ userName: userName, isVerified: true })
        if (isUserAlreadyExistsAndVerified) {
            return NextResponse.json({ message: 'User already exists. Please login.' }, { status: 401 });
        }

        // generate a verification token
        const generatedVerificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit token


        // check if the email is already registered
        const isEmailAlreadyRegistered = await User.findOne({ email })
        if (isEmailAlreadyRegistered) {
            // 
            if (isEmailAlreadyRegistered.isVerified) {
                return NextResponse.json({
                    mesaage: 'User is already exists with this email.',
                    success: false
                }, {
                    status: 401
                })
            } else {
                // update the password and resend the verification token
                const hashedPassword = await bcrypt.hash(password, 10);
                isEmailAlreadyRegistered.password = hashedPassword;
                isEmailAlreadyRegistered.verificationToken = generatedVerificationToken
                isEmailAlreadyRegistered.verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
                await isEmailAlreadyRegistered.save();
            }
        } else {

            // hashed password before saving to the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // generate verification token and expiry date
            const expiryDate = Date.now()
            expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry


            // create a new user
            const newuser = await User.create({
                userName,
                email,
                password: hashedPassword,
                verificationToken: generatedVerificationToken,
                verificationTokenExpiry: expiryDate,

            })

            // send the verification token to the user via emails
            await sendMail(email, generatedVerificationToken);

        }

        // return success response
        return NextResponse.json(
            { message: 'User signed up successfully', success: true },
            { status: 201 });

    } catch (error) {
        console.error('Error in sign up route:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', success: false },
            { status: 500 });

    }
}