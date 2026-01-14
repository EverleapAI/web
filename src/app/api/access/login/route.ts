// apps/web/src/app/api/access/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "everleap_access";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    code?: string;
    next?: string;
  };

  const expected = (process.env.EVERLEAP_ACCESS_CODE ?? "").trim();
  const provided = (body.code ?? "").trim();

  if (!expected) {
    return NextResponse.json(
      { error: "Access system not configured." },
      { status: 500 }
    );
  }

  if (!provided || provided !== expected) {
    return NextResponse.json(
      { error: "Invalid access code." },
      { status: 401 }
    );
  }

  const redirectTo =
    typeof body.next === "string" && body.next.startsWith("/")
      ? body.next
      : "/";

  const res = NextResponse.json({ redirectTo });

  // ✅ Session cookie (no maxAge/expires)
  res.cookies.set({
    name: ACCESS_COOKIE,
    value: "v1",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res;
}
