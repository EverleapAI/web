// apps/web/src/app/api/session/webauthn/registration/verify/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

/** Normalize Functions base; ensure exactly one /api */
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const VERIFY_URL = `${API_BASE}/webauthn/registration/verify`;
const HYDRATE_URL = `${API_BASE}/session-me`;

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

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
    if (!/;\s*HttpOnly/i.test(c)) c += "; HttpOnly";
    return c;
  });
}
function parseNameValue(sc: string): { name: string; value: string } | null {
  const m = sc.match(/^\s*([^=;,\s]+)=([^;]+)/);
  return m ? { name: m[1], value: m[2] } : null;
}
function buildMergedCookieHeader(original: string, setCookies: string[]): string {
  const jar = new Map<string,string>();
  for (const part of (original || "").split(";")) {
    const m = part.trim().match(/^([^=]+)=(.*)$/);
    if (m) jar.set(m[1].trim(), m[2]);
  }
  for (const sc of setCookies) {
    const nv = parseNameValue(sc);
    if (nv) jar.set(nv.name, nv.value);
  }
  return Array.from(jar.entries()).map(([k,v]) => `${k}=${v}`).join("; ");
}
function extractToken(obj: unknown): string | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  const keys = ["token","sessionToken","accessToken","jwt","idToken","authToken","session","bearer"];
  for (const k of keys) { const v = o[k]; if (typeof v === "string" && v.length > 10) return v; }
  for (const nk of ["data","result","session","auth"]) {
    const v = o[nk]; if (v && typeof v === "object") { const t = extractToken(v); if (t) return t; }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  const host = req.headers.get("host") || "";
  const origin = `https://${host}`;
  const referer = `${origin}/login`;
  const incomingCookie = req.headers.get("cookie") || "";

  // 1) upstream verify
  const verifyRes = await fetch(VERIFY_URL, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      cookie: incomingCookie,
      origin, referer,
      "user-agent": req.headers.get("user-agent") || "",
      "x-forwarded-host": host, "x-forwarded-proto": "https",
      "cache-control": "no-cache",
    },
    body,
    redirect: "manual",
    cache: "no-store",
  });

  const verifyCT = verifyRes.headers.get("content-type") || "application/json";
  const verifyIsJson = verifyCT.includes("application/json");
  const verifyPayload = verifyIsJson ? await verifyRes.json().catch(() => null) : await verifyRes.text();

  const out = new NextResponse(
    typeof verifyPayload === "string" ? verifyPayload : JSON.stringify(verifyPayload ?? {}),
    { status: verifyRes.status, headers: { "content-type": verifyCT } }
  );

  // pass through verify cookies
  const verifySetCookies = getSetCookieArray(verifyRes.headers);
  const rewrittenVerify = rewriteForHost(verifySetCookies);
  for (const c of rewrittenVerify) out.headers.append("set-cookie", c);

  // 2) hydrate using MERGED cookie jar
  if (verifyRes.ok) {
    const mergedCookieHeader = buildMergedCookieHeader(incomingCookie, verifySetCookies);

    const hydrateRes = await fetch(HYDRATE_URL, {
      method: "GET",
      headers: {
        cookie: mergedCookieHeader,
        origin, referer,
        "x-forwarded-host": host, "x-forwarded-proto": "https",
        "cache-control": "no-cache",
      },
      redirect: "manual",
      cache: "no-store",
    });

    const hydrateSetCookies = getSetCookieArray(hydrateRes.headers);
    const rewrittenHydrate = rewriteForHost(hydrateSetCookies);
    for (const c of rewrittenHydrate) out.headers.append("set-cookie", c);

    if (hydrateSetCookies.length === 0 && rewrittenVerify.length === 0) {
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
