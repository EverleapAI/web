// apps/web/src/app/api/guidance/self-portrait/route.ts
//
// Proxy -> backend GET /guidance/self-portrait (the user-facing self-portrait).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "everleap_session";

const RAW_BASE = (
  process.env.EVERLEAP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:7071/api"
).replace(/\/+$/, "");

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/self-portrait`;

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    return noStore(NextResponse.json({ ok: true, portrait: null }, { status: 200 }));
  }

  try {
    const upstream = await fetch(TARGET_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: `${SESSION_COOKIE}=${encodeURIComponent(session)}`,
      },
      cache: "no-store",
    });
    const data = await upstream.json().catch(() => ({}));
    return noStore(NextResponse.json(data ?? {}, { status: upstream.status }));
  } catch {
    return noStore(NextResponse.json({ ok: false, portrait: null, error: "Failed to load self-portrait." }, { status: 502 }));
  }
}
