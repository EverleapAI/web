// apps/web/src/app/api/session/refresh/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getSetCookieArray, rewriteForHost, setNoStore } from "@/app/api/_bff/cookies";

// Resolve Functions base; ensure exactly one /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = RAW_BASE ? `${API_BASE}/session-me` : null;

type UpstreamMe =
  | { ok?: boolean; verified?: boolean; userId?: string | null; verifiedAtUtc?: string | null; issuedAtUtc?: string | null }
  | unknown;

function toStable(body: UpstreamMe): {
  ok: true;
  verified: boolean;
  userId: string | null;
  verifiedAtUtc: string | null;
  issuedAtUtc: string | null;
} {
  const o = (body && typeof body === "object" ? (body as Record<string, unknown>) : {});
  return {
    ok: true,
    verified: typeof o.verified === "boolean" ? o.verified : false,
    userId: typeof o.userId === "string" ? o.userId : null,
    verifiedAtUtc: typeof o.verifiedAtUtc === "string" ? o.verifiedAtUtc : null,
    issuedAtUtc: typeof o.issuedAtUtc === "string" ? o.issuedAtUtc : null,
  };
}

export async function GET(req: NextRequest) {
  // If no backend configured, return safe default
  if (!TARGET_URL) {
    const res = NextResponse.json(toStable({ verified: false, userId: null, verifiedAtUtc: null, issuedAtUtc: null }), { status: 200 });
    res.headers.set("Vary", "Cookie");
    return setNoStore(res);
  }

  const secure = req.nextUrl.protocol === "https:";
  const origin = req.nextUrl.origin;
  const host = req.headers.get("host") || req.nextUrl.host || "";
  const referer = `${origin}/`;
  const cookieHeader = req.headers.get("cookie") ?? "";

  const upstream = await fetch(TARGET_URL, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
      origin,
      referer,
      "x-forwarded-host": host,
      "x-forwarded-proto": secure ? "https" : "http",
      "cache-control": "no-cache",
    },
    redirect: "manual",
    cache: "no-store",
  });

  // Try to parse body; fall back to null
  const ct = upstream.headers.get("content-type") || "application/json";
  const isJson = ct.includes("application/json");
  const raw = isJson ? await upstream.json().catch(() => null) : await upstream.text();
  const stable = toStable((raw as UpstreamMe) ?? { verified: false });

  const res = NextResponse.json(stable, { status: 200 });
  res.headers.set("Vary", "Cookie");

  // Propagate any Set-Cookie updates from Functions
  const rawSetCookies = getSetCookieArray(upstream.headers);
  const rewritten = rewriteForHost(rawSetCookies, secure);
  for (const c of rewritten) res.headers.append("set-cookie", c);

  return setNoStore(res);
}
