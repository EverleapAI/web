// src/app/accessibility/page.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";

import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

export default function AccessibilityPage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const dark = isDarkTheme(themeId);

  const bgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const bodyText = dark ? "text-slate-200/90" : "text-slate-700/95";
  const mutedText = dark ? "text-slate-300/70" : "text-slate-600/70";
  const sectionTitleClass = dark ? "text-slate-50" : "text-slate-900";
  const bulletDot = dark ? "bg-sky-400" : "bg-sky-600";

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="accessibility_orb"
      ambientCap={0.35}
    >
      <div
        className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`}
        style={bgStyle}
      >
        {/* Ambient blobs */}
        {gradientLevel > 0 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: gradient.ambientOpacity }}
          >
            <div
              className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <div
              className={`absolute top-40 -right-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
            />
          </div>
        )}

        <BrandBadge />

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
          <div className="w-full max-w-4xl -translate-y-4">
            {/* Header */}
            <div className="mb-5">
              <p className={theme.sectionLabelClass}>Everleap · Accessibility</p>
              <h1
                id="accessibility-title"
                className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl"
              >
                Accessibility
              </h1>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Everleap is for everyone. We&apos;re committed to making this
                experience work well for as many people as possible.
              </p>
            </div>

            {/* Card */}
            <section className="w-full">
              <div
                className={`relative w-full overflow-hidden rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
                role="region"
                aria-labelledby="accessibility-title"
              >
                {/* subtle pop */}
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className={`absolute -top-10 -left-10 h-44 w-44 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${
                      dark
                        ? "from-sky-400 via-cyan-300 to-indigo-400"
                        : "from-sky-300 via-cyan-200 to-indigo-300"
                    }`}
                  />
                  <div
                    className={`absolute -bottom-14 -right-10 h-52 w-52 rounded-full blur-3xl opacity-15 bg-gradient-to-br ${
                      dark
                        ? "from-fuchsia-400 via-violet-400 to-sky-400"
                        : "from-fuchsia-200 via-violet-200 to-sky-200"
                    }`}
                  />
                </div>

                <div className="relative space-y-7">
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      Our commitment
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      We aim to meet or exceed <strong>WCAG 2.2 AA</strong>{" "}
                      guidelines. That includes keyboard operability, clear focus
                      states, sufficient color contrast, motion reduction
                      support, and helpful labels for screen readers.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      What we design for
                    </h2>
                    <ul className="space-y-2">
                      {[
                        "Full keyboard navigation and visible focus",
                        "Screen readers (e.g., VoiceOver, NVDA)",
                        "High contrast and reduced-motion preferences",
                        "Responsive layouts for phones, tablets, and desktops",
                        "Clear, student-friendly language and guidance",
                      ].map((t) => (
                        <li key={t} className="flex gap-3">
                          <span
                            className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${bulletDot}`}
                          />
                          <span className={`text-sm ${bodyText}`}>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      Having trouble?
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      If something isn&apos;t working for you, we want to know so
                      we can fix it. Email{" "}
                      <a
                        href="mailto:tomtully@everleap.ai"
                        className="underline underline-offset-2 hover:text-sky-400"
                      >
                        tomtully@everleap.ai
                      </a>{" "}
                      with a quick description, your device or browser, and any
                      assistive tech you&apos;re using.
                    </p>

                    <p className={`text-xs ${mutedText}`}>
                      Last updated: January 2026
                    </p>
                  </section>

                  {/* Bottom actions (no collision with AppChrome toggles) */}
                  <div className="pt-2">
                    <div
                      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                        dark
                          ? "border-slate-700/60 bg-slate-950/30"
                          : "border-slate-200/70 bg-white/50"
                      }`}
                    >
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                            dark ? "text-slate-300/70" : "text-slate-600/70"
                          }`}
                        >
                          Account
                        </div>
                        <div className={`mt-1 text-sm ${bodyText}`}>
                          Already have an account?
                        </div>
                      </div>

                      <a
                        href="/login"
                        className={`shrink-0 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.99] ${
                          dark
                            ? "border border-sky-400/70 bg-sky-500/85 text-white hover:bg-sky-400 shadow-sm shadow-sky-500/30"
                            : "border border-sky-500/70 bg-sky-500 text-white hover:bg-sky-400"
                        }`}
                      >
                        Sign in
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <OnboardingFooterNav />
      </div>
    </AppChrome>
  );
}
