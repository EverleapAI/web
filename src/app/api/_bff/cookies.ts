import { NextRequest, NextResponse } from "next/server";

/** Mark auth responses as non-cacheable and vary on Cookie */
export function setNoStore(res: NextResponse): NextResponse {
  res.headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
  return res;
}

/** Determine if current request is HTTPS (affects Secure cookie behavior) */
export function isHttps(req: NextRequest): boolean {
  return req.nextUrl.protocol === "https:";
}

/** Safely split a single combined Set-Cookie header into individual cookies */
export function splitSetCookie(raw: string): string[] {
  // Split on commas only when next token looks like NAME=
  return raw.split(/,(?=[^ ;]+=)/);
}

/** Read all Set-Cookie values (supports Undici's getSetCookie when available) */
export function getSetCookieArray(h: Headers): string[] {
  const maybe = h as unknown as { getSetCookie?: () => string[] };
  if (typeof maybe.getSetCookie === "function") {
    try {
      const arr = maybe.getSetCookie();
      if (Array.isArray(arr)) return arr;
    } catch {
      // fall through
    }
  }
  const single = h.get("set-cookie");
  return single ? splitSetCookie(single) : [];
}

/** Extract "name" and "value" from a Set-Cookie string's first pair */
export function parseNameValue(sc: string): { name: string; value: string } | null {
  const m = sc.match(/^\s*([^=;,\s]+)=([^;]+)/);
  return m ? { name: m[1], value: m[2] } : null;
}

/**
 * Drop Domain and ensure sane defaults; add Secure only when actually on HTTPS.
 * Optionally force HttpOnly for specific cookies (default: everleap_session).
 */
export function rewriteForHost(
  cookies: string[],
  secure: boolean,
  opts?: { forceHttpOnlyFor?: RegExp }
): string[] {
  const forceRx = opts?.forceHttpOnlyFor ?? /^everleap_session$/i;

  return cookies.map((cookie) => {
    let c = cookie.replace(/\s*;\s*Domain=[^;]+/gi, "");
    if (!/;\s*Path=/i.test(c)) c += "; Path=/";
    if (!/;\s*SameSite=/i.test(c)) c += "; SameSite=Lax";
    if (secure && !/;\s*Secure/i.test(c)) c += "; Secure";

    const nv = parseNameValue(c);
    if (nv && forceRx.test(nv.name) && !/;\s*HttpOnly/i.test(c)) {
      c += "; HttpOnly";
    }
    // Cleanup whitespace around semicolons
    return c.replace(/\s+;/g, ";");
  });
}

/** Build a Cookie header by merging incoming cookies with NAME=VALUE extracted from Set-Cookie values */
export function buildMergedCookieHeader(original: string, setCookies: string[]): string {
  const jar = new Map<string, string>();

  for (const part of (original || "").split(";")) {
    const m = part.trim().match(/^([^=]+)=(.*)$/);
    if (m) jar.set(m[1].trim(), m[2]);
  }
  for (const sc of setCookies) {
    const nv = parseNameValue(sc);
    if (nv) jar.set(nv.name, nv.value);
  }
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}
