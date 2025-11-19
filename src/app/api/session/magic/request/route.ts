// apps/web/src/app/api/session/magic/request/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {
  setNoStore,
  getSetCookieArray,
  rewriteForHost,
} from "@/app/api/_bff/cookies";

// Normalize Functions base; ensure exactly one /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
if (!RAW_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for magic-link request proxy.");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;

// Functions endpoint (aligned with your naming): POST /api/auth/magic/request
const TARGET_URL = `${API_BASE}/auth/magic/request`;

export async function POST(req: NextRequest) {
  const body = await req.text();

  const secure = req.nextUrl.protocol === "https:";
  const origin = req.nextUrl.origin;
  const host = req.headers.get("host") || req.nextUrl.host || "";
  const referer = `${origin}/auth/magic`;

  // Forward request (with browser cookies, origin & proto)
  const upstream = await fetch(TARGET_URL, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      cookie: req.headers.get("cookie") || "",
      origin,
      referer,
      "user-agent": req.headers.get("user-agent") || "",
      "x-forwarded-host": host,
      "x-forwarded-proto": secure ? "https" : "http",
      "cache-control": "no-cache",
    },
    body,
    redirect: "manual",
    cache: "no-store",
  });

  // Collect cookies from Functions and rewrite for this host/scheme
  const rawCookies = getSetCookieArray(upstream.headers);
  const rewritten = rewriteForHost(rawCookies, secure);

  // Proxy payload through as-is (json or text)
  const ct = upstream.headers.get("content-type") || "application/json";
  const isJson = ct.includes("application/json");
  const payload = isJson ? await upstream.json().catch(() => null) : await upstream.text();

  const res = new NextResponse(
    typeof payload === "string" ? payload : JSON.stringify(payload ?? {}),
    { status: upstream.status, headers: { "content-type": ct } }
  );

  res.headers.set("Vary", "Cookie");
  for (const c of rewritten) res.headers.append("set-cookie", c);

  return setNoStore(res);
}
