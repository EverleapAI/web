// src/app/main/components/nextSteps/TinyTaskCard.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Timer, CheckCircle2 } from "lucide-react";

import type { TinyTaskDefinition, TinyTaskResult } from "@/app/main/domain/tinyTasks";
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
  return dark ? "ring-1 ring-white/10" : "ring-1 ring-black/8";
}

function surface(dark: boolean) {
  return dark ? "bg-white/5" : "bg-white/85";
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

function chip(dark: boolean) {
  if (dark) {
    return "border-emerald-300/18 bg-emerald-300/12 text-emerald-100 shadow-[0_0_26px_rgba(52,211,153,0.14)]";
  }
  return "border-emerald-500/18 bg-emerald-500/10 text-emerald-800";
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
        ? "ring-1 ring-emerald-300/30"
        : "ring-1 ring-emerald-500/20"
      : "",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function headerPill(dark: boolean, tone: "primary" | "neutral" | "done") {
  const base =
    "inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-sm font-semibold";

  if (tone === "primary") return `${base} ${chip(dark)}`;

  if (tone === "done") {
    return [
      base,
      dark
        ? "border-emerald-300/18 bg-emerald-300/12 text-emerald-100"
        : "border-emerald-500/18 bg-emerald-500/10 text-emerald-800",
    ].join(" ");
  }

  return [
    base,
    dark
      ? "border-white/12 bg-white/6 text-white/70"
      : "border-black/10 bg-black/3 text-slate-700",
  ].join(" ");
}

function ctaPill(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-5 py-2.5",
    "text-sm font-semibold transition active:scale-[0.98]",
    "backdrop-blur-xl",
    dark
      ? "border-emerald-300/18 bg-emerald-300/12 text-emerald-50 hover:bg-emerald-300/16 shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
      : "border-emerald-500/18 bg-emerald-500/10 text-emerald-900 hover:bg-emerald-500/14 shadow-[0_14px_40px_rgba(0,0,0,0.10)]",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/28"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/18",
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
  subtitle = "5 minutes or less — a quick check-in that makes Everleap smarter.",
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
    setOpen(false);
  }

  function clear() {
    setResult(null);
    clearTinyTaskResult(definition.pageId, { useLocal });
    setTextValue("");
    setOpen(false);
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

  const showCompact = !open;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl px-5 py-4",
        ring(dark),
        surface(dark),
        "backdrop-blur-2xl",
        dark ? "shadow-[0_22px_80px_rgba(0,0,0,0.22)]" : "shadow-[0_14px_40px_rgba(0,0,0,0.10)]",
      ].join(" ")}
    >
      {/* Accent rail + subtle glow + watermark */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400/70" />

        <div
          className={[
            "absolute -top-16 -left-20 h-[280px] w-[280px] rounded-full blur-3xl",
            dark ? "bg-emerald-400/14" : "bg-emerald-400/10",
          ].join(" ")}
        />
        <div
          className={[
            "absolute -bottom-20 -right-20 h-[320px] w-[320px] rounded-full blur-3xl",
            dark ? "bg-sky-400/12" : "bg-sky-400/8",
          ].join(" ")}
        />

        {/* WATERMARK ICON — always present, subtle */}
        <div
          className={[
            "absolute right-5 top-5",
            "opacity-[0.12] blur-[0.6px]",
            dark ? "text-emerald-200" : "text-emerald-700",
          ].join(" ")}
          aria-hidden
        >
          <Sparkles className="h-14 w-14" />
        </div>

        <div className={["absolute inset-x-0 top-0 h-px", dark ? "bg-white/10" : "bg-black/8"].join(" ")} />
      </div>

      <div className="relative">
        <div className="flex flex-col gap-3">
          {/* Top pills row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={headerPill(dark, "primary")}>
              <Wand2 className="h-5 w-5 opacity-90" aria-hidden />
              <span>{label}</span>
            </span>

            <span className={headerPill(dark, "neutral")}>
              <Timer className="h-5 w-5 opacity-85" aria-hidden />
              {minutes} min
            </span>

            {isDone ? (
              <span className={headerPill(dark, "done")}>
                <CheckCircle2 className="h-5 w-5 opacity-90" aria-hidden />
                Done
              </span>
            ) : null}
          </div>

          <div className="min-w-0">
            <div className={`text-[16px] font-semibold leading-snug ${text(dark)}`}>
              {definition.title}
            </div>

            <div className={`mt-1 text-sm leading-relaxed ${softText(dark)}`}>
              {definition.prompt}
            </div>

            {/* CTA: left-justified under definition */}
            <div className="mt-3 flex justify-start">
              <button
                type="button"
                className={ctaPill(dark)}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                <span aria-hidden className="opacity-90">
                  {open ? "▾" : "▸"}
                </span>
                {open ? "Hide" : isDone ? "Edit answer" : "Answer this"}
              </button>
            </div>

            {!showCompact && subtitle ? (
              <div className={`mt-2 text-xs ${muted(dark)}`}>{subtitle}</div>
            ) : null}

            {!showCompact && definition.profileHint ? (
              <div className={`mt-2 text-xs ${muted(dark)}`}>{definition.profileHint}</div>
            ) : null}

            {!open && isDone ? (
              <div
                className={[
                  "mt-3 rounded-2xl border px-3.5 py-3",
                  "backdrop-blur-xl",
                  dark ? "border-white/10 bg-white/6" : "border-black/10 bg-white/90",
                ].join(" ")}
              >
                <div className={`text-xs font-semibold ${muted(dark)}`}>Your answer</div>
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

            {!open && isDone ? (
              <div className="mt-2 flex justify-start">
                <button type="button" className={pill(dark)} onClick={clear}>
                  <span aria-hidden className="opacity-80">↺</span>
                  Reset
                </button>
              </div>
            ) : null}
          </div>
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
              <div
                className={[
                  "relative overflow-hidden rounded-3xl border p-4",
                  "backdrop-blur-2xl",
                  dark ? "border-white/10 bg-white/4" : "border-black/10 bg-white/85",
                ].join(" ")}
              >
                <div className="relative">
                  {definition.kind === "choice" ? (
                    <div className="flex flex-col gap-2">
                      {definition.options.map((opt) => {
                        const selected =
                          result?.kind === "choice" && result.choiceId === opt.id;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={[
                              "w-full text-left rounded-2xl border px-4 py-3",
                              "text-sm font-semibold transition active:scale-[0.99]",
                              "backdrop-blur-md",
                              dark
                                ? "border-white/10 bg-white/6 text-white/88 hover:bg-white/10"
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
                            Tap one option to save (and close).
                          </div>
                        )}

                        {isDone ? (
                          <button type="button" className={pill(dark)} onClick={clear}>
                            <span aria-hidden className="opacity-80">↺</span>
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
                            ? "border-white/12 bg-white/7 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-emerald-300/30 focus-visible:border-white/18"
                            : "border-black/10 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-black/15",
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
                              <span aria-hidden className="opacity-80">↺</span>
                              Reset
                            </button>
                          ) : null}

                          <button
                            type="button"
                            className={[pill(dark, true), !textValue.trim() ? "opacity-50" : ""].join(" ")}
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
                            Save & close →
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
