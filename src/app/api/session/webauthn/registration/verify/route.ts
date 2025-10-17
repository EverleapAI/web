// apps/web/src/app/api/session/webauthn/registration/verify/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/webauthn/registration/verify`;

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  return res;
}

function rewriteSetCookieForHost(raw: string | null): string | null {
  if (!raw) return null;
  return raw
    .split(/,(?=[^ ;]+=)/)
    .map((c) => {
      let x = c.replace(/\s*;\s*Domain=[^;]+/gi, "");
      if (!/;\s*Path=/i.test(x)) x += "; Path=/";
      if (!/;\s*SameSite=/i.test(x)) x += "; SameSite=Lax";
      if (!/;\s*Secure/i.test(x)) x += "; Secure";
      return x;
    })
    .join(", ");
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  const res = await fetch(TARGET_URL, {
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

  const contentType = res.headers.get("content-type") || "application/json";
  const payload = contentType.includes("application/json") ? await res.json() : await res.text();

  const next = new NextResponse(
    typeof payload === "string" ? payload : JSON.stringify(payload),
    { status: res.status, headers: { "content-type": contentType } }
  );

  const setCookie = res.headers.get("set-cookie");
  const rewritten = rewriteSetCookieForHost(setCookie);
  if (rewritten) next.headers.set("set-cookie", rewritten);

  return setNoStore(next);
}
