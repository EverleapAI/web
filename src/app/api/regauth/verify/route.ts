// web/src/app/api/regauth/verify/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

type VerifyBody = {
  code?: unknown;
};

type PendingPayload = {
  v: 1;
  identifier: string;
  codeHash?: string;
  iat: number;
  exp: number;
};

const PENDING_COOKIE = "regauth_pending";
const SESSION_COOKIE = "everleap_session";

const RAW_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7071/api"
).replace(/\/+$/, "");

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const VERIFY_URL = `${API_BASE}/auth/email/verify-code`;

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

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function isSixDigits(code: string): boolean {
  return onlyDigits(code).length === 6;
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

  if (!secret) {
    throw new Error("Missing env REGAUTH_COOKIE_SECRET");
  }

  return secret;
}

function decodeSigned<T>(secret: string, token: string): T | null {
  const parts = token.split(".");

  if (parts.length !== 2) return null;

  const [b64, sig] = parts;
  const expected = hmacHex(secret, b64);

  if (!timingSafeEqualStr(sig, expected)) return null;

  try {
    return JSON.parse(Buffer.from(b64, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function isLikelyEmail(value: string): boolean {
  const s = String(value || "").trim().toLowerCase();
  const at = s.indexOf("@");

  if (at <= 0) return false;

  const dot = s.lastIndexOf(".");
  return dot > at + 1 && dot < s.length - 1;
}

function getUpstreamSetCookies(upstream: Response): string[] {
  const headersAny = upstream.headers as Headers & {
    getSetCookie?: () => string[];
    raw?: () => Record<string, string[]>;
  };

  if (typeof headersAny.getSetCookie === "function") {
    return headersAny.getSetCookie();
  }

  if (typeof headersAny.raw === "function") {
    return headersAny.raw()["set-cookie"] ?? [];
  }

  const single = upstream.headers.get("set-cookie");
  return single ? [single] : [];
}

function extractCookieValue(setCookieHeader: string, cookieName: string): string | null {
  const escapedName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = setCookieHeader.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]+)`));

  return match?.[1] ?? null;
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

  const pendingToken = req.cookies.get(PENDING_COOKIE)?.value;

  if (!pendingToken) {
    return jsonError("That code expired. Request a new one.", 401);
  }

  let pending: PendingPayload | null = null;

  try {
    pending = decodeSigned<PendingPayload>(getSecret(), pendingToken);
  } catch {
    return jsonError("Server not configured for sign-in.", 500);
  }

  if (!pending || pending.v !== 1 || !pending.identifier) {
    return jsonError("That code expired. Request a new one.", 401);
  }

  if (pending.exp && Date.now() > pending.exp) {
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

  if (!isLikelyEmail(pending.identifier)) {
    return jsonError("Phone sign-in is not wired up yet. Use email.", 400);
  }

  let upstream: Response;

  try {
    upstream = await fetch(VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        email: pending.identifier.toLowerCase(),
        code: codeDigits,
      }),
    });
  } catch {
    return jsonError("Couldn’t reach sign-in service.", 502);
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
        : "That code didn’t work. Check it and try again.";

    return noStore(
      NextResponse.json({ ok: false, error: message } as const, {
        status: upstream.status,
      })
    );
  }

  const allSetCookies = getUpstreamSetCookies(upstream);

  const upstreamSessionCookie = allSetCookies.find((cookie) =>
    cookie.startsWith(`${SESSION_COOKIE}=`)
  );

  if (!upstreamSessionCookie) {
    return jsonError("Sign-in succeeded, but no session was created.", 502);
  }

  const sessionToken = extractCookieValue(upstreamSessionCookie, SESSION_COOKIE);

  if (!sessionToken) {
    return jsonError("Invalid session cookie.", 502);
  }

  const res = NextResponse.json(
    {
      ok: true,
      ...(typeof data === "object" && data !== null ? data : {}),
    },
    { status: 200 }
  );

  res.cookies.set(SESSION_COOKIE, decodeURIComponent(sessionToken), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  res.cookies.set(PENDING_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return noStore(res);
}