import { NextResponse } from "next/server";

/**
 * Clears Everleap session cookies (HttpOnly) for this site.
 */
export async function POST() {
  const isSecure = process.env.NODE_ENV !== "development";

  const resp = NextResponse.json({ ok: true });

  // Expire cookies immediately
  resp.cookies.set("everleap_verified", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
    maxAge: 0,
    expires: new Date(0),
  });

  resp.cookies.set("everleap_session", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
    maxAge: 0,
    expires: new Date(0),
  });

  return resp;
}
