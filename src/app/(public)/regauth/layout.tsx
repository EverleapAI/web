"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { APP_ROUTES } from "@/regauth/config";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";
import { getAuthedCached } from "@/regauth/state/session";

export default function RegAuthLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const returnTo = sanitizeReturnTo(searchParams?.get("returnTo"));

  React.useEffect(() => {
    const p = pathname ?? "";

    // Only bounce authed users from the entry page
    if (!(p === "/regauth" || p === "/regauth/")) return;

    let alive = true;

    (async () => {
      const res = await getAuthedCached();
      if (!alive) return;

      if (res.authed) {
        router.replace(returnTo || APP_ROUTES.home);
      }
    })();

    return () => {
      alive = false;
    };
  }, [router, pathname, returnTo]);

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-[#070B18] text-white">
      {/* Everleap ambient background (full-bleed) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1500px 980px at 18% 10%, rgba(86,114,255,0.16), transparent 62%)," +
            "radial-gradient(1200px 860px at 78% 18%, rgba(125,211,252,0.10), transparent 64%)," +
            "radial-gradient(1500px 980px at 50% 120%, rgba(0,0,0,0.92), transparent 52%)," +
            "linear-gradient(to bottom, rgba(7,11,24,1), rgba(5,7,15,1) 74%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.55)" }}
      />

      {/* IMPORTANT: no max-w constraint here. Pages control their own width. */}
      <div className="relative min-h-[100svh] w-full">
        <div className="mx-auto flex min-h-[100svh] w-full items-center justify-center px-4 py-10 md:px-8">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}