// web/src/lib/passkey.ts
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
  allowCredentials?: Array<{ type: "public-key"; id: string; transports?: AuthenticatorTransport[] }>;
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
  excludeCredentials?: Array<{ type: "public-key"; id: string; transports?: AuthenticatorTransport[] }>;
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
  transports?: AuthenticatorTransport[];
};

export type OptionsOK<T> = { ok: true; options: T; bridgeId?: string | null; debugUrl?: string | null };
export type OptionsErr = { ok: false; error?: string; message?: string };
export type AuthnOptionsResponse = OptionsOK<PublicKeyCredentialRequestOptionsJSON> | OptionsErr;
export type RegOptionsResponse  = OptionsOK<PublicKeyCredentialCreationOptionsJSON> | OptionsErr;

/* ----------------------- Base64URL helpers ----------------------- */

export function b64urlToArrayBuffer(b64url: string): ArrayBuffer {
  const padding = "=".repeat((4 - (b64url.length % 4)) % 4);
  const base64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + padding;
  const binary =
    typeof atob !== "undefined" ? atob(base64) : Buffer.from(base64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function arrayBufferToB64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/* ----------------------------- Fetch ----------------------------- */

export async function fetchJson<T = any>(input: RequestInfo, init?: RequestInit): Promise<T> {
  // Route through the Azure-aware URL builder
  const finalUrl =
    typeof input === "string"
      ? api.url(input)
      : api.url((input as any)?.toString?.() ?? String(input));

  const res = await fetch(finalUrl, {
    ...init,
    credentials: "include",
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json") ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok) {
    const msg =
      typeof body === "string"
        ? body
        : (body as any)?.error || (body as any)?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body as T;
}

/** Try a list of URLs in order; return first successful JSON */
export async function tryEndpoints<T = any>(paths: string[], init?: RequestInit): Promise<T> {
  let lastErr: unknown = null;
  for (const p of paths) {
    try {
      return await fetchJson<T>(p, init);
    } catch (e) {
      lastErr = e;
    }
  }
  throw (lastErr instanceof Error ? lastErr : new Error("All endpoints failed"));
}

/* ---------------------- WebAuthn conversions --------------------- */

export function decodeRequestOptions(
  json: PublicKeyCredentialRequestOptionsJSON
): PublicKeyCredentialRequestOptions {
  const allowCreds: PublicKeyCredentialDescriptor[] = (json.allowCredentials ?? []).map((c) => ({
    type: "public-key",
    id: b64urlToArrayBuffer(c.id),
    transports: c.transports,
  }));

  return {
    ...json,
    challenge: b64urlToArrayBuffer(json.challenge),
    allowCredentials: allowCreds,
  };
}

export function decodeCreationOptions(
  json: PublicKeyCredentialCreationOptionsJSON
): PublicKeyCredentialCreationOptions {
  const excludeCreds: PublicKeyCredentialDescriptor[] = (json.excludeCredentials ?? []).map((cred) => ({
    type: "public-key",
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
    excludeCredentials: excludeCreds,
  };
}

export async function performAuthentication(
  optsJson: PublicKeyCredentialRequestOptionsJSON
): Promise<AuthnVerifyBody> {
  const publicKey = decodeRequestOptions(optsJson);
  const cred = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
  if (!cred) throw new Error("No credential returned");
  const resp = cred.response as AuthenticatorAssertionResponse;
  return {
    id: cred.id,
    rawId: arrayBufferToB64url(cred.rawId),
    type: cred.type,
    clientDataJSON: arrayBufferToB64url(resp.clientDataJSON),
    authenticatorData: arrayBufferToB64url(resp.authenticatorData),
    signature: arrayBufferToB64url(resp.signature),
    userHandle: resp.userHandle ? arrayBufferToB64url(resp.userHandle) : null,
  };
}

export async function performRegistration(
  optsJson: PublicKeyCredentialCreationOptionsJSON
): Promise<RegVerifyBody> {
  const publicKey = decodeCreationOptions(optsJson);
  const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;
  if (!cred) throw new Error("No credential returned");
  const resp = cred.response as AuthenticatorAttestationResponse;
  const transports =
    typeof (resp as any).getTransports === "function" ? (resp as any).getTransports() : undefined;
  return {
    id: cred.id,
    rawId: arrayBufferToB64url(cred.rawId),
    type: cred.type,
    clientDataJSON: arrayBufferToB64url(resp.clientDataJSON),
    attestationObject: arrayBufferToB64url(resp.attestationObject),
    transports,
  };
}

/* ------------------------- Session helpers ------------------------ */

export async function hydrateSession() {
  try { await fetchJson("/api/me", { method: "GET" }); } catch {}
}

export function parseContact(raw: string): { method: "email" | "phone"; value: string } | null {
  const s = raw.trim();
  if (!s) return null;
  if (isEmail(s)) return { method: "email", value: s.toLowerCase() };
  const digits = s.replace(/[^\d+]/g, "");
  if (/^\+?\d{8,15}$/.test(digits)) return { method: "phone", value: digits.startsWith("+") ? digits : `+${digits}` };
  return null;
}

export function isEmail(input: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim());
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
