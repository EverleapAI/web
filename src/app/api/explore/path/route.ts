export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!RAW_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for /api/explore/path proxy.");
}

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/explore-path`;

function noStore(res: NextResponse) {
  // A path's content is catalog data that changes only when it is regenerated,
// which is rare. The only per-user part is the short "why this fits you"
// overlay, so it caches privately rather than not at all. Without this, opening
// five specialties of one career refetched the identical path five times.
  res.headers.set("Cache-Control", "private, max-age=300");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";

  // Forward the WHOLE query string. Copying a fixed list of keys means any
  // parameter added upstream later silently vanishes here, with no error on
  // either side — the failure mode that hid `branch` on the scene-image
  // endpoint for hours behind green deploys.
  const target = new URL(TARGET_URL + (req.nextUrl.search || ""));

  const upstream = await fetch(target.toString(), {
    method: "GET",
    headers: {
      cookie: req.headers.get("cookie") || "",
      "x-forwarded-host": host,
      "x-forwarded-proto": proto,
      "user-agent": req.headers.get("user-agent") || "",
      "cache-control": "no-cache",
    },
    redirect: "manual",
  });

  const contentType =
    upstream.headers.get("content-type") || "application/json; charset=utf-8";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await upstream.json().catch(() => ({})) : await upstream.text();

  const res = new NextResponse(
    typeof body === "string" ? body : JSON.stringify(body ?? {}),
    { status: upstream.status, headers: { "content-type": contentType } }
  );

  return noStore(res);
}
