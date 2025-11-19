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
if (!RAW_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for magic-link consume proxy.");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;

// Functions endpoint that actually verifies token + sets session
const TARGET_URL = `${API_BASE}/auth/magic/consume`;

export async function GET(req: NextRequest) {
  const secure = req.nextUrl.protocol === "https:";
  const origin = req.nextUrl.origin;
  const host = req.headers.get("host") || req.nextUrl.host || "";
  const referer = `${origin}/auth/magic`;
  const search = req.nextUrl.search || "";

  // Forward GET with browser cookies + headers
  const upstream = await fetch(`${TARGET_URL}${search}`, {
    method: "GET",
    headers: {
      cookie: req.headers.get("cookie") || "",
      origin,
      referer,
      "user-agent": req.headers.get("user-agent") || "",
      "x-forwarded-host": host,
      "x-forwarded-proto": secure ? "https" : "http",
      "cache-control": "no-cache",
    },
    redirect: "manual",
    cache: "no-store",
  });

  // If Functions returns a redirect (302), preserve Location + cookies
  const status = upstream.status;
  const location = upstream.headers.get("location") || null;

  const rawCookies = getSetCookieArray(upstream.headers);
  const rewritten = rewriteForHost(rawCookies, secure);

  if (status >= 300 && status < 400 && location) {
    const res = NextResponse.redirect(location, { status });
    for (const c of rewritten) res.headers.append("set-cookie", c);
    return setNoStore(res);
  }

  // Otherwise, proxy JSON/text body
  const ct = upstream.headers.get("content-type") || "application/json";
  const isJson = ct.includes("application/json");
  const payload = isJson ? await upstream.json().catch(() => null) : await upstream.text();

  const res = new NextResponse(
    typeof payload === "string" ? payload : JSON.stringify(payload ?? {}),
    { status, headers: { "content-type": ct } }
  );

  res.headers.set("Vary", "Cookie");
  for (const c of rewritten) res.headers.append("set-cookie", c);

  return setNoStore(res);
}
