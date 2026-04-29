// src/app/api/regauth/logout/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

const SESSION_COOKIE = "everleap_session";
const OLD_SESSION_COOKIE = "regauth_session";
const PENDING_COOKIE = "regauth_pending";

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

export async function POST() {
  const res = NextResponse.json({ ok: true });

  for (const name of [SESSION_COOKIE, OLD_SESSION_COOKIE, PENDING_COOKIE]) {
    res.cookies.set({
      name,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }

  return noStore(res);
}