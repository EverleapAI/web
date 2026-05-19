import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function getApiBaseUrl() {
  return (
    process.env.EVERLEAP_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:7071/api"
  ).replace(/\/+$/, "");
}

async function verifyTurnstileToken(token: unknown, req: NextRequest) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return {
      ok: false,
      error: "Turnstile is not configured.",
    };
  }

  if (typeof token !== "string" || token.trim().length === 0) {
    return {
      ok: false,
      error: "Missing Turnstile token.",
    };
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      ok: false,
      error: "Turnstile verification failed.",
    };
  }

  const result = (await response.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  if (!result.success) {
    return {
      ok: false,
      error: "Turnstile verification failed.",
      codes: result["error-codes"] ?? [],
    };
  }

  return {
    ok: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const turnstileCheck = await verifyTurnstileToken(
      body?.turnstileToken,
      req
    );

    if (!turnstileCheck.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: turnstileCheck.error,
          codes: "codes" in turnstileCheck ? turnstileCheck.codes : undefined,
        },
        {
          status: 403,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const { turnstileToken: _turnstileToken, ...upstreamBody } = body;

    const upstream = await fetch(`${getApiBaseUrl()}/onboarding/synthesis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") ?? "",
      },
      body: JSON.stringify(upstreamBody),
      cache: "no-store",
    });

    const text = await upstream.text();

    let data: unknown;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = {
        ok: false,
        error: text || "Invalid synthesis response",
      };
    }

    return NextResponse.json(data, {
      status: upstream.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to generate onboarding synthesis",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}