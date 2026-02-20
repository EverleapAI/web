// src/app/api/regauth/start/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

type StartBody = {
  identifier?: unknown;
  returnTo?: unknown;
};

type PendingPayload = {
  v: 1;
  identifier: string;
  codeHash: string;
  iat: number; // epoch ms
  exp: number; // epoch ms
};

const PENDING_COOKIE = "regauth_pending";
const PENDING_TTL_MS = 10 * 60 * 1000; // 10 minutes

function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ ok: false, error: message } as const, { status });
}

function getSecret(): string {
  const secret = process.env.REGAUTH_COOKIE_SECRET;
  if (!secret) {
    // Fail closed in prod; in dev we still want you to notice quickly.
    throw new Error("Missing env REGAUTH_COOKIE_SECRET");
  }
  return secret;
}

function normalizeIdentifier(raw: string): string {
  const s = raw.trim();
  // Keep minimal normalization for now (email/phone). Validation can evolve later.
  return s;
}

function isReasonableIdentifier(s: string): boolean {
  if (s.length < 3) return false;
  if (s.length > 200) return false;
  return true;
}

function generateCode6(): string {
  // cryptographically strong 6-digit code
  const n = crypto.randomInt(0, 1_000_000);
  return String(n).padStart(6, "0");
}

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function hmacHex(secret: string, input: string): string {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

function encodePending(secret: string, payload: PendingPayload): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, "utf8").toString("base64url");
  const sig = hmacHex(secret, b64);
  return `${b64}.${sig}`;
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: StartBody;
  try {
    body = (await req.json()) as StartBody;
  } catch {
    return jsonError("Invalid request.", 400);
  }

  const identifierRaw = typeof body.identifier === "string" ? body.identifier : "";
  const identifier = normalizeIdentifier(identifierRaw);

  if (!isReasonableIdentifier(identifier)) {
    return jsonError("Enter a valid email or phone number.", 400);
  }

  // Generate the code (delivery is stubbed for now).
  const code = generateCode6();

  const now = Date.now();
  const payload: PendingPayload = {
    v: 1,
    identifier,
    codeHash: sha256Hex(code),
    iat: now,
    exp: now + PENDING_TTL_MS,
  };

  let cookieValue: string;
  try {
    cookieValue = encodePending(getSecret(), payload);
  } catch {
    // In production we want a clean failure if misconfigured.
    return jsonError("Server not configured for sign-in.", 500);
  }

  // In a real system: send code via SMS/email provider here.
  // For now: log it in dev to support UI testing.
  if (process.env.NODE_ENV !== "production") {
    console.info(`[regauth] dev code for ${identifier}: ${code}`);
  }

  const resBody: { ok: true; devCode?: string } = { ok: true };
  if (process.env.NODE_ENV !== "production") {
    resBody.devCode = code;
  }

  const res = NextResponse.json(resBody, { status: 200 });

  res.cookies.set(PENDING_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(PENDING_TTL_MS / 1000),
  });

  return res;
}
