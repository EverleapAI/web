"use client";

import * as React from "react";
import { Check, CheckSquare } from "lucide-react";

import type {
  TinyTaskDefinition,
  TinyTaskResult,
} from "@/app/(app)/main/domain/tinyTasks";
import {
  loadTinyTaskResult,
  saveTinyTaskResult,
  makeChoiceResult,
} from "@/app/(app)/main/domain/tinyTasks";

type Props = {
  dark: boolean;
  useLocal: boolean;
  definition: TinyTaskDefinition;
};

function readPrompt(definition: TinyTaskDefinition): string {
  const source = definition as Record<string, unknown>;

  const candidates = [
    source.prompt,
    source.question,
    source.title,
    source.label,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "Choose the momentum you want to build next.";
}

/* =============================================================================
   Header (INSIGHTS-ALIGNED)
   ============================================================================= */

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

function optionBase(dark: boolean, selected: boolean) {
  return [
    "w-full text-left rounded-[16px] px-4 py-3.5",
    "text-[14px] font-medium leading-5 transition",
    "border-l-[3px]",
    "focus-visible:outline-none",
    dark
      ? selected
        ? "border-teal-300/70 bg-[linear-gradient(135deg,rgba(20,42,52,0.95)_0%,rgba(13,30,40,0.98)_100%)] text-white ring-1 ring-teal-300/25"
        : "border-transparent bg-[linear-gradient(135deg,rgba(28,48,70,0.78)_0%,rgba(24,44,68,0.82)_100%)] hover:-translate-y-[1px] hover:bg-[linear-gradient(135deg,rgba(32,54,78,0.82)_0%,rgba(28,50,72,0.86)_100%)] text-white/72 ring-1 ring-white/6"
      : selected
        ? "border-emerald-500 bg-slate-100 text-slate-950 ring-1 ring-emerald-500/25"
        : "border-transparent bg-white text-slate-900 hover:bg-slate-50 ring-1 ring-black/8",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-teal-300/18"
      : "focus-visible:ring-2 focus-visible:ring-emerald-500/20",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
  ].join(" ");
}

function labelClass(dark: boolean, selected: boolean) {
  if (!dark) return "text-slate-900";
  return selected ? "text-white/82" : "text-white/72";
}

function checkWrap(dark: boolean, selected: boolean) {
  return [
    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition",
    selected
      ? dark
        ? "bg-teal-300/14 text-teal-100/90 ring-1 ring-teal-300/20"
        : "bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/18"
      : dark
        ? "bg-white/[0.035] text-white/26 ring-1 ring-white/6"
        : "bg-black/6 text-black/18 ring-1 ring-black/6",
  ].join(" ");
}

export function TinyTaskCard({ dark, useLocal, definition }: Props) {
  const [result, setResult] = React.useState<TinyTaskResult | null>(null);

  React.useEffect(() => {
    const r = loadTinyTaskResult(definition.pageId, { useLocal });
    setResult(r);
  }, [definition.pageId, useLocal]);

  function select(choiceId: string) {
    const next = makeChoiceResult({
      id: definition.id,
      pageId: definition.pageId,
      choiceId,
    });

    setResult(next);
    saveTinyTaskResult(definition.pageId, next, { useLocal });
  }

  if (definition.kind !== "choice") return null;

  const prompt = readPrompt(definition);

  return (
    <div className="space-y-3">
      <div className="mb-1">
        <div className={headerRow()}>
          <span className={headerIconWrap(dark)}>
            <CheckSquare className="h-3.5 w-3.5" />
          </span>
          <div className={headerTitleClass(dark)}>Tiny Task</div>
        </div>

        <div
          className={
            dark
              ? "text-[17px] font-semibold tracking-[-0.01em] text-white/76 sm:text-[18px] mb-3"
              : "text-[17px] font-semibold tracking-[-0.01em] text-slate-950 sm:text-[18px] mb-3"
          }
        >
          {prompt}
        </div>
      </div>

      <div className="space-y-2.5">
        {definition.options.map((opt) => {
          const selected =
            result?.kind === "choice" && result.choiceId === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => select(opt.id)}
              className={optionBase(dark, selected)}
              aria-pressed={selected}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={labelClass(dark, selected)}>
                  {opt.label}
                </span>

                {selected ? (
                  <span className={checkWrap(dark, true)} aria-hidden>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}