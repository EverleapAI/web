// apps/web/src/lib/rate-limit.ts

import { NextRequest, NextResponse } from "next/server";

/**
 * Simple in-memory, per-process sliding-window rate limiter.
 * Good for local/dev and single-instance deployments.
 * For multi-instance prod, replace with Redis/Upstash and keep the API the same.
 */

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number; // seconds until window resets
  resetAt: number;       // epoch seconds when window resets
};

type Bucket = { count: number; resetTs: number };
const buckets = new Map<string, Bucket>();

/** Best-effort client key (IP) extraction */
export function getClientIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  // NextRequest doesn't expose req.socket, so fall back to host as last resort
  return req.headers.get("host") || "unknown";
}

/** Build a namespaced key (e.g., "verify:1.2.3.4") */
export function makeRateKey(req: NextRequest, name: string, extra?: string) {
  const ip = getClientIp(req);
  return extra ? `${name}:${ip}:${extra}` : `${name}:${ip}`;
}

/**
 * Check/consume a token in the current window.
 * - limit: max requests per window
 * - windowMs: window length in ms
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetTs) {
    const resetTs = now + windowMs;
    buckets.set(key, { count: 1, resetTs });
    return {
      ok: true,
      limit,
      remaining: Math.max(0, limit - 1),
      retryAfterSec: Math.ceil(windowMs / 1000),
      resetAt: Math.ceil(resetTs / 1000),
    };
  }

  // within current window
  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  const ok = bucket.count <= limit;
  return {
    ok,
    limit,
    remaining,
    retryAfterSec: Math.max(0, Math.ceil((bucket.resetTs - now) / 1000)),
    resetAt: Math.ceil(bucket.resetTs / 1000),
  };
}

/** Decorate a response with standard rate-limit headers */
export function setRateLimitHeaders(res: NextResponse, rl: RateLimitResult) {
  res.headers.set("X-RateLimit-Limit", String(rl.limit));
  res.headers.set("X-RateLimit-Remaining", String(rl.remaining));
  res.headers.set("X-RateLimit-Reset", String(rl.resetAt)); // epoch seconds
  if (!rl.ok) {
    // Inform client when to retry (RFC 9298 compatible)
    res.headers.set("Retry-After", String(rl.retryAfterSec));
  }
  return res;
}

/**
 * Convenience helper: enforce and return a 429 response if over limit.
 * Usage:
 *   const key = makeRateKey(req, "verify");
 *   const over = enforceRateLimit(req, key, 5, 60_000);
 *   if (over) return over; // 429
 */
export function enforceRateLimit(
  req: NextRequest,
  key: string,
  limit = 10,
  windowMs = 60_000
): NextResponse | null {
  const rl = checkRateLimit(key, limit, windowMs);
  if (rl.ok) return null;

  const res = NextResponse.json(
    { ok: false, error: "Too many requests. Please try again later." },
    { status: 429 }
  );
  return setRateLimitHeaders(res, rl);
}
