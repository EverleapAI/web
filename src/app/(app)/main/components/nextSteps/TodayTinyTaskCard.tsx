"use client";

import * as React from "react";
import { Check, CheckSquare } from "lucide-react";

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
    "w-full text-left rounded-[16px] px-4 py-3.5",
    "text-[14px] font-medium leading-5 transition",
    "focus-visible:outline-none",
    dark
      ? selected
        ? "bg-[linear-gradient(135deg,rgba(18,30,46,0.94)_0%,rgba(12,22,38,0.98)_100%)] text-white/82 ring-1 ring-white/8"
        : "bg-[linear-gradient(135deg,rgba(28,48,70,0.78)_0%,rgba(24,44,68,0.82)_100%)] hover:bg-[linear-gradient(135deg,rgba(32,54,78,0.82)_0%,rgba(28,50,72,0.86)_100%)] text-white/72 ring-1 ring-white/6"
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
          <div className={headerTitleClass(dark)}>
            Today’s Question
          </div>
        </div>

        <div
          className={
            dark
              ? "mb-3 text-[17px] font-semibold tracking-[-0.01em] text-white/76 sm:text-[18px]"
              : "mb-3 text-[17px] font-semibold tracking-[-0.01em] text-slate-950 sm:text-[18px]"
          }
        >
          {task.question}
        </div>
      </div>

      <div className="space-y-2.5">
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
              <div className="flex items-center justify-between gap-3">
                <span className={labelClass(dark, selected)}>{label}</span>

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