import nodemailer from "nodemailer";

export async function sendMail(email, verificationToken) {
    try {

        // Create a test account or replace with real credentials.
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            }
        });

        // email content and structure
        // const mailOptions = {
        //     from: 'hrittik@gmail.com',
        //     to: email,
        //     subject: 'Verify your email',
        //     html:
        // }


        //send the email
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;


    } catch (error) {
        console.error('Error sending emails:', error?.message);
        throw new Error(error?.message)
    }
}

