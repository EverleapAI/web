export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!RAW_BASE) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL for /api/guidance/time-twin-reflection proxy."
  );
}

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/time-twin-reflection`;

function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

function forwardHeaders(req: NextRequest): Record<string, string> {
  return {
    cookie: req.headers.get("cookie") || "",
    "x-forwarded-host": req.headers.get("x-forwarded-host") || req.headers.get("host") || "",
    "x-forwarded-proto": req.headers.get("x-forwarded-proto") || "https",
    "user-agent": req.headers.get("user-agent") || "",
    "cache-control": "no-cache",
  };
}

async function relay(upstream: Response): Promise<NextResponse> {
  const contentType = upstream.headers.get("content-type") || "application/json; charset=utf-8";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await upstream.json().catch(() => ({})) : await upstream.text();

  const res = new NextResponse(
    typeof body === "string" ? body : JSON.stringify(body ?? {}),
    { status: upstream.status, headers: { "content-type": contentType } }
  );

  return noStore(res);
}

export async function GET(req: NextRequest) {
  // Whole query string: a named-key copy drops anything added upstream later.
  const url = TARGET_URL + (req.nextUrl.search || "");

  const upstream = await fetch(url, {
    method: "GET",
    headers: forwardHeaders(req),
    redirect: "manual",
  });

  return relay(upstream);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const upstream = await fetch(TARGET_URL, {
    method: "POST",
    headers: { ...forwardHeaders(req), "content-type": "application/json" },
    body: rawBody,
    redirect: "manual",
  });

  return relay(upstream);
}
