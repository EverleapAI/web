// apps/web/src/lib/passkey.ts
import { api } from "@/lib/api";

/**
 * Shared WebAuthn + fetch helpers for Everleap
 * --------------------------------------------------
 * Used by both /login and /register pages.
 * Handles base64url conversion, safe fetch,
 * decoding, and credential serialization.
 */

/* ----------------------------- Types ----------------------------- */

export type PublicKeyCredentialRequestOptionsJSON = {
  challenge: string;
  allowCredentials?: Array<{
    type: "public-key";
    id: string;
    transports?: AuthenticatorTransport[];
  }>;
  timeout?: number;
  rpId?: string;
  userVerification?: "required" | "preferred" | "discouraged";
  extensions?: AuthenticationExtensionsClientInputs;
};

export type PublicKeyCredentialCreationOptionsJSON = {
  challenge: string;
  rp: { name: string; id?: string };
  user: { id: string; name: string; displayName?: string };
  pubKeyCredParams: Array<{ type: "public-key"; alg: number }>;
  timeout?: number;
  excludeCredentials?: Array<{
    type: "public-key";
    id: string;
    transports?: AuthenticatorTransport[];
  }>;
  authenticatorSelection?: PublicKeyCredentialCreationOptions["authenticatorSelection"];
  attestation?: "none" | "indirect" | "direct" | "enterprise";
  extensions?: AuthenticationExtensionsClientInputs;
};

export type AuthnVerifyBody = {
  id: string;
  rawId: string;
  type: string;
  clientDataJSON: string;
  authenticatorData: string;
  signature: string;
  userHandle?: string | null;
};

export type RegVerifyBody = {
  id: string;
  rawId: string;
  type: string;
  clientDataJSON: string;
  attestationObject?: string;
  // transports are optional metadata; we can live without them
  transports?: AuthenticatorTransport[];
};

export type OptionsOK<T> = {
  ok: true;
  options: T;
  bridgeId?: string | null;
  debugUrl?: string | null;
};

export type OptionsErr = {
  ok: false;
  error?: string;
  message?: string;
};

export type AuthnOptionsResponse =
  | OptionsOK<PublicKeyCredentialRequestOptionsJSON>
  | OptionsErr;

export type RegOptionsResponse =
  | OptionsOK<PublicKeyCredentialCreationOptionsJSON>
  | OptionsErr;

/* ----------------------- Base64URL helpers ----------------------- */

export function b64urlToArrayBuffer(b64url: string): ArrayBuffer {
  const padding = "=".repeat((4 - (b64url.length % 4)) % 4);
  const base64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + padding;

  const binary =
    typeof atob !== "undefined"
      ? atob(base64)
      : Buffer.from(base64, "base64").toString("binary");

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function arrayBufferToB64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(binary, "binary").toString("base64");

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/* ----------------------------- Fetch ----------------------------- */

type JsonErrorShape = {
  error?: string;
  message?: string;
};

function toApiUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return api.url(input);
  }

  if (input instanceof URL) {
    return api.url(input.toString());
  }

  // Fallback: let Request/RequestInfo stringify itself
  return api.url(String(input as unknown));
}

export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const finalUrl = toApiUrl(input);

  const res = await fetch(finalUrl, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") ?? "";
  const body: unknown = ct.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text();

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;

    if (typeof body === "string" && body.trim()) {
      msg = body;
    } else if (body && typeof body === "object") {
      const shaped = body as JsonErrorShape;
      msg = shaped.error ?? shaped.message ?? msg;
    }

    throw new Error(msg);
  }

  return body as T;
}

/** Try a list of URLs in order; return first successful JSON */
export async function tryEndpoints<T = unknown>(
  paths: string[],
  init?: RequestInit,
): Promise<T> {
  let lastErr: unknown = null;

  for (const p of paths) {
    try {
      return await fetchJson<T>(p, init);
    } catch (err) {
      lastErr = err;
    }
  }

  if (lastErr instanceof Error) {
    throw lastErr;
  }
  throw new Error("All endpoints failed");
}

/* ---------------------- WebAuthn conversions --------------------- */

