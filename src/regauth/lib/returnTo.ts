// src/regauth/lib/returnTo.ts

import { APP_ROUTES } from "../config";

/**
 * Prevent open-redirects.
 * Only allow same-origin, internal paths that start with "/".
 * Disallow protocol-relative ("//evil.com") and anything with a scheme.
 */
export function sanitizeReturnTo(raw: string | null | undefined): string {
  if (!raw) return APP_ROUTES.home;

  const v = raw.trim();

  // Must be an internal path
  if (!v.startsWith("/")) return APP_ROUTES.home;

  // Disallow protocol-relative URLs
  if (v.startsWith("//")) return APP_ROUTES.home;

  // Disallow any obvious scheme attempts
  // (e.g. "javascript:", "http:", "https:")
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(v)) return APP_ROUTES.home;

  // Optional: block control chars
  if (/[\u0000-\u001F\u007F]/.test(v)) return APP_ROUTES.home;

  return v;
}
