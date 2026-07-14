"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ActionLink({
  label,
  onClick,
  disabled,
  muted = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "inline-flex items-center gap-2 text-label font-semibold tracking-normal transition",
        disabled
          ? "cursor-not-allowed text-white/26"
          : muted
            ? "text-white/48 hover:text-white/72"
            : "text-white/86 hover:text-white active:translate-x-[1px]",
      ].join(" ")}
    >
      <span>{label}</span>
      <span aria-hidden="true" className="text-body">
        →
      </span>
    </button>
  );
}

export default function ConsentPage() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

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

  const onDecline = () => {
    if (busy) return;
    persistConsent(false);
    router.push("/");
  };

  return (
    <main className="min-h-[100svh] bg-[#070B16] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(1100px 800px at 50% 35%, rgba(120, 180, 255, 0.08), transparent 62%), radial-gradient(900px 700px at 50% 75%, rgba(150, 110, 255, 0.06), transparent 70%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-none flex-col px-4 pb-10 pt-6 sm:px-5 sm:pt-10">
        <div className="flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 opacity-90 transition hover:opacity-100"
            aria-label="Everleap home"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,226,168,0.95),rgba(255,178,58,0.9)_35%,rgba(255,116,24,0.85)_70%,rgba(255,91,46,0.8)_100%)] shadow-[0_0_18px_rgba(255,145,56,0.35)]" />
            </span>
            <span className="text-meta font-medium tracking-eyebrow text-white/70">
              EVERLEAP
            </span>
          </Link>
        </div>

        <div className="mt-10 sm:mt-14">
          <p className="text-micro tracking-eyebrow text-white/45">
            EVERLEAP · CONSENT
          </p>

          <h1 className="mt-4 text-3xl font-semibold leading-display sm:text-4xl">
            We need your permission.
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/70 sm:text-label sm:leading-7">
            Everleap uses what you share to personalize guidance, ideas, and
            next steps. We may rely on trusted service providers to help operate
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

          <div className="mt-10">
            <div className="flex flex-col items-start gap-4">
              <ActionLink
                label={busy ? "Continuing…" : "I agree"}
                onClick={onAgree}
                disabled={busy}
              />

              <ActionLink
                label="I do not agree"
                onClick={onDecline}
                disabled={busy}
                muted
              />
            </div>

            <div className="mt-8 h-px w-44 rounded-full bg-white/14" />
          </div>
        </div>

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