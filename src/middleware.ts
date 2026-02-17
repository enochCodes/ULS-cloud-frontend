import { NextResponse } from "next/server";

export const config = {
    matcher: [
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
};

export default function middleware() {
    return NextResponse.next();
}
