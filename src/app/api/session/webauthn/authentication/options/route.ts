// apps/web/src/app/api/session/webauthn/authentication/options/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies authentication *options* requests from the app to the API.
 * New backend route:  POST /api/passkey/auth/options
 */

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
if (!RAW_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for passkey authentication options proxy.");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/passkey/auth/options`;

function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

function getSetCookieArray(headers: Headers): string[] {
  const values: string[] = [];
  const sc = headers.get("set-cookie");
  if (sc) values.push(sc);
  // @ts-ignore - some runtimes expose getSetCookie()
  const all = headers.getSetCookie?.() as string[] | undefined;
  if (Array.isArray(all)) values.push(...all);
  return values;
}

/** Rewrite cookie attributes so they land correctly for the current host */
function rewriteSetCookieForHost(rawCookies: string[]): string[] {
  return rawCookies.map((c) => {
    let out = c
      .replace(/;\s*Domain=[^;]+/gi, "")
      .replace(/;\s*SameSite=[^;]+/gi, "")
      .replace(/;\s*Path=[^;]+/gi, "");

    if (!/;\s*Path=/i.test(out)) out += "; Path=/";
    if (!/;\s*SameSite=/i.test(out)) out += "; SameSite=Lax";
    if (!/;\s*Secure/i.test(out)) out += "; Secure";

    return out;
  });
}

function parseNameValue(cookie: string): { name: string; value: string } | null {
  const m = cookie.match(/^\s*([^=\s]+)\s*=\s*([^;]*)/);
  return m ? { name: m[1], value: m[2] } : null;
}

async function forward(req: NextRequest, method: "GET" | "POST") {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";

  // Prepare body for POST
  const ct = req.headers.get("content-type") || undefined;
  let body: BodyInit | undefined = undefined;
  if (method === "POST") {
    if (ct?.includes("application/json")) {
      const json = await req.json().catch(() => ({}));
      body = JSON.stringify(json ?? {});
    } else if (ct?.includes("application/x-www-form-urlencoded")) {
      body = await req.text();
    } else if (ct?.includes("multipart/form-data")) {
      body = await req.formData();
    } else {
      body = await req.text();
    }
  }

  const upstream = await fetch(TARGET_URL, {
    method,
    headers: {
      "content-type": ct || "application/json",
      "x-forwarded-host": host,
      "x-forwarded-proto": proto,
      "user-agent": req.headers.get("user-agent") || "",
      cookie: req.headers.get("cookie") || "",
      "cache-control": "no-cache",
    },
    body,
    redirect: "manual",
    cache: "no-store",
  });

  const contentType = upstream.headers.get("content-type") || "application/json; charset=utf-8";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await upstream.json().catch(() => null) : await upstream.text();

  const res = new NextResponse(
    typeof payload === "string" ? payload : JSON.stringify(payload ?? {}),
    { status: upstream.status, headers: { "content-type": contentType } }
  );

  // Ensure caches vary on Cookie
  res.headers.set("Vary", "Cookie");

  // Forward & normalize Set-Cookie from API
  const rawCookies = getSetCookieArray(upstream.headers);
  const rewritten = rewriteSetCookieForHost(rawCookies);
  for (const c of rewritten) res.headers.append("set-cookie", c);

  // Optional: short-lived debug mirror to verify cookies land in the browser
  for (const c of rewritten) {
    const nv = parseNameValue(c);
    if (!nv) continue;
    res.headers.append(
      "set-cookie",
      `${nv.name}_debug=${encodeURIComponent(nv.value)}; Path=/; SameSite=Lax; Secure; Max-Age=600`
    );
  }

  return noStore(res);
}

// Support both GET and POST (some clients use POST for “options”)
export async function GET(req: NextRequest) { return forward(req, "GET"); }
export async function POST(req: NextRequest) { return forward(req, "POST"); }
