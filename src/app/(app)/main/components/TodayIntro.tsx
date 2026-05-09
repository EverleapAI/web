"use client";

import * as React from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { SignalWord } from "./SignalWord";

export type RecommendedNext = "motivations" | "strengths" | "skills";

const fadeIn = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
};

export type TodayIntroProps = {
  title?: string;
  dark: boolean;
  motionEnabled: boolean;
  isTransitioning?: boolean;
  body?: string;
  primaryCtaLabel?: string;
  onPrimary?: () => void;
};

function headerRow(dark: boolean) {
  return "flex items-center gap-2 mb-2";
}

function headerIconWrap(dark: boolean) {
  return [
    "flex h-4 w-4 items-center justify-center rounded-[5px]",
    dark
      ? "bg-amber-300/10 text-amber-200/70"
      : "bg-amber-500/10 text-amber-600/70",
  ].join(" ");
}

function headerTitle(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.28em]",
    dark ? "text-white/42" : "text-slate-600",
  ].join(" ");
}

function heroTitleClass(dark: boolean) {
  return [
    "text-[1.56rem] font-semibold leading-[1.08] tracking-[-0.024em]",
    "sm:text-[1.8rem]",
    dark ? "text-white/72" : "text-slate-950",
  ].join(" ");
}

function heroBodyClass(dark: boolean) {
  return [
    "mt-2.5 max-w-[46rem] text-[15px] leading-[1.72]",
    "sm:text-[15.5px]",
    "whitespace-normal break-words",
    dark ? "text-white/42" : "text-slate-800",
  ].join(" ");
}

function ctaClass(dark: boolean) {
  return [
    "group inline-flex items-center gap-2",
    "text-[14.5px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-sky-300/60 hover:text-sky-200/68"
      : "text-sky-700 hover:text-sky-900",
  ].join(" ");
}

function defaultBody() {
  return "You’ve already helped Everleap understand your motivations, strengths, and skills, so Insights is where those signals can start turning into a clearer picture of who you are and what may fit.";
}

function renderBodyWithSignalWord(body: string) {
  const match = /\bsignals\b/i.exec(body);
  if (!match || match.index === undefined) return body;

  const start = match.index;
  const end = start + match[0].length;

  return (
    <>
      {body.slice(0, start)}
      <span className="text-white/50">
        <SignalWord>{body.slice(start, end).toLowerCase()}</SignalWord>
      </span>
      {body.slice(end)}
    </>
  );
}

export function TodayIntro(props: TodayIntroProps) {
  const {
    title: introTitle,
    dark,
    motionEnabled,
    body,
    primaryCtaLabel,
    onPrimary,
  } = props;

  const resolvedBody = React.useMemo(() => {
    if (body && body.trim().length > 0) return body;

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("everleapOnboarding_v4_convo_min");
        if (raw) {
          const snapshot = JSON.parse(raw);

          const name = snapshot?.name;
          const zip = snapshot?.zip_code || snapshot?.zip;

          if (name && zip) {
            return `Alright ${name}, we’ve started mapping out how you think and what drives you. Now we can begin shaping real paths and opportunities around you — including things happening near ${zip}.`;
          }

          if (name) {
            return `Alright ${name}, we’ve started mapping out how you think and what drives you. Now we can begin turning those signals into real paths that fit you.`;
          }
        }
      } catch {}
    }

    return defaultBody();
  }, [body]);

  const shouldShowCta = Boolean(primaryCtaLabel && onPrimary);

  return (
    <div className="relative">
      <div className={headerRow(dark)}>
        <span className={headerIconWrap(dark)}>
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className={headerTitle(dark)}>Today</div>
      </div>

      <h1 className={heroTitleClass(dark)}>
        {introTitle ?? "Your direction is starting to take shape"}
      </h1>

      <p className={heroBodyClass(dark)}>
        {renderBodyWithSignalWord(resolvedBody)}
      </p>

      {shouldShowCta ? (
        <div className="mt-4.5">
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
              <ChevronRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-[3px]" />
            </motion.button>
          ) : (
            <button type="button" onClick={onPrimary} className={ctaClass(dark)}>
              <span>{primaryCtaLabel}</span>
              <ChevronRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-[3px]" />
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}