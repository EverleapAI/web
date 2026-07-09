import { NextResponse } from "next/server";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

// Same-origin proxy for the dev "regenerate all Today packs" backfill (the
// Function app has no CORS, so client calls must go through /api).
export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie") ?? "";
    const body = await request.text();

    const res = await fetch(`${getApiBaseUrl()}/admin/regenerate-today`, {
      method: "POST",
      headers: { cookie, "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Regenerate-all proxy failed." },
      { status: 500 }
    );
  }
}
