// src/app/main/components/SignalsCard.tsx
"use client";

import * as React from "react";
import Link from "next/link";

import { hrefForSignal } from "../domain/signals";

type SignalKey = "motivations" | "strengths" | "skills";

type Progress = {
  motivationsDone: boolean;
  strengthsDone: boolean;
  skillsDone: boolean;
  motivationsAnswered: number;
  strengthsAnswered: number;
  skillsAnswered: number;
  totalPer: number;
};

type Props = {
  dark: boolean;
  progress: Progress;
  nextKey: SignalKey;
};

export function SignalsCard({ dark, progress, nextKey }: Props) {
  const border = dark ? "border-white/10" : "border-black/10";
  const textDim = dark ? "text-white/55" : "text-slate-500";
  const textMain = dark ? "text-white/85" : "text-slate-900";

  const track = dark ? "bg-white/10" : "bg-black/10";
  const fillDone = dark ? "bg-emerald-300/80" : "bg-emerald-600/80";

  const totalAnswered =
    (progress.motivationsAnswered || 0) +
    (progress.strengthsAnswered || 0) +
    (progress.skillsAnswered || 0);

  const totalAll = (progress.totalPer || 0) * 3;

  const lanes: Array<{
    k: SignalKey;
    label: string;
    answered: number;
    done: boolean;
  }> = [
    {
      k: "motivations",
      label: "Motivations",
      answered: progress.motivationsAnswered ?? 0,
      done: !!progress.motivationsDone,
    },
    {
      k: "strengths",
      label: "Strengths",
      answered: progress.strengthsAnswered ?? 0,
      done: !!progress.strengthsDone,
    },
    {
      k: "skills",
      label: "Skills",
      answered: progress.skillsAnswered ?? 0,
      done: !!progress.skillsDone,
    },
  ];

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div
          className={`text-[0.7rem] font-semibold uppercase tracking-[0.26em] ${
            dark ? "text-white/70" : "text-slate-500"
          }`}
        >
          Signals
        </div>

        <div className="flex items-center gap-2">
          <div className={`text-[11px] font-semibold ${textDim}`}>tap to review</div>
          <div className={`text-xs font-semibold ${textDim}`}>
            {totalAnswered}/{totalAll}
          </div>
        </div>
      </div>

      {/* Mobile: stack. Desktop: 3 columns */}
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {lanes.map((l) => {
          const meta = l.done ? "done" : `${l.answered}/${progress.totalPer}`;
          const pct =
            progress.totalPer > 0 ? Math.max(0, Math.min(1, l.answered / progress.totalPer)) : 0;

          const isNext = l.k === nextKey;

          // Each lane is its own link — ALWAYS goes to that lane’s questions.
          return (
            <Link
              key={l.k}
              href={hrefForSignal(l.k)}
              className={[
                "block rounded-2xl border px-4 py-4 transition",
                border,
                dark ? "hover:bg-white/5" : "hover:bg-black/4",
                dark ? "focus:ring-white/20" : "focus:ring-black/15",
                "focus:outline-none focus:ring-2",
              ].join(" ")}
              aria-label={`Open ${l.label}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* Never truncate label on mobile: allow wrapping */}
                  <div className={`text-sm font-semibold leading-snug ${textMain}`}>{l.label}</div>

                  {isNext ? (
                    <div
                      className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        dark ? "bg-white/10 text-white/70" : "bg-black/5 text-slate-700"
                      }`}
                    >
                      Next
                    </div>
                  ) : null}
                </div>

                <div className={`shrink-0 text-[11px] font-semibold ${textDim}`}>{meta}</div>
              </div>

              <div className={`mt-3 h-[3px] w-full overflow-hidden rounded-full ${track}`}>
                <div
                  className={`h-full rounded-full ${
                    l.done ? fillDone : dark ? "bg-white/12" : "bg-black/12"
                  }`}
                  style={{ width: `${pct * 100}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1" aria-hidden>
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

                  const emphasis = isNext ? "opacity-95" : "opacity-80";

                  return <span key={i} className={`h-1.5 w-1.5 rounded-full ${dot} ${emphasis}`} />;
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}