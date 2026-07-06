// apps/web/src/app/api/data/export/route.ts  ->  backend GET /data/export

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

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }
  try {
    const upstream = await fetch(`${API_BASE}/data/export`, {
      method: "GET",
      headers: { Accept: "application/json", Cookie: `${SESSION_COOKIE}=${encodeURIComponent(session)}` },
      cache: "no-store",
    });
    const data = await upstream.json().catch(() => ({}));
    const res = NextResponse.json(data ?? {}, { status: upstream.status });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to export data." }, { status: 502 });
  }
}
