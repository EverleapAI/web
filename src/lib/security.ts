// apps/web/src/lib/security.ts
import type { NextRequest } from "next/server";

/** Central cookie names used across the app */
export const COOKIE = {
  VERIFIED: "everleap_verified",
  SESSION: "everleap_session",
  CONSENT: "everleap_consent",
} as const;

/** Shared cookie options (HttpOnly, Lax, domain, etc.) */
export function cookieBase() {
  const domain = (process.env.COOKIE_DOMAIN || "").trim() || undefined; // e.g. ".everleap.example"
  const secure = process.env.NODE_ENV !== "development";
  return {
    path: "/",
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure,
    domain,
    priority: "high" as const,
  };
}

/** Add a no-store header to API responses (call on every auth/consent response) */
export function setNoStore(res: Response) {
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

/**
 * Same-origin check for POSTs to guard against CSRF when you’re not using full CSRF tokens.
 * Allows same-origin, and optionally any additional origins in CORS_ALLOWED_ORIGINS
 * (comma-separated exact origins, e.g. "https://app.example.com,https://preview.example.com").
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.nextUrl.origin;

  // Accept exact same-origin via Origin or Referer
  const originOk = !origin || origin === host;
  const refererOk = !referer || safeSameOriginUrl(referer, host);

  if (originOk && refererOk) return true;

  // Optionally allow extra origins via env
  const extra = (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return !!(origin && extra.includes(origin));
}

function safeSameOriginUrl(urlStr: string, expectedOrigin: string): boolean {
  try {
    const u = new URL(urlStr);
    return u.origin === expectedOrigin;
  } catch {
    return false;
  }
}

/** Read JSON safely; throws a 400-friendly Error if invalid */
export async function readJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    const err = new Error("Invalid JSON body");
    // @ts-expect-error attach status for callers who want to use it
    err.status = 400;
    throw err;
  }
}

/** Sanitize a `next` param to prevent open-redirects (root-relative only) */
export function sanitizeNext(next: string | null | undefined, fallback = "/dashboard") {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  // Disallow protocol-relative like //evil.com
  if (next.startsWith("//")) return fallback;
  return next;
}
