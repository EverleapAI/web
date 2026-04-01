"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Timer, CheckCircle2 } from "lucide-react";

import type {
  TinyTaskDefinition,
  TinyTaskResult,
} from "@/app/(app)/main/domain/tinyTasks";
import {
  loadTinyTaskResult,
  saveTinyTaskResult,
  clearTinyTaskResult,
  makeChoiceResult,
  makeTextResult,
} from "@/app/(app)/main/domain/tinyTasks";

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

  /**
   * Embedded mode:
   * - reduces internal chrome
   * - removes "card inside card" when expanded
   * - uses lighter "saved" treatment
   */
  embedded?: boolean;

  /**
   * When true, render the full card open with no Answer/Edit/Hide control.
   * Use this on the main home page.
   */
  alwaysExpanded?: boolean;
};

/* =============================================================================
   UI helpers
   ============================================================================= */

function ring(dark: boolean) {
  return dark ? "ring-1 ring-white/10" : "ring-1 ring-black/8";
}

function calmSurface(dark: boolean) {
  return dark ? "bg-slate-950/22" : "bg-white/85";
}

function muted(dark: boolean) {
  return dark ? "text-white/60" : "text-slate-600";
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
        ? "ring-1 ring-emerald-300/24"
        : "ring-1 ring-emerald-500/18"
      : "",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function headerChip(dark: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
    "text-xs font-semibold",
    "backdrop-blur-md",
    dark
      ? "border-emerald-300/16 bg-emerald-300/10 text-emerald-100/90"
      : "border-emerald-500/18 bg-emerald-500/10 text-emerald-900",
  ].join(" ");
}

function doneBadge(dark: boolean) {
  return [
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
    "text-[11px] font-semibold",
    dark
      ? "border-white/12 bg-white/6 text-white/72"
      : "border-black/10 bg-black/3 text-slate-700",
  ].join(" ");
}

