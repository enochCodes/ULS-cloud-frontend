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

// Route for workspace setup (requires auth but no org)
const setupWorkspaceRoute = "/auth/setup-workspace";

function isProtectedRoute(pathname: string): boolean {
    return protectedRoutes.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
    return authRoutes.some((route) => pathname.startsWith(route));
}

function isSetupWorkspaceRoute(pathname: string): boolean {
    return pathname.startsWith(setupWorkspaceRoute);
}

function parseJWT(token: string): { exp?: number; role?: string; org_id?: number } | null {
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
    const payload = token ? parseJWT(token) : null;
    const hasOrg = !!(payload?.org_id && payload.org_id > 0);
    
    // If user is on a protected route but not authenticated, redirect to login
    if (isProtectedRoute(pathname) && !isAuthenticated) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If authenticated user on a protected route has no org, redirect to setup workspace
    if (isProtectedRoute(pathname) && isAuthenticated && !hasOrg) {
        return NextResponse.redirect(new URL(setupWorkspaceRoute, request.url));
    }

    // If user is on setup-workspace but not authenticated, redirect to login
    if (isSetupWorkspaceRoute(pathname) && !isAuthenticated) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // If user is on setup-workspace but already has an org, redirect to dashboard
    if (isSetupWorkspaceRoute(pathname) && isAuthenticated && hasOrg) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // If user is on auth routes but already authenticated, redirect appropriately
    if (isAuthRoute(pathname) && isAuthenticated) {
        if (!hasOrg) {
            return NextResponse.redirect(new URL(setupWorkspaceRoute, request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
}
