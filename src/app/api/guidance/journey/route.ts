export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!RAW_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for /api/guidance/journey proxy.");
}

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/journey`;

async function forward(req: NextRequest, method: "GET" | "POST") {
  // Whole query string, forwarded as-is. Sibling handlers rebuild it from named
  // params and silently drop anything added upstream later — that is how
  // `branch` went missing for hours behind six green deploys.
  const upstream = await fetch(`${TARGET_URL}${req.nextUrl.search || ""}`, {
    method,
    headers: {
      "content-type": "application/json",
      cookie: req.headers.get("cookie") || "",
      "x-forwarded-host":
        req.headers.get("x-forwarded-host") || req.headers.get("host") || "",
      "x-forwarded-proto": req.headers.get("x-forwarded-proto") || "https",
      "cache-control": "no-cache",
    },
    redirect: "manual",
  });

  const data = await upstream.json().catch(() => ({}));
  const res = new NextResponse(JSON.stringify(data ?? {}), {
    status: upstream.status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Vary", "Cookie");
  return res;
}

export const GET = (req: NextRequest) => forward(req, "GET");
export const POST = (req: NextRequest) => forward(req, "POST");
