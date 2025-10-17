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

/** Strip Domain= so cookies land on THIS host; ensure Path/SameSite/Secure defaults */
function rewriteSetCookieForHost(raw: string | null): string | null {
  if (!raw) return null;
  const parts = raw.split(/,(?=[^ ;]+=)/);
  const rewritten = parts.map((cookie) => {
    let c = cookie.replace(/\s*;\s*Domain=[^;]+/gi, "");
    if (!/;\s*Path=/i.test(c)) c += "; Path=/";
    if (!/;\s*SameSite=/i.test(c)) c += "; SameSite=Lax";
    if (!/;\s*Secure/i.test(c)) c += "; Secure";
    return c;
  });
  return rewritten.join(", ");
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  const res = await fetch(TARGET_URL, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      // 🔑 forward the browser cookies so Functions can read challenge/state
      cookie: req.headers.get("cookie") || "",
      "x-forwarded-host": req.headers.get("host") || "",
      "x-forwarded-proto": "https",
      "cache-control": "no-cache",
    },
    body,
    redirect: "manual",
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "application/json";
  const payload = contentType.includes("application/json") ? await res.json() : await res.text();

  const next = new NextResponse(
    typeof payload === "string" ? payload : JSON.stringify(payload),
    { status: res.status, headers: { "content-type": contentType } }
  );

  // Rewrite Set-Cookie so the session lands on the site host
  const setCookie = res.headers.get("set-cookie");
  const rewritten = rewriteSetCookieForHost(setCookie);
  if (rewritten) next.headers.set("set-cookie", rewritten);

  return setNoStore(next);
}
