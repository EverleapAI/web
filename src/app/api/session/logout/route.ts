// apps/web/src/app/api/session/logout/route.ts
import { NextResponse, NextRequest } from "next/server";
import { COOKIE, setNoStore } from "@/lib/security";
import { getSetCookieArray, rewriteForHost } from "@/app/api/_bff/cookies";

// Resolve Functions base; ensure exactly one /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const REVOKE_URL = RAW_BASE ? `${API_BASE}/auth-session-revoke` : null;

export async function POST(req: NextRequest) {
  // CSRF guard: same-origin only
  const origin = req.headers.get("origin") || "";
  const reqOrigin = req.nextUrl.origin;
  if (origin && origin !== reqOrigin) {
    return setNoStore(NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }));
  }

  // Rate limit: 10 logouts / minute per IP (best-effort)
  try {
    const { enforceRateLimit, makeRateKey } = await import("@/lib/rate-limit");
    const rl = enforceRateLimit(req, makeRateKey(req, "session", "logout"), 10, 60_000);
    if (rl) return setNoStore(rl);
  } catch {
    // continue even if rate-limit helpers are unavailable
  }

  const secure = req.nextUrl.protocol === "https:"; // only add Secure on HTTPS
  const host = req.headers.get("host") || req.nextUrl.host || "";

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.headers.set("Vary", "Cookie");

  // 1) Best-effort: revoke session on backend and propagate any cookie clears
  if (REVOKE_URL) {
    try {
      const upstream = await fetch(REVOKE_URL, {
        method: "POST",
        headers: {
          cookie: req.headers.get("cookie") || "",
          origin: reqOrigin,
          referer: reqOrigin,
          "x-forwarded-host": host,
          "x-forwarded-proto": secure ? "https" : "http",
          "cache-control": "no-cache",
        },
        redirect: "manual",
        cache: "no-store",
      });

      const rawSetCookies = getSetCookieArray(upstream.headers);
      const rewritten = rewriteForHost(rawSetCookies, secure);
      for (const c of rewritten) res.headers.append("set-cookie", c);
    } catch {
      // ignore backend errors; proceed to local clears
    }
  }

  // 2) Local cookie clears (host-scoped; Path=/; SameSite=Lax; Secure only on HTTPS)
  const common = { path: "/", sameSite: "lax" as const, secure, expires: new Date(0), maxAge: 0 };
  // SESSION should be HttpOnly; VERIFIED typically readable by client
  res.cookies.set(COOKIE.SESSION, "", { ...common, httpOnly: true });
  res.cookies.set(COOKIE.VERIFIED, "", { ...common, httpOnly: false });

  return setNoStore(res);
}
