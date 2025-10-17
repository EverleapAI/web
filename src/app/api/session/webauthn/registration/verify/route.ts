export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

// Normalize Functions base; ensure exactly one /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${BASE_WITH_API}/webauthn/registration/verify`;

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  return res;
}

/**
 * Normalize Set-Cookie to this web origin:
 * - remove Domain
 * - ensure Path=/, SameSite=Lax, Secure, HttpOnly
 * Supports multiple cookies in one header.
 */
function normalizeSetCookieForHost(raw: string | null): string | null {
  if (!raw) return null;
  const parts = raw.split(/,(?=[^ ;]+=)/);
  const fixed = parts.map((cookie) => {
    let c = cookie.replace(/; *Domain=[^;]+/gi, "");
    if (!/; *Path=/i.test(c)) c += "; Path=/";
    if (!/; *SameSite=/i.test(c)) c += "; SameSite=Lax";
    if (!/; *Secure/i.test(c)) c += "; Secure";
    if (!/; *HttpOnly/i.test(c)) c += "; HttpOnly";
    return c;
  });
  return fixed.join(", ");
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const body = await req.text();

    const upstream = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
        "cache-control": "no-cache",
      },
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const status = upstream.status;
    const location = upstream.headers.get("location") || null;
    const rawSetCookie = upstream.headers.get("set-cookie");
    const setCookie = normalizeSetCookieForHost(rawSetCookie);

    // 🔎 Instead of redirecting, *always* return JSON so we can inspect headers in DevTools
    const text = await upstream.text();
    let payload: unknown = text;
    try { payload = text ? JSON.parse(text) : null; } catch { /* keep text */ }

    const res = NextResponse.json(
      {
        ok: status >= 200 && status < 400,
        upstreamStatus: status,
        next: location,
        payload,
      },
      { status: 200 }
    );

    if (setCookie) res.headers.append("set-cookie", setCookie);
    res.headers.set("x-bff-target", TARGET_URL);
    res.headers.set("x-bff-upstream-status", String(status));
    res.headers.set("x-bff-had-cookie", rawSetCookie ? "1" : "0");

    return setNoStore(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy failed";
    const res = NextResponse.json({ ok: false, error: "BFF_ERROR", message }, { status: 502 });
    return setNoStore(res);
  }
}
