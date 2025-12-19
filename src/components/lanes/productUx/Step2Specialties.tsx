// src/components/lanes/productUx/Step2Specialties.tsx
"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";

import type { StepCommonProps } from "@/components/lanes/StepperShell";

type ProgressShape = Record<string, unknown> & {
  productUx_specialties?: string[];
};

const ALL_SPECIALTIES: { id: string; label: string; desc: string }[] = [
  { id: "mobile", label: "Mobile UX", desc: "Flows that feel effortless on a phone." },
  { id: "web", label: "Web apps", desc: "Designing for clarity across screens + devices." },
  { id: "research", label: "User research", desc: "Interviews, tests, and real signal." },
  { id: "writing", label: "UX writing", desc: "Tiny words that reduce confusion." },
  { id: "systems", label: "Design systems", desc: "Reusable UI building blocks." },
  { id: "accessibility", label: "Accessibility", desc: "Inclusive design that works for everyone." },
  { id: "data", label: "Data + analytics", desc: "Using signal to decide what to improve next." },
  { id: "ai", label: "AI products", desc: "Designing experiences with smart helpers." },
];

export default function Step2Specialties(props: StepCommonProps<ProgressShape>) {
  const { dark, accentClass, laneId, progress, setProgress, openGuide } = props;

  // ✅ Force correct type: always string[]
  const picks: string[] = Array.isArray(progress.productUx_specialties)
    ? progress.productUx_specialties
    : [];

  function togglePick(id: string) {
    setProgress((p) => {
      const current: string[] = Array.isArray(p.productUx_specialties) ? p.productUx_specialties : [];
      const on = current.includes(id);

      const next = on ? current.filter((x) => x !== id) : [...current, id];

      return {
        ...p,
        productUx_specialties: next,
      };
    });
  }

  function clearAll() {
    setProgress((p) => ({ ...p, productUx_specialties: [] }));
  }

  function nudgeGuide() {
    openGuide?.({
      source: "productUx_specialties",
      laneId,
      picks,
      prompt:
        "User selected Product/UX specialties. Suggest ONE specialty to explore first and give ONE tiny next step (30 minutes max).",
    });
  }

  const card =
    "rounded-[28px] border border-white/10 bg-slate-950/45 px-5 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur-xl";
  const micro = "text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/60";
  const muted = dark ? "text-slate-200/85" : "text-slate-600";

  return (
    <div className="space-y-4">
      <div className={card}>
        <div className={micro}>Specialties</div>
        <div className="mt-2 text-xl font-semibold tracking-tight text-slate-50">
          What parts of Product / UX sound interesting?
        </div>
        <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
          Pick a few. This doesn’t lock you in — it helps Everleap suggest better mini-goals.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200/80">
            {picks.length} picked
          </span>

          {picks.length ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10 active:scale-[0.99]"
            >
              Clear
            </button>
          ) : null}

          <button
            type="button"
            onClick={nudgeGuide}
            className={`ml-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold hover:bg-white/10 active:scale-[0.99] ${
              dark ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            Ask the Guide <Sparkles className="h-3.5 w-3.5 opacity-80" />
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {ALL_SPECIALTIES.map((s) => {
          const on = picks.includes(s.id);

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => togglePick(s.id)}
              className={[
                "group relative w-full text-left overflow-hidden rounded-[26px] border px-5 py-4 transition",
                "bg-slate-950/45 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.45)]",
                on ? "border-sky-300/35" : "border-white/10 hover:border-white/20",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-slate-50">{s.label}</div>
                  <div className={`mt-1 text-sm leading-relaxed ${muted}`}>{s.desc}</div>
                </div>

                <div
                  className={[
                    "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                    on ? "border-sky-300/40 bg-sky-300/15 text-sky-200" : "border-white/10 bg-white/5 text-slate-200/70",
                    accentClass ?? "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {on ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current opacity-60" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
