// src/components/career/steps/productUx/ForecastStep.tsx
"use client";

import * as React from "react";
import type {
  StepperStep,
  StepperPersistedState,
} from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-100">
      {children}
    </span>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-12 -left-10 h-56 w-56 rounded-full bg-gradient-to-br from-sky-500/16 via-cyan-400/9 to-indigo-500/10 blur-3xl opacity-70" />
        <div className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/14 via-fuchsia-400/8 to-sky-500/10 blur-3xl opacity-60" />
      </div>

      <div className="relative">
        <div className="text-sm font-semibold text-slate-50">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-slate-200/85">{subtitle}</div>
        ) : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function MiniCard({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="text-sm font-semibold text-slate-50">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-200/85">{body}</div>
    </div>
  );
}

function normalizeZip(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (/^\d{5}(-\d{4})?$/.test(s)) return s;
  return "";
}

type Signal = "green" | "yellow" | "red";

function SignalPill({ kind, children }: { kind: Signal; children: React.ReactNode }) {
  const cls =
    kind === "green"
      ? "border-emerald-200/20 bg-emerald-300/12 text-emerald-50"
      : kind === "yellow"
        ? "border-amber-200/20 bg-amber-300/12 text-amber-50"
        : "border-rose-200/20 bg-rose-300/12 text-rose-50";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

export function ForecastStep({ step, progress }: Props) {
  // Keep your existing behavior: zip is optional + not required.
  // (Note: other steps used zipCode; leaving this untouched for now.)
  const zip = normalizeZip((progress as unknown as Record<string, unknown>)["zip"]);

  const headlines = [
    "Product + UX is still growing — but the bar is rising.",
    "AI won’t replace UX. It will replace sloppy UX.",
    "The winners: faster learning, clearer decisions, closer to real users.",
  ];

  const whatChanges = [
    "More work happens inside prototypes, not docs.",
    "Design gets measured (conversion, retention, trust).",
    "Teams expect you to think like a product partner — not just “make screens.”",
    "AI speeds up drafts — judgment + taste still win.",
  ];

  const whatStays = [
    "Understanding humans (behavior, emotion, motivation).",
    "Turning messy problems into clear decisions.",
    "Testing fast with real users.",
    "Craft: making complex things feel simple.",
  ];

  const practice = [
    "Write clearer microcopy (buttons, errors, empty states).",
    "Run 1 tiny user test per week (yes, friends count).",
    "Go deep on one prototyping tool (Figma is the default).",
    "Ship tiny: one screen → one flow → one improvement.",
  ];

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Dive deeper · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          The next 3–5 years (no jargon)
        </h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          This isn’t a “job guarantee.” It’s a friendly map so you practice the right
          things — and don’t waste time on outdated advice.
        </p>
      </div>

      {/* Signals panel */}
      <Panel
        title="The vibe of the market"
        subtitle="Think of these as weather — not destiny."
      >
        <div className="flex flex-wrap gap-2">
          <SignalPill kind="green">Demand is real</SignalPill>
          <SignalPill kind="yellow">Bar is rising</SignalPill>
          <SignalPill kind="green">Proof beats pedigree</SignalPill>
          <SignalPill kind="yellow">AI changes workflows</SignalPill>
        </div>

        <div className="mt-4 space-y-2">
          {headlines.map((h) => (
            <div key={h} className="flex gap-3">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
              <div className="text-sm text-slate-200/90">{h}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>AI-assisted workflows</Chip>
          <Chip>User research matters more</Chip>
          <Chip>Craft + clarity</Chip>
          <Chip>Proof &gt; pedigree</Chip>
        </div>
      </Panel>

      {/* Changes vs stays */}
      <div className="grid gap-3 md:grid-cols-2">
        <MiniCard
          title="What’s changing"
          body={
            <ul className="ml-5 list-disc space-y-2">
              {whatChanges.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          }
        />

        <MiniCard
          title="What stays valuable"
          body={
            <ul className="ml-5 list-disc space-y-2">
              {whatStays.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          }
        />
      </div>

      {/* Future-proof */}
      <Panel
        title="If you want to be “future-proof”…"
        subtitle="Here’s the simplest strategy that keeps working."
      >
        <div className="text-sm text-slate-200/85">
          Be the person who can{" "}
          <span className="font-semibold text-slate-50">find the real problem</span>,
          <span className="font-semibold text-slate-50"> test quickly</span>, and{" "}
          <span className="font-semibold text-slate-50">ship improvements that actually work</span>.
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/70">
            What to practice this month
          </div>
          <ul className="mt-3 ml-5 list-disc space-y-2 text-sm text-slate-200/85">
            {practice.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </Panel>

      {/* Tiny footer hint */}
      <div className="pt-1 text-xs text-slate-300/60">
        {zip ? (
          <>
            Later we’ll tailor opportunities to{" "}
            <span className="text-slate-100">{zip}</span> (meetups, internships, programs,
            volunteer UX projects).
          </>
        ) : (
          <>We’ll tailor the opportunities section once we have your ZIP.</>
        )}
      </div>
    </section>
  );
}
