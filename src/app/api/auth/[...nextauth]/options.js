/* This code snippet is setting up authentication options using NextAuth in a Next.js application.
Here's a breakdown of what each part of the code is doing: */

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/userModel";
import { connectDatabase } from "../../../../lib/dbConnect";
// import bcrypt from "bcryptjs";
import bcrypt from 'bcryptjs'

// Define authentication options
export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        // username: { label: "Username", type: "text" },
        // password: { label: "Password", type: "password" },
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },

      },
      // Authorize function to validate user credentials
      async authorize(credentials, req) {
        // Connect to the database
        await connectDatabase();

        try {
          // Check if the user exists
          const user = await User.findOne({
            $or: [
              { userName: credentials.identifier },
              { email: credentials.identifier },
            ],
          });

          // If user not found
          if (!user) {
            throw new Error("No user found with the given credentials.");
          }

          // Check if the user is verified
          if (!user.isVerified) {
            throw new Error(
              "User is not verified. Please verify your email before logging in."
            );
          }

          // Verify password
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            throw new Error("Incorrect password. Please try again.");
          }

          return user;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  // Callbacks to handle JWT and session
  callbacks: {
    async jwt({ token, user }) {
      // check if the user is available or not
      if (user) {
        // add custom fields to the token
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.userName = user.userName;
        token.isAcceptingMessages = user.isAcceptingMessages;

      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.userName = token.userName;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;

      }
      return session
    },
  },
  // Custom pages for authentication
  pages: {
    signIn: '/sign-in',
  },
  // session strategy and secret
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET
};
