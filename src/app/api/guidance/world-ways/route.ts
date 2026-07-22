export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
if (!RAW_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for /api/guidance/world-ways proxy.");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/world-ways`;

export async function GET(req: NextRequest) {
  const upstream = await fetch(`${TARGET_URL}${req.nextUrl.search || ""}`, {
    method: "GET",
    headers: {
      cookie: req.headers.get("cookie") || "",
      "x-forwarded-host": req.headers.get("x-forwarded-host") || req.headers.get("host") || "",
      "x-forwarded-proto": req.headers.get("x-forwarded-proto") || "https",
      "user-agent": req.headers.get("user-agent") || "",
    },
    redirect: "manual",
  });
  const contentType = upstream.headers.get("content-type") || "application/json";
  const body = contentType.includes("application/json")
    ? await upstream.json().catch(() => ({}))
    : await upstream.text();
  const res = new NextResponse(typeof body === "string" ? body : JSON.stringify(body ?? {}), {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Vary", "Cookie");
  return res;
}
