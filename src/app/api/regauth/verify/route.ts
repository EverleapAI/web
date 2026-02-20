import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

type VerifyBody = {
  code?: unknown;
};

type PendingPayload = {
  v: 1;
  identifier: string;
  codeHash: string;
  iat: number; // epoch ms
  exp: number; // epoch ms
};

type SessionPayload = {
  v: 1;
  userId: string;
  displayName: string | null;
  identifier: string;
  iat: number; // epoch ms
  exp: number; // epoch ms
};

const PENDING_COOKIE = "regauth_pending";
const SESSION_COOKIE = "regauth_session";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DEV_CODE = "111111";

function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ ok: false, error: message } as const, { status });
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function isSixDigits(code: string): boolean {
  const d = onlyDigits(code);
  return d.length === 6;
}

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function hmacHex(secret: string, input: string): string {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const aa = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function getSecret(): string {
  const secret = process.env.REGAUTH_COOKIE_SECRET;
  if (!secret) throw new Error("Missing env REGAUTH_COOKIE_SECRET");
  return secret;
}

function decodeSigned<T>(secret: string, token: string): T | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [b64, sig] = parts;
  const expected = hmacHex(secret, b64);

  if (!timingSafeEqualStr(sig, expected)) return null;

  try {
    const json = Buffer.from(b64, "base64url").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function encodeSigned<T>(secret: string, payload: T): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, "utf8").toString("base64url");
  const sig = hmacHex(secret, b64);
  return `${b64}.${sig}`;
}

function stableUserIdFromIdentifier(identifier: string): string {
  return sha256Hex(identifier).slice(0, 24);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: VerifyBody;
  try {
    body = (await req.json()) as VerifyBody;
  } catch {
    return jsonError("Invalid request.", 400);
  }

  const codeRaw = typeof body.code === "string" ? body.code : "";
  const codeDigits = onlyDigits(codeRaw);

  if (!isSixDigits(codeDigits)) {
    return jsonError("Enter the 6-digit code.", 400);
  }

  // Dev shortcut: 111111 always passes
  const isDevOk = codeDigits === DEV_CODE;

  const pendingToken = req.cookies.get(PENDING_COOKIE)?.value;

  let pending: PendingPayload | null = null;

  if (pendingToken) {
    try {
      pending = decodeSigned<PendingPayload>(getSecret(), pendingToken);
    } catch {
      // If server isn't configured, dev code can still work (but real flow can't).
      if (!isDevOk) return jsonError("Server not configured for sign-in.", 500);
    }
  }

  const now = Date.now();

  // If not dev ok, must validate pending cookie
  if (!isDevOk) {
    if (!pending || pending.v !== 1) {
      return jsonError("That code expired. Request a new one.", 401);
    }

    if (now > pending.exp) {
      const res = jsonError("That code expired. Request a new one.", 401);
      res.cookies.set(PENDING_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    const incomingHash = sha256Hex(codeDigits);
    const ok = timingSafeEqualStr(incomingHash, pending.codeHash);

    if (!ok) {
      return jsonError("That code didn’t work. Check it and try again.", 400);
    }
  }

  // Pick identifier:
  // - normal: pending.identifier
  // - dev: use pending.identifier if present, else stable "dev"
  const identifier = pending?.identifier ?? "dev";

  const userId = stableUserIdFromIdentifier(identifier);

  const session: SessionPayload = {
    v: 1,
    userId,
    displayName: null,
    identifier,
    iat: now,
    exp: now + SESSION_TTL_MS,
  };

  let sessionToken: string;
  try {
    sessionToken = encodeSigned(getSecret(), session);
  } catch {
    // If missing secret, dev code still should not silently auth (cookies would be invalid)
    return jsonError("Server not configured for sign-in.", 500);
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });

  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });

  // Clear pending cookie once used (or if present during dev shortcut)
  res.cookies.set(PENDING_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return res;
}
