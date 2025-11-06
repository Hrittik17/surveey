/* This code snippet is importing the `NextAuth` module from the "next-auth" package and the
`authOptions` object from a local file named "options". It then creates a handler function using
`NextAuth` with the `authOptions` object. Finally, it exports the handler function twice, once as
`GET` and once as `POST`. This means that the handler function can be used for both GET and POST
requests in the application. */


import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
