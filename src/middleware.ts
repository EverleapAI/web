// apps/web/src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "everleap_access";

// Paths that must remain reachable without auth
const PUBLIC_PATHS = [
  "/access",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next internals & public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/access") ||
    PUBLIC_PATHS.includes(pathname) ||
    /\.[^/]+$/.test(pathname) // static files
  ) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(ACCESS_COOKIE)?.value;

  if (!cookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/access";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"]
};
