// apps/web/src/app/api/session/me/route.ts
export const dynamic = "force-static";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { COOKIE, setNoStore } from "@/lib/security";
import { SessionMeResponseSchema } from "@/lib/validation";

function parseJsonCookie<T = unknown>(raw?: string): T | null {
  if (!raw) return null;
  const attempts = [raw, (() => { try { return decodeURIComponent(raw); } catch { return raw; } })()];
  for (const s of attempts) {
    try {
      return JSON.parse(s as string) as T;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const verifiedFlag = req.cookies.get(COOKIE.VERIFIED)?.value === "1";
  const session = parseJsonCookie<{ verified?: boolean; verifiedAtUtc?: string; userId?: string }>(
    req.cookies.get(COOKIE.SESSION)?.value
  );

  const verified =
    verifiedFlag || Boolean(session?.verified === true || typeof session?.verifiedAtUtc === "string");

  // Build response body and validate (defense-in-depth)
  const body = {
    ok: true, // request itself succeeded; 'verified' communicates auth state
    verified,
    userId: session?.userId ?? null,
    verifiedAtUtc: session?.verifiedAtUtc ?? null,
  };

  const parsed = SessionMeResponseSchema.safeParse(body);
  const safe = parsed.success
    ? parsed.data
    : { ok: true, verified: false, userId: null, verifiedAtUtc: null };

  const res = NextResponse.json(safe, { status: 200 });
  return setNoStore(res);
}
