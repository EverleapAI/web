import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.json(
    { middleware: "HIT", path: req.nextUrl.pathname },
    { status: 418 }
  );
  res.headers.set("x-everleap-mw", "hit");
  return res;
}

export const config = { matcher: ["/api/auth-check"] };
