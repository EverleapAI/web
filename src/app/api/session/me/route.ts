// apps/web/src/app/api/session/me/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { setNoStore } from "@/lib/security";

// Resolve your Functions base from env; handle cases where it already ends with /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${BASE_WITH_API}/session-me`;

export async function GET(req: NextRequest) {
  try {
    // Forward the cookies so the Functions app sees the same session
    const cookieHeader = req.headers.get("cookie") ?? "";

    const upstream = await fetch(TARGET_URL, {
      method: "GET",
      headers: {
        // pass through cookies; add anything else you need here
        cookie: cookieHeader,
        // force fresh data
        "cache-control": "no-cache",
      },
      // Next.js server runtime; we don't use credentials here
      redirect: "follow",
      cache: "no-store",
    });

    const text = await upstream.text();
    // Try to preserve JSON if possible
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    const res = NextResponse.json(body, { status: upstream.status });
    return setNoStore(res);
  } catch (err) {
    const res = NextResponse.json(
      {
        ok: false,
        message:
          (err as { message?: string })?.message ||
          "Failed to reach session endpoint",
      },
      { status: 502 }
    );
    return setNoStore(res);
  }
}
