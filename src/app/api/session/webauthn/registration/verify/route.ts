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

/** Strip any `Domain=` attribute so the cookie lands on this host (the web app). */
function rewriteSetCookieForHost(raw: string | null): string | null {
  if (!raw) return null;
  // Split multiple cookies in a single header on true cookie boundaries,
  // not commas inside an Expires attribute.
  return raw
    .split(/,(?=[^ ;]+=)/)
    .map((c) => c.replace(/; *Domain=[^;]+/gi, "")) // drop Domain=...
    .join(", ");
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
      redirect: "manual", // mirror redirects so Next can append Set-Cookie
      cache: "no-store",
    });

    const status = upstream.status;
    const location = upstream.headers.get("location");
    const rawSetCookie = upstream.headers.get("set-cookie");
    const setCookie = rewriteSetCookieForHost(rawSetCookie);

    // Mirror redirect (e.g., 302 → /dashboard) and forward cookie(s)
    if (status >= 300 && status < 400 && location) {
      const res = NextResponse.redirect(location, { status });
      if (setCookie) res.headers.append("set-cookie", setCookie);
      return setNoStore(res);
    }

    // Otherwise, relay JSON (or text) with same status
    const text = await upstream.text();
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }

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
