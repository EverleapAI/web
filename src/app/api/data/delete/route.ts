// apps/web/src/app/api/data/delete/route.ts  ->  backend POST /data/delete

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

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }
  try {
    const upstream = await fetch(`${API_BASE}/data/delete`, {
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
    const res = NextResponse.json(data ?? {}, { status: upstream.status });
    // Best-effort: clear the session cookie once the account is gone.
    if (upstream.ok && (data as { ok?: boolean })?.ok) {
      res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    }
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to delete account." }, { status: 502 });
  }
}
