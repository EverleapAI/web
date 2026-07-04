import { NextRequest, NextResponse } from "next/server";

import { COOKIE, cookieBase, setNoStore } from "@/lib/security";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const cookie = request.headers.get("cookie") ?? "";

  const upstream = await fetch(`${getApiBaseUrl()}/prompt-lab/unlock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify(body ?? {}),
    cache: "no-store",
  });

  const text = await upstream.text();
  const parsed = (() => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  })();

  if (!upstream.ok || !parsed?.token) {
    return setNoStore(
      NextResponse.json(parsed ?? { ok: false, error: "Unlock failed." }, {
        status: upstream.status,
      })
    );
  }

  const resp = NextResponse.json({ ok: true }, { status: 200 });

  const maxAge = 24 * 60 * 60; // 24 hours, matches the unlock token's server-side expiry

  resp.cookies.set(COOKIE.PROMPT_LAB_UNLOCK, parsed.token, {
    ...cookieBase(),
    maxAge,
  });

  setNoStore(resp);

  return resp;
}
