// apps/web/src/app/api/session/webauthn/registration/verify/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies registration *verify* requests from the app to the API.
 * New backend route: POST /api/passkey/register/verify
 * - Should set/refresh the HttpOnly session cookie on success
 * - We rewrite Set-Cookie attrs for the current host and enforce Secure/Lax/Path=/
 */

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
if (!RAW_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for passkey registration verify proxy.");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/passkey/register/verify`;

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

/** Ensure cookies land for the current host; remove Domain=, enforce Path=/, SameSite=Lax, Secure */
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

async function forward(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";

  // Body: pass JSON straight through; some libs send base64url-encoded credential fields
  const ct = req.headers.get("content-type") || "application/json";
  let body: BodyInit | undefined;
  if (ct.includes("application/json")) {
    const json = await req.json().catch(() => ({}));
    body = JSON.stringify(json ?? {});
  } else if (ct.includes("application/x-www-form-urlencoded")) {
    body = await req.text();
  } else if (ct.includes("multipart/form-data")) {
    body = await req.formData();
  } else {
    body = await req.text();
  }

  const upstream = await fetch(TARGET_URL, {
    method: "POST",
    headers: {
      "content-type": ct,
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

  // Forward & normalize Set-Cookie from API so the browser receives the session
  const rawCookies = getSetCookieArray(upstream.headers);
  const rewritten = rewriteSetCookieForHost(rawCookies);
  for (const c of rewritten) res.headers.append("set-cookie", c);

  // Avoid cache issues in Azure/AppGateway/CDN
  res.headers.set("Vary", "Cookie");

  return noStore(res);
}

export async function POST(req: NextRequest) {
  return forward(req);
}
