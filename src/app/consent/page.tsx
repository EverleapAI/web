"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
} from "@/theme/everleapVisuals";

/* ========= Page ========= */

export default function ConsentPage() {
  const router = useRouter();

  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[Math.min(3, GRADIENT_CONFIGS.length - 1)];

  const pageBgImage = getPageBackgroundImage(themeId);
  const pageBgStyle: CSSProperties = pageBgImage
    ? { backgroundImage: pageBgImage }
    : {};

  const dark = isDarkTheme(themeId);

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const consentCardBg = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const bodyTextClass = dark ? "text-slate-200/90" : "text-slate-700/95";
  const microTextClass = dark ? "text-slate-300/70" : "text-slate-600/70";
  const bulletDot = dark ? "bg-sky-400" : "bg-sky-600";

  const [under18, setUnder18] = React.useState(false);

  // acknowledgement micro-moment
  const [ack, setAck] = React.useState<"idle" | "acknowledging">("idle");

  const disabled = ack !== "idle";

  const handleAgree = () => {
    if (ack !== "idle") return;

    setAck("acknowledging");

    try {
      localStorage.setItem(
        "everleap_consent_v1",
        JSON.stringify({
          agreedAt: new Date().toISOString(),
          under18,
          themeId,
          gradientLevel,
        })
      );
    } catch {}

    // Slightly longer so it's clearly visible
    window.setTimeout(() => {
      router.push("/onboarding?from=consent");
    }, 900);
  };

  const handleBack = () => {
    if (disabled) return;

    // If user opened consent directly (no back stack), router.back() won't help.
    // Use a safe fallback.
    if (typeof window !== "undefined" && window.history.length <= 1) {
      router.push("/onboarding");
      return;
    }

    router.back();
  };

  const handleNotNow = () => {
    if (disabled) return;
    router.replace("/");
  };

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="consent_orb"
      ambientCap={0.35}
    >
      <div
        className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`}
        style={pageBgStyle}
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
              className={`absolute top-40 right-[-32px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
            />
          </div>
        )}

        <BrandBadge />

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
          <div className="w-full max-w-xl -translate-y-6">
            {/* Headline */}
            <div className="mb-5">
              <p className={theme.sectionLabelClass}>
                Everleap · Before we start
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                To really help you, we need your permission.
              </h1>
              <p className={`mt-2 text-sm md:text-[0.95rem] ${bodyTextClass}`}>
                Everleap learns from your answers so it can give you better
                insights and ideas. Big dreams start with small conversations —
                let&apos;s begin.
              </p>
            </div>

            {/* Consent card */}
            <section className="w-full">
              <div
                className={`relative w-full overflow-hidden rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${consentCardBg}`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={disabled}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                      dark
                        ? "text-slate-200 hover:bg-white/10"
                        : "text-slate-700 hover:bg-black/5"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>

                  <div
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-100"
                        : "border-slate-200 bg-white/80 text-slate-800"
                    }`}
                  >
                    Consent
                  </div>

                  <label
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                        : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                    } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    title="If you’re under 18, we’ll show parent/guardian info."
                  >
                    <span
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition ${
                        under18
                          ? dark
                            ? "bg-sky-400"
                            : "bg-sky-500"
                          : dark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 translate-x-0.5 rounded-full bg-white shadow transition ${
                          under18 ? "translate-x-3.5" : ""
                        }`}
                      />
                    </span>
                    <span>Under 18</span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={under18}
                      disabled={disabled}
                      onChange={(e) => setUnder18(e.target.checked)}
                      aria-label="Under 18"
                    />
                  </label>
                </div>

                {/* Bullets */}
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span
                      className={`mt-[7px] h-1.5 w-1.5 rounded-full ${bulletDot}`}
                    />
                    <span className={bodyTextClass}>
                      We store your name and contact information to keep your
                      account connected to you.
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span
                      className={`mt-[7px] h-1.5 w-1.5 rounded-full ${bulletDot}`}
                    />
                    <span className={bodyTextClass}>
                      We use your responses to generate personalized insights
                      and recommendations.
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span
                      className={`mt-[7px] h-1.5 w-1.5 rounded-full ${bulletDot}`}
                    />
                    <span className={bodyTextClass}>
                      We protect your data as described in our{" "}
                      <Link
                        href="/privacy"
                        className="underline underline-offset-2"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </li>
                </ul>

                {/* Acknowledgement */}
                {ack === "acknowledging" ? (
                  <div
                    className={`mt-5 rounded-2xl border px-4 py-3 text-xs ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-200/90"
                        : "border-slate-200 bg-white/75 text-slate-700"
                    }`}
                    aria-live="polite"
                  >
                    <div className="font-semibold">
                      Ok cool — thanks. Let’s get you set up…
                    </div>
                    <div className={`mt-1 ${microTextClass}`}>One moment…</div>
                  </div>
                ) : null}

                {/* Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handleAgree}
                    disabled={disabled}
                    className={`inline-flex w-full justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                      dark
                        ? "bg-sky-500 text-white hover:bg-sky-400"
                        : "bg-sky-500 text-white hover:bg-sky-400"
                    } ${disabled ? "opacity-70" : ""}`}
                  >
                    {disabled ? "Continuing…" : "I agree and want to continue"}
                  </button>

                  <button
                    type="button"
                    onClick={handleNotNow}
                    disabled={disabled}
                    className={`inline-flex w-full justify-center rounded-full px-6 py-3 text-sm ${
                      dark
                        ? "bg-slate-900/70 text-slate-200"
                        : "bg-white/70 text-slate-700"
                    } ${disabled ? "opacity-60" : ""}`}
                  >
                    Not now
                  </button>
                </div>

                <p className={`mt-3 text-[0.7rem] ${microTextClass}`}>
                  You can update your consent settings later.
                </p>
              </div>
            </section>
          </div>
        </main>

        <OnboardingFooterNav />
      </div>
    </AppChrome>
  );
}
