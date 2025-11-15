/**
 * The above function is a proxy function in JavaScript that checks for a token in the request and
 * redirects users based on their authentication status and the URL path they are trying to access.
 * @param request - The `request` parameter in the code snippet represents the incoming HTTP request
 * made to the server. It contains information such as the URL of the request, headers, method, and
 * other relevant details needed to process the request and generate a response. In this specific
 * context, the `request` object is used
 * @returns The `proxy` function is returning a redirection response using `NextResponse.redirect`
 * based on certain conditions. If a token exists and the user is trying to access
 * authentication-related pages, it redirects to the dashboard. If there is no token and the user is
 * trying to access protected routes, it redirects to the sign-in page.
 */

import { NextResponse } from 'next/server';
// import { default } from 'next-auth/proxy';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function proxy(request) {
    // get the token form the request
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // if token exists and the user is trying to access auth pages, redirect to dashboard
    if (token && (
        url.pathName.startsWith('/sign-in') ||
        url.pathName.startsWith('/signUp') ||
        url.pathName.startsWith('/verify') ||
        url.pathName.startsWith('/')
    )) {

        // redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // if no token and they hit protected route
    // if (!token && url.pathName.startsWith('/dashboard')){
    //     return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    // allow the request to proceed
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/signUp',
        '/verify/:path*',
        '/dashboard/:path*',
    ]
}