// apps/web/src/app/api/session/webauthn/authentication/verify/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

/** Normalize Functions base; ensure exactly one /api */
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/webauthn/authentication/verify`;

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  return res;
}

/** Safely split comma-joined Set-Cookie header into individual cookies */
function splitSetCookie(raw: string): string[] {
  return raw.split(/,(?=[^ ;]+=)/);
}

/** Read all Set-Cookie values from Headers (supports Undici getSetCookie) */
function getSetCookieArray(h: Headers): string[] {
  const maybe = h as unknown as { getSetCookie?: () => string[] };
  if (typeof maybe.getSetCookie === "function") {
    try {
      const arr = maybe.getSetCookie();
      if (Array.isArray(arr)) return arr;
    } catch {}
  }
  const single = h.get("set-cookie");
  return single ? splitSetCookie(single) : [];
}

/** Drop Domain and ensure sane defaults */
function rewriteForHost(cookies: string[]): string[] {
  return cookies.map((cookie) => {
    let c = cookie.replace(/\s*;\s*Domain=[^;]+/gi, "");
    if (!/;\s*Path=/i.test(c)) c += "; Path=/";
    if (!/;\s*SameSite=/i.test(c)) c += "; SameSite=Lax";
    if (!/;\s*Secure/i.test(c)) c += "; Secure";
    return c;
  });
}

/** Extract "name" and "value" from a Set-Cookie string's first pair */
function parseNameValue(sc: string): { name: string; value: string } | null {
  const m = sc.match(/^\s*([^=;,\s]+)=([^;]+)/);
  return m ? { name: m[1], value: m[2] } : null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Reconstruct site origin for CSRF-sensitive backends
  const host = req.headers.get("host") || "";
  const origin = `https://${host}`;
  const referer = `${origin}/login`;

  const upstream = await fetch(TARGET_URL, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      // Forward browser cookies so Functions can read challenge/state
      cookie: req.headers.get("cookie") || "",
      // These help some backends decide whether to set cookies
      origin,
      referer,
      "user-agent": req.headers.get("user-agent") || "",
      // Forwarded info for logging/upstream logic
      "x-forwarded-host": host,
      "x-forwarded-proto": "https",
      "cache-control": "no-cache",
    },
    body,
    redirect: "manual",
    cache: "no-store",
  });

  // Payload passthrough
  const contentType = upstream.headers.get("content-type") || "application/json";
  const payload = contentType.includes("application/json")
    ? await upstream.json()
    : await upstream.text();

  const res = new NextResponse(
    typeof payload === "string" ? payload : JSON.stringify(payload),
    { status: upstream.status, headers: { "content-type": contentType } }
  );

  // Get all upstream cookies, rewrite for this host, and append them
  const rawCookies = getSetCookieArray(upstream.headers);
  const rewritten = rewriteForHost(rawCookies);
  for (const c of rewritten) res.headers.append("set-cookie", c);

  // 🔎 TEMP DIAGNOSTIC: mirror each upstream cookie into a visible *_debug cookie
  for (const c of rewritten) {
    const nv = parseNameValue(c);
    if (!nv) continue;
    res.headers.append(
      "set-cookie",
      `${nv.name}_debug=${encodeURIComponent(nv.value)}; Path=/; SameSite=Lax; Secure; Max-Age=600`
    );
  }

  return setNoStore(res);
}
