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

/** Split multiple Set-Cookie values safely */
function splitSetCookie(raw: string): string[] {
  return raw.split(/,(?=[^ ;]+=)/);
}

/** Try to read all Set-Cookie values from Headers (supports Undici getSetCookie) */
function getSetCookieArray(h: Headers): string[] {
  // Undici (Node fetch) often provides headers.getSetCookie(), but it's not in lib types.
  const maybeHeaders = h as unknown as { getSetCookie?: () => string[] };
  if (typeof maybeHeaders.getSetCookie === "function") {
    try {
      const arr = maybeHeaders.getSetCookie();
      if (Array.isArray(arr)) return arr;
    } catch {
      // fall through to single-header path
    }
  }
  const single = h.get("set-cookie");
  return single ? splitSetCookie(single) : [];
}

/** Rewrite Domain away and ensure sensible defaults */
function rewriteSetCookieArray(raw: string[]): string[] {
  return raw.map((cookie) => {
    let c = cookie.replace(/\s*;\s*Domain=[^;]+/gi, "");
    if (!/;\s*Path=/i.test(c)) c += "; Path=/";
    if (!/;\s*SameSite=/i.test(c)) c += "; SameSite=Lax";
    if (!/;\s*Secure/i.test(c)) c += "; Secure";
    return c;
  });
}

/** Extract cookie value by name from a Set-Cookie string */
function extractCookieValue(sc: string, name: string): string | null {
  const m = sc.match(new RegExp(`^\\s*${name}=([^;]+)`));
  return m ? m[1] : null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  const upstream = await fetch(TARGET_URL, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      cookie: req.headers.get("cookie") || "",
      "x-forwarded-host": req.headers.get("host") || "",
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

  // ---- Handle Set-Cookie(s) robustly ----
  const rawCookies = getSetCookieArray(upstream.headers);
  const rewritten = rewriteSetCookieArray(rawCookies);

  // TEMP: if an everleap_session cookie is present, mirror it to a debug cookie (non-HttpOnly)
  let sessionValue: string | null = null;

  for (const c of rewritten) {
    res.headers.append("set-cookie", c);
    if (sessionValue === null) {
      const maybe = extractCookieValue(c, "everleap_session");
      if (maybe) sessionValue = maybe;
    }
  }

  if (sessionValue) {
    res.headers.append(
      "set-cookie",
      `everleap_session_debug=${sessionValue}; Path=/; SameSite=Lax; Secure; Max-Age=600`
    );
  }

  return setNoStore(res);
}
