import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Public routes (all except /admin/*)
    if (!pathname.startsWith("/admin/")) {
        // Redirect authenticated users from /signin to /dashboard
        if (token && pathname === "/signin") {
            const url = req.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Protect /admin/* routes and redirect to /signin if not authenticated
    if (pathname.startsWith("/admin/") && !token) {
        const url = req.nextUrl.clone();
        url.pathname = "/signin";
        return NextResponse.redirect(url);
    }

    // Allow access to /admin/* routes if authenticated
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};