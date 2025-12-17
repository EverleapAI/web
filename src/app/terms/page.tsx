// src/app/terms/page.tsx
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

export default function TermsPage() {
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
      orbSource="terms_orb"
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

        {/* Centered layout */}
        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
          <div className="w-full max-w-4xl -translate-y-4">
            {/* Header */}
            <div className="mb-5">
              <p className={theme.sectionLabelClass}>Everleap · Terms</p>
              <h1
                id="terms-title"
                className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl"
              >
                Terms of Service
              </h1>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Last updated October 4, 2025
              </p>
            </div>

            {/* Card */}
            <section className="w-full">
              <div
                className={`relative w-full overflow-hidden rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
                role="region"
                aria-labelledby="terms-title"
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
                  {/* 1 */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      1. Acceptance of Terms
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      By accessing or using Everleap, you agree to these Terms.
                      If you do not agree, do not use the service.
                    </p>
                  </section>

                  {/* 2 */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      2. Eligibility & Accounts
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      You are responsible for your account credentials and for
                      all activity under your account. If you are under the age
                      required by local laws, you must have consent from a
                      parent or guardian.
                    </p>
                  </section>

                  {/* 3 */}
                  <section className="space-y-3">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      3. Use of the Service
                    </h2>
                    <ul className="space-y-2">
                      {[
                        "Do not misuse, disrupt, or interfere with the service.",
                        "Do not attempt to access data you do not have permission to access.",
                        "Follow all applicable laws and regulations.",
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

                  {/* 4 */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      4. Content & Feedback
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      You retain ownership of content you submit. By submitting
                      content or feedback, you grant us a non-exclusive license
                      to use it to operate and improve the service.
                    </p>
                  </section>

                  {/* 5 */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      5. Privacy
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      Your use of the service is subject to our{" "}
                      <a
                        href="/privacy"
                        className={`underline underline-offset-2 ${
                          dark ? "hover:text-sky-300" : "hover:text-sky-600"
                        }`}
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </section>

                  {/* 6 */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      6. Third-Party Services
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      We may integrate third-party services. We aren’t
                      responsible for their content or practices.
                    </p>
                  </section>

                  {/* 7 */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      7. Disclaimers
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      The service is provided “as is” without warranties of any
                      kind, to the fullest extent permitted by law.
                    </p>
                  </section>

                  {/* 8 */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      8. Limitation of Liability
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      To the fullest extent permitted by law, Everleap will not
                      be liable for indirect, incidental, special,
                      consequential, or punitive damages.
                    </p>
                  </section>

                  {/* 9 */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      9. Changes to the Service or Terms
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      We may update the service or these Terms periodically.
                      Updates will be posted here with a revised date.
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
