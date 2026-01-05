// src/components/site/AppChrome.tsx
"use client";

import * as React from "react";

import {
  DEFAULT_THEME_ID,
  DEFAULT_GRADIENT_LEVEL,
  getThemeById,
  getGradientConfig,
  getPageBackgroundImage,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

type AppChromeProps = {
  title?: string;
  children: React.ReactNode;

  themeId?: SpotlightThemeId;
  gradientLevel?: GradientLevel;

  /** Some pages pass setters for in-place theme controls */
  setThemeId?: (id: SpotlightThemeId) => void;
  setGradientLevel?: (level: GradientLevel) => void;

  /** Optional identifier (analytics/debug) */
  orbSource?: string;

  /**
   * Per-page cap on ambient intensity (0..1).
   * We still clamp to a safe default so gradients stay subtle.
   */
  ambientCap?: number;

  className?: string;

  /** Accept legacy/unknown props without breaking pages */
  [key: string]: unknown;
};

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function AppChrome({
  title,
  children,
  themeId = DEFAULT_THEME_ID,
  gradientLevel = DEFAULT_GRADIENT_LEVEL,
  setThemeId: _setThemeId,
  setGradientLevel: _setGradientLevel,
  orbSource: _orbSource,
  ambientCap,
  className,
}: AppChromeProps) {
  const theme = getThemeById(themeId);
  const gradient = getGradientConfig(gradientLevel);

  /**
   * Keep ambience subtle:
   * - Start with configured ambientOpacity
   * - Apply per-page cap if provided
   * - Apply a conservative global cap (prevents bright corners / bright right wall)
   */
  const globalCap = 0.18;
  const pageCap = typeof ambientCap === "number" ? clamp01(ambientCap) : 1;
  const ambientOpacity = Math.min(
    clamp01(gradient.ambientOpacity),
    pageCap,
    globalCap
  );

  const bgImage = getPageBackgroundImage(themeId, gradientLevel);
  const showHeader = Boolean(title);

  return (
    <div
      className={[
        "relative min-h-[100svh] w-full overflow-hidden",
        theme.pageBgBaseClass,
        className ?? "",
      ].join(" ")}
      style={
        {
          backgroundImage: bgImage,
        } as React.CSSProperties
      }
    >
      {/* Ambient blobs */}
      {ambientOpacity > 0 && (
        <>
          {/* Top-left: intentionally weaker to avoid the bright-corner wash */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute -top-14 -left-14 h-[340px] w-[340px] rounded-full blur-[160px]",
              theme.ambientTopLeftClass,
            ].join(" ")}
            style={{ opacity: ambientOpacity * 0.26 }}
          />

          {/* Right side: also subtle (no big cyan wall) */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute -top-10 -right-20 h-[420px] w-[420px] rounded-full blur-[180px]",
              theme.ambientRightClass,
            ].join(" ")}
            style={{ opacity: ambientOpacity * 0.32 }}
          />
        </>
      )}

      {/* Header (ONLY when title exists) */}
      {showHeader && (
        <header className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="truncate text-[0.95rem] font-semibold text-slate-100">
                {title}
              </div>
            </div>

            {/* spacing placeholder (no controls) */}
            <div className="h-10 w-10 opacity-0" aria-hidden="true" />
          </div>
        </header>
      )}

      {/* Content */}
      <main
        className={[
          "relative z-10 mx-auto w-full max-w-5xl px-4 pb-24",
          showHeader ? "pt-3" : "pt-2",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
}
