export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!RAW_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for /api/guidance/day-scene-image proxy.");
}

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/day-scene-image`;

function forwardHeaders(req: NextRequest): Record<string, string> {
  return {
    cookie: req.headers.get("cookie") || "",
    "x-forwarded-host": req.headers.get("x-forwarded-host") || req.headers.get("host") || "",
    "x-forwarded-proto": req.headers.get("x-forwarded-proto") || "https",
    "user-agent": req.headers.get("user-agent") || "",
  };
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "";
  const moment = req.nextUrl.searchParams.get("moment") || "";
  const url = `${TARGET_URL}?path=${encodeURIComponent(path)}&moment=${encodeURIComponent(moment)}`;

  const upstream = await fetch(url, {
    method: "GET",
    headers: forwardHeaders(req),
    redirect: "manual",
  });

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";

  if (!contentType.startsWith("image/")) {
    const text = await upstream.text();
    const res = new NextResponse(text, { status: upstream.status, headers: { "content-type": contentType } });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const bytes = Buffer.from(await upstream.arrayBuffer());
  const res = new NextResponse(bytes, { status: upstream.status, headers: { "content-type": contentType } });
  res.headers.set("Cache-Control", "private, max-age=604800, immutable");
  res.headers.set("Vary", "Cookie");
  return res;
}
