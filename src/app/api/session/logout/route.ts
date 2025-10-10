// apps/web/src/app/api/session/logout/route.ts
import { NextResponse, NextRequest } from "next/server";
import { COOKIE, cookieBase, isSameOrigin, setNoStore } from "@/lib/security";
import { enforceRateLimit, makeRateKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // CSRF guard: same-origin only
  if (!isSameOrigin(req)) {
    return setNoStore(NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }));
  }

  // Rate limit: 10 logouts / minute per IP
  const rl = enforceRateLimit(req, makeRateKey(req, "session", "logout"), 10, 60_000);
  if (rl) return setNoStore(rl);

  const res = NextResponse.json({ ok: true }, { status: 200 });
  setNoStore(res);

  // Expire session cookies
  const base = cookieBase();
  res.cookies.set(COOKIE.VERIFIED, "", { ...base, maxAge: 0, expires: new Date(0) });
  res.cookies.set(COOKIE.SESSION, "", { ...base, maxAge: 0, expires: new Date(0) });

  return res;
}
