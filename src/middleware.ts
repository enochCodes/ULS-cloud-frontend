import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host");

    // Get the subdomain from the hostname
    // e.g. "foo.ulsplatform.com" -> "foo"
    // e.g. "localhost:3000" -> null or handled differently

    // Basic Logic: Split by dot. 
    // Identify if it's localhost or the main domain.
    // Update this logic based on your actual production domain.
    const isLocalhost = hostname?.includes("localhost");
    const domainParts = hostname?.split(".") || [];

    let currentOrg = "_root";
    let currentApp = "marketing";

    if (hostname) {
        if (isLocalhost) {
            // Localhost: app.org.localhost:3000 or org.localhost:3000
            if (domainParts.length === 3 && domainParts[0] !== 'localhost') {
                currentApp = domainParts[0];
                currentOrg = domainParts[1];
            } else if (domainParts.length === 2 && domainParts[0] !== 'localhost') {
                currentApp = "dashboard";
                currentOrg = domainParts[0];
            }
        } else {
            // Production: app.org.ulscloud.com or org.ulscloud.com
            if (domainParts.length === 4) {
                currentApp = domainParts[0];
                currentOrg = domainParts[1];
            } else if (domainParts.length === 3) {
                currentApp = "dashboard";
                currentOrg = domainParts[0];
            }
        }
    }

    // Special case for routing on the root domain (marketing site)
    if (currentOrg === "_root" || currentOrg === "www") {
        currentOrg = "_root";
        // On root, if path is / we use the root domain page (marketing)
        // Otherwise we follow the path to auth, marketplace etc.
    }

    // Rewrite the path
    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // Normalize path for rewrites
    // If the path already has the segment, we need to handle it.
    // In our case, we just want to prefix everything with /[org]/[app]
    // However, if we are on root, we don't have a "currentApp" prefix anymore, 
    // it's just /[org]/[path]

    let rewritePath;
    if (currentOrg === "_root") {
        rewritePath = `/_root${path}`;
    } else if (currentApp === "dashboard") {
        // If we are on the main domain (no app subdomain), we route to the requested path.
        // Only valid paths are /dashboard, /marketplace, /settings, etc.
        // If path is root "/", we default to dashboard.
        if (path === "/") {
            rewritePath = `/${currentOrg}/dashboard`;
        } else {
            rewritePath = `/${currentOrg}${path}`;
        }
    } else {
        // For subdomains, mapping defaults to dashboard if no app specified
        rewritePath = `/${currentOrg}/${currentApp}${path.replace(`/${currentApp}`, '')}`;
    }

    return NextResponse.rewrite(
        new URL(rewritePath, req.url)
    );
}
