"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, CheckSquare } from "lucide-react";

import {
  bodyText,
  cardBody,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
  headerRow,
  sectionCard,
  sectionTitle,
} from "./summaryShared";
import {
  useMicroTaskBatch,
  type MicroTaskBatchItem,
} from "@/lib/microTasks/useMicroTaskBatch";

type Props = {
  dark: boolean;
  eyebrow?: string;
  tasks: MicroTaskBatchItem[];
  hasStrongSignal: boolean;
};

function optionBase(dark: boolean, selected: boolean) {
  return [
    "w-full rounded-[14px] px-3 py-2.5 text-left transition",
    "focus-visible:outline-none",
    dark
      ? selected
        ? "bg-[linear-gradient(135deg,rgba(56,189,248,0.18)_0%,rgba(14,165,233,0.12)_100%)] ring-1 ring-sky-300/30"
        : "bg-[linear-gradient(135deg,rgba(28,48,70,0.78)_0%,rgba(24,44,68,0.82)_100%)] hover:bg-[linear-gradient(135deg,rgba(56,189,248,0.12)_0%,rgba(14,165,233,0.08)_100%)] ring-1 ring-white/6"
      : selected
        ? "bg-sky-100 ring-1 ring-sky-300"
        : "bg-white hover:bg-sky-50 ring-1 ring-black/8",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-sky-300/30"
      : "focus-visible:ring-2 focus-visible:ring-sky-500/30",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
  ].join(" ");
}

function labelClass(dark: boolean, selected: boolean) {
  if (!dark) return selected ? "text-slate-950" : "text-slate-900";
  return selected ? "text-white/90" : "text-white/78";
}

function checkWrap(dark: boolean, selected: boolean) {
  return [
    "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full transition",
    selected
      ? dark
        ? "bg-sky-300/22 text-sky-100 ring-1 ring-sky-300/30"
        : "bg-sky-500/20 text-sky-700 ring-1 ring-sky-500/30"
      : dark
        ? "bg-white/[0.035] text-white/26 ring-1 ring-white/6"
        : "bg-black/6 text-black/18 ring-1 ring-black/6",
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

export default function InsightsTinyTaskCard({
  dark,
  eyebrow = "Something I’m Wondering",
  tasks,
  hasStrongSignal,
}: Props) {
  const { current, allAnswered, canGoBack, answer, goBack, selectedIndexFor } =
    useMicroTaskBatch(tasks);

  return (
    <section
      className={[
        sectionCard(dark, "task"),
        "overflow-hidden px-3 py-3.5 sm:px-4 sm:py-4.5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(56,189,248,0.14) 0%, transparent 30%), radial-gradient(circle at 88% 100%, rgba(34,211,238,0.08) 0%, transparent 24%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "sky")}>
            <CheckSquare className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>{eyebrow}</div>
            </div>
          </div>

          {constellationOrnament(dark, "task")}
        </div>

        <div className={cardBody()}>
          {!hasStrongSignal ? (
            <>
              <div className={sectionTitle(dark)}>
                Pick the one that’s most true this week.
              </div>
              <p
                className={[
                  "mt-2.5",
                  bodyText(dark),
                  "text-[14px] leading-[1.65] sm:text-[14.5px]",
                ].join(" ")}
              >
                A Tiny Task is one small experiment. Once we have more signal,
                this turns into something simple you can actually try this
                week.
              </p>
            </>
          ) : (
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

                  <div className={sectionTitle(dark)}>{current.question}</div>

                  <div className="mt-3 space-y-2">
                    {current.options.map((label, index) => {
                      const selected = selectedIndexFor(current) === index;

                      return (
                        <motion.button
                          key={index}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => answer(index)}
                          className={optionBase(dark, selected)}
                          aria-pressed={selected}
                        >
                          <div className="flex items-center justify-between gap-2.5">
                            <div
                              className={[
                                "min-w-0 text-[13.5px] font-medium leading-5 sm:text-[14px]",
                                labelClass(dark, selected),
                              ].join(" ")}
                            >
                              {label}
                            </div>

                            <span
                              className={checkWrap(dark, selected)}
                              aria-hidden
                            >
                              {selected ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              )}
                            </span>
                          </div>
                        </motion.button>
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
                  className={[
                    bodyText(dark),
                    "text-[14px] leading-[1.65] sm:text-[14.5px]",
                  ].join(" ")}
                >
                  {allAnswered
                    ? "That's all for now."
                    : "A Tiny Task is one small experiment. Once we have more signal, this turns into something simple you can actually try this week."}
                </motion.p>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
