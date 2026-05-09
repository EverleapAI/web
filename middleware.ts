import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "everleap_session";

function buildReturnTo(req: NextRequest) {
  return `${req.nextUrl.pathname}${req.nextUrl.search}`;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isMainRoute = path === "/main" || path.startsWith("/main/");
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if (isMainRoute && !hasSession) {
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