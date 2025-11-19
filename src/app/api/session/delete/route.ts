// apps/web/src/app/api/session/delete/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { setNoStore, getSetCookieArray, rewriteForHost } from "@/app/api/_bff/cookies";

// Functions base → ensure exactly one /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const REVOKE_URL = RAW_BASE ? `${API_BASE}/auth-session-revoke` : null;

// Centralize your cookie names if you have a constants module
const COOKIE_SESSION = "everleap_session";
const COOKIE_VERIFIED = "everleap_verified";

export async function POST(req: NextRequest) {
  const secure = req.nextUrl.protocol === "https:";
  const origin = req.nextUrl.origin;
  const host = req.headers.get("host") || req.nextUrl.host || "";

  // Start with a success payload; we’ll augment headers below
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.headers.set("Vary", "Cookie");

  // 1) Best-effort server-side revoke (if configured)
  if (REVOKE_URL) {
    try {
      const upstream = await fetch(REVOKE_URL, {
        method: "POST",
        headers: {
          cookie: req.headers.get("cookie") || "",
          origin,
          referer: origin,
          "x-forwarded-host": host,
          "x-forwarded-proto": secure ? "https" : "http",
          "cache-control": "no-cache",
        },
        redirect: "manual",
        cache: "no-store",
      });

      // Propagate any backend cookie clears
      const rawSetCookies = getSetCookieArray(upstream.headers);
      const rewritten = rewriteForHost(rawSetCookies, secure);
      for (const c of rewritten) res.headers.append("set-cookie", c);
    } catch {
      // Ignore backend errors; still clear client cookies below
    }
  }

  // 2) Client-side cookie clears (host-scoped; Path=/; SameSite=Lax; Secure only on HTTPS)
  const common = { path: "/", sameSite: "lax" as const, secure, expires: new Date(0), maxAge: 0 };
  res.cookies.set(COOKIE_SESSION, "", { ...common, httpOnly: true });
  res.cookies.set(COOKIE_VERIFIED, "", { ...common, httpOnly: false });

  return setNoStore(res);
}
