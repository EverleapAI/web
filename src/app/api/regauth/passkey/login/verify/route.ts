export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "everleap_session";

const RAW_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7071/api"
).replace(/\/+$/, "");

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/auth/passkey/login/verify`;

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

function extractCookieValue(setCookieHeader: string, cookieName: string): string | null {
  const escapedName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = setCookieHeader.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]+)`));

  return match?.[1] ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const upstream = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });

    const text = await upstream.text().catch(() => "");

    const res = new NextResponse(text || "{}", {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/json",
      },
    });

    const setCookie = upstream.headers.get("set-cookie");
    const sessionToken = setCookie
      ? extractCookieValue(setCookie, SESSION_COOKIE)
      : null;

    if (sessionToken) {
      res.cookies.set(SESSION_COOKIE, decodeURIComponent(sessionToken), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return noStore(res);
  } catch {
    return noStore(
      NextResponse.json(
        { ok: false, error: "Could not verify passkey sign-in." },
        { status: 502 }
      )
    );
  }
}