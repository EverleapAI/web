// src/app/accessibility/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Mail } from "lucide-react";

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

export default function AccessibilityPage() {
  const toc: TocItem[] = [
    { id: "summary", label: "Summary" },
    { id: "commitment", label: "Commitment" },
    { id: "design", label: "Design targets" },
    { id: "tips", label: "Tips" },
    { id: "support", label: "Get help" },
  ];

  const sections: Section[] = [
    {
      id: "summary",
      title: "Plain-English summary",
      body: (
        <div className="space-y-3">
          <p className="text-[15px] leading-7 text-white/70">
            Everleap is built for a wide range of learners and devices. We aim
            for clear language, strong contrast, and predictable navigation.
          </p>
          <p className="text-[15px] leading-7 text-white/62">
            Our goal is to meet or exceed{" "}
            <span className="font-semibold text-white/80">WCAG 2.2 AA</span>{" "}
            over time.
          </p>
        </div>
      ),
    },
    {
      id: "commitment",
      title: "Our commitment",
      body: (
        <p className="text-[15px] leading-7 text-white/70">
          We design for keyboard operability, clear focus states, sufficient
          color contrast, reduced motion preferences, and screen reader-friendly
          labeling. We also keep the UI simple and student-friendly.
        </p>
      ),
    },
    {
      id: "design",
      title: "What we design for",
      body: (
        <div className="space-y-2 text-[15px] leading-7 text-white/62">
          <p>— Full keyboard navigation and visible focus</p>
          <p>— Screen readers (VoiceOver, NVDA, TalkBack)</p>
          <p>— High contrast and reduced-motion preferences</p>
          <p>— Responsive layouts for phones, tablets, and desktops</p>
          <p>— Clear, teen-friendly language and guidance</p>
        </div>
      ),
    },
    {
      id: "tips",
      title: "Quick tips",
      body: (
        <div className="space-y-3">
          <div className="text-[15px] leading-7 text-white/70">
            <p className="text-white/80">Keyboard</p>
            <p className="text-white/62">
              Use Tab / Shift+Tab to move through interactive elements. Focus
              styles should always be visible.
            </p>
          </div>

          <div className="text-[15px] leading-7 text-white/70">
            <p className="text-white/80">Contrast & motion</p>
            <p className="text-white/62">
              If motion feels distracting, enable “Reduce motion” in your device
              accessibility settings.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "support",
      title: "Get help",
      body: (
        <div className="space-y-4">
          <p className="text-[15px] leading-7 text-white/70">
            If something isn’t working for you, tell us so we can fix it.
          </p>

          <a
            href="mailto:tomtully@everleap.ai"
            className="inline-flex items-center gap-2 text-[15px] text-white/75 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/55"
          >
            <Mail className="h-4 w-4 text-white/55" />
            tomtully@everleap.ai
          </a>

          <div className="space-y-2 text-[15px] leading-7 text-white/62">
            <p>— What you were trying to do</p>
            <p>— Your device + browser</p>
            <p>— Any assistive tech (VoiceOver, NVDA, etc.)</p>
            <p>— A screenshot if possible</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-[100svh] bg-[#070B16] text-white">
      {/* Minimal atmosphere: subtle, centered, non-directional (matches consent/privacy/terms/contact). */}
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
            EVERLEAP · ACCESSIBILITY
          </p>

          <h1 className="mt-4 text-3xl font-semibold leading-[1.08] sm:text-4xl">
            Accessibility
          </h1>

          <p className="mt-3 max-w-prose text-sm leading-6 text-white/62 sm:text-[15px] sm:leading-7">
            We’re committed to an experience that works well for as many people
            as possible.
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

        {/* Related + footer */}
        <div className="mt-12 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-wide text-white/55">
              RELATED
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
                href="/contact"
                className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-white/70 transition hover:bg-white/6 hover:text-white/80"
              >
                <span>Contact</span>
                <ChevronRight className="h-4 w-4 text-white/35" />
              </Link>
            </div>
          </div>

          <div className="text-xs text-white/28">
            Last updated Jan 2026
          </div>
        </div>

        {/* Footer links */}
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
