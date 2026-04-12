"use client";

import * as React from "react";
import {
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* =============================================================================
   Mark
   ============================================================================= */

export type EverleapMarkProps = {
  subtitle?: string;
  variant?: "app" | "hero";
  className?: string;
};

function markWordColor(): string {
  return "rgba(255,214,178,0.92)";
}

export function EverleapMark({
  subtitle,
  variant = "app",
  className,
}: EverleapMarkProps) {
  const orbBox =
    variant === "hero" ? "h-8 w-8 rounded-[14px]" : "h-7 w-7 rounded-xl";
  const titleSize = variant === "hero" ? "text-[11.5px]" : "text-[11px]";
  const subSize = variant === "hero" ? "text-[12.5px]" : "text-[12px]";

  return (
    <div className={cx("flex items-center gap-2.5", className)}>
      <span className={cx("relative", variant === "hero" ? "h-8 w-8" : "h-7 w-7")}>
        <span
          className="absolute inset-[-12px] rounded-[18px]"
          style={{
            background:
              "radial-gradient(18px 18px at 42% 38%, rgba(255,240,210,0.75), rgba(255,170,110,0.32) 55%, rgba(255,110,140,0.16) 80%, transparent 100%)",
            filter: "blur(10px)",
          }}
        />

        <span
          className={cx(
            "relative block overflow-hidden ring-1 ring-white/15",
            orbBox
          )}
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(16px 16px at 35% 35%, rgba(255,236,206,1), rgba(255,168,96,0.98) 48%, rgba(255,96,120,0.88) 78%, rgba(22,16,30,0.25) 100%)",
            }}
          />
        </span>
      </span>

      <div>
        <div
          className={cx(
            "font-semibold uppercase tracking-[0.26em] antialiased",
            titleSize
          )}
          style={{ color: markWordColor() }}
        >
          EVERLEAP
        </div>
        {subtitle && (
          <div className={cx("leading-snug text-white/60", subSize)}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

/* =============================================================================
   Chrome
   ============================================================================= */

export type AppChromeProps = {
  children: React.ReactNode;
  brandSubtitle?: string;
  className?: string;
  gradientLevel?: GradientLevel;
  hideHeader?: boolean;
  minimalBackground?: boolean;
  flushContent?: boolean;
};

function intensityForLevel(level: GradientLevel | undefined) {
  const v = Math.max(1, Math.min(4, level ?? 2));
  return {
    wash: 0.28 + v * 0.02,
    vignette: 0.6 + v * 0.02,
  };
}

export function AppChrome({
  children,
  brandSubtitle,
  className,
  gradientLevel,
  hideHeader = false,
  minimalBackground = false,
  flushContent = false,
}: AppChromeProps) {
  const intensity = intensityForLevel(gradientLevel);

  const rootClasses =
    "relative flex min-h-[100svh] w-full flex-col bg-slate-950 text-white";

  const contentClasses =
    hideHeader || flushContent
      ? "flex-1 px-0 pt-0 pb-0"
      : "flex-1 px-4 pt-2 pb-6 sm:px-6 lg:px-8";

  return (
    <div className={cx(rootClasses, className)}>
      {!minimalBackground && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(1100px 760px at 24% 10%, rgba(56,189,248,0.10), transparent 60%)",
                "radial-gradient(880px 660px at 76% 16%, rgba(167,139,250,0.08), transparent 60%)",
                "linear-gradient(180deg, rgba(2,6,23,0.96), rgba(0,0,0,0.96))",
              ].join(","),
              opacity: intensity.wash,
            }}
          />
        </div>
      )}

      {!hideHeader && (
        <header
          className="relative z-10"
          style={{
            background: "rgba(2,6,23,0.85)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center px-4 py-2.5">
            <EverleapMark subtitle={brandSubtitle} />
          </div>
        </header>
      )}

      <main
        className={cx(
          "relative z-10 mx-auto flex w-full flex-1 flex-col overflow-y-auto",
          contentClasses
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default AppChrome;