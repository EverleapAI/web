export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

function setNoStore(res: NextResponse) {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  return res;
}

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";

  // Parse cookies into a simple object (HttpOnly cookies WILL appear here via the header)
  const parsed: Record<string, string> = {};
  cookieHeader.split(/;\s*/).forEach(kv => {
    if (!kv) return;
    const idx = kv.indexOf("=");
    if (idx > -1) {
      const k = kv.slice(0, idx).trim();
      const v = kv.slice(idx + 1);
      parsed[k] = v;
    }
  });

  const res = NextResponse.json(
    {
      note: "These are the cookies your browser sent to the site for this request.",
      cookieHeader,
      parsed,
    },
    { status: 200 }
  );
  return setNoStore(res);
}
