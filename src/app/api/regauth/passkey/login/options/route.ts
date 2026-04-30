export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

const RAW_BASE = (
  process.env.EVERLEAP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:7071/api"
).replace(/\/+$/, "");

const API_BASE = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;
const TARGET_URL = `${API_BASE}/auth/passkey/login/options`;

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

export async function POST() {
  try {
    const upstream = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await upstream.text().catch(() => "");

    return noStore(
      new NextResponse(text || "{}", {
        status: upstream.status,
        headers: {
          "content-type": upstream.headers.get("content-type") || "application/json",
        },
      })
    );
  } catch {
    return noStore(
      NextResponse.json(
        { ok: false, error: "Could not start passkey sign-in." },
        { status: 502 }
      )
    );
  }
}