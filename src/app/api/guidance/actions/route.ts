export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!RAW_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for /api/guidance/actions proxy.");
}

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/actions`;

function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

async function forward(req: NextRequest, method: "GET" | "POST" | "PATCH") {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";

  const target = new URL(TARGET_URL);
  req.nextUrl.searchParams.forEach((v, k) => target.searchParams.set(k, v));

  const init: RequestInit = {
    method,
    headers: {
      "content-type": "application/json",
      cookie: req.headers.get("cookie") || "",
      "x-forwarded-host": host,
      "x-forwarded-proto": proto,
      "user-agent": req.headers.get("user-agent") || "",
      "cache-control": "no-cache",
    },
    redirect: "manual",
  };
  if (method !== "GET") init.body = await req.text();

  const upstream = await fetch(target.toString(), init);
  const contentType =
    upstream.headers.get("content-type") || "application/json; charset=utf-8";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await upstream.json().catch(() => ({})) : await upstream.text();
  const res = new NextResponse(
    typeof data === "string" ? data : JSON.stringify(data ?? {}),
    { status: upstream.status, headers: { "content-type": contentType } }
  );
  return noStore(res);
}

export const GET = (req: NextRequest) => forward(req, "GET");
export const POST = (req: NextRequest) => forward(req, "POST");
export const PATCH = (req: NextRequest) => forward(req, "PATCH");
