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

/* ========= Local Theme Toggle ========= */

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

/* ========= Local Gradient Toggle ========= */

function GradientToggle({
  activeLevel,
  onChange,
}: {
  activeLevel: GradientLevel;
  onChange: (level: GradientLevel) => void;
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

export default function TermsPage() {
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

  const bgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

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

      {/* Toggles (top-right) */}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2 md:right-6 md:top-6 md:flex-row">
        <ThemeToggle activeId={themeId} onChange={setThemeId} />
        <GradientToggle
          activeLevel={gradientLevel}
          onChange={setGradientLevel}
        />
      </div>

      {/* Everleap Badge */}
      <BrandBadge />

      {/* Center block */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
        <section className="w-full max-w-3xl">
          <div
            className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
            role="region"
            aria-labelledby="terms-title"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={theme.sectionLabelClass}>Everleap · Terms</p>

                <h1
                  id="terms-title"
                  className="mt-3 mb-1 text-2xl font-semibold tracking-tight md:text-3xl"
                >
                  Terms of Service
                </h1>

                <p className={`mb-2 text-sm ${mutedText}`}>
                  Last updated October&nbsp;4,&nbsp;2025
                </p>
              </div>

              {/* Sign in pill */}
              <a
                href="/login"
                className={`mt-1 inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition active:scale-[0.98] ${
                  dark
                    ? "border border-slate-600/80 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                    : "border border-slate-300 bg-white/80 text-slate-800 hover:bg-slate-100"
                }`}
              >
                Sign in
              </a>
            </div>

            {/* Legal text */}
            <article className="mt-3 prose prose-sm prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p className={bodyText}>
                By accessing or using Everleap, you agree to these Terms. If you
                do not agree, do not use the service.
              </p>

              <h2>2. Eligibility & Accounts</h2>
              <p className={bodyText}>
                You are responsible for your account credentials and for all
                activity under your account. If you are under the age required
                by local laws, you must have consent from a parent or guardian.
              </p>

              <h2>3. Use of the Service</h2>
              <ul className={bodyText}>
                <li>Do not misuse, disrupt, or interfere with the service.</li>
                <li>
                  Do not attempt to access data you do not have permission to
                  access.
                </li>
                <li>Follow all applicable laws and regulations.</li>
              </ul>

              <h2>4. Content & Feedback</h2>
              <p className={bodyText}>
                You retain ownership of content you submit. By submitting
                content or feedback, you grant us a non-exclusive license to use
                it to operate and improve the service.
              </p>

              <h2>5. Privacy</h2>
              <p className={bodyText}>
                Your use of the service is subject to our{" "}
                <a href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </p>

              <h2>6. Third-Party Services</h2>
              <p className={bodyText}>
                We may integrate third-party services. We aren’t responsible for
                their content or practices.
              </p>

              <h2>7. Disclaimers</h2>
              <p className={bodyText}>
                The service is provided “as is” without warranties of any kind,
                to the fullest extent permitted by law.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p className={bodyText}>
                To the fullest extent permitted by law, Everleap will not be
                liable for indirect, incidental, special, consequential, or
                punitive damages.
              </p>

              <h2>9. Changes to the Service or Terms</h2>
              <p className={bodyText}>
                We may update the service or these Terms periodically. Updates
                will be posted here with a revised date.
              </p>
            </article>
          </div>
        </section>
      </main>

      <OnboardingFooterNav />
    </div>
  );
}
