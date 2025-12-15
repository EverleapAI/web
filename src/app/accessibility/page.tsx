"use client";

import * as React from "react";
import type { CSSProperties } from "react";

import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  SpotlightThemeId,
  GradientLevel,
} from "@/theme/everleapVisuals";

/* ========= Local Theme Toggle (same pattern as Privacy) ========= */

function ThemeToggle({
  activeId,
  onChange,
}: {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/80 px-1 py-1 text-[0.65rem] shadow-sm">
      {INSIGHTS_THEMES.map((theme) => {
        const active = theme.id === activeId;
        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`h-5 w-5 rounded-full transition ${
              active
                ? "bg-sky-300 shadow-sm shadow-sky-300/60"
                : "bg-slate-800/80 hover:bg-slate-700/80"
            }`}
            aria-label={theme.label}
          />
        );
      })}
    </div>
  );
}

/* ========= Local Gradient Toggle (same pattern as Privacy) ========= */

function GradientToggle({
  activeLevel,
  onChange,
}: {
  activeLevel: GradientLevel;
  onChange: (l: GradientLevel) => void;
}) {
  const levels: GradientLevel[] = [0, 1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/80 px-1 py-1 text-[0.65rem] shadow-sm">
      {levels.map((level) => {
        const isActive = level === activeLevel;
        const isZero = level === 0;
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`flex items-center justify-center rounded-full transition ${
              isZero
                ? isActive
                  ? "h-4 w-4 border border-amber-300 bg-transparent"
                  : "h-4 w-4 border border-slate-600/80 bg-transparent hover:border-slate-400"
                : isActive
                ? "h-4 w-4 bg-amber-300 shadow-sm shadow-amber-300/60"
                : "h-4 w-4 bg-slate-800/80 hover:bg-slate-700/80"
            }`}
            aria-label={isZero ? "No gradient" : `Gradient level ${level}`}
          />
        );
      })}
    </div>
  );
}

/* ========= Main Page ========= */

export default function AccessibilityPage() {
  /* Theme + Gradient State (local, same as Privacy) */
  const [themeId, setThemeId] =
    React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] =
    React.useState<GradientLevel>(3);

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const dark = isDarkTheme(themeId);

  /* Background */
  const bgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);

  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  /* Card styles */
  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const bodyText = dark ? "text-slate-200/90" : "text-slate-700/95";
  const mutedText = dark ? "text-slate-400/90" : "text-slate-500";

  return (
    <div
      className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`}
      style={bgStyle}
    >
      {/* Ambient Blobs */}
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

      {/* Top-Right Toggles */}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2 md:right-6 md:top-6 md:flex-row">
        <ThemeToggle activeId={themeId} onChange={setThemeId} />
        <GradientToggle
          activeLevel={gradientLevel}
          onChange={setGradientLevel}
        />
      </div>

      {/* Everleap Badge */}
      <BrandBadge />

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
        <section className="w-full max-w-3xl">
          <div
            className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
            role="region"
            aria-labelledby="accessibility-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={theme.sectionLabelClass}>
                  Everleap · Accessibility
                </p>

                <h1
                  id="accessibility-title"
                  className="mt-3 mb-1 text-2xl font-semibold tracking-tight md:text-3xl"
                >
                  Accessibility
                </h1>

                <p className={`mb-2 text-sm ${mutedText}`}>
                  Everleap is for everyone. We&apos;re committed to making this
                  experience work well for as many people as possible.
                </p>
              </div>

              {/* Sign In Button (one line) */}
              <a
                href="/login"
                className={`mt-1 inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition active:scale-[0.98] ${
                  dark
                    ? "border border-slate-600/80 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                    : "border border-slate-300 bg-white/80 text-slate-800 hover:bg-slate-100"
                }`}
              >
                Sign in
              </a>
            </div>

            {/* Accessibility Content */}
            <article className="mt-3 prose prose-sm prose-invert max-w-none">
              <h2>Our commitment</h2>
              <p className={bodyText}>
                We aim to meet or exceed <strong>WCAG 2.2 AA</strong> guidelines.
                That includes keyboard operability, clear focus states,
                sufficient color contrast, motion reduction support, and helpful
                labels for screen readers.
              </p>

              <h2>What we design for</h2>
              <ul className={bodyText}>
                <li>Full keyboard navigation and visible focus</li>
                <li>Screen readers (e.g., VoiceOver, NVDA)</li>
                <li>High contrast and reduced-motion preferences</li>
                <li>Responsive layouts for phones, tablets, and desktops</li>
                <li>Clear, student-friendly language and guidance</li>
              </ul>

              <h2>Having trouble?</h2>
              <p className={bodyText}>
                If something isn&apos;t working for you, we want to know so we
                can fix it. Email{" "}
                <a href="mailto:tomtully@everleap.ai" className="underline">
                  tomtully@everleap.ai
                </a>{" "}
                with a quick description, your device or browser, and any
                assistive tech you&apos;re using.
              </p>

              <p className="text-xs opacity-60">Last updated: January 2026</p>
            </article>
          </div>
        </section>
      </main>

      <OnboardingFooterNav />
    </div>
  );
}
