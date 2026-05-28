import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getApiBaseUrl() {
  return (
    process.env.EVERLEAP_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:7071/api"
  ).replace(/\/+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${getApiBaseUrl()}/onboarding/synthesis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") ?? "",
      },
      body: JSON.stringify(body),
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