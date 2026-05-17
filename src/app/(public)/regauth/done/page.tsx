"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useReducedMotion, motion } from "framer-motion";

import { APP_ROUTES } from "@/regauth/config";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";
import { getAuthedCached } from "@/regauth/state/session";
import RegAuthVisual from "../components/RegAuthVisual";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function LegalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      className={cx(
        "text-white/40 underline-offset-4",
        "hover:text-white/70 hover:underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12 rounded"
      )}
    >
      {children}
    </Link>
  );
}

export default function RegAuthDonePage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const returnTo =
    sanitizeReturnTo(searchParams?.get("returnTo")) ||
    APP_ROUTES.home;

  // Only show UI if the redirect takes longer than a blink.
  const [showFallbackUI, setShowFallbackUI] =
    React.useState(false);

  React.useEffect(() => {
    if (!pathname?.startsWith("/regauth")) return;

    let alive = true;
    let fallbackT: number | null = null;

    // If we haven't navigated away quickly, show a minimal fallback.
    fallbackT = window.setTimeout(() => {
      if (!alive) return;
      setShowFallbackUI(true);
    }, prefersReducedMotion ? 0 : 260);

    (async () => {
      const me = await getAuthedCached(0);

      if (!alive) return;

      if (!me.authed) {
        router.replace(
          `/regauth?returnTo=${encodeURIComponent(
            returnTo
          )}&mode=code`
        );

        return;
      }

      // Immediate handoff. No “success screen”.
      // (Next tick helps avoid occasional layout flashes.)
      window.setTimeout(() => {
        if (!alive) return;

        router.replace(returnTo);
      }, 0);
    })();

    return () => {
      alive = false;

      if (fallbackT) {
        window.clearTimeout(fallbackT);
      }
    };
  }, [
    router,
    pathname,
    returnTo,
    prefersReducedMotion,
  ]);

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 720px at 18% 10%, rgba(86,114,255,0.18), transparent 62%)," +
            "radial-gradient(980px 680px at 78% 18%, rgba(125,211,252,0.12), transparent 64%)," +
            "radial-gradient(980px 640px at 52% 92%, rgba(255,180,120,0.12), transparent 66%)," +
            "linear-gradient(to bottom, rgba(7,11,24,1), rgba(5,7,15,1) 74%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 220px rgba(0,0,0,0.55)",
        }}
      />

      {/* Top brand */}
      <div className="relative mx-auto flex w-full max-w-6xl px-4 py-4 md:px-8 md:py-8">
        <div className="flex w-full items-start justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
            aria-label="Everleap home"
          >
            {/* Orb */}
            <span
              className="relative h-7 w-7"
              aria-hidden="true"
            >
              <span
                className="relative block h-7 w-7 overflow-hidden rounded-xl ring-1 ring-white/15"
                style={{
                  boxShadow:
                    "0 10px 18px rgba(255,120,80,0.16)",
                  background:
                    "radial-gradient(16px 16px at 35% 35%, rgba(255,236,206,1), rgba(255,168,96,0.98) 48%, rgba(255,96,120,0.88) 78%, rgba(22,16,30,0.25) 100%)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-[6px] top-[6px] h-[7px] w-[7px] rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                  }}
                />
              </span>
            </span>

            <span
              className="text-[11px] tracking-[0.26em] antialiased"
              style={{
                color: "rgba(255,214,178,0.92)",
                textShadow: "0 1px 0 rgba(0,0,0,0.25)",
              }}
            >
              EVERLEAP
            </span>
          </Link>

          <span className="sr-only">Redirecting…</span>
        </div>
      </div>

      {/* Fallback UI */}
      {showFallbackUI ? (
        <div className="relative mx-auto flex w-full max-w-6xl px-4 pb-10 md:px-8">
          <section className="w-full">
            <div className="mx-auto mt-10 max-w-md">
              <div
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
                style={{
                  boxShadow:
                    "0 30px 90px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)",
                }}
              >
                <div className="space-y-5 text-center">
                  <RegAuthVisual kind="welcome" />

                  <div className="space-y-2">
                    <div className="text-2xl font-semibold tracking-tight text-white">
                      Welcome aboard.
                    </div>

                    <div className="text-sm leading-6 text-white/60">
                      Preparing your Everleap experience…
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: "12%" }}
                    animate={{ width: "92%" }}
                    transition={{
                      duration:
                        prefersReducedMotion ? 0.01 : 0.9,
                      ease: "easeOut",
                    }}
                    style={{
                      background:
                        "rgba(165,243,252,0.55)",
                    }}
                    aria-hidden
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => router.replace(returnTo)}
                    className="text-white/65 hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12 rounded"
                  >
                    Continue
                  </button>

                  <Link
                    href={`/regauth?returnTo=${encodeURIComponent(
                      returnTo
                    )}&mode=code`}
                    className="text-white/45 hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12 rounded"
                  >
                    Try again
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-center text-[11px] text-white/36">
                <LegalLink href="/terms">
                  Terms
                </LegalLink>

                <span className="mx-2 text-white/20">
                  •
                </span>

                <LegalLink href="/privacy">
                  Privacy
                </LegalLink>

                <span className="mx-2 text-white/20">
                  •
                </span>

                <LegalLink href="/contact">
                  Contact
                </LegalLink>

                <span className="mx-2 text-white/20">
                  •
                </span>

                <LegalLink href="/accessibility">
                  Accessibility
                </LegalLink>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}