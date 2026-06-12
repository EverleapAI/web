import { NextRequest, NextResponse } from "next/server";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params;

  if (!taskId) {
    return NextResponse.json(
      { ok: false, error: "Missing task id." },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);

  const apiBaseUrl = getApiBaseUrl();

  const cookie = request.headers.get("cookie") ?? "";

  const upstream = await fetch(
    `${apiBaseUrl}/micro-tasks/${encodeURIComponent(taskId)}/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(body ?? {}),
      cache: "no-store",
    }
  );

  const text = await upstream.text();

  try {
    return NextResponse.json(JSON.parse(text), {
      status: upstream.status,
    });
  } catch {
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "text/plain",
      },
    });
  }
}