// web/src/app/api/regauth/me/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7071/api"
).replace(/\/+$/, "");

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const ME_URL = `${API_BASE}/me`;

function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get("everleap_session")?.value;

  if (!session) {
    return noStore(
      NextResponse.json({ ok: true, authed: false }, { status: 200 })
    );
  }

  try {
    const upstream = await fetch(ME_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: `everleap_session=${encodeURIComponent(session)}`,
        "cache-control": "no-cache",
      },
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);

    if (upstream.status === 401) {
      return noStore(
        NextResponse.json({ ok: true, authed: false }, { status: 200 })
      );
    }

    if (!upstream.ok || !data) {
      return noStore(
        NextResponse.json(
          { ok: false, authed: false, error: "Failed to read session." },
          { status: 502 }
        )
      );
    }

    return noStore(
      NextResponse.json(
        {
          ok: true,
          authed: true,
          user: data.user,
        },
        { status: 200 }
      )
    );
  } catch {
    return noStore(
      NextResponse.json(
        { ok: false, authed: false, error: "Couldn’t reach session service." },
        { status: 502 }
      )
    );
  }
}