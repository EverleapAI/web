"use client";

import * as React from "react";
import Link from "next/link";

import { hrefForSignal } from "../domain/signals";

type Progress = {
  motivationsDone: boolean;
  strengthsDone: boolean;
  skillsDone: boolean;
  motivationsAnswered: number;
  strengthsAnswered: number;
  skillsAnswered: number;
  totalPer: number;
};

export function SignalsCard({
  dark,
  progress,
  nextKey,
}: {
  dark: boolean;
  progress: Progress;
  nextKey: "motivations" | "strengths" | "skills";
}) {
  const border = dark ? "border-white/10" : "border-black/10";
  const textDim = dark ? "text-white/55" : "text-slate-500";
  const textMain = dark ? "text-white/85" : "text-slate-900";

  const track = dark ? "bg-white/10" : "bg-black/10";
  const fillDone = dark ? "bg-emerald-300/80" : "bg-emerald-600/80";

  const lanes: Array<{
    k: "motivations" | "strengths" | "skills";
    label: string;
    answered: number;
    done: boolean;
  }> = [
    {
      k: "motivations",
      label: "Motivations",
      answered: progress.motivationsAnswered,
      done: progress.motivationsDone,
    },
    {
      k: "strengths",
      label: "Strengths",
      answered: progress.strengthsAnswered,
      done: progress.strengthsDone,
    },
    {
      k: "skills",
      label: "Skills",
      answered: progress.skillsAnswered,
      done: progress.skillsDone,
    },
  ];

  return (
    <div
      className={[
        "mt-3 rounded-2xl border px-4 py-4",
        border,
      ].join(" ")}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`text-[0.7rem] font-semibold uppercase tracking-[0.26em] ${
            dark ? "text-white/70" : "text-slate-500"
          }`}
        >
          Signals
        </div>

        <div className={`text-xs font-semibold ${textDim}`}>
          tap to review
        </div>
      </div>

      {/* Lanes */}
      <div className="grid grid-cols-3 gap-4">
        {lanes.map((l) => {
          const pct = Math.max(0, Math.min(1, l.answered / progress.totalPer));
          const isNext = l.k === nextKey;

          return (
            <Link
              key={l.k}
              href={hrefForSignal(l.k)}
              className={[
                "group block rounded-xl p-2 transition",
                dark ? "hover:bg-white/5" : "hover:bg-black/5",
                isNext ? "ring-1 ring-amber-400/40" : "",
              ].join(" ")}
              aria-label={`Review ${l.label}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div
                  className={`truncate text-xs font-semibold ${textMain}`}
                >
                  {l.label}
                </div>

                <div className={`text-[11px] font-semibold ${textDim}`}>
                  {l.done ? "done" : `${l.answered}/${progress.totalPer}`}
                </div>
              </div>

              {/* Progress bar */}
              <div
                className={`mt-2 h-[3px] w-full overflow-hidden rounded-full ${track}`}
                aria-hidden
              >
                <div
                  className={`h-full rounded-full ${
                    l.done
                      ? fillDone
                      : dark
                      ? "bg-white/12"
                      : "bg-black/12"
                  }`}
                  style={{ width: `${pct * 100}%` }}
                />
              </div>

              {/* Dots */}
              <div className="mt-2 flex items-center gap-1" aria-hidden>
                {Array.from({ length: progress.totalPer }).map((_, i) => {
                  const filled = i < l.answered;

                  const dot =
                    l.done && filled
                      ? dark
                        ? "bg-emerald-300/80"
                        : "bg-emerald-600/80"
                      : filled
                      ? dark
                        ? "bg-white/28"
                        : "bg-slate-900/30"
                      : dark
                      ? "bg-white/10"
                      : "bg-black/10";

                  return (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${dot}`}
                    />
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}