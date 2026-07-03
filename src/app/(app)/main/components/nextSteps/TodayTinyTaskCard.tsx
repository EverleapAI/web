"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";

import {
  useMicroTaskBatch,
  type MicroTaskBatchItem,
} from "@/lib/microTasks/useMicroTaskBatch";

type Props = {
  dark: boolean;
  tasks: MicroTaskBatchItem[];
};

function headerRow() {
  return "mb-3 flex items-center gap-2";
}

function headerIconWrap(dark: boolean) {
  return [
    "flex h-4 w-4 items-center justify-center rounded-[5px]",
    dark
      ? "bg-teal-300/10 text-teal-200/70"
      : "bg-teal-500/10 text-teal-600/70",
  ].join(" ");
}

function headerTitleClass(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.28em]",
    dark ? "text-white/42" : "text-slate-600",
  ].join(" ");
}

function backButtonClass(dark: boolean) {
  return [
    "mb-2 flex items-center gap-1 text-[12px] font-medium",
    dark
      ? "text-white/40 hover:text-white/64"
      : "text-slate-500 hover:text-slate-700",
  ].join(" ");
}

function optionBase(dark: boolean, selected: boolean) {
  return [
    "w-full text-left rounded-[16px] px-4 py-3",
    "text-[14px] font-medium leading-5 transition-all duration-200",
    "border-l-4",
    "focus-visible:outline-none",
    "hover:-translate-y-[1px]",
    dark
      ? selected
        ? "border-cyan-300 bg-[linear-gradient(135deg,rgba(28,58,78,0.98)_0%,rgba(16,34,54,0.98)_100%)] text-white shadow-[0_0_24px_rgba(103,232,249,0.14)] ring-1 ring-cyan-300/35"
        : "border-transparent bg-[linear-gradient(135deg,rgba(28,48,70,0.78)_0%,rgba(24,44,68,0.82)_100%)] text-white/74 ring-1 ring-white/6 hover:bg-[linear-gradient(135deg,rgba(34,56,82,0.84)_0%,rgba(28,50,76,0.88)_100%)] hover:ring-cyan-300/12"
      : selected
        ? "border-emerald-500 bg-slate-200 text-slate-950 ring-1 ring-emerald-500/25"
        : "border-transparent bg-white text-slate-900 ring-1 ring-black/8 hover:bg-slate-50 hover:ring-emerald-500/14",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-cyan-300/20"
      : "focus-visible:ring-2 focus-visible:ring-emerald-500/20",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
  ].join(" ");
}

function labelClass(dark: boolean, selected: boolean) {
  if (!dark) return "text-slate-900";
  return selected ? "text-white" : "text-white/74";
}

export function TodayTinyTaskCard({ dark, tasks }: Props) {
  const { current, allAnswered, canGoBack, answer, goBack, selectedIndexFor } =
    useMicroTaskBatch(tasks);

  return (
    <div className="space-y-3">
      <div className="mb-1">
        <div className={headerRow()}>
          <span className={headerIconWrap(dark)}>
            <Sparkles className="h-3.5 w-3.5" />
          </span>

          <div className={headerTitleClass(dark)}>
            Something I&apos;m Wondering
          </div>
        </div>
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
              className={
                dark
                  ? "mb-4 text-[21px] font-semibold leading-[1.2] tracking-[-0.025em] text-white sm:text-[22px]"
                  : "mb-4 text-[21px] font-semibold leading-[1.2] tracking-[-0.025em] text-slate-950 sm:text-[22px]"
              }
            >
              {current.question}
            </div>

            <div className="space-y-2">
              {current.options.map((label, index) => {
                const selected = selectedIndexFor(current) === index;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => answer(index)}
                    className={optionBase(dark, selected)}
                    aria-pressed={selected}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={labelClass(dark, selected)}>
                        {label}
                      </span>

                      {selected ? (
                        <span
                          className={
                            dark
                              ? "shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80"
                              : "shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700/80"
                          }
                        >
                          Helps
                        </span>
                      ) : null}
                    </div>
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
                ? "text-[13px] leading-5 text-white/46"
                : "text-[13px] leading-5 text-slate-500"
            }
          >
            {allAnswered ? "That's all for now." : ""}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
