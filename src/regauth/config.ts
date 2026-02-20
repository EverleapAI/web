// src/regauth/config.ts

/* =============================================================================
   Routes
   ============================================================================= */

export const REGAUTH_ROUTES = {
  entry: "/regauth",
  verify: "/regauth/verify",
  profile: "/regauth/profile",
  done: "/regauth/done",
  blocked: "/regauth/blocked",
} as const;

export const APP_ROUTES = {
  home: "/main",
} as const;

/**
 * Any route prefixes that require a signed-in session.
 * Middleware will protect these.
 */
export const PROTECTED_ROUTE_PREFIXES = [
  "/main",
  "/app", // if you ever add an /app namespace
] as const;

/* =============================================================================
   Local stub keys (UI-first)
   ============================================================================= */

/**
 * We keep ALL local auth state in one object so we can later swap
 * localStorage → server without touching the UI.
 */
export const LOCAL_AUTH_STORAGE_KEY = "regauth_session_v1";

/**
 * Optional: store the in-progress identifier to make verify screen smoother
 * (e.g. show “Sent to t***@gmail.com” even after refresh).
 */
export const LOCAL_REGAUTH_DRAFT_KEY = "regauth_draft_v1";

/**
 * If you already have a global state blob, keep this separate.
 * (Later you’ll move this server-side as /me/state.)
 */
export const LOCAL_APP_STATE_KEY = "everleap_state_v1";

/* =============================================================================
   UX constants
   ============================================================================= */

export const REGAUTH_UX = {
  codeLength: 6,
  resendCooldownSeconds: 30,
  verifyMaxAttempts: 6,
  minSpinnerMs: 450, // avoids “blink” on fast transitions
  successAutoAdvanceMs: 650,

  // NEW: /regauth/done auto-continue delay (used by RegAuthDonePage)
  doneAutoContinueMs: 1200,
} as const;

/* =============================================================================
   Helpers
   ============================================================================= */

export type ProtectedPrefix = (typeof PROTECTED_ROUTE_PREFIXES)[number];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}
