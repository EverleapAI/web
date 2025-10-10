// apps/web/src/app/api/consent/accept/route.ts
import { NextResponse, NextRequest } from "next/server";
import { COOKIE, cookieBase, isSameOrigin, setNoStore } from "@/lib/security";
import { parseOrThrow, ConsentAcceptPayloadSchema, ConsentRecordSchema } from "@/lib/validation";
import { enforceRateLimit, makeRateKey } from "@/lib/rate-limit";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function POST(req: NextRequest) {
  // CSRF guard: allow only same-origin POSTs
  if (!isSameOrigin(req)) {
    return setNoStore(NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }));
  }

  // Rate limit: 10 accepts per minute per IP
  const rl = enforceRateLimit(req, makeRateKey(req, "consent", "accept"), 10, 60_000);
  if (rl) return setNoStore(rl);

  // Validate incoming body
  const body = await req.json().catch(() => ({}));
  const payload = parseOrThrow(ConsentAcceptPayloadSchema, body, 400);

  const record = {
    version: typeof payload.version === "number" ? payload.version : 1, // keep in sync with RequireConsent.tsx
    accepted: true,
    scopes: Array.isArray(payload.scopes) ? payload.scopes : undefined,
    acceptedAtUtc:
      typeof payload.acceptedAtUtc === "string" ? payload.acceptedAtUtc : new Date().toISOString(),
  };

  // Double-check the record shape (defense-in-depth)
  parseOrThrow(ConsentRecordSchema, record, 500);

  const res = NextResponse.json({ ok: true, ...record }, { status: 200 });
  setNoStore(res);

  // HttpOnly consent cookie
  const base = cookieBase();
  res.cookies.set(COOKIE.CONSENT, JSON.stringify(record), { ...base, maxAge: ONE_YEAR });

  return res;
}

/** Optional: allow revocation of consent via DELETE */
export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return setNoStore(NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }));
  }

  // Rate limit: 5 revokes per minute per IP
  const rl = enforceRateLimit(req, makeRateKey(req, "consent", "revoke"), 5, 60_000);
  if (rl) return setNoStore(rl);

  const res = NextResponse.json({ ok: true, accepted: false, version: 0 }, { status: 200 });
  setNoStore(res);

  const base = cookieBase();
  res.cookies.set(COOKIE.CONSENT, "", { ...base, maxAge: 0, expires: new Date(0) });

  return res;
}
