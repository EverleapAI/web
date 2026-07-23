// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "everleap_session";

const PUBLIC_AUTH_PATHS = new Set(["/regauth", "/regauth/verify"]);

function isMainPath(pathname: string): boolean {
  return pathname === "/main" || pathname.startsWith("/main/");
}

// /admin needs a session before it can even ask "are you an admin?". Middleware
// only enforces "signed in" (it can't see is_admin); the admin check itself is
// server-side in requireAdmin and echoed by the page via /api/admin/status.
function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.has(pathname);
}

function isSafeReturnTo(value: string | null): string {
  if (!value) return "/main";

  if (!value.startsWith("/")) return "/main";
  if (value.startsWith("//")) return "/main";
  if (value.startsWith("/regauth")) return "/main";
  if (value === "/") return "/main";

  return value;
}

function buildReturnTo(req: NextRequest): string {
  const { pathname, search } = req.nextUrl;
  return isSafeReturnTo(`${pathname}${search || ""}`);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if ((isMainPath(pathname) || isAdminPath(pathname)) && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/regauth";
    url.search = "";
    url.searchParams.set("returnTo", buildReturnTo(req));
    return NextResponse.redirect(url);
  }

  if (isAuthPath(pathname) && hasSession) {
    const rawReturnTo = req.nextUrl.searchParams.get("returnTo");
    const url = req.nextUrl.clone();
    url.pathname = isSafeReturnTo(rawReturnTo);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/main/:path*", "/admin/:path*", "/regauth", "/regauth/verify"],
};