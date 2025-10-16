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
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${BASE_WITH_API}/webauthn/registration/options`;

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  return res;
}

/** Strip any Domain= so cookies land on THIS host */
function rewriteSetCookieForHost(raw: string | null): string | null {
  if (!raw) return null;
  return raw
    .split(/,(?=[^ ;]+=)/) // split multiple cookies safely
    .map((c) => c.replace(/; *Domain=[^;]+/gi, "")) // drop Domain=
    .join(", ");
}

export async function GET() {
  return setNoStore(NextResponse.json({ ok: false, error: "METHOD_NOT_ALLOWED" }, { status: 405 }));
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const body = await req.text();

    const upstream = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
        "cache-control": "no-cache",
        // pass along helpful context (not required, but nice for logs)
        "x-forwarded-host": req.headers.get("host") ?? "",
        "x-forwarded-proto": "https",
      },
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const status = upstream.status;
    const rawSetCookie = upstream.headers.get("set-cookie");
    const setCookie = rewriteSetCookieForHost(rawSetCookie);

    const upstreamCt = upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();
    let payload: unknown = text;
    try { payload = text ? JSON.parse(text) : null; } catch { /* keep raw text */ }

    const res =
      upstreamCt.includes("application/json")
        ? NextResponse.json(payload, { status })
        : new NextResponse(text, { status, headers: { "content-type": upstreamCt } });

    if (setCookie) res.headers.append("set-cookie", setCookie);
    return setNoStore(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy failed";
    return setNoStore(
      NextResponse.json({ ok: false, error: "BFF_ERROR", message }, { status: 502 })
    );
  }
}
