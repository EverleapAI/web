// src/components/career/steps/productUx/Plan7DayStep.tsx
"use client";

import * as React from "react";
import type { StepperStep } from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: Record<string, unknown>;
  setProgress: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
};

type DayTask = {
  day: number;
  title: string;
  blurb: string;
  done?: boolean;
};

const PLAN: DayTask[] = [
  {
    day: 1,
    title: "Pick one UX problem",
    blurb: "Choose a screen, app, or flow you use often that feels confusing, annoying, or slow.",
  },
  {
    day: 2,
    title: "Study the user (you count)",
    blurb: "Write down what the user is trying to do, what’s confusing, and where they hesitate.",
  },
  {
    day: 3,
    title: "Sketch a better version",
    blurb: "On paper or Figma, redesign just ONE screen or flow. Don’t overthink it.",
  },
  {
    day: 4,
    title: "Get one reaction",
    blurb: "Show it to one person. Ask: “What’s confusing? What’s better?”",
  },
  {
    day: 5,
    title: "Improve based on feedback",
    blurb: "Fix only the biggest issue they noticed. Ignore the rest for now.",
  },
  {
    day: 6,
    title: "Write the story",
    blurb: "Describe the problem, your decision, and what changed. Short is good.",
  },
  {
    day: 7,
    title: "Ship it somewhere",
    blurb: "Post it, save it, or add it to a folder. Proof beats perfection.",
  },
];

function coerceDoneMap(v: unknown): Record<string, boolean> {
  if (!v || typeof v !== "object") return {};
  const out: Record<string, boolean> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === "boolean") out[k] = val;
  }
  return out;
}

function ProgressPill({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100/90">
      <span className="text-slate-300/70">{completed}</span>
      <span className="text-slate-300/50">/</span>
      <span className="text-slate-300/70">{total}</span>
      <span className="ml-1 text-slate-300/50">•</span>
      <span className="text-slate-200/90">{pct}%</span>
    </div>
  );
}

function TaskCard({
  task,
  onToggle,
}: {
  task: DayTask;
  onToggle: () => void;
}) {
  const on = Boolean(task.done);

  const halo =
    task.day <= 2
      ? "from-sky-500/18 via-cyan-400/10 to-indigo-500/10"
      : task.day <= 4
        ? "from-amber-500/16 via-orange-400/10 to-rose-500/10"
        : "from-emerald-500/16 via-teal-400/10 to-sky-500/10";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative w-full text-left rounded-card border p-[1px] transition active:scale-[0.99]
        ${on ? "border-emerald-400/35" : "border-white/10 hover:border-white/15"}
      `}
      aria-pressed={on}
    >
      <div className={`pointer-events-none absolute inset-0 rounded-card bg-gradient-to-br ${halo} opacity-60`} />
      <div
        className={`
          relative rounded-card p-4 backdrop-blur-xl
          ${
            on
              ? "bg-emerald-400/10"
              : "bg-slate-950/40 hover:bg-slate-950/50"
          }
        `}
      >
        <div className="flex items-start gap-3">
          <div
            className={`
              flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold
              ${
                on
                  ? "border-emerald-400/55 bg-emerald-400/20 text-emerald-100"
                  : "border-white/10 bg-white/5 text-slate-100"
              }
            `}
            aria-hidden
          >
            {on ? "✓" : task.day}
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-semibold text-slate-50">
                Day {task.day}: {task.title}
              </div>

              <span
                className={`
                  shrink-0 rounded-full border px-2 py-1 text-[0.7rem] font-semibold
                  ${
                    on
                      ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-50/90"
                      : "border-white/10 bg-slate-950/35 text-slate-100/75"
                  }
                `}
              >
                {on ? "Done" : "Tap to mark"}
              </span>
            </div>

            <div className="mt-1 text-xs leading-relaxed text-slate-200/80">
              {task.blurb}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export function Plan7DayStep({ step, progress, setProgress }: Props) {
  // ✅ Keep your persisted key EXACTLY the same
  const doneMap = React.useMemo(
    () => coerceDoneMap(progress["plan7_done"]),
    [progress]
  );

  const tasks = React.useMemo<DayTask[]>(() => {
    return PLAN.map((t) => ({ ...t, done: Boolean(doneMap[String(t.day)]) }));
  }, [doneMap]);

  function toggleDay(day: number) {
    setProgress((p) => {
      const current = coerceDoneMap(p["plan7_done"]);
      const key = String(day);
      const next = { ...current, [key]: !Boolean(current[key]) };
      return { ...p, plan7_done: next };
    });
  }

  const completed = tasks.filter((t) => t.done).length;
  const doneToday = completed > 0;

  const coachLine = React.useMemo(() => {
    if (completed <= 0) return "Start with Day 1. Just pick a screen that annoys you. That’s enough for today.";
    if (completed === 1) return "Nice. You’ve started a real UX loop. Keep it tiny and keep moving.";
    if (completed <= 3) return "You’re doing the thing most people only talk about. Keep the momentum.";
    if (completed <= 6) return "You’re basically building a portfolio piece. Don’t polish — ship.";
    return "Seven for seven. This is real proof. Screenshot it. Save it. You earned it.";
  }, [completed]);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-white/70">
        Dive deeper · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          Your 7-day starter plan
        </h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          This isn’t about being “ready.” It’s about building momentum with something real.
          Tiny proof beats perfect planning.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-white/10 bg-slate-950/40 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-14 h-60 w-60 rounded-full bg-gradient-to-br from-sky-500/16 via-cyan-400/9 to-indigo-500/10 blur-3xl opacity-70" />
          <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-amber-500/14 via-orange-400/8 to-rose-500/9 blur-3xl opacity-60" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-50">
                7-day UX challenge
              </div>
              <div className="mt-1 text-xs text-slate-300/70">
                Tap a day to mark it done. You can unmark it anytime.
              </div>
            </div>

            <ProgressPill completed={completed} total={7} />
          </div>

          <div className="mt-4 space-y-2">
            {tasks.map((t) => (
              <TaskCard key={t.day} task={t} onToggle={() => toggleDay(t.day)} />
            ))}
          </div>
        </div>
      </div>

      {/* “If you only do one thing…” */}
      <div className="relative overflow-hidden rounded-card border border-sky-200/15 bg-sky-300/10 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-gradient-to-br from-sky-500/18 via-cyan-400/10 to-indigo-500/10 blur-3xl opacity-70" />
        </div>
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-eyebrow text-sky-50/80">
            If you only do one thing…
          </div>
          <div className="mt-2 text-sm text-sky-50/90">
            Redo one screen you use daily, then show it to one human and ask:
            <span className="font-semibold text-sky-50">
              {" "}
              “What’s clearer? What’s still confusing?”
            </span>
            <span className="text-sky-50/80"> That’s UX.</span>
          </div>
        </div>
      </div>

      {/* Satisfying “done for today” moment */}
      <div
        className={`rounded-card border p-5 backdrop-blur-xl ${
          doneToday
            ? "border-emerald-200/20 bg-emerald-300/10"
            : "border-white/10 bg-white/5"
        }`}
      >
        <div className="text-xs font-semibold uppercase tracking-eyebrow text-slate-300/70">
          Coach note
        </div>
        <div
          className={`mt-2 text-sm ${
            doneToday ? "text-emerald-50/90" : "text-slate-200/85"
          }`}
        >
          {coachLine}
        </div>

        {doneToday ? (
          <div className="mt-3 text-xs text-emerald-50/70">
            You can stop for today. Seriously. Consistency beats intensity.
          </div>
        ) : null}
      </div>
    </section>
  );
}
