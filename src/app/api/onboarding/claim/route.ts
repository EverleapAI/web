import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${getApiBaseUrl()}/onboarding/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // forward cookies so backend sees everleap_session
        Cookie: req.headers.get("cookie") ?? "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Failed to claim onboarding" },
      { status: 500 }
    );
  }
}