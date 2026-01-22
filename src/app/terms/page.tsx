// src/app/terms/page.tsx
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

export default function TermsPage() {
  const toc: TocItem[] = [
    { id: "summary", label: "Summary" },
    { id: "acceptance", label: "Acceptance" },
    { id: "eligibility", label: "Eligibility" },
    { id: "use", label: "Use" },
    { id: "content", label: "Content" },
    { id: "privacy", label: "Privacy" },
    { id: "thirdparty", label: "Third-party" },
    { id: "disclaimers", label: "Disclaimers" },
    { id: "liability", label: "Liability" },
    { id: "changes", label: "Changes" },
  ];

  const sections: Section[] = [
    {
      id: "summary",
      title: "Plain-English summary",
      body: (
        <div className="space-y-3">
          <p className="text-[15px] leading-7 text-white/70">
            These Terms explain the rules for using Everleap. In short:
          </p>
          <div className="space-y-2 text-[15px] leading-7 text-white/62">
            <p>— Use Everleap respectfully and legally.</p>
            <p>— You’re responsible for your account and activity.</p>
            <p>— We may update features and these Terms over time.</p>
          </div>
        </div>
      ),
    },
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          By accessing or using Everleap, you agree to these Terms. If you don’t
          agree, do not use the service.
        </p>
      ),
    },
    {
      id: "eligibility",
      title: "2. Eligibility & Accounts",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          You are responsible for keeping your account credentials secure and
          for all activity under your account. If local law requires it, a
          parent or guardian may need to consent to your use of Everleap.
        </p>
      ),
    },
    {
      id: "use",
      title: "3. Use of the Service",
      body: (
        <div className="space-y-3">
          <p className="text-[15px] leading-7 text-white/70">
            Please don’t misuse the service. For example:
          </p>
          <div className="space-y-2 text-[15px] leading-7 text-white/62">
            <p>— Don’t disrupt, overload, or interfere with the service.</p>
            <p>— Don’t attempt to access data you don’t have permission to access.</p>
            <p>— Follow applicable laws and regulations.</p>
          </div>
        </div>
      ),
    },
    {
      id: "content",
      title: "4. Content & Feedback",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          You retain ownership of content you submit. By submitting content or
          feedback, you grant us a non-exclusive license to use it to operate
          and improve Everleap.
        </p>
      ),
    },
    {
      id: "privacy",
      title: "5. Privacy",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          Your use of Everleap is subject to our{" "}
          <Link
            href="/privacy"
            className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/55"
          >
            Privacy Policy
          </Link>
          .
        </p>
      ),
    },
    {
      id: "thirdparty",
      title: "6. Third-Party Services",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          Everleap may integrate or link to third-party services. We aren’t
          responsible for their content, availability, or practices.
        </p>
      ),
    },
    {
      id: "disclaimers",
      title: "7. Disclaimers",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          The service is provided “as is” without warranties of any kind, to the
          fullest extent permitted by law.
        </p>
      ),
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          To the fullest extent permitted by law, Everleap will not be liable
          for indirect, incidental, special, consequential, or punitive damages.
        </p>
      ),
    },
    {
      id: "changes",
      title: "9. Changes to the Service or Terms",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          We may update the service or these Terms from time to time. Updates
          will be posted here with a revised date.
        </p>
      ),
    },
  ];

  return (
    <main className="min-h-[100svh] bg-[#070B16] text-white">
      {/* Minimal atmosphere: subtle, centered, non-directional (matches consent/privacy). */}
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
            EVERLEAP · TERMS
          </p>

          <h1 className="mt-4 text-3xl font-semibold leading-[1.08] sm:text-4xl">
            Terms of Service
          </h1>

          <p className="mt-3 max-w-prose text-sm leading-6 text-white/62 sm:text-[15px] sm:leading-7">
            Clear, readable terms for using Everleap. For questions, visit{" "}
            <Link
              href="/contact"
              className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/55"
            >
              Contact
            </Link>
            .
          </p>
        </div>

        {/* TOC chips */}
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
            <Link
              href="/accessibility"
              className="transition hover:text-white/55"
            >
              Accessibility
            </Link>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-white/28">
            Last updated Oct 4, 2025
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/6 px-4 py-2 text-xs font-semibold text-white/65 transition hover:bg-white/10 hover:text-white/75"
            >
              Privacy Policy
              <ChevronRight className="h-4 w-4 text-white/45" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/6 px-4 py-2 text-xs font-semibold text-white/65 transition hover:bg-white/10 hover:text-white/75"
            >
              Contact
              <ChevronRight className="h-4 w-4 text-white/45" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
