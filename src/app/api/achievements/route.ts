import { NextResponse } from "next/server";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie") ?? "";

    const res = await fetch(`${getApiBaseUrl()}/achievements`, {
      method: "GET",
      headers: { cookie },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to load achievements." },
      { status: 500 }
    );
  }
}
