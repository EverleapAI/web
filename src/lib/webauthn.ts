/* WebAuthn browser helpers
   - Converts server JSON options ⇄ WebAuthn binary formats
   - Calls navigator.credentials.create/get
   - Serializes PublicKeyCredential back to JSON (base64url fields)
*/

export function isWebAuthnAvailable(): boolean {
  return typeof window !== "undefined" && !!(window as Window & typeof globalThis).PublicKeyCredential;
}

/* ---------- Minimal JSON types ---------- */
type Base64URLString = string;

export type PublicKeyCredentialCreationOptionsJSON = Omit<PublicKeyCredentialCreationOptions, "challenge" | "user" | "excludeCredentials"> & {
  challenge: Base64URLString;
  user: Omit<PublicKeyCredentialUserEntity, "id"> & { id: Base64URLString };
  excludeCredentials?: Array<Omit<PublicKeyCredentialDescriptor, "id"> & { id: Base64URLString }>;
};

export type PublicKeyCredentialRequestOptionsJSON = Omit<PublicKeyCredentialRequestOptions, "challenge" | "allowCredentials"> & {
  challenge: Base64URLString;
  allowCredentials?: Array<Omit<PublicKeyCredentialDescriptor, "id"> & { id: Base64URLString }>;
};

export type PublicKeyCredentialJSON =
  | string
  | number
  | boolean
  | null
  | { [k: string]: PublicKeyCredentialJSON }
  | PublicKeyCredentialJSON[];

/* -------- base64url helpers (browser) -------- */
export function bufToBase64url(buf: ArrayBuffer): Base64URLString {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64urlToBuf(b64url: string): ArrayBuffer {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(b64 + pad);
  const buf = new ArrayBuffer(bin.length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return buf;
}

/* -------- map server → WebAuthn (binary fields) -------- */
function toCreationOpts(publicKeyJSON: PublicKeyCredentialCreationOptionsJSON): PublicKeyCredentialCreationOptions {
  const { challenge, user, excludeCredentials, ...rest } = publicKeyJSON || ({} as PublicKeyCredentialCreationOptionsJSON);
  const out: PublicKeyCredentialCreationOptions = {
    ...(rest as Omit<PublicKeyCredentialCreationOptions, "challenge" | "user" | "excludeCredentials">),
    challenge: base64urlToBuf(challenge),
    user: {
      ...user,
      id: base64urlToBuf(user.id),
    },
  };

  if (Array.isArray(excludeCredentials)) {
    out.excludeCredentials = excludeCredentials.map((cred) => ({
      ...cred,
      id: base64urlToBuf(cred.id),
    }));
  }

  return out;
}

function toRequestOpts(publicKeyJSON: PublicKeyCredentialRequestOptionsJSON): PublicKeyCredentialRequestOptions {
  const { challenge, allowCredentials, ...rest } = publicKeyJSON || ({} as PublicKeyCredentialRequestOptionsJSON);
  const out: PublicKeyCredentialRequestOptions = {
    ...(rest as Omit<PublicKeyCredentialRequestOptions, "challenge" | "allowCredentials">),
    challenge: base64urlToBuf(challenge),
  };

  if (Array.isArray(allowCredentials)) {
    out.allowCredentials = allowCredentials.map((cred) => ({
      ...cred,
      id: base64urlToBuf(cred.id),
    }));
  }

  return out;
}

/* -------- serialize WebAuthn credential → JSON -------- */
export function publicKeyCredentialToJSON(input: unknown): PublicKeyCredentialJSON {
  if (input instanceof ArrayBuffer) {
    return bufToBase64url(input);
  }
  if (Array.isArray(input)) {
    return input.map((x) => publicKeyCredentialToJSON(x));
  }
  if (input && typeof input === "object") {
    const obj: Record<string, PublicKeyCredentialJSON> = {};
    for (const k of Object.keys(input as Record<string, unknown>)) {
      const v = (input as Record<string, unknown>)[k];
      // Skip functions
      if (typeof v === "function") continue;
      obj[k] = publicKeyCredentialToJSON(v as unknown);
    }
    return obj;
  }
  return input as PublicKeyCredentialJSON;
}

/* -------- Registration (create) -------- */
export async function performRegistration(
  optionsJSON: PublicKeyCredentialCreationOptionsJSON
): Promise<Record<string, PublicKeyCredentialJSON>> {
  if (!isWebAuthnAvailable()) {
    throw new Error("WebAuthn not available in this browser");
  }

  const publicKey = toCreationOpts(optionsJSON);
  const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;

  if (!cred) throw new Error("Creation was not allowed or cancelled");

  const json = publicKeyCredentialToJSON(cred) as Record<string, PublicKeyCredentialJSON>;

  // Some browsers expose transports on the attestation response
  try {
    const resp = cred.response as unknown as { getTransports?: () => string[] };
    const transports = typeof resp?.getTransports === "function" ? resp.getTransports() : undefined;
    if (transports && Array.isArray(transports) && transports.length) {
      (json.response as Record<string, unknown>) = (json.response as Record<string, unknown>) || {};
      (json.response as Record<string, unknown>)["transports"] = transports;
    }
  } catch {
    /* ignore */
  }

  // Include client extension results if present
  try {
    const exts = (cred as PublicKeyCredential).getClientExtensionResults?.();
    if (exts && Object.keys(exts).length > 0) {
      (json as Record<string, unknown>)["clientExtensionResults"] = exts as unknown;
    }
  } catch {
    /* ignore */
  }

  return json;
}

/* -------- Authentication (get) -------- */
export async function performAuthentication(
  optionsJSON: PublicKeyCredentialRequestOptionsJSON
): Promise<Record<string, PublicKeyCredentialJSON>> {
  if (!isWebAuthnAvailable()) {
    throw new Error("WebAuthn not available in this browser");
  }

  const publicKey = toRequestOpts(optionsJSON);
  const cred = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;

  if (!cred) throw new Error("Authentication was not allowed or cancelled");

  const json = publicKeyCredentialToJSON(cred) as Record<string, PublicKeyCredentialJSON>;

  // Include client extension results if present
  try {
    const exts = (cred as PublicKeyCredential).getClientExtensionResults?.();
    if (exts && Object.keys(exts).length > 0) {
      (json as Record<string, unknown>)["clientExtensionResults"] = exts as unknown;
    }
  } catch {
    /* ignore */
  }

  return json;
}
