"use client";

import { CARD_TITLE_CLASS, HEADING_STYLE } from "@/lib/ui/prose";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import {
  useMicroTaskBatch,
  type MicroTaskBatchItem,
} from "@/lib/microTasks/useMicroTaskBatch";

type Props = {
  dark: boolean;
  tasks: MicroTaskBatchItem[];
  /** Insights reuses this card verbatim and only ever relabels the eyebrow. */
  eyebrow?: string;
};

// One spot of color per theme: the app's "learn you" purple on dark, teal on
// light. Drives the orbit anchor, the eyebrow, the option ticks, and selection.
function accentRgb(dark: boolean) {
  return dark ? "182,160,255" : "13,148,136";
}

function backButtonClass(dark: boolean) {
  return [
    "mb-2 flex items-center gap-1 text-meta font-medium",
    dark
      ? "text-white/30 hover:text-white/50"
      : "text-slate-500 hover:text-slate-700",
  ].join(" ");
}

// Soft-raised pills that lift on hover — depth instead of a flat plane. Accent
// values are hard-coded per theme so the hover/selected states can live in
// classes (inline styles can't carry a hover rule).
function optionClass(dark: boolean, selected: boolean) {
  const base =
    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-label font-medium leading-5 transition-all duration-200 border hover:-translate-y-[2px] focus-visible:outline-none";
  if (dark) {
    return [
      base,
      selected
        ? "border-[rgba(182,160,255,0.55)] bg-[rgba(182,160,255,0.14)] text-white ring-1 ring-[rgba(182,160,255,0.3)] shadow-[0_8px_26px_rgba(182,160,255,0.16)]"
        : "border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] text-white/80 shadow-[0_6px_16px_rgba(0,0,0,0.22)] hover:border-[rgba(182,160,255,0.4)] hover:bg-[linear-gradient(180deg,rgba(182,160,255,0.10),rgba(255,255,255,0.02))]",
      "focus-visible:ring-2 focus-visible:ring-[rgba(182,160,255,0.25)]",
    ].join(" ");
  }
  return [
    base,
    selected
      ? "border-emerald-500 bg-slate-200 text-slate-950 ring-1 ring-emerald-500/25 shadow-[0_8px_24px_rgba(13,148,136,0.15)]"
      : "border-black/8 bg-white text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.06)] hover:border-emerald-500/30 hover:bg-emerald-50/60",
    "focus-visible:ring-2 focus-visible:ring-emerald-500/20",
  ].join(" ");
}

// The little accent tick on the left of each option — dim at rest, lights up on
// hover, fully lit when chosen.
function tickClass(dark: boolean, selected: boolean) {
  if (dark) {
    return selected
      ? "bg-[rgb(182,160,255)] shadow-[0_0_10px_rgba(182,160,255,0.7)]"
      : "bg-[rgba(182,160,255,0.28)] group-hover:bg-[rgb(182,160,255)] group-hover:shadow-[0_0_10px_rgba(182,160,255,0.7)]";
  }
  return selected
    ? "bg-[rgb(13,148,136)] shadow-[0_0_10px_rgba(13,148,136,0.5)]"
    : "bg-[rgba(13,148,136,0.3)] group-hover:bg-[rgb(13,148,136)] group-hover:shadow-[0_0_8px_rgba(13,148,136,0.5)]";
}

function labelClass(dark: boolean, selected: boolean) {
  if (!dark) return "text-slate-900";
  return selected ? "text-white/88" : "text-white/56";
}

export function TodayTinyTaskCard({
  dark,
  tasks,
  eyebrow = "Something I’m wondering",
}: Props) {
  const { current, allAnswered, canGoBack, answer, goBack, selectedIndexFor } =
    useMicroTaskBatch(tasks);

  const accent = accentRgb(dark);

  return (
    <div className="space-y-3">
      {/* Header: a tiny orbiting star as the "wondering" anchor + an accent
          eyebrow. The creative anchor that keeps the card from reading flat. */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative h-[30px] w-[30px] shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid rgba(${accent},0.35)` }}
          />
          <div
            className="absolute inset-[6px] rounded-full"
            style={{ border: `1px solid rgba(${accent},0.18)` }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `rgb(${accent})`,
              boxShadow: `0 0 10px rgba(${accent},0.9)`,
            }}
          />
          <div
            className="absolute left-1/2 top-[-1px] -ml-[1.75px] h-[3.5px] w-[3.5px] rounded-full [transform-origin:1.75px_16px] motion-safe:animate-[spin_7s_linear_infinite]"
            style={{ background: "#dfe0ff" }}
          />
        </div>
        <span
          className="text-micro font-bold uppercase tracking-eyebrow"
          style={{ color: `rgb(${accent})` }}
        >
          {eyebrow}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {canGoBack ? (
              <button
                type="button"
                onClick={goBack}
                className={backButtonClass(dark)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : null}

            <div
              className={`mb-4 w-full ${CARD_TITLE_CLASS}`}
              // The question was set at `text-read` (21px) — the same size as the
              // agent's own voice — at fontWeight 550, a weight that exists in no
              // system font and silently rounds to 400 or 600 depending on the
              // platform. So a card was speaking as loudly as the agent, in a
              // weight nobody chose. It is a card title now: the same treatment as
              // the agent's opening line, one rung down.
              style={dark ? HEADING_STYLE : { color: "#1e293b", fontWeight: 600 }}
            >
              {current.question}
            </div>

            <div className="space-y-2.5">
              {current.options.map((label, index) => {
                const selected = selectedIndexFor(current) === index;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => answer(index)}
                    className={optionClass(dark, selected)}
                    aria-pressed={selected}
                  >
                    <span
                      className={`h-5 w-[3px] shrink-0 rounded-full transition-all duration-200 ${tickClass(dark, selected)}`}
                    />
                    <span className={labelClass(dark, selected)}>{label}</span>

                    {selected ? (
                      <span
                        className={
                          dark
                            ? "ml-auto shrink-0 text-micro font-semibold uppercase tracking-eyebrow text-[rgba(182,160,255,0.85)]"
                            : "ml-auto shrink-0 text-micro font-semibold uppercase tracking-eyebrow text-emerald-700/80"
                        }
                      >
                        Helps
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="closing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={
              dark
                ? "text-meta leading-5 text-white/32"
                : "text-meta leading-5 text-slate-500"
            }
          >
            {allAnswered ? "That's all for now." : ""}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
