// apps/web/src/app/api/session/webauthn/registration/options/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

// Normalize Functions base; ensure exactly one /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
if (!RAW_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for WebAuthn registration/options proxy.");
}
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/webauthn/registration/options`;

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
    } catch {
      // fall through
    }
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

async function forward(req: NextRequest, method: "POST" | "GET") {
  try {
    const host = req.headers.get("host") || "";
    const origin = `https://${host}`;
    const referer = `${origin}/login`;

    const init: RequestInit = {
      method,
      headers: {
        "content-type": method === "POST" ? (req.headers.get("content-type") || "application/json") : undefined,
        cookie: req.headers.get("cookie") || "",
        origin,
        referer,
        "user-agent": req.headers.get("user-agent") || "",
        "x-forwarded-host": host,
        "x-forwarded-proto": "https",
        "cache-control": "no-cache",
      } as Record<string, string>,
      redirect: "manual",
      cache: "no-store",
    };

    if (method === "POST") {
      (init as any).body = await req.text();
    }

    const upstream = await fetch(TARGET_URL, init);

    const ct = upstream.headers.get("content-type") || "application/json";
    const isJson = ct.includes("application/json");
    const payload = isJson ? await upstream.json().catch(() => null) : await upstream.text();

    const res = new NextResponse(
      typeof payload === "string" ? payload : JSON.stringify(payload ?? {}),
      { status: upstream.status, headers: { "content-type": ct } }
    );

    // Result depends on cookies; avoid intermediary caching mix-ups
    res.headers.set("Vary", "Cookie");

    // Rewrite and append each Set-Cookie individually
    const rawCookies = getSetCookieArray(upstream.headers);
    const rewritten = rewriteForHost(rawCookies);
    for (const c of rewritten) res.headers.append("set-cookie", c);

    // TEMP: mirror upstream cookies into visible *_debug for troubleshooting; remove later
    for (const c of rewritten) {
      const nv = parseNameValue(c);
      if (!nv) continue;
      res.headers.append(
        "set-cookie",
        `${nv.name}_debug=${encodeURIComponent(nv.value)}; Path=/; SameSite=Lax; Secure; Max-Age=600`
      );
    }

    return setNoStore(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy failed";
    return setNoStore(
      NextResponse.json({ ok: false, error: "BFF_ERROR", message }, { status: 502 })
    );
  }
}

// Some libs call GET; support both safely.
export async function GET(req: NextRequest) {
  return forward(req, "GET");
}
export async function POST(req: NextRequest) {
  return forward(req, "POST");
}
