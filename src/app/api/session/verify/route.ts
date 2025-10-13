import { NextResponse, NextRequest } from "next/server";
import { COOKIE, cookieBase, isSameOrigin, readJson, setNoStore } from "@/lib/security";
import {
  parseOrThrow,
  VerifyOtpRequestSchema,
  VerifyOtpResponseSchema,
} from "@/lib/validation";
import { enforceRateLimit, makeRateKey } from "@/lib/rate-limit";
import { z } from "zod";

/**
 * Proxies to your Azure Function /auth/verify-otp
 * and sets HttpOnly cookies on your site when verification succeeds.
 */

// Handle NEXT_PUBLIC_API_BASE_URL that may or may not already end with /api
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7071/api").replace(/\/+$/, "");
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const AUTH_VERIFY = `${BASE_WITH_API}/auth/verify-otp`;

// Extend the base schema to include pre-auth profile fields
const VerifyOtpWithProfileSchema = VerifyOtpRequestSchema.extend({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(["student", "supporter"]),
});

type UpstreamError = { code?: string; error?: string };

function safeParseJson<T>(txt: string): T | null {
  try {
    return JSON.parse(txt) as T;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // CSRF guard for same-origin POSTs
    if (!isSameOrigin(req)) {
      return setNoStore(NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }));
    }

    // Rate limit (per-IP): 6 requests / minute
    const rl = enforceRateLimit(req, makeRateKey(req, "verify"), 6, 60_000);
    if (rl) return setNoStore(rl);

    // Validate incoming payload (includes firstName, lastName, role)
    const raw = await readJson<unknown>(req);
    const payload = parseOrThrow(VerifyOtpWithProfileSchema, raw, 400);

    // Proxy to upstream
    const upstream = await fetch(AUTH_VERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    // Handle upstream errors (surface USER_EXISTS clearly)
    if (!upstream.ok) {
      const txt = await upstream.text().catch(() => `HTTP ${upstream.status}`);
      const parsed = safeParseJson<UpstreamError>(txt) || {};

      if (upstream.status === 409) {
        const code = parsed.code || "USER_EXISTS";
        const error = parsed.error || "Account already exists for that contact.";
        return setNoStore(NextResponse.json({ ok: false, code, error }, { status: 409 }));
      }

      return new NextResponse(txt, {
        status: upstream.status,
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    // Validate upstream success response
    const upstreamTxt = await upstream.text().catch(() => "");
    const upstreamJson = safeParseJson<unknown>(upstreamTxt) ?? {};
    const parsed = VerifyOtpResponseSchema.safeParse(upstreamJson);
    if (!parsed.success) {
      return setNoStore(NextResponse.json({ ok: false, error: "Bad upstream response" }, { status: 502 }));
    }
    const data = parsed.data;

    if (!data.ok || !data.userId) {
      const msg = data.error || "Verification failed";
      return setNoStore(NextResponse.json({ ok: false, error: msg }, { status: 401 }));
    }

    // Success
    const resp = NextResponse.json(
      { ok: true, userId: String(data.userId), redirect: data.redirect ?? null },
      { status: 200 }
    );

    // No-store for auth responses
    setNoStore(resp);

    // Cookies
    const base = cookieBase();
    const maxAge = 60 * 60 * 24 * 30; // 30 days

    resp.cookies.set(COOKIE.VERIFIED, "1", { ...base, maxAge });

    const session = {
      verified: true,
      verifiedAtUtc: new Date().toISOString(),
      userId: String(data.userId),
    };
    resp.cookies.set(COOKIE.SESSION, JSON.stringify(session), { ...base, maxAge });

    return resp;
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    const status = typeof e?.status === "number" ? e.status : 500;
    const msg = e?.message || "Server error";
    return setNoStore(NextResponse.json({ ok: false, error: msg }, { status }));
  }
}
