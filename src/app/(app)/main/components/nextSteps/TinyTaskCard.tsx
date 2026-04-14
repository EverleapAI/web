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

function TinyTaskLead({ dark }: { dark: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden>
      <span
        className={[
          "flex h-4 w-4 items-center justify-center rounded-[5px] border",
          dark
            ? "border-teal-200/20 bg-teal-300/10"
            : "border-emerald-600/18 bg-emerald-500/8",
        ].join(" ")}
      >
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            dark ? "bg-teal-200/72" : "bg-emerald-600/70",
          ].join(" ")}
        />
      </span>

      <span
        className={[
          "h-[1px] w-4 rounded-full",
          dark ? "bg-white/16" : "bg-slate-900/14",
        ].join(" ")}
      />
    </span>
  );
}

function optionBase(dark: boolean, selected: boolean) {
  return [
    "w-full text-left rounded-[16px] px-4 py-3.5",
    "text-[14px] font-medium leading-5 transition",
    "focus-visible:outline-none",
    dark
      ? selected
        ? // softened selected
          "bg-[linear-gradient(135deg,rgba(18,30,46,0.94)_0%,rgba(12,22,38,0.98)_100%)] text-white/82 ring-1 ring-white/8"
        : // slightly calmer default
          "bg-[linear-gradient(135deg,rgba(28,48,70,0.78)_0%,rgba(24,44,68,0.82)_100%)] hover:bg-[linear-gradient(135deg,rgba(32,54,78,0.82)_0%,rgba(28,50,72,0.86)_100%)] text-white/72 ring-1 ring-white/6"
      : selected
        ? "bg-slate-200 text-slate-950 ring-1 ring-slate-300"
        : "bg-white text-slate-900 hover:bg-slate-50 ring-1 ring-black/8",
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
        <div className="mb-2 flex items-center gap-2">
          <TinyTaskLead dark={dark} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
            Tiny Task
          </span>
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
    </div>
  );
}