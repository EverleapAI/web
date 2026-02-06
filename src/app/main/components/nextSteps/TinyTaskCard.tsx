// src/app/main/components/nextSteps/TinyTaskCard.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import type {
  TinyTaskDefinition,
  TinyTaskResult,
} from "@/app/main/domain/tinyTasks";
import {
  loadTinyTaskResult,
  saveTinyTaskResult,
  clearTinyTaskResult,
  makeChoiceResult,
  makeTextResult,
} from "@/app/main/domain/tinyTasks";

/* =============================================================================
   Props
   ============================================================================= */

type Props = {
  dark: boolean;
  useLocal: boolean;

  definition: TinyTaskDefinition;

  /** Visual label shown in the UI (default: "Tiny Task") */
  label?: string;

  /** Optional hint shown under the header */
  subtitle?: string;
};

/* =============================================================================
   UI helpers
   ============================================================================= */

function ring(dark: boolean) {
  return dark ? "ring-1 ring-white/12" : "ring-1 ring-black/10";
}

function surface(dark: boolean) {
  // Slightly brighter “glass” to avoid the boxed / heavy look.
  return dark ? "bg-white/7" : "bg-white";
}

function muted(dark: boolean) {
  return dark ? "text-white/65" : "text-slate-600";
}

function text(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function softText(dark: boolean) {
  return dark ? "text-white/78" : "text-slate-700";
}

function pill(dark: boolean, selected = false) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
    "text-xs font-semibold transition active:scale-95",
    "backdrop-blur-md",
    dark
      ? "border-white/12 bg-white/8 text-white/85 hover:bg-white/12"
      : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
    selected
      ? dark
        ? "ring-1 ring-emerald-300/35"
        : "ring-1 ring-emerald-500/20"
      : "",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function chip(dark: boolean) {
  if (dark) {
    return "border-emerald-300/18 bg-emerald-300/12 text-emerald-100 shadow-[0_0_26px_rgba(52,211,153,0.14)]";
  }
  return "border-emerald-500/18 bg-emerald-500/10 text-emerald-800";
}

function relativeTime(ts: number) {
  const d = Date.now() - ts;
  const min = Math.floor(d / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

/* =============================================================================
   Component
   ============================================================================= */

export function TinyTaskCard({
  dark,
  useLocal,
  definition,
  label = "Tiny Task",
  subtitle = "5 minutes or less — quick signal that makes Everleap smarter.",
}: Props) {
  const [result, setResult] = React.useState<TinyTaskResult | null>(null);
  const [open, setOpen] = React.useState(false);

  const [textValue, setTextValue] = React.useState("");

  React.useEffect(() => {
    const r = loadTinyTaskResult(definition.pageId, { useLocal });
    setResult(r);
  }, [definition.pageId, useLocal]);

  React.useEffect(() => {
    if (!result) return;
    if (result.kind === "text") setTextValue(result.text);
  }, [result]);

  function persist(next: TinyTaskResult) {
    setResult(next);
    saveTinyTaskResult(definition.pageId, next, { useLocal });
  }

  function clear() {
    setResult(null);
    clearTinyTaskResult(definition.pageId, { useLocal });
    setTextValue("");
  }

  const isDone = !!result;

  const minutes =
    definition.minutes && Number.isFinite(definition.minutes)
      ? Math.max(1, Math.min(5, Math.round(definition.minutes)))
      : 5;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl px-5 py-4",
        ring(dark),
        surface(dark),
        "shadow-[0_16px_60px_rgba(0,0,0,0.16)]",
      ].join(" ")}
    >
      {/* Accent rail + soft lift */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400/72" />
        <div
          className={[
            "absolute -top-14 right-[-70px] h-[260px] w-[260px] rounded-full blur-3xl",
            dark ? "bg-emerald-400/16" : "bg-emerald-400/10",
          ].join(" ")}
        />
        <div
          className={[
            "absolute -bottom-16 left-[-80px] h-[280px] w-[280px] rounded-full blur-3xl",
            dark ? "bg-sky-400/10" : "bg-sky-400/8",
          ].join(" ")}
        />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
                  "text-xs font-semibold",
                  chip(dark),
                ].join(" ")}
              >
                <span aria-hidden className="opacity-90">
                  ✳
                </span>
                <span>{label}</span>
              </span>

              <span
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
                  "text-[11px] font-semibold",
                  dark
                    ? "border-white/12 bg-white/6 text-white/70"
                    : "border-black/10 bg-black/3 text-slate-700",
                ].join(" ")}
              >
                <span aria-hidden className="opacity-70">
                  ⏱
                </span>
                {minutes} min
              </span>

              {isDone ? (
                <span
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
                    "text-[11px] font-semibold",
                    dark
                      ? "border-emerald-300/18 bg-emerald-300/12 text-emerald-100"
                      : "border-emerald-500/18 bg-emerald-500/10 text-emerald-800",
                  ].join(" ")}
                >
                  <span aria-hidden className="opacity-90">
                    ✓
                  </span>
                  Done
                </span>
              ) : null}
            </div>

            <div
              className={`mt-3 text-[16px] font-semibold leading-snug ${text(
                dark
              )}`}
            >
              {definition.title}
            </div>
            <div className={`mt-1 text-sm leading-relaxed ${softText(dark)}`}>
              {definition.prompt}
            </div>

            {subtitle ? (
              <div className={`mt-2 text-xs ${muted(dark)}`}>{subtitle}</div>
            ) : null}

            {definition.profileHint ? (
              <div className={`mt-2 text-xs ${muted(dark)}`}>
                {definition.profileHint}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className={pill(dark)}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            <span aria-hidden className="opacity-80">
              {open ? "▾" : "▸"}
            </span>
            {open ? "Hide" : isDone ? "Edit" : "Do it"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="mt-4"
            >
              {/* Soft “sheet” container to reduce boxed vibes */}
              <div
                className={[
                  "relative overflow-hidden rounded-3xl border p-4",
                  "backdrop-blur-2xl",
                  dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/85",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className={[
                      "absolute -top-20 -right-24 h-72 w-72 rounded-full blur-3xl",
                      dark ? "bg-emerald-400/10" : "bg-emerald-400/8",
                    ].join(" ")}
                  />
                  <div
                    className={[
                      "absolute -bottom-24 -left-24 h-80 w-80 rounded-full blur-3xl",
                      dark ? "bg-sky-400/8" : "bg-sky-400/6",
                    ].join(" ")}
                  />
                </div>

                <div className="relative">
                  {definition.kind === "choice" ? (
                    <div className="flex flex-col gap-2">
                      {definition.options.map((opt) => {
                        const selected =
                          result?.kind === "choice" &&
                          result.choiceId === opt.id;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={[
                              "w-full text-left rounded-2xl border px-4 py-3",
                              "text-sm font-semibold transition active:scale-[0.99]",
                              "backdrop-blur-md",
                              dark
                                ? [
                                    "border-white/10",
                                    "bg-white/6",
                                    "text-white/88",
                                    "hover:bg-white/10",
                                  ].join(" ")
                                : "border-black/10 bg-white text-slate-900 hover:bg-black/2",
                              selected
                                ? dark
                                  ? "ring-2 ring-emerald-300/22 bg-white/10"
                                  : "ring-2 ring-emerald-500/18 bg-black/2"
                                : "",
                              "focus-visible:outline-none",
                              dark
                                ? "focus-visible:ring-2 focus-visible:ring-emerald-300/28"
                                : "focus-visible:ring-2 focus-visible:ring-emerald-500/18",
                            ].join(" ")}
                            onClick={() =>
                              persist(
                                makeChoiceResult({
                                  id: definition.id,
                                  pageId: definition.pageId,
                                  choiceId: opt.id,
                                })
                              )
                            }
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">{opt.label}</div>
                              <div
                                className={[
                                  "h-2.5 w-2.5 shrink-0 rounded-full",
                                  selected
                                    ? "bg-emerald-300/85 shadow-[0_0_16px_rgba(52,211,153,0.45)]"
                                    : dark
                                    ? "bg-white/18"
                                    : "bg-black/15",
                                ].join(" ")}
                                aria-hidden
                              />
                            </div>
                          </button>
                        );
                      })}

                      <div className="mt-2 flex items-center justify-between gap-3">
                        {result?.completedAt ? (
                          <div className={`text-xs ${muted(dark)}`}>
                            Saved {relativeTime(result.completedAt)}.
                          </div>
                        ) : (
                          <div className={`text-xs ${muted(dark)}`}>
                            Tap one option to save.
                          </div>
                        )}

                        {isDone ? (
                          <button
                            type="button"
                            className={pill(dark)}
                            onClick={clear}
                          >
                            <span aria-hidden className="opacity-80">
                              ↺
                            </span>
                            Reset
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder={
                          definition.placeholder ?? "One sentence is enough."
                        }
                        rows={3}
                        className={[
                          "w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none",
                          "transition",
                          dark
                            ? [
                                "border-white/12",
                                "bg-white/7",
                                "text-white",
                                "placeholder:text-white/40",
                                "focus-visible:ring-2 focus-visible:ring-emerald-300/30",
                                "focus-visible:border-white/18",
                              ].join(" ")
                            : [
                                "border-black/10",
                                "bg-white",
                                "text-slate-900",
                                "placeholder:text-slate-400",
                                "focus-visible:ring-2 focus-visible:ring-emerald-500/20",
                                "focus-visible:border-black/15",
                              ].join(" "),
                        ].join(" ")}
                        maxLength={definition.maxChars ?? 280}
                      />

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className={`text-xs ${muted(dark)}`}>
                          {textValue.trim().length}/{definition.maxChars ?? 280}
                        </div>

                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <button
                              type="button"
                              className={pill(dark)}
                              onClick={clear}
                            >
                              <span aria-hidden className="opacity-80">
                                ↺
                              </span>
                              Reset
                            </button>
                          ) : null}

                          <button
                            type="button"
                            className={[
                              pill(dark, true),
                              !textValue.trim() ? "opacity-50" : "",
                            ].join(" ")}
                            onClick={() =>
                              persist(
                                makeTextResult({
                                  id: definition.id,
                                  pageId: definition.pageId,
                                  text: textValue.trim(),
                                })
                              )
                            }
                            disabled={!textValue.trim()}
                          >
                            Save →
                          </button>
                        </div>
                      </div>

                      {result?.completedAt ? (
                        <div className={`mt-2 text-xs ${muted(dark)}`}>
                          Saved {relativeTime(result.completedAt)}.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
