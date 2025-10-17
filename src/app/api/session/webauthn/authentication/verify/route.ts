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

/** Helpers for Set-Cookie handling */
function splitSetCookie(raw: string): string[] { return raw.split(/,(?=[^ ;]+=)/); }
function getSetCookieArray(h: Headers): string[] {
  const maybe = h as unknown as { getSetCookie?: () => string[] };
  if (typeof maybe.getSetCookie === "function") { try { const arr = maybe.getSetCookie(); if (Array.isArray(arr)) return arr; } catch {} }
  const single = h.get("set-cookie");
  return single ? splitSetCookie(single) : [];
}
function rewriteForHost(cookies: string[]): string[] {
  return cookies.map((cookie) => {
    let c = cookie.replace(/\s*;\s*Domain=[^;]+/gi, "");
    if (!/;\s*Path=/i.test(c)) c += "; Path=/";
    if (!/;\s*SameSite=/i.test(c)) c += "; SameSite=Lax";
    if (!/;\s*Secure/i.test(c)) c += "; Secure";
    return c;
  });
}

/** Heuristically extract a session token from a JSON payload */
function extractToken(obj: unknown): string | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  const candidateKeys = [
    "token","sessionToken","accessToken","jwt","idToken","authToken","session","bearer"
  ];
  for (const key of candidateKeys) {
    const v = o[key];
    if (typeof v === "string" && v.length > 10) return v;
  }
  // Nested common shapes e.g. { data: { token: "..." } }
  const nestedKeys = ["data","result","session","auth"];
  for (const nk of nestedKeys) {
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

  // Reconstruct site origin for CSRF-sensitive backends
  const host = req.headers.get("host") || "";
  const origin = `https://${host}`;
  const referer = `${origin}/login`;

  const upstream = await fetch(TARGET_URL, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      cookie: req.headers.get("cookie") || "",
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

  // Read upstream payload (json or text)
  const contentType = upstream.headers.get("content-type") || "application/json";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await upstream.json().catch(() => null) : await upstream.text();

  // Build response passthrough
  const res = new NextResponse(
    typeof payload === "string" ? payload : JSON.stringify(payload ?? {}),
    { status: upstream.status, headers: { "content-type": contentType } }
  );

  // 1) Forward any upstream Set-Cookie (rewritten for this host)
  const rawCookies = getSetCookieArray(upstream.headers);
  const rewritten = rewriteForHost(rawCookies);
  for (const c of rewritten) res.headers.append("set-cookie", c);

  // 2) If upstream didn't set a session cookie, set ours from the payload token
  if (upstream.ok) {
    const token = extractToken(payload);
    if (token) {
      // HttpOnly cookie for the app
      res.headers.append(
        "set-cookie",
        `everleap_session=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Secure; HttpOnly; Max-Age=2592000`
      );
      // TEMP visible mirror for debugging in /api/debug/cookies (remove later)
      res.headers.append(
        "set-cookie",
        `everleap_session_debug=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Secure; Max-Age=600`
      );
    }
  }

  return setNoStore(res);
}
