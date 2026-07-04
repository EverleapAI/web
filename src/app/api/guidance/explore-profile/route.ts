export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!RAW_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for /api/guidance/explore-profile proxy.");
}

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/explore-profile`;

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";

  const upstream = await fetch(TARGET_URL, {
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

  const contentType = upstream.headers.get("content-type") || "application/json; charset=utf-8";
  const data = contentType.includes("application/json")
    ? await upstream.json().catch(() => ({}))
    : await upstream.text();
  const res = new NextResponse(typeof data === "string" ? data : JSON.stringify(data ?? {}), {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Vary", "Cookie");
  return res;
}
