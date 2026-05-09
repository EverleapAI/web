// src/app/api/regauth/start/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import crypto from "crypto";

type StartBody = {
  identifier?: unknown;
  returnTo?: unknown;
};

type PendingPayload = {
  v: 1;
  identifier: string;
  method: "email" | "sms";
  iat: number;
  exp: number;
};

const PENDING_COOKIE = "regauth_pending";
const PENDING_TTL_MS = 10 * 60 * 1000;

const RAW_BASE = (
  process.env.EVERLEAP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:7071/api"
).replace(/\/+$/, "");

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;

const REQUEST_EMAIL_CODE_URL = `${API_BASE}/auth/email/request-code`;
const REQUEST_SMS_CODE_URL = `${API_BASE}/auth/sms/request-code`;

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

function jsonError(message: string, status = 400): NextResponse {
  return noStore(
    NextResponse.json({ ok: false, error: message } as const, { status })
  );
}

function getSecret(): string {
  const secret = process.env.REGAUTH_COOKIE_SECRET;

  if (!secret) {
    throw new Error("Missing env REGAUTH_COOKIE_SECRET");
  }

  return secret;
}

function normalizeIdentifier(raw: string): string {
  return String(raw || "").trim().toLowerCase();
}

function isLikelyEmail(value: string): boolean {
  const s = String(value || "").trim();
  const at = s.indexOf("@");

  if (at <= 0) return false;

  const dot = s.lastIndexOf(".");
  return dot > at + 1 && dot < s.length - 1;
}

function normalizePhone(raw: string): string | null {
  const digits = String(raw || "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return null;
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

  const identifierRaw =
    typeof body.identifier === "string" ? body.identifier : "";

  const normalizedRaw = normalizeIdentifier(identifierRaw);
  const phone = normalizePhone(identifierRaw);

  const method: "email" | "sms" = isLikelyEmail(normalizedRaw)
    ? "email"
    : phone
      ? "sms"
      : "email";

  const identifier = method === "email" ? normalizedRaw : phone;

  if (!identifier) {
    return jsonError("Enter a valid email or phone number.", 400);
  }

  const targetUrl =
    method === "sms" ? REQUEST_SMS_CODE_URL : REQUEST_EMAIL_CODE_URL;

  const requestBody =
    method === "sms" ? { phone: identifier } : { email: identifier };

  let upstream: Response;

  try {
    upstream = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    return jsonError(
      `Couldn’t reach sign-in service. Target: ${targetUrl}. Error: ${String(error)}`,
      502
    );
  }

  const text = await upstream.text().catch(() => "");
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!upstream.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Couldn’t send it. Try again.";

    return jsonError(message, upstream.status);
  }

  const now = Date.now();

  const payload: PendingPayload = {
    v: 1,
    identifier,
    method,
    iat: now,
    exp: now + PENDING_TTL_MS,
  };

  let cookieValue: string;

  try {
    cookieValue = encodePending(getSecret(), payload);
  } catch {
    return jsonError("Server not configured for sign-in.", 500);
  }

  const res = NextResponse.json(
    {
      ok: true,
      method,
      destination: identifier,
    },
    { status: 200 }
  );

  res.cookies.set(PENDING_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(PENDING_TTL_MS / 1000),
  });

  return noStore(res);
}