// apps/web/src/app/api/profile/route.ts
//
// Proxy for updating the signed-in user's editable basics -> backend POST /profile.

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
const TARGET_URL = `${API_BASE}/profile`;

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    return noStore(NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 }));
  }

  try {
    const upstream = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Cookie: `${SESSION_COOKIE}=${encodeURIComponent(session)}`,
      },
      body: await req.text(),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));
    return noStore(NextResponse.json(data ?? {}, { status: upstream.status }));
  } catch {
    return noStore(NextResponse.json({ ok: false, error: "Failed to update profile." }, { status: 502 }));
  }
}
