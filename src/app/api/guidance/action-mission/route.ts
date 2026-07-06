export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!RAW_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for /api/guidance/action-mission proxy.");
}

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/guidance/action-mission`;

function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

export async function POST(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";

  const init: RequestInit = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: req.headers.get("cookie") || "",
      "x-forwarded-host": host,
      "x-forwarded-proto": proto,
      "user-agent": req.headers.get("user-agent") || "",
      "cache-control": "no-cache",
    },
    redirect: "manual",
    body: await req.text(),
  };

  const upstream = await fetch(TARGET_URL, init);
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
