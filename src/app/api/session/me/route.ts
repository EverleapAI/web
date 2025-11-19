// apps/web/src/app/api/session/me/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { setNoStore } from "@/lib/security";
import { getSetCookieArray, rewriteForHost } from "@/app/api/_bff/cookies";

// Resolve your Functions base from env; handle bases that may already include /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = RAW_BASE ? `${BASE_WITH_API}/session-me` : null;

type UpstreamMe =
  | { ok?: boolean; verified?: boolean; userId?: string | null; verifiedAtUtc?: string | null; issuedAtUtc?: string | null }
  | unknown;

// Normalize whatever the upstream said into our stable envelope
function toStable(body: UpstreamMe): {
  ok: true;
  verified: boolean;
  userId: string | null;
  verifiedAtUtc: string | null;
  issuedAtUtc: string | null;
} {
  const asObj = (body && typeof body === "object") ? (body as Record<string, unknown>) : {};
  const verified = typeof asObj.verified === "boolean" ? asObj.verified : false;
  const userId = typeof asObj.userId === "string" ? asObj.userId : null;
  const verifiedAtUtc = typeof asObj.verifiedAtUtc === "string" ? asObj.verifiedAtUtc : null;
  const issuedAtUtc = typeof asObj.issuedAtUtc === "string" ? asObj.issuedAtUtc : null;
  return { ok: true, verified, userId, verifiedAtUtc, issuedAtUtc };
}

export async function GET(req: NextRequest) {
  try {
    // If we don't have a backend base configured, return a safe "not verified" shape
    if (!TARGET_URL) {
      const res = NextResponse.json(
        toStable({ verified: false, userId: null, verifiedAtUtc: null, issuedAtUtc: null }),
        { status: 200 },
      );
      res.headers.set("Vary", "Cookie");
      return setNoStore(res);
    }

    // Forward cookies so Functions can read the same session
    const cookieHeader = req.headers.get("cookie") ?? "";
    const secure = req.nextUrl.protocol === "https:";
    const origin = req.nextUrl.origin;
    const host = req.headers.get("host") || req.nextUrl.host || "";
    const referer = `${origin}/`;

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
      redirect: "follow",
      cache: "no-store",
    });

    const text = await upstream.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }

    // Even if upstream returns a non-200, keep the client contract stable
    const stable = toStable((parsed as UpstreamMe) ?? { verified: false });

    const res = NextResponse.json(stable, { status: 200 });
    res.headers.set("Vary", "Cookie"); // different users → different responses

    // ⬇️ Propagate any upstream Set-Cookie values (rewritten for current host/scheme)
    const rawSetCookies = getSetCookieArray(upstream.headers);
    const rewritten = rewriteForHost(rawSetCookies, secure);
    for (const c of rewritten) res.headers.append("set-cookie", c);

    return setNoStore(res);
  } catch (err) {
    const res = NextResponse.json(
      {
        ok: false,
        error:
          (err as { message?: string })?.message ||
          "Failed to reach session endpoint",
      },
      { status: 502 },
    );
    res.headers.set("Vary", "Cookie");
    return setNoStore(res);
  }
}
