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

        // define the email options
        const mailOptions = {
            from: 'noreply@yourapp.com',
            to: email,
            subject: 'Verify your email',
            html: `
        <p>Welcome to our app! Please verify your email using the OTP below:</p>
        <h2>${verificationToken}</h2>
        <p>This OTP will expire in 1 hour.</p>
      `,
        };

        //send the email
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error) {
        console.error('Error sending emails:', error?.message);
        throw new Error(error?.message)
    }
}