export function decodeRequestOptions(
  json: PublicKeyCredentialRequestOptionsJSON,
): PublicKeyCredentialRequestOptions {
  const allowCreds = (json.allowCredentials ?? []).map((c) => ({
    type: "public-key" as const,
    id: b64urlToArrayBuffer(c.id),
    transports: c.transports,
  }));

  return {
    ...json,
    challenge: b64urlToArrayBuffer(json.challenge),
    allowCredentials:
      allowCreds as unknown as PublicKeyCredentialRequestOptions["allowCredentials"],
  };
}

export function decodeCreationOptions(
  json: PublicKeyCredentialCreationOptionsJSON,
): PublicKeyCredentialCreationOptions {
  const excludeCreds = (json.excludeCredentials ?? []).map((cred) => ({
    type: "public-key" as const,
    id: b64urlToArrayBuffer(cred.id),
    transports: cred.transports,
  }));

  const { challenge, user, ...rest } = json;

  return {
    ...rest,
    challenge: b64urlToArrayBuffer(challenge),
    user: {
      id: b64urlToArrayBuffer(user.id),
      name: user.name,
      displayName: user.displayName ?? user.name,
    },
    excludeCredentials:
      excludeCreds as unknown as PublicKeyCredentialCreationOptions["excludeCredentials"],
  };
}

/* -------------------- WebAuthn credential flows ------------------ */

export async function performAuthentication(
  optsJson: PublicKeyCredentialRequestOptionsJSON,
): Promise<AuthnVerifyBody> {
  const publicKey = decodeRequestOptions(optsJson);
  const cred = (await navigator.credentials.get({
    publicKey,
  })) as PublicKeyCredential | null;

  if (!cred) {
    throw new Error("No credential returned");
  }

  const resp = cred.response as AuthenticatorAssertionResponse;

  return {
    id: cred.id,
    rawId: arrayBufferToB64url(cred.rawId),
    type: cred.type,
    clientDataJSON: arrayBufferToB64url(resp.clientDataJSON),
    authenticatorData: arrayBufferToB64url(resp.authenticatorData),
    signature: arrayBufferToB64url(resp.signature),
    userHandle: resp.userHandle
      ? arrayBufferToB64url(resp.userHandle)
      : null,
  };
}

export async function performRegistration(
  optsJson: PublicKeyCredentialCreationOptionsJSON,
): Promise<RegVerifyBody> {
  const publicKey = decodeCreationOptions(optsJson);
  const cred = (await navigator.credentials.create({
    publicKey,
  })) as PublicKeyCredential | null;

  if (!cred) {
    throw new Error("No credential returned");
  }

  const resp = cred.response as AuthenticatorAttestationResponse;

  return {
    id: cred.id,
    rawId: arrayBufferToB64url(cred.rawId),
    type: cred.type,
    clientDataJSON: arrayBufferToB64url(resp.clientDataJSON),
    attestationObject: arrayBufferToB64url(resp.attestationObject),
    // transports intentionally omitted (not critical for our flows)
  };
}

/* ------------------------- Session helpers ------------------------ */

export async function hydrateSession(): Promise<void> {
  try {
    await fetchJson("/api/me", { method: "GET" });
  } catch {
    // best-effort; ignore errors
  }
}

export function isEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim());
}

export function parseContact(
  raw: string,
): { method: "email" | "phone"; value: string } | null {
  const s = raw.trim();
  if (!s) return null;

  if (isEmail(s)) {
    return { method: "email", value: s.toLowerCase() };
  }

  const digits = s.replace(/[^\d+]/g, "");
  if (/^\+?\d{8,15}$/.test(digits)) {
    return {
      method: "phone",
      value: digits.startsWith("+") ? digits : `+${digits}`,
    };
  }

  return null;
}

/* ------------------------- Endpoint groups ------------------------ */
/** Preferred BFF (same-origin) paths; then direct new (/passkey/*); then legacy */
export const Endpoints = {
  auth: {
    options: [
      "/session/webauthn/authentication/options",
      "/api/passkey/auth/options",
      "/api/webauthn/authentication/options",
    ],
    verify: [
      "/session/webauthn/authentication/verify",
      "/api/passkey/auth/verify",
      "/api/webauthn/authentication/verify",
    ],
  },
  register: {
    options: [
      "/session/webauthn/registration/options",
      "/api/passkey/register/options",
      "/api/webauthn/registration/options",
    ],
    verify: [
      "/session/webauthn/registration/verify",
      "/api/passkey/register/verify",
      "/api/webauthn/registration/verify",
    ],
  },
};
