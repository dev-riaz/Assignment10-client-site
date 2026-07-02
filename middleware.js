// middleware.js
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    const isProtectedRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/profile") ||
        /^\/browse\/[^/]+$/.test(pathname); 

    if (isProtectedRoute && !sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/browse/:path*"],
};