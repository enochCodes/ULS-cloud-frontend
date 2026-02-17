import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
};

// Routes that require authentication
const protectedRoutes = [
    "/dashboard",
    "/crm",
    "/ticketing",
    "/marketplace",
    "/settings",
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/auth/login", "/auth/register"];

function isProtectedRoute(pathname: string): boolean {
    return protectedRoutes.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
    return authRoutes.some((route) => pathname.startsWith(route));
}

function parseJWT(token: string): { exp?: number; role?: string } | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1];
        // Handle base64url padding - add padding if needed
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
        const decoded = atob(padded);
        const parsed = JSON.parse(decoded);
        // Validate expected structure
        if (typeof parsed !== "object" || parsed === null) return null;
        return parsed;
    } catch {
        return null;
    }
}

function isTokenValid(token: string): boolean {
    const payload = parseJWT(token);
    if (!payload?.exp) return false;
    return Date.now() < payload.exp * 1000;
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Get token from cookie
    const token = request.cookies.get("token")?.value;
    const isAuthenticated = token ? isTokenValid(token) : false;
    
    // If user is on a protected route but not authenticated, redirect to login
    if (isProtectedRoute(pathname) && !isAuthenticated) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }
    
    // If user is on auth routes but already authenticated, redirect to dashboard
    if (isAuthRoute(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
}
