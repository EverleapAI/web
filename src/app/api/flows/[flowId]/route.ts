import { NextRequest, NextResponse } from "next/server";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ flowId: string }> }
) {
  const { flowId } = await params;
  const safeId = encodeURIComponent(flowId);
  const cookie = request.headers.get("cookie") ?? "";

  const upstream = await fetch(`${getApiBaseUrl()}/flows/${safeId}`, {
    method: "GET",
    headers: {
      cookie,
    },
    cache: "no-store",
  });

  const text = await upstream.text();

  try {
    return NextResponse.json(JSON.parse(text), { status: upstream.status });
  } catch {
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "text/plain",
      },
    });
  }
}
