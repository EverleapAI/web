// apps/web/src/app/api/regauth/me/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "everleap_session";

const RAW_BASE = (
  process.env.EVERLEAP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:7071/api"
).replace(/\/+$/, "");

const API_BASE = /\/api$/i.test(RAW_BASE)
  ? RAW_BASE
  : `${RAW_BASE}/api`;

const ME_URL = `${API_BASE}/me`;

function noStore(res: NextResponse): NextResponse {
  res.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );

  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");

  return res;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse> {
  const session =
    req.cookies.get(SESSION_COOKIE)?.value;

  if (!session) {
    return noStore(
      NextResponse.json(
        {
          ok: true,
          authed: false,
        },
        { status: 200 }
      )
    );
  }

  try {
    const upstream = await fetch(ME_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie:
          `${SESSION_COOKIE}=${encodeURIComponent(session)}`,
      },
      cache: "no-store",
    });

    const data = await upstream
      .json()
      .catch(() => null);

    if (
      upstream.status === 401 ||
      !upstream.ok ||
      !data?.user
    ) {
      return noStore(
        NextResponse.json(
          {
            ok: true,
            authed: false,
          },
          { status: 200 }
        )
      );
    }

    return noStore(
      NextResponse.json(
        {
          ok: true,
          authed: true,
          user: data.user,
          onboardingAnswers:
            data.onboardingAnswers ?? {},
        },
        { status: 200 }
      )
    );
  } catch {
    return noStore(
      NextResponse.json(
        {
          ok: true,
          authed: false,
        },
        { status: 200 }
      )
    );
  }
}