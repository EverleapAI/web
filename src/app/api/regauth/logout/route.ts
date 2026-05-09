// src/app/api/regauth/logout/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "everleap_session";
const OLD_SESSION_COOKIE = "regauth_session";
const PENDING_COOKIE = "regauth_pending";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

function clearCookies(res: NextResponse) {
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
}

async function revokeBackendSession(req: NextRequest) {
  try {
    await fetch(`${getApiBaseUrl()}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });
  } catch {
    // Still clear browser cookies even if backend revoke fails.
  }
}

export async function POST(req: NextRequest) {
  await revokeBackendSession(req);

  const res = NextResponse.json({ ok: true });
  clearCookies(res);
  return noStore(res);
}

export async function GET(req: NextRequest) {
  await revokeBackendSession(req);

  const redirectTo = req.nextUrl.searchParams.get("redirect") || "/";
  const safePath = redirectTo.startsWith("/") ? redirectTo : "/";

  const res = NextResponse.redirect(new URL(safePath, req.url));
  clearCookies(res);
  return noStore(res);
}