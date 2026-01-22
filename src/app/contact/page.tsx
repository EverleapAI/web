// src/app/contact/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Send, ChevronRight } from "lucide-react";

type ContactMode = "support" | "feedback" | "privacy";

export default function ContactPage() {
  const [mode, setMode] = React.useState<ContactMode>("support");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const modeCopy: Record<
    ContactMode,
    { label: string; hint: string; placeholder: string }
  > = {
    support: {
      label: "Support",
      hint: "Tell us what happened.",
      placeholder: "What happened? What page were you on? Any error text?",
    },
    feedback: {
      label: "Feedback",
      hint: "Tell us what to improve.",
      placeholder: "What should Everleap add or improve?",
    },
    privacy: {
      label: "Privacy",
      hint: "Questions about data, consent, or deletion requests.",
      placeholder: "What privacy question or request do you have?",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder (intentionally not wired).
  };

  const canSubmit =
    (email.trim().length > 2 || name.trim().length > 0) &&
    message.trim().length > 0;

  const inputBase =
    "w-full rounded-2xl border px-4 py-3 text-[14px] leading-6 outline-none transition";
  const inputTheme =
    "border-white/12 bg-white/5 text-white/85 placeholder:text-white/40 focus:border-white/22 focus:ring-2 focus:ring-white/10";

  const selected = modeCopy[mode];

  return (
    <main className="min-h-[100svh] bg-[#070B16] text-white">
      {/* Minimal atmosphere: subtle, centered, non-directional (matches consent/privacy/terms). */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(1200px 900px at 50% 35%, rgba(120, 180, 255, 0.07), transparent 62%), radial-gradient(900px 700px at 50% 75%, rgba(150, 110, 255, 0.05), transparent 70%)",
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
        {/* Minimal top bar */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold tracking-wide text-white/70">
            Everleap
          </div>

          <Link
            href="/"
            className="text-xs text-white/55 transition hover:text-white/80"
          >
            Back
          </Link>
        </div>

        {/* Header */}
        <div className="mt-10 sm:mt-14">
          <p className="text-[11px] tracking-[0.25em] text-white/45">
            EVERLEAP · CONTACT
          </p>

          <h1 className="mt-4 text-3xl font-semibold leading-[1.08] sm:text-4xl">
            Contact
          </h1>

          <p className="mt-3 max-w-prose text-sm leading-6 text-white/62 sm:text-[15px] sm:leading-7">
            Send a note to the Everleap team.
          </p>
        </div>

        {/* Mode chips (minimal; no card) */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["support", "feedback", "privacy"] as ContactMode[]).map((k) => {
            const active = mode === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setMode(k)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "bg-white/12 text-white"
                    : "bg-white/6 text-white/65 hover:bg-white/10 hover:text-white/75",
                ].join(" ")}
              >
                {modeCopy[k].label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white">Send a message</h2>
          <p className="mt-2 text-[15px] leading-7 text-white/62">
            {selected.hint}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-white/50">
                  Name (optional)
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${inputBase} ${inputTheme}`}
                  placeholder="e.g., Jordan"
                  aria-label="Name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-white/50">
                  Email (optional)
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBase} ${inputTheme}`}
                  placeholder="e.g., you@example.com"
                  aria-label="Email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-white/50">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputBase} ${inputTheme} min-h-[160px] resize-none`}
                placeholder={selected.placeholder}
                aria-label="Message"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition active:scale-[0.99]",
                canSubmit
                  ? "bg-white/92 text-[#070B16] hover:bg-white shadow-sm"
                  : "cursor-not-allowed bg-white/10 text-white/35",
              ].join(" ")}
            >
              <Send className="h-4 w-4" />
              Send
            </button>

            <p className="text-xs text-white/38">
              This form isn’t wired yet.
            </p>
          </form>

          {/* Email + quick links (minimal, no cards) */}
          <div className="mt-10 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-wide text-white/55">
                EMAIL
              </div>
              <a
                href="mailto:info@everleap.ai"
                className="inline-flex items-center gap-2 text-[15px] text-white/75 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/55"
              >
                <Mail className="h-4 w-4 text-white/55" />
                info@everleap.ai
              </a>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-wide text-white/55">
                QUICK LINKS
              </div>

              <div className="space-y-1">
                <Link
                  href="/privacy"
                  className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-white/70 transition hover:bg-white/6 hover:text-white/80"
                >
                  <span>Privacy</span>
                  <ChevronRight className="h-4 w-4 text-white/35" />
                </Link>

                <Link
                  href="/terms"
                  className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-white/70 transition hover:bg-white/6 hover:text-white/80"
                >
                  <span>Terms</span>
                  <ChevronRight className="h-4 w-4 text-white/35" />
                </Link>

                <Link
                  href="/accessibility"
                  className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-white/70 transition hover:bg-white/6 hover:text-white/80"
                >
                  <span>Accessibility</span>
                  <ChevronRight className="h-4 w-4 text-white/35" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-auto pt-12 text-xs text-white/32">
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