function headerToggle(dark: boolean) {
  return [
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5",
    "text-xs font-semibold",
    "transition active:scale-[0.99]",
    dark
      ? "border-white/12 bg-white/6 text-white/75 hover:bg-white/10"
      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
    "focus-visible:outline-none",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-white/16"
      : "focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
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

function summarizeResult(def: TinyTaskDefinition, r: TinyTaskResult | null) {
  if (!r) return null;

  if (r.kind === "choice") {
    if (def.kind === "choice") {
      const found = def.options?.find((o) => o.id === r.choiceId);
      return found?.label ?? "Saved";
    }
    return "Saved";
  }

  if (r.kind === "text") {
    const t = (r.text ?? "").trim();
    if (!t) return "Saved";
    return t.length > 110 ? `${t.slice(0, 110)}…` : t;
  }

  return "Saved";
}

/* =============================================================================
   Component
   ============================================================================= */

export function TinyTaskCard({
  dark,
  useLocal,
  definition,
  label = "Tiny Task",
  subtitle = "Choose the one that would make the biggest difference right now — this is how you start turning your signal into something real. It takes less than five minutes, but it helps Everleap sharpen what it suggests and point you toward moves that actually fit.",
  embedded = false,
  alwaysExpanded = false,
}: Props) {
  const [result, setResult] = React.useState<TinyTaskResult | null>(null);
  const [open, setOpen] = React.useState(alwaysExpanded);
  const [textValue, setTextValue] = React.useState("");

  React.useEffect(() => {
    const r = loadTinyTaskResult(definition.pageId, { useLocal });
    setResult(r);
  }, [definition.pageId, useLocal]);

  React.useEffect(() => {
    if (!result) return;
    if (result.kind === "text") setTextValue(result.text);
  }, [result]);

  React.useEffect(() => {
    if (alwaysExpanded && !open) setOpen(true);
  }, [alwaysExpanded, open]);

  function persist(next: TinyTaskResult, opts?: { close?: boolean }) {
    setResult(next);
    saveTinyTaskResult(definition.pageId, next, { useLocal });
    if (opts?.close && !alwaysExpanded) setOpen(false);
  }

  function clear() {
    setResult(null);
    clearTinyTaskResult(definition.pageId, { useLocal });
    setTextValue("");
    if (!alwaysExpanded) setOpen(false);
  }

  const isDone = !!result;

  const minutes =
    definition.minutes && Number.isFinite(definition.minutes)
      ? Math.max(1, Math.min(5, Math.round(definition.minutes)))
      : 5;

  const resultSummary = React.useMemo(
    () => summarizeResult(definition, result),
    [definition, result]
  );

  const titleId = React.useId();

  const content = (
    <div id={`${titleId}-panel`} className="mt-4">
      {definition.kind === "choice" ? (
        <div className="space-y-2">
          {definition.options.map((opt) => {
            const selected =
              result?.kind === "choice" && result.choiceId === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                className={[
                  "group relative w-full text-left rounded-2xl border px-4 py-3",
                  "text-sm font-semibold transition active:scale-[0.99]",
                  "backdrop-blur-md",
                  dark
                    ? "border-white/10 bg-white/6 text-white/88 hover:bg-white/10"
                    : "border-black/10 bg-white text-slate-900 hover:bg-black/2",
                  selected
                    ? dark
                      ? "border-emerald-300/18 bg-white/8 ring-1 ring-emerald-300/22"
                      : "border-emerald-500/16 bg-black/2 ring-1 ring-emerald-500/16"
                    : "",
                  "focus-visible:outline-none",
                  dark
                    ? "focus-visible:ring-2 focus-visible:ring-emerald-300/24"
                    : "focus-visible:ring-2 focus-visible:ring-emerald-500/18",
                ].join(" ")}
                onClick={() =>
                  persist(
                    makeChoiceResult({
                      id: definition.id,
                      pageId: definition.pageId,
                      choiceId: opt.id,
                    }),
                    { close: false }
                  )
                }
              >
                <span
                  aria-hidden
                  className={[
                    "absolute left-0 top-2 bottom-2 w-1 rounded-full transition",
                    selected
                      ? dark
                        ? "bg-emerald-300/70"
                        : "bg-emerald-500/55"
                      : dark
                        ? "bg-white/0 group-hover:bg-white/6"
                        : "bg-black/0 group-hover:bg-black/5",
                  ].join(" ")}
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">{opt.label}</div>

                  {selected ? (
                    <div
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
                        "text-[11px] font-semibold",
                        dark
                          ? "border-emerald-300/18 bg-emerald-300/10 text-emerald-100/90"
                          : "border-emerald-500/18 bg-emerald-500/10 text-emerald-900",
                      ].join(" ")}
                      aria-hidden
                    >
                      <CheckCircle2 className="h-4 w-4 opacity-90" />
                      Selected
                    </div>
                  ) : (
                    <div
                      className={[
                        "h-2.5 w-2.5 shrink-0 rounded-full",
                        dark ? "bg-white/16" : "bg-black/12",
                      ].join(" ")}
                      aria-hidden
                    />
                  )}
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
              <div />
            )}

            {isDone ? (
              <button type="button" className={pill(dark)} onClick={clear}>
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
            placeholder={definition.placeholder ?? "One sentence is enough."}
            rows={3}
            className={[
              "w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none",
              "transition",
              dark
                ? "border-white/12 bg-white/7 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-emerald-300/26 focus-visible:border-white/18"
                : "border-black/10 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/18 focus-visible:border-black/15",
            ].join(" ")}
            maxLength={definition.maxChars ?? 280}
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className={`text-xs ${muted(dark)}`}>
              {textValue.trim().length}/{definition.maxChars ?? 280}
            </div>

            <div className="flex items-center gap-2">
              {isDone ? (
                <button type="button" className={pill(dark)} onClick={clear}>
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
                    }),
                    { close: true }
                  )
                }
                disabled={!textValue.trim()}
              >
                {alwaysExpanded ? "Save" : "Save & close →"}
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
  );

  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl",
        "px-5 py-4",
        ring(dark),
        calmSurface(dark),
        "backdrop-blur-2xl",
        embedded
          ? dark
            ? "shadow-[0_18px_60px_rgba(0,0,0,0.16)]"
            : "shadow-[0_12px_34px_rgba(0,0,0,0.10)]"
          : dark
            ? "shadow-[0_22px_80px_rgba(0,0,0,0.20)]"
            : "shadow-[0_14px_40px_rgba(0,0,0,0.10)]",
      ].join(" ")}
      aria-labelledby={titleId}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={[
            "absolute -top-20 -left-24 h-[260px] w-[260px] rounded-full blur-3xl",
            dark ? "bg-emerald-300/10" : "bg-emerald-400/8",
          ].join(" ")}
        />
        <div
          className={[
            "absolute -bottom-24 -right-24 h-[300px] w-[300px] rounded-full blur-3xl",
            dark ? "bg-sky-300/8" : "bg-sky-400/6",
          ].join(" ")}
        />

        <div
          className={[
            "absolute right-5 top-5 opacity-[0.07]",
            dark ? "text-white" : "text-slate-900",
          ].join(" ")}
          aria-hidden
        >
          <Sparkles className="h-14 w-14" />
        </div>

        <div
          className={[
            "absolute inset-x-0 top-0 h-px",
            dark ? "bg-white/10" : "bg-black/8",
          ].join(" ")}
        />
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className={headerChip(dark)}>
            <Wand2 className="h-4 w-4 opacity-90" aria-hidden />
            <span>
              {label}{" "}
              <span
                className={dark ? "text-emerald-100/70" : "text-emerald-900/70"}
              >
                ·
              </span>{" "}
              <span className="inline-flex items-center gap-1.5">
                <Timer className="h-4 w-4 opacity-85" aria-hidden />
                {minutes} min
              </span>
            </span>
          </span>

          {isDone ? (
            <span className={doneBadge(dark)}>
              <CheckCircle2 className="h-4 w-4 opacity-90" aria-hidden />
              Done
            </span>
          ) : null}

          {!alwaysExpanded ? (
            <button
              type="button"
              className={headerToggle(dark)}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`${titleId}-panel`}
            >
              <span aria-hidden className="opacity-80">
                {open ? "▾" : "▸"}
              </span>
              {open ? "Hide" : isDone ? "Edit" : "Answer"}
            </button>
          ) : null}
        </div>

        <div className="mt-3 min-w-0">
          <div
            id={titleId}
            className={`text-[16px] font-semibold leading-snug ${text(dark)}`}
          >
            {definition.title}
          </div>

          <div className={`mt-1 text-sm leading-relaxed ${softText(dark)}`}>
            {definition.prompt}
          </div>

          {!open && isDone && embedded ? (
            <div className={`mt-2 text-xs ${muted(dark)}`}>
              <span
                className={
                  dark
                    ? "text-white/70 font-semibold"
                    : "text-slate-800 font-semibold"
                }
              >
                Saved:
              </span>{" "}
              <span className={dark ? "text-white/75" : "text-slate-700"}>
                {resultSummary}
              </span>
              {result?.completedAt ? (
                <span className={dark ? "text-white/45" : "text-slate-500"}>
                  {" "}
                  · {relativeTime(result.completedAt)}
                </span>
              ) : null}
            </div>
          ) : null}

          {open && subtitle ? (
            <div className={`mt-2 text-xs ${muted(dark)}`}>{subtitle}</div>
          ) : null}
          {open && definition.profileHint ? (
            <div className={`mt-2 text-xs ${muted(dark)}`}>
              {definition.profileHint}
            </div>
          ) : null}

          {!open && isDone && !embedded ? (
            <div
              className={[
                "mt-3 rounded-2xl border px-3.5 py-3",
                "backdrop-blur-xl",
                dark ? "border-white/10 bg-white/6" : "border-black/10 bg-white/90",
              ].join(" ")}
            >
              <div className={`text-xs font-semibold ${muted(dark)}`}>
                Your answer
              </div>
              <div className={`mt-1 text-sm leading-relaxed ${softText(dark)}`}>
                {resultSummary}
              </div>
              {result?.completedAt ? (
                <div className={`mt-1 text-xs ${muted(dark)}`}>
                  Saved {relativeTime(result.completedAt)}.
                </div>
              ) : null}
            </div>
          ) : null}

          {!open && isDone && !embedded ? (
            <div className="mt-2 flex justify-start">
              <button type="button" className={pill(dark)} onClick={clear}>
                <span aria-hidden className="opacity-80">
                  ↺
                </span>
                Reset
              </button>
            </div>
          ) : null}
        </div>

        {alwaysExpanded ? (
          content
        ) : (
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
              >
                {content}
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}