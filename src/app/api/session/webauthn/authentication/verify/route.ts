export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

/** Normalize Functions base; ensure exactly one /api */
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const VERIFY_URL = `${API_BASE}/webauthn/authentication/verify`;
const HYDRATE_URL = `${API_BASE}/session-me`;

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

/** Safely split comma-joined Set-Cookie header into individual cookies */
function splitSetCookie(raw: string): string[] { return raw.split(/,(?=[^ ;]+=)/); }

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
    if (!/;\s*HttpOnly/i.test(c)) c += "; HttpOnly";
    return c;
  });
}

/** Heuristically extract a session token from a JSON payload (fallback) */
function extractToken(obj: unknown): string | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  const keys = ["token","sessionToken","accessToken","jwt","idToken","authToken","session","bearer"];
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.length > 10) return v;
  }
  for (const nk of ["data","result","session","auth"]) {
    const v = o[nk];
    if (v && typeof v === "object") {
      const t = extractToken(v);
      if (t) return t;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const host = req.headers.get("host") || "";
  const origin = `https://${host}`;
  const referer = `${origin}/login`;
  const cookieHeader = req.headers.get("cookie") || "";

  // 1) Call upstream verify
  const verifyRes = await fetch(VERIFY_URL, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      cookie: cookieHeader,
      origin,
      referer,
      "user-agent": req.headers.get("user-agent") || "",
      "x-forwarded-host": host,
      "x-forwarded-proto": "https",
      "cache-control": "no-cache",
    },
    body,
    redirect: "manual",
    cache: "no-store",
  });

  const verifyCT = verifyRes.headers.get("content-type") || "application/json";
  const verifyIsJson = verifyCT.includes("application/json");
  const verifyPayload = verifyIsJson ? await verifyRes.json().catch(() => null) : await verifyRes.text();

  // Prepare the response to the browser
  const out = new NextResponse(
    typeof verifyPayload === "string" ? verifyPayload : JSON.stringify(verifyPayload ?? {}),
    { status: verifyRes.status, headers: { "content-type": verifyCT } }
  );

  // Forward any cookies from verify itself
  const vCookies = rewriteForHost(getSetCookieArray(verifyRes.headers));
  for (const c of vCookies) out.headers.append("set-cookie", c);

  // 2) If verify OK, HYDRATE the session by calling session-me server-side
  if (verifyRes.ok) {
    const hydrateRes = await fetch(HYDRATE_URL, {
      method: "GET",
      headers: {
        cookie: cookieHeader,                 // forward incoming cookies
        origin,
        referer,
        "x-forwarded-host": host,
        "x-forwarded-proto": "https",
        "cache-control": "no-cache",
      },
      redirect: "manual",
      cache: "no-store",
    });

    // Forward any session cookies minted during hydrate
    const hCookies = rewriteForHost(getSetCookieArray(hydrateRes.headers));
    for (const c of hCookies) out.headers.append("set-cookie", c);

    // Fallback: if backend uses token-in-body (no Set-Cookie), set ours
    if (hCookies.length === 0) {
      const tryJson = await hydrateRes.json().catch(() => null) as unknown;
      const token = extractToken(tryJson) || extractToken(verifyPayload);
      if (token) {
        out.headers.append(
          "set-cookie",
          `everleap_session=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Secure; HttpOnly; Max-Age=2592000`
        );
      }
    }
  }

  return setNoStore(out);
}
