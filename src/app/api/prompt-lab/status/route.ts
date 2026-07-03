import { NextRequest, NextResponse } from "next/server";

import { setNoStore } from "@/lib/security";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie") ?? "";

  const upstream = await fetch(`${getApiBaseUrl()}/prompt-lab/status`, {
    method: "GET",
    headers: { cookie },
    cache: "no-store",
  });

  const text = await upstream.text();

  try {
    return setNoStore(
      NextResponse.json(JSON.parse(text), { status: upstream.status })
    );
  } catch {
    return setNoStore(
      NextResponse.json(
        { ok: false, unlocked: false },
        { status: upstream.status }
      )
    );
  }
}
