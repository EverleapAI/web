// apps/web/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routing + lightweight auth gate.
 *
 * Redirects:
 *   - "/" and "/welcome" → "/login" (no-store)
 *
 * Protects:
 *   - /dashboard, /profile, /questions → requires presence of session/verified cookie.
 *     (Authoritative verification still happens on the API; this just blocks obvious unauth’d hits.)
 */

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/questions"] as const;

const COOKIE_VERIFIED = "everleap_verified";
const COOKIE_SESSION = "everleap_session";

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ⛳ TEMP: bypass auth for /dashboard to isolate redirect source
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.next();
  }

  // --- 1) Normalize entry: "/" and "/welcome" → "/login" ---
  if (pathname === "/" || pathname === "/welcome") {
    const url = req.nextUrl.clone();
    const nextParam = req.nextUrl.searchParams.get("next"); // preserve ?next if provided
    url.pathname = "/login";
    url.search = "";
    if (nextParam) url.searchParams.set("next", nextParam);

    const res = NextResponse.redirect(url, 308);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // --- 2) Gate protected routes (best-effort) ---
  if (isProtectedPath(pathname)) {
    const hasVerifiedFlag = req.cookies.get(COOKIE_VERIFIED)?.value === "1";
    const hasSession = Boolean(req.cookies.get(COOKIE_SESSION)?.value);

    if (hasVerifiedFlag || hasSession) {
      return NextResponse.next();
    }

    // No client hint → send to /login with ?next=<intended>
    const url = req.nextUrl.clone();
    const intended = `${pathname}${req.nextUrl.search || ""}`;
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", intended);

    const res = NextResponse.redirect(url, 307);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Default pass-through
  return NextResponse.next();
}

export const config = {
  // Run on all app routes except static assets and Next API routes
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|images|video|assets|api).*)",
  ],
};
