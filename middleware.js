import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });
    const isAdmin =
        token?.email?.toLowerCase() === "tpoppypie@gmail.com";

    if (req.nextUrl.pathname.startsWith("/admin") && (!token || !isAdmin)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};