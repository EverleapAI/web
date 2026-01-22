// src/app/consent/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BrandBadge from "@/components/site/BrandBadge";

export default function ConsentPage() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  // NOTE:
  // We intentionally do NOT auto-skip this page, even if the user has previously consented.
  // (Per product decision: always show consent moment.)

  const persistConsent = (agreed: boolean) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        "everleap_consent_v1",
        JSON.stringify({ agreed, ts: Date.now() })
      );
    } catch {
      // ignore
    }
  };

  const onAgree = () => {
    if (busy) return;
    setBusy(true);
    persistConsent(true);
    router.push("/onboarding");
  };

  const onNotNow = () => {
    if (busy) return;
    persistConsent(false);
    router.push("/");
  };

  return (
    <main className="min-h-[100svh] bg-[#070B16] text-white">
      {/* Minimal atmosphere: subtle, centered, non-directional (no hotspot). */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(1100px 800px at 50% 35%, rgba(120, 180, 255, 0.08), transparent 62%), radial-gradient(900px 700px at 50% 75%, rgba(150, 110, 255, 0.06), transparent 70%)",
        }}
      />

      {/* Ultra-light film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col px-5 pb-10 pt-6 sm:px-8 sm:pt-10">
        {/* Minimal identity anchor */}
        <div className="flex items-center justify-between">
          <BrandBadge />
          <Link
            href="/"
            className="text-xs text-white/55 transition hover:text-white/80"
          >
            Back
          </Link>
        </div>

        {/* Content */}
        <div className="mt-10 sm:mt-14">
          <p className="text-[11px] tracking-[0.25em] text-white/45">
            EVERLEAP · CONSENT
          </p>

          <h1 className="mt-4 max-w-[26ch] text-3xl font-semibold leading-[1.08] sm:text-4xl">
            Before we begin, we need your permission.
          </h1>

          <p className="mt-4 max-w-prose text-sm leading-6 text-white/70 sm:text-[15px] sm:leading-7">
            Everleap uses what you share to personalize guidance, ideas, and next
            steps. We may rely on trusted service providers to help operate
            Everleap, as described in our{" "}
            <Link
              href="/privacy"
              className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/55"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-6 space-y-2 text-sm text-white/62">
            <p>— We store basic account information.</p>
            <p>— We use your responses to personalize your experience.</p>
            <p>
              — We protect your data as described in our{" "}
              <Link
                href="/privacy"
                className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/55"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Decision zone (no boxes; structure via whitespace) */}
          <div className="mt-10">
            <button
              type="button"
              onClick={onAgree}
              disabled={busy}
              className="h-12 w-full rounded-full bg-white/92 text-[15px] font-medium text-[#070B16] shadow-sm transition hover:bg-white disabled:opacity-60"
            >
              {busy ? "Continuing…" : "Agree and continue"}
            </button>

            <button
              type="button"
              onClick={onNotNow}
              disabled={busy}
              className="mt-3 h-12 w-full rounded-full bg-transparent text-[15px] font-medium text-white/65 transition hover:text-white disabled:opacity-60"
            >
              Not now
            </button>
          </div>
        </div>

        {/* Footer links (quiet) */}
        <div className="mt-auto pt-10 text-xs text-white/32">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacy" className="transition hover:text-white/55">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white/55">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-white/55">
              Contact
            </Link>
            <Link
              href="/accessibility"
              className="transition hover:text-white/55"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
