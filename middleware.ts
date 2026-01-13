import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * HTTP Basic Auth challenge (browser popup).
 */
function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Everleap Private Beta"',
    },
  });
}

export function middleware(req: NextRequest) {
  const user = process.env.SITE_BASIC_USER ?? "";
  const pass = process.env.SITE_BASIC_PASS ?? "";

  // Fail closed: if env vars aren't set, lock everything.
  if (!user || !pass) return unauthorized();

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const encoded = auth.slice("Basic ".length).trim();

  let decoded = "";
  try {
    decoded = atob(encoded);
  } catch {
    return unauthorized();
  }

  const sep = decoded.indexOf(":");
  if (sep < 0) return unauthorized();

  const u = decoded.slice(0, sep);
  const p = decoded.slice(sep + 1);

  if (u !== user || p !== pass) return unauthorized();

  return NextResponse.next();
}

/**
 * Protect everything except Next.js internal static assets.
 * (We still protect pages, API routes, and app routes.)
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
