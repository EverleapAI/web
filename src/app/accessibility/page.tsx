// src/app/accessibility/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Accessibility,
  Keyboard,
  Contrast,
  ScreenShare,
  Sparkles,
  Mail,
  ChevronRight,
  Shield,
  FileText,
} from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import { type SpotlightThemeId, type GradientLevel } from "@/theme/everleapVisuals";

type TocItem = { id: string; label: string };

type Section = {
  id: string;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  body: React.ReactNode;
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function AccessibilityPage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

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
      title: "Plain-English Summary",
      Icon: Sparkles,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            Everleap is built for a wide range of learners and devices. We aim
            for clear language, strong contrast, and predictable navigation — so
            the experience stays calm, even when life isn’t.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Goal
            </div>
            <div className="mt-1 text-[14px] leading-6 text-white/75">
              Meet or exceed <span className="font-semibold text-white/85">WCAG 2.2 AA</span> over time.
            </div>
          </div>
        </>
      ),
    },
    {
      id: "commitment",
      title: "Our commitment",
      Icon: Accessibility,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          We design for keyboard operability, clear focus states, sufficient
          color contrast, reduced motion preferences, and screen reader-friendly
          labeling. We also aim to keep the UI simple and student-friendly.
        </p>
      ),
    },
    {
      id: "design",
      title: "What we design for",
      Icon: ScreenShare,
      body: (
        <ul className="mt-1 space-y-2">
          {[
            "Full keyboard navigation and visible focus",
            "Screen readers (VoiceOver, NVDA, TalkBack)",
            "High contrast and reduced-motion preferences",
            "Responsive layouts for phones, tablets, and desktops",
            "Clear, teen-friendly language and guidance",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
              <span className="text-[15px] leading-7 text-white/80">{t}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "tips",
      title: "Quick tips",
      Icon: Keyboard,
      body: (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
              <Keyboard className="h-4 w-4 text-white/70" />
              Keyboard
            </div>
            <div className="mt-1 text-[14px] leading-6 text-white/75">
              Use Tab / Shift+Tab to move through interactive elements. Focus
              styles should always be visible.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
              <Contrast className="h-4 w-4 text-white/70" />
              Contrast & motion
            </div>
            <div className="mt-1 text-[14px] leading-6 text-white/75">
              If motion feels distracting, enable “Reduce motion” in your device
              accessibility settings.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "support",
      title: "Having trouble?",
      Icon: Mail,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            If something isn&apos;t working for you, we want to know so we can
            fix it. Email{" "}
            <a
              href="mailto:tomtully@everleap.ai"
              className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
            >
              tomtully@everleap.ai
            </a>{" "}
            with:
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "What you were trying to do",
              "Your device + browser",
              "Any assistive tech (VoiceOver, NVDA, etc.)",
              "A screenshot if possible",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                <span className="text-[15px] leading-7 text-white/80">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Last updated
            </div>
            <div className="mt-1 text-[14px] leading-6 text-white/75">
              January 2026
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="accessibility_orb"
      ambientCap={0.35}
    >
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8">
        {/* Top header */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold tracking-wide text-white/75">
              Everleap · Accessibility
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              Updated Jan 2026
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Accessibility
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Everleap is for everyone. We&apos;re committed to building an
            experience that works well for as many people as possible.
          </p>
        </div>

        {/* Reading card */}
        <section className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/35 backdrop-blur-xl">
          {/* One subtle corner glow only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-[220px] w-[220px] rounded-full bg-gradient-to-br from-emerald-300/14 via-sky-300/10 to-transparent blur-[70px]"
          />

          <div className="relative">
            {/* Mini TOC */}
            <div className="border-b border-white/10 px-5 py-4 md:px-7">
              <div className="flex flex-wrap gap-2">
                {toc.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => scrollToId(t.id)}
                    className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/8"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-6 md:px-7 md:py-7">
              <div className="mx-auto max-w-[72ch] space-y-10">
                {sections.map(({ id, title, Icon, body }) => (
                  <section key={id} id={id} className="scroll-mt-24">
                    <div className="flex items-start gap-4">
                      {/* Section icon chip */}
                      <div className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/6">
                        <Icon className="h-5 w-5 text-white/80" />
                      </div>

                      {/* Title + rail */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-[2px] rounded-full bg-gradient-to-b from-emerald-200/60 via-white/10 to-transparent" />
                          <h2 className="text-xl font-semibold text-white">
                            {title}
                          </h2>
                        </div>
                        <div className="mt-3">{body}</div>
                      </div>
                    </div>
                  </section>
                ))}

                {/* Quick links */}
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Related
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <Link
                      href="/privacy"
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75 hover:bg-white/8"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Shield className="h-4 w-4 text-white/55" />
                        Privacy
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/35" />
                    </Link>

                    <Link
                      href="/terms"
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75 hover:bg-white/8"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FileText className="h-4 w-4 text-white/55" />
                        Terms
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/35" />
                    </Link>
                  </div>
                </div>

                {/* Contact note */}
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Need help?
                  </div>
                  <div className="mt-1 text-[14px] leading-6 text-white/75">
                    You can also reach us through{" "}
                    <Link
                      href="/contact"
                      className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
                    >
                      Contact
                    </Link>
                    .
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom nav includes Guide + + menu */}
      <BottomNav activeKey="home" themeId={themeId} gradientLevel={gradientLevel} />
    </AppChrome>
  );
}
