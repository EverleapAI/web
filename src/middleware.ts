// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "regauth_session";

/**
 * Build a safe internal returnTo string from the request URL.
 * - always starts with "/"
 * - includes query string
 * - no external redirects possible because we derive it from req.nextUrl
 */
function buildReturnTo(req: NextRequest): string {
  const { pathname, search } = req.nextUrl;
  return `${pathname}${search || ""}`;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /main/*
  if (!pathname.startsWith("/main")) return NextResponse.next();

  const hasSession = req.cookies.get(SESSION_COOKIE)?.value;

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/regauth";
    url.searchParams.set("returnTo", buildReturnTo(req));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/main/:path*"],
};
