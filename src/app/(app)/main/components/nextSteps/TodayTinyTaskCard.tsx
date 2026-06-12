"use client";

import * as React from "react";
import { CheckSquare } from "lucide-react";

type TodayMicroTask = {
  id: string;
  question: string;
  options: string[];
  signal_key: string;
  selected_option?: string | null;
  selected_option_index?: number | null;
};

type Props = {
  dark: boolean;
  task: TodayMicroTask;
};

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
    "w-full text-left rounded-[16px] px-4 py-3",
    "text-[14px] font-medium leading-5 transition-all duration-200",
    "focus-visible:outline-none",
    "hover:-translate-y-[1px]",
    dark
      ? selected
        ? "bg-[linear-gradient(135deg,rgba(22,40,60,0.96)_0%,rgba(14,28,46,0.98)_100%)] text-white shadow-[0_0_18px_rgba(103,232,249,0.08)] ring-1 ring-cyan-300/18"
        : "bg-[linear-gradient(135deg,rgba(28,48,70,0.78)_0%,rgba(24,44,68,0.82)_100%)] text-white/74 ring-1 ring-white/6 hover:bg-[linear-gradient(135deg,rgba(34,56,82,0.84)_0%,rgba(28,50,76,0.88)_100%)] hover:ring-cyan-300/12"
      : selected
        ? "bg-slate-200 text-slate-950 ring-1 ring-slate-300"
        : "bg-white text-slate-900 ring-1 ring-black/8 hover:bg-slate-50 hover:ring-emerald-500/14",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-cyan-300/20"
      : "focus-visible:ring-2 focus-visible:ring-emerald-500/20",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
  ].join(" ");
}

function labelClass(dark: boolean, selected: boolean) {
  if (!dark) return "text-slate-900";
  return selected ? "text-white" : "text-white/74";
}

export function TodayTinyTaskCard({ dark, task }: Props) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
    task.selected_option_index ?? null
  );

  React.useEffect(() => {
    setSelectedIndex(task.selected_option_index ?? null);
  }, [task.id, task.selected_option_index]);

  async function select(index: number) {
    setSelectedIndex(index);

    try {
      await fetch(`/api/micro-tasks/${task.id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selected_option_index: index,
        }),
      });
    } catch {
      // Keep optimistic UI.
    }
  }

  return (
    <div className="space-y-3">
      <div className="mb-1">
        <div className={headerRow()}>
          <span className={headerIconWrap(dark)}>
            <CheckSquare className="h-3.5 w-3.5" />
          </span>

          <div className={headerTitleClass(dark)}>Today’s Question</div>
        </div>

        <div
          className={
            dark
              ? "mb-4 text-[21px] font-semibold leading-[1.2] tracking-[-0.025em] text-white sm:text-[22px]"
              : "mb-4 text-[21px] font-semibold leading-[1.2] tracking-[-0.025em] text-slate-950 sm:text-[22px]"
          }
        >
          {task.question}
        </div>
      </div>

      <div className="space-y-2">
        {task.options.map((label, index) => {
          const selected = selectedIndex === index;

          return (
            <button
              key={`${task.id}-${index}`}
              type="button"
              onClick={() => select(index)}
              className={optionBase(dark, selected)}
              aria-pressed={selected}
            >
              <span className={labelClass(dark, selected)}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}