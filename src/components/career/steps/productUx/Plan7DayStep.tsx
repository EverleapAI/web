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
    blurb:
      "Choose a screen, app, or flow you use often that feels confusing, annoying, or slow.",
  },
  {
    day: 2,
    title: "Study the user (you count)",
    blurb:
      "Write down what the user is trying to do, what’s confusing, and where they hesitate.",
  },
  {
    day: 3,
    title: "Sketch a better version",
    blurb:
      "On paper or Figma, redesign just ONE screen or flow. Don’t overthink it.",
  },
  {
    day: 4,
    title: "Get one reaction",
    blurb:
      "Show it to one person. Ask: “What’s confusing? What’s better?”",
  },
  {
    day: 5,
    title: "Improve based on feedback",
    blurb:
      "Fix only the biggest issue they noticed. Ignore the rest for now.",
  },
  {
    day: 6,
    title: "Write the story",
    blurb:
      "Describe the problem, your decision, and what changed. Short is good.",
  },
  {
    day: 7,
    title: "Ship it somewhere",
    blurb:
      "Post it, save it, or add it to a folder. Proof beats perfection.",
  },
];

function TaskCard({
  task,
  onToggle,
}: {
  task: DayTask;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-full text-left rounded-[26px] border p-4 transition active:scale-[0.99]
        ${
          task.done
            ? "border-emerald-400/40 bg-emerald-400/10"
            : "border-white/10 bg-slate-950/40 hover:bg-slate-950/50"
        }
      `}
      aria-pressed={task.done}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold
            ${
              task.done
                ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-200"
                : "border-white/10 bg-white/5 text-slate-100"
            }
          `}
        >
          {task.day}
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-50">
            {task.title}
          </div>
          <div className="mt-1 text-xs leading-relaxed text-slate-200/80">
            {task.blurb}
          </div>
        </div>
      </div>
    </button>
  );
}

export function Plan7DayStep({ step }: Props) {
  const [tasks, setTasks] = React.useState<DayTask[]>(PLAN);

  function toggleDay(day: number) {
    setTasks((prev) =>
      prev.map((t) =>
        t.day === day ? { ...t, done: !t.done } : t
      )
    );
  }

  const completed = tasks.filter((t) => t.done).length;

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Recommendation · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          Your 7-day starter plan
        </h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          This isn’t about becoming “ready.”  
          It’s about building momentum with something real.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-50">
            7-day UX challenge
          </div>
          <div className="text-xs text-slate-300/70">
            {completed} / 7 done
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {tasks.map((t) => (
            <TaskCard
              key={t.day}
              task={t}
              onToggle={() => toggleDay(t.day)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/70">
          Coach note
        </div>
        <div className="mt-2 text-sm text-slate-200/85">
          If you complete even <span className="text-slate-50 font-semibold">3 of these</span>,  
          you’ll be ahead of most people who say they want to do UX.
        </div>
      </div>
    </section>
  );
}
