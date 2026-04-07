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
  const orbBox = variant === "hero" ? "h-8 w-8 rounded-[14px]" : "h-7 w-7 rounded-xl";
  const titleSize = variant === "hero" ? "text-[11.5px]" : "text-[11px]";
  const subSize = variant === "hero" ? "text-[12.5px]" : "text-[12px]";

  return (
    <div className={cx("flex items-center gap-2.5", className)}>
      <span
        className={cx("relative", variant === "hero" ? "h-8 w-8" : "h-7 w-7")}
        aria-hidden="true"
      >
        <span
          aria-hidden="true"
          className="absolute inset-[-12px] rounded-[18px]"
          style={{
            background:
              "radial-gradient(18px 18px at 42% 38%, rgba(255,240,210,0.75), rgba(255,170,110,0.32) 55%, rgba(255,110,140,0.16) 80%, transparent 100%)",
            filter: "blur(10px)",
            opacity: 1,
          }}
        />

        <span
          className={cx("relative block overflow-hidden ring-1 ring-white/15", orbBox)}
          style={{ boxShadow: "0 12px 22px rgba(255,120,80,0.18)" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(16px 16px at 35% 35%, rgba(255,236,206,1), rgba(255,168,96,0.98) 48%, rgba(255,96,120,0.88) 78%, rgba(22,16,30,0.25) 100%)",
            }}
          />
          <span
            aria-hidden="true"
            className={cx(
              "absolute rounded-full",
              variant === "hero"
                ? "left-[7px] top-[7px] h-[7px] w-[7px]"
                : "left-[6px] top-[6px] h-[7px] w-[7px]"
            )}
            style={{ background: "rgba(255,255,255,0.55)" }}
          />
        </span>
      </span>

      <div className="min-w-0">
        <div
          className={cx(
            "font-semibold uppercase tracking-[0.26em] antialiased",
            titleSize
          )}
          style={{ color: markWordColor() }}
        >
          EVERLEAP
        </div>

        {subtitle ? (
          <div className={cx("leading-snug text-white/60", subSize)}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* =============================================================================
   Chrome
   ============================================================================= */

export type AppChromeProps = {
  children: React.ReactNode;

  themeId?: SpotlightThemeId;

  setThemeId?: React.Dispatch<React.SetStateAction<SpotlightThemeId>>;
  onThemeChange?: React.Dispatch<React.SetStateAction<SpotlightThemeId>>;

  gradientLevel?: GradientLevel;
  setGradientLevel?: React.Dispatch<React.SetStateAction<GradientLevel>>;
  onGradientChange?: React.Dispatch<React.SetStateAction<GradientLevel>>;

  orbSource?: string;
  ambientCap?: number;

  brandSubtitle?: string;
  className?: string;
};

function intensityForLevel(level: GradientLevel | undefined) {
  const n = typeof level === "number" ? level : 2;
  const v = Math.max(1, Math.min(4, n));
  if (v <= 1) return { bloom: 0.22, wash: 0.28, vignette: 0.6 };
  if (v === 2) return { bloom: 0.28, wash: 0.34, vignette: 0.64 };
  if (v === 3) return { bloom: 0.34, wash: 0.4, vignette: 0.68 };
  return { bloom: 0.4, wash: 0.46, vignette: 0.72 };
}

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

export function AppChrome({
  children,
  brandSubtitle,
  className,
  gradientLevel,
  ..._unused
}: AppChromeProps) {
  void _unused;

  const intensity = intensityForLevel(gradientLevel);

  const chromeVars: CSSVars = {
    "--el-chrome-bg": "rgba(255,255,255,0.032)",
    "--el-chrome-border": "rgba(255,255,255,0.10)",
    "--el-chrome-highlight": "rgba(255,255,255,0.12)",
    "--el-chrome-shadow": "0 18px 60px rgba(0,0,0,0.18)",
    "--el-chrome-blur": "26px",
  };

  const chromeBg = "var(--el-chrome-bg)";
  const chromeHighlight = "var(--el-chrome-highlight)";
  const chromeShadow = "var(--el-chrome-shadow)";
  const chromeBlur = "var(--el-chrome-blur)";

  return (
    <div
      className={cx("relative min-h-dvh w-full bg-slate-950 text-white", className)}
      style={chromeVars}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 800px at 30% 12%, rgba(56,189,248,0.20) 0%, rgba(0,0,0,0) 60%)," +
              "radial-gradient(900px 700px at 70% 18%, rgba(167,139,250,0.18) 0%, rgba(0,0,0,0) 62%)," +
              "radial-gradient(1000px 900px at 55% 85%, rgba(34,197,94,0.10) 0%, rgba(0,0,0,0) 58%)," +
              "linear-gradient(180deg, rgba(2,6,23,0.96) 0%, rgba(2,6,23,0.88) 40%, rgba(0,0,0,0.94) 100%)",
            opacity: intensity.wash,
          }}
        />

        <div
          className="absolute -top-40 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(56,189,248,0.30) 0%, rgba(0,0,0,0) 65%)",
            opacity: intensity.bloom,
          }}
        />
        <div
          className="absolute top-24 -left-48 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.26) 0%, rgba(0,0,0,0) 70%)",
            opacity: intensity.bloom,
          }}
        />
        <div
          className="absolute bottom-0 -right-56 h-[620px] w-[720px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 35% 55%, rgba(14,165,233,0.22) 0%, rgba(0,0,0,0) 68%)",
            opacity: intensity.bloom,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 900px at 50% 35%, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 72%)",
            opacity: intensity.vignette,
          }}
        />
      </div>

      <header
        className={cx("relative z-10 sticky top-0")}
        style={{
          background: chromeBg,
          boxShadow: chromeShadow,
          backdropFilter: `blur(${chromeBlur})`,
          WebkitBackdropFilter: `blur(${chromeBlur})`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
          style={{
            background: `linear-gradient(to bottom, ${chromeBg}, rgba(0,0,0,0))`,
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${chromeHighlight}, transparent)`,
            opacity: 0.9,
          }}
        />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-5 lg:px-6">
          <EverleapMark subtitle={brandSubtitle} />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-2 pt-2 pb-4 sm:px-4 sm:pt-2.5 md:px-6 lg:px-8 xl:px-10">
        {children}
      </main>
    </div>
  );
}

export default AppChrome;