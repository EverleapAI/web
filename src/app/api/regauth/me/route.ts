import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("regauth_session")?.value;

  const hasSession = typeof sessionValue === "string" && sessionValue.length > 0;

  if (!hasSession) {
    return NextResponse.json({ ok: true, authed: false }, { status: 200 });
  }

  return NextResponse.json(
    {
      ok: true,
      authed: true,
      user: { id: "stub", displayName: null },
    },
    { status: 200 },
  );
}
