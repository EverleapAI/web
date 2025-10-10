// apps/web/src/app/api/consent/status/route.ts
export const dynamic = "force-static";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { COOKIE, setNoStore } from "@/lib/security";
import { ConsentStatusResponseSchema } from "@/lib/validation";

type ConsentRecord = {
  version: number;
  accepted: boolean;
  scopes?: string[];
  acceptedAtUtc?: string;
};

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
  const consent = parseJsonCookie<ConsentRecord>(req.cookies.get(COOKIE.CONSENT)?.value);

  const body = {
    ok: true as const,
    accepted: consent?.accepted === true,
    version: typeof consent?.version === "number" ? consent.version : 0,
    scopes: Array.isArray(consent?.scopes) ? consent.scopes : undefined,
    acceptedAtUtc: typeof consent?.acceptedAtUtc === "string" ? consent.acceptedAtUtc : undefined,
  };

  const parsed = ConsentStatusResponseSchema.safeParse(body);
  const safe = parsed.success ? parsed.data : { ok: true as const, accepted: false, version: 0 };

  const res = NextResponse.json(safe, { status: 200 });
  return setNoStore(res);
}
