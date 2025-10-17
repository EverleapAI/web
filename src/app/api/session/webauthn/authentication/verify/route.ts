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

/** Return an array of rewritten Set-Cookie headers (NOT a single comma-joined string) */
function rewriteSetCookieArray(raw: string | null): string[] {
  if (!raw) return [];
  // split multiple cookies in a single header safely
  const parts = raw.split(/,(?=[^ ;]+=)/);
  return parts.map((cookie) => {
    let c = cookie.replace(/\s*;\s*Domain=[^;]+/gi, "");
    if (!/;\s*Path=/i.test(c)) c += "; Path=/";
    if (!/;\s*SameSite=/i.test(c)) c += "; SameSite=Lax";
    if (!/;\s*Secure/i.test(c)) c += "; Secure";
    return c;
  });
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

  const contentType = upstream.headers.get("content-type") || "application/json";
  const payload = contentType.includes("application/json") ? await upstream.json() : await upstream.text();

  const res = new NextResponse(
    typeof payload === "string" ? payload : JSON.stringify(payload),
    { status: upstream.status, headers: { "content-type": contentType } }
  );

  // Rewrite and APPEND each Set-Cookie individually
  const rawSetCookie = upstream.headers.get("set-cookie");
  const cookies = rewriteSetCookieArray(rawSetCookie);
  for (const c of cookies) res.headers.append("set-cookie", c);

  return setNoStore(res);
}
