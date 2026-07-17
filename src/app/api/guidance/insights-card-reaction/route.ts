export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!RAW_BASE) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL for /api/guidance/insights-card-reaction proxy."
  );
}

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/insights-card-reaction`;

function forwardHeaders(req: NextRequest): Record<string, string> {
  return {
    cookie: req.headers.get("cookie") || "",
    "content-type": req.headers.get("content-type") || "application/json",
    "x-forwarded-host":
      req.headers.get("x-forwarded-host") || req.headers.get("host") || "",
    "x-forwarded-proto": req.headers.get("x-forwarded-proto") || "https",
    "user-agent": req.headers.get("user-agent") || "",
    "cache-control": "no-cache",
  };
}

function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

async function relay(upstream: Response): Promise<NextResponse> {
  const contentType =
    upstream.headers.get("content-type") || "application/json; charset=utf-8";
  const isJson = contentType.includes("application/json");
  const resBody = isJson
    ? await upstream.json().catch(() => ({}))
    : await upstream.text();

  const res = new NextResponse(
    typeof resBody === "string" ? resBody : JSON.stringify(resBody ?? {}),
    { status: upstream.status, headers: { "content-type": contentType } }
  );
  return noStore(res);
}

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search || "";
  const upstream = await fetch(`${TARGET_URL}${qs}`, {
    method: "GET",
    headers: forwardHeaders(req),
    redirect: "manual",
  });
  return relay(upstream);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const upstream = await fetch(TARGET_URL, {
    method: "POST",
    headers: forwardHeaders(req),
    body,
    redirect: "manual",
  });
  return relay(upstream);
}
