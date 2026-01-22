// src/app/privacy/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type TocItem = { id: string; label: string };

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function PrivacyPage() {
  const toc: TocItem[] = [
    { id: "overview", label: "Summary" },
    { id: "collect", label: "What we collect" },
    { id: "use", label: "How we use it" },
    { id: "sharing", label: "Sharing" },
    { id: "security", label: "Security" },
    { id: "choices", label: "Your choices" },
  ];

  const sections: Section[] = [
    {
      id: "overview",
      title: "Plain-English summary",
      body: (
        <div className="space-y-3">
          <p className="text-[15px] leading-7 text-white/70">
            We use your information to run Everleap and personalize your
            experience. We don’t sell your personal information.
          </p>
          <div className="space-y-2 text-[15px] leading-7 text-white/62">
            <p>— You choose what optional questions to answer.</p>
            <p>— You can request access, export, or deletion (subject to law).</p>
            <p>— We use trusted service providers to help operate Everleap.</p>
          </div>
        </div>
      ),
    },
    {
      id: "collect",
      title: "Information we collect",
      body: (
        <div className="space-y-3">
          <p className="text-[15px] leading-7 text-white/70">
            We collect only what we need to provide and improve Everleap.
          </p>
          <div className="space-y-2 text-[15px] leading-7 text-white/62">
            <p>— Account details you provide (like name and email).</p>
            <p>— Usage data (like pages viewed and feature interactions).</p>
            <p>— Optional responses you choose to share (like goals or preferences).</p>
          </div>
        </div>
      ),
    },
    {
      id: "use",
      title: "How we use information",
      body: (
        <div className="space-y-3">
          <p className="text-[15px] leading-7 text-white/70">
            We use information to:
          </p>
          <div className="space-y-2 text-[15px] leading-7 text-white/62">
            <p>— Provide and improve Everleap.</p>
            <p>— Personalize guidance and suggestions.</p>
            <p>— Maintain safety, security, and integrity.</p>
            <p>— Respond to support requests.</p>
          </div>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "Sharing",
      body: (
        <div className="space-y-3">
          <p className="text-[15px] leading-7 text-white/70">
            We don’t sell your personal information. We may share information
            with trusted service providers who help us operate Everleap (for
            example, hosting, analytics, and customer support). They’re required
            to protect it and use it only to provide services to us.
          </p>
        </div>
      ),
    },
    {
      id: "security",
      title: "Security",
      body: (
        <div className="space-y-3">
          <p className="text-[15px] leading-7 text-white/70">
            We use industry-standard safeguards to protect information. No
            system is perfectly secure, so please use a strong password and keep
            it confidential.
          </p>
        </div>
      ),
    },
    {
      id: "choices",
      title: "Your choices",
      body: (
        <div className="space-y-4">
          <p className="text-[15px] leading-7 text-white/70">
            Depending on your region and legal requirements, you may be able to:
          </p>

          <div className="space-y-2 text-[15px] leading-7 text-white/62">
            <p>— Access, update, export, or delete your data (subject to law).</p>
            <p>— Control optional answers and personalization settings.</p>
            <p>— Opt out of non-essential communications.</p>
          </div>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/14"
            >
              Contact
              <ChevronRight className="h-4 w-4 text-white/50" />
            </Link>

            <Link
              href="/terms"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/6 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10"
            >
              Terms
              <ChevronRight className="h-4 w-4 text-white/45" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-[100svh] bg-[#070B16] text-white">
      {/* Minimal atmosphere: subtle, centered, non-directional (matches consent). */}
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
            EVERLEAP · PRIVACY
          </p>

          <h1 className="mt-4 text-3xl font-semibold leading-[1.08] sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 max-w-prose text-sm leading-6 text-white/62 sm:text-[15px] sm:leading-7">
            Clear, readable, and consistent with Everleap. For questions, visit{" "}
            <Link
              href="/contact"
              className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/55"
            >
              Contact
            </Link>
            .
          </p>
        </div>

        {/* TOC chips (minimal, optional) */}
        <div className="mt-6 flex flex-wrap gap-2">
          {toc.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToId(t.id)}
              className="rounded-full bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/65 transition hover:bg-white/10 hover:text-white/75"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8 space-y-10">
          {sections.map(({ id, title, body }) => (
            <section key={id} id={id} className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <div className="mt-3">{body}</div>
            </section>
          ))}
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
            <Link href="/accessibility" className="transition hover:text-white/55">
              Accessibility
            </Link>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-white/28">
            Last updated Oct 4, 2025
          </p>
        </div>
      </div>
    </main>
  );
}
