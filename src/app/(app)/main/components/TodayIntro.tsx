"use client";

import * as React from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =============================================================================
   Types
   ============================================================================= */

export type RecommendedNext = "motivations" | "strengths" | "skills";

/* =============================================================================
   Motion
   ============================================================================= */

const fadeIn = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 2 },
};

/* =============================================================================
   Props
   ============================================================================= */

export type TodayIntroProps = {
  title?: string;
  dark: boolean;
  motionEnabled: boolean;
  isTransitioning?: boolean;
  paragraphs: React.ReactNode[];
  primaryCtaLabel?: string;
  onPrimary?: () => void;
};

/* =============================================================================
   Unified type system
   ============================================================================= */

function eyebrowClass(dark: boolean) {
  return [
    "text-[10px] font-semibold uppercase tracking-[0.24em]",
    dark ? "text-white/40" : "text-slate-500",
  ].join(" ");
}

function heroTitleClass(dark: boolean) {
  return [
    "mt-1.5 text-[1.4rem] font-semibold leading-tight tracking-[-0.02em]",
    "sm:mt-2 sm:text-[1.65rem]",
    dark ? "text-white/82" : "text-slate-950",
  ].join(" ");
}

function heroBodyClass(dark: boolean) {
  return [
    "mt-2.5 max-w-[46rem] text-[14.5px] leading-6",
    "sm:mt-3 sm:text-[15.5px] sm:leading-7",
    dark ? "text-white/60" : "text-slate-800",
  ].join(" ");
}

function ctaClass(dark: boolean) {
  return [
    "group inline-flex items-center gap-2",
    "text-[1.02rem] font-medium transition",
    "sm:text-[1.05rem]",
    dark
      ? "text-white/66 hover:text-white/78"
      : "text-sky-700 hover:text-sky-900",
    "focus-visible:outline-none",
  ].join(" ");
}

function iconClass(dark: boolean) {
  return dark
    ? "h-3.5 w-3.5 text-amber-200/60"
    : "h-3.5 w-3.5 text-amber-700";
}

/* =============================================================================
   Component
   ============================================================================= */

export function TodayIntro(props: TodayIntroProps) {
  const {
    title: introTitle,
    dark,
    motionEnabled,
    isTransitioning = false,
    paragraphs,
    primaryCtaLabel,
    onPrimary,
  } = props;

  return (
    <div className="relative">
      <div className="inline-flex items-center gap-2">
        <Sparkles className={iconClass(dark)} aria-hidden />
        <div className={eyebrowClass(dark)}>Today</div>
      </div>

      <h1 className={heroTitleClass(dark)}>
        {introTitle ?? "Let’s start building your direction"}
      </h1>

      <div
        className={
          motionEnabled
            ? isTransitioning
              ? "opacity-70"
              : "opacity-100"
            : ""
        }
      >
        {paragraphs?.length ? (
          <div className={heroBodyClass(dark)}>
            {paragraphs.map((p, i) => (
              <p key={i} className={i > 0 ? "mt-3.5" : ""}>
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {primaryCtaLabel ? (
          <div className="mt-3 sm:mt-4">
            <AnimatePresence mode="wait" initial={false}>
              {motionEnabled ? (
                <motion.button
                  key="today_primary"
                  type="button"
                  onClick={onPrimary}
                  initial={fadeIn.initial}
                  animate={fadeIn.animate}
                  exit={fadeIn.exit}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.995 }}
                  className={ctaClass(dark)}
                >
                  <span>{primaryCtaLabel}</span>
                  <ChevronRight className="h-4 w-4 opacity-75 transition group-hover:translate-x-[3px]" />
                </motion.button>
              ) : (
                <button
                  type="button"
                  onClick={onPrimary}
                  className={ctaClass(dark)}
                >
                  <span>{primaryCtaLabel}</span>
                  <ChevronRight className="h-4 w-4 opacity-75 transition group-hover:translate-x-[3px]" />
                </button>
              )}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </div>
  );
}