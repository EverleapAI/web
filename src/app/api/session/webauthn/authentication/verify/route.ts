export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

// Normalize Functions base; ensure exactly one /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${BASE_WITH_API}/webauthn/authentication/verify`;

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  return res;
}

/**
 * Normalize Set-Cookie to this web origin:
 * - remove any Domain attribute (bind to current host)
 * - ensure Path=/ (visible app-wide)
 * - ensure SameSite=Lax and Secure
 * - ensure HttpOnly (defense-in-depth; Functions likely already sets this)
 * Handles multiple cookies in one header.
 */
function normalizeSetCookieForHost(raw: string | null): string | null {
  if (!raw) return null;

  // Split on cookie boundaries (commas that start a new k=v)
  const parts = raw.split(/,(?=[^ ;]+=)/);

  const fixed = parts.map((cookie) => {
    let c = cookie;

    // strip Domain
    c = c.replace(/; *Domain=[^;]+/gi, "");

    // ensure Path=/
    if (!/; *Path=/i.test(c)) c += "; Path=/";

    // ensure SameSite=Lax
    if (!/; *SameSite=/i.test(c)) c += "; SameSite=Lax";

    // ensure Secure
    if (!/; *Secure/i.test(c)) c += "; Secure";

    // ensure HttpOnly
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
      redirect: "manual", // mirror redirects so we can attach Set-Cookie
      cache: "no-store",
    });

    const status = upstream.status;
    const location = upstream.headers.get("location");
    const rawSetCookie = upstream.headers.get("set-cookie");
    const setCookie = normalizeSetCookieForHost(rawSetCookie);

    // Mirror redirect (e.g. 302 → /dashboard) and forward cookie(s)
    if (status >= 300 && status < 400 && location) {
      const res = NextResponse.redirect(location, { status });
      if (setCookie) res.headers.append("set-cookie", setCookie);
      return setNoStore(res);
    }

    // Otherwise relay JSON (or text) with same status
    const text = await upstream.text();
    let payload: unknown = text;
    try { payload = text ? JSON.parse(text) : null; } catch { /* keep as text */ }

    const res = NextResponse.json(payload, { status });
    if (setCookie) res.headers.append("set-cookie", setCookie);
    return setNoStore(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy failed";
    const res = NextResponse.json(
      { ok: false, error: "BFF_ERROR", message },
      { status: 502 }
    );
    return setNoStore(res);
  }
}
