export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

// Normalize Functions base; ensure exactly one /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${BASE_WITH_API}/webauthn/authentication/verify`;

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  return res;
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
      },
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const setCookie = upstream.headers.get("set-cookie");
    const location = upstream.headers.get("location");
    const status = upstream.status;

    if (status >= 300 && status < 400 && location) {
      const res = NextResponse.redirect(location, { status });
      if (setCookie) res.headers.append("set-cookie", setCookie);
      return setNoStore(res);
    }

    const text = await upstream.text();
    let payload: unknown = text;
    try { payload = text ? JSON.parse(text) : null; } catch {}

    const res = NextResponse.json(payload, { status });
    if (setCookie) res.headers.append("set-cookie", setCookie);
    return setNoStore(res);
  } catch (err) {
    const res = NextResponse.json(
      { ok: false, error: "BFF_ERROR", message: (err as any)?.message ?? "Proxy failed" },
      { status: 502 }
    );
    return setNoStore(res);
  }
}
