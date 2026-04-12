"use client";

import * as React from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
};

/* =============================================================================
   Props
   ============================================================================= */

export type TodayIntroProps = {
  title?: string;
  dark: boolean;
  motionEnabled: boolean;
  isTransitioning?: boolean;
  body?: string;
  primaryCtaLabel?: string;
  onPrimary?: () => void;
};

/* =============================================================================
   Unified type system
   ============================================================================= */

function eyebrowClass(dark: boolean) {
  return [
    "text-[10px] font-semibold uppercase tracking-[0.24em]",
    dark ? "text-white/36" : "text-slate-500",
  ].join(" ");
}

function heroTitleClass(dark: boolean) {
  return [
    "mt-1.5 text-[1.4rem] font-semibold leading-tight tracking-[-0.02em]",
    "sm:mt-2 sm:text-[1.65rem]",
    dark ? "text-white/74" : "text-slate-950",
  ].join(" ");
}

function heroBodyClass(dark: boolean) {
  return [
    "mt-2.5 max-w-[46rem] text-[14.5px] leading-6",
    "sm:mt-3 sm:text-[15.5px] sm:leading-7",
    "whitespace-normal break-words",
    dark ? "text-white/52" : "text-slate-800",
  ].join(" ");
}

function ctaClass(dark: boolean) {
  return [
    "group inline-flex items-center gap-2",
    "text-[1.02rem] font-medium transition",
    "sm:text-[1.05rem]",
    dark
      ? "text-teal-300/90 hover:text-teal-200"
      : "text-sky-700 hover:text-sky-900",
    "focus-visible:outline-none",
  ].join(" ");
}

function iconClass(dark: boolean) {
  return dark
    ? "h-3.5 w-3.5 text-amber-200/50"
    : "h-3.5 w-3.5 text-amber-700";
}

function defaultBody() {
  return "You’ve already helped Everleap understand your motivations, strengths, and skills, so Insights is where those signals can start turning into a clearer picture of who you are and what may fit.";
}

/* =============================================================================
   Component
   ============================================================================= */

export function TodayIntro(props: TodayIntroProps) {
  const {
    title: introTitle,
    dark,
    motionEnabled,
    body,
    primaryCtaLabel,
    onPrimary,
  } = props;

  const resolvedBody = body?.trim() || defaultBody();
  const shouldShowCta = Boolean(primaryCtaLabel && onPrimary);

  return (
    <div className="relative">
      <div className="inline-flex items-center gap-2">
        <Sparkles className={iconClass(dark)} aria-hidden />
        <div className={eyebrowClass(dark)}>Today</div>
      </div>

      <h1 className={heroTitleClass(dark)}>
        {introTitle ?? "Your direction is starting to take shape"}
      </h1>

      <p className={heroBodyClass(dark)}>{resolvedBody}</p>

      {shouldShowCta ? (
        <div className="mt-4 sm:mt-5">
          {motionEnabled ? (
            <motion.button
              type="button"
              onClick={onPrimary}
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ duration: 0.32, ease: "easeOut" }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.995 }}
              className={ctaClass(dark)}
            >
              <span>{primaryCtaLabel}</span>
              <ChevronRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-[3px]" />
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={onPrimary}
              className={ctaClass(dark)}
            >
              <span>{primaryCtaLabel}</span>
              <ChevronRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-[3px]" />
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}