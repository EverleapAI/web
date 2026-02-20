// src/regauth/types.ts

/* =============================================================================
   Core types
   ============================================================================= */

export type AuthIdentifierType = "email" | "phone";

export type AuthIdentifier = {
  raw: string;            // what the user typed
  normalized: string;     // canonical form (email lowercased; phone E.164-like)
  type: AuthIdentifierType;
};

export type AuthMethod = "passkey" | "code";

/**
 * Minimal user shape for UI-first flow.
 * Later you can extend this without breaking the UI.
 */
export type RegAuthUser = {
  id: string;
  createdAt: string; // ISO
  displayName?: string;
  identifier?: {
    type: AuthIdentifierType;
    valueMasked: string; // e.g. t***@gmail.com or +1 ••• ••12
  };
};

/**
 * What the UI considers an active session.
 * Later this will map to a cookie/session on the server.
 */
export type RegAuthSession = {
  userId: string;
  createdAt: string; // ISO
  lastSeenAt: string; // ISO
};

/* =============================================================================
   Local stub storage payloads
   ============================================================================= */

export type RegAuthStoragePayload = {
  schemaVersion: 1;
  session: RegAuthSession | null;
  user: RegAuthUser | null;
};

export type RegAuthDraftPayload = {
  schemaVersion: 1;

  /**
   * Used to carry the identifier from /regauth → /regauth/verify
   * even if the page refreshes.
   */
  identifier?: AuthIdentifier;

  /**
   * UI state hints. Keep optional.
   */
  method?: AuthMethod;

  /**
   * For resend cooldown UX; timestamps are ISO strings.
   */
  lastCodeSentAt?: string;
};
