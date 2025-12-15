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
          />
        );
      })}
    </div>
  );
}

/* ========= Main Page ========= */

export default function LoginPage() {
  const [identifier, setIdentifier] = React.useState("");
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] =
    React.useState<GradientLevel>(3);

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
  const mutedText = dark ? "text-slate-400/90" : "text-slate-500";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No real auth for now — just go to Spotlight
    window.location.assign("/main");
  }

  return (
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

      {/* Top-right toggles (mobile-safe, like Privacy) */}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2 md:right-6 md:top-6 md:flex-row">
        <ThemeToggle activeId={themeId} onChange={setThemeId} />
        <GradientToggle
          activeLevel={gradientLevel}
          onChange={setGradientLevel}
        />
      </div>

      {/* Everleap badge */}
      <BrandBadge />

      {/* Main content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
        <section className="w-full max-w-md">
          <div
            className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
            role="region"
            aria-labelledby="login-title"
          >
            {/* Header copy */}
            <div className="mb-5">
              <p className={theme.sectionLabelClass}>Everleap · Sign in</p>

              <h1
                id="login-title"
                className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl"
              >
                Sign in securely
              </h1>

              <p className={`mt-2 text-sm ${mutedText}`}>
                Use the email or phone you shared with Everleap. If you’re new,
                we’ll still walk you into the app.
              </p>
            </div>

            {/* Simple, fake form – just routes to Spotlight */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Email or phone
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com or (555) 555-1234"
                  className={`mt-1 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition ${
                    dark
                      ? "border-slate-700/80 text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/60"
                      : "border-slate-300/80 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-400/70 bg-slate-950/5"
                  }`}
                />
              </label>

              <button
                type="submit"
                className={`mt-2 inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
                  dark
                    ? "bg-sky-400 text-slate-950 hover:bg-sky-300"
                    : "bg-sky-500 text-white hover:bg-sky-400"
                }`}
              >
                Continue to Everleap
              </button>

              <p className={`mt-2 text-[0.7rem] ${mutedText}`}>
                No passwords here—just a simple way back into your Everleap
                journey.
              </p>
            </form>
          </div>
        </section>
      </main>

      <OnboardingFooterNav />
    </div>
  );
}
