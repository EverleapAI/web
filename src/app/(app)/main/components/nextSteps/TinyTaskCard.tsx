"use client";

import * as React from "react";
import { Check } from "lucide-react";

import type {
  TinyTaskDefinition,
  TinyTaskResult,
} from "@/app/(app)/main/domain/tinyTasks";
import {
  loadTinyTaskResult,
  saveTinyTaskResult,
  makeChoiceResult,
} from "@/app/(app)/main/domain/tinyTasks";

/* =============================================================================
   Props
   ============================================================================= */

type Props = {
  dark: boolean;
  useLocal: boolean;
  definition: TinyTaskDefinition;
};

/* =============================================================================
   UI helpers (SOFTENED)
   ============================================================================= */

function optionBase(dark: boolean, selected: boolean) {
  return [
    "w-full text-left rounded-xl px-4 py-3",
    "text-sm font-medium transition",
    "focus-visible:outline-none",

    dark
      ? selected
        ? "bg-white/[0.07] text-white/88 ring-1 ring-emerald-300/16"
        : "bg-white/[0.035] hover:bg-white/[0.06] text-white/78"
      : selected
        ? "bg-black/8 text-slate-950 ring-1 ring-emerald-500/22"
        : "bg-black/5 hover:bg-black/10 text-slate-900",

    dark
      ? "focus-visible:ring-2 focus-visible:ring-emerald-300/20"
      : "focus-visible:ring-2 focus-visible:ring-emerald-500/18",
  ].join(" ");
}

function checkWrap(dark: boolean, selected: boolean) {
  return [
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition",

    selected
      ? dark
        ? "bg-emerald-300/12 text-emerald-100 ring-1 ring-emerald-300/14"
        : "bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/18"
      : dark
        ? "bg-white/6 text-white/20"
        : "bg-black/6 text-black/18",
  ].join(" ");
}

/* =============================================================================
   Component
   ============================================================================= */

export function TinyTaskCard({
  dark,
  useLocal,
  definition,
}: Props) {
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

  return (
    <div className="mt-4 space-y-2">
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
              <span
                className={
                  selected
                    ? "text-white/88"
                    : dark
                    ? "text-white/78"
                    : "text-slate-900"
                }
              >
                {opt.label}
              </span>

              <span className={checkWrap(dark, selected)} aria-hidden>
                {selected ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}