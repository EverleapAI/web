// src/components/lanes/productUx/Step1Details.tsx
"use client";

import * as React from "react";
import { ArrowUpRight, Sparkles, Target, Users2, Zap } from "lucide-react";
import type { StepCommonProps } from "@/components/lanes/StepperShell";

export default function Step1Details(props: StepCommonProps) {
  const { dark, accentClass, laneId, setProgress, openGuide } = props;

  // If you ever want to pre-seed specialties based on “Details” reading,
  // you can do it here. Keeping minimal for now.

  const micro = dark ? "text-slate-300/70" : "text-slate-600/70";
  const body = dark ? "text-slate-200/90" : "text-slate-800";
  const surface = dark
    ? "border-white/10 bg-slate-950/35"
    : "border-slate-200 bg-white/85";

  const chip = dark
    ? "border-white/10 bg-white/5 text-slate-100"
    : "border-slate-200 bg-white text-slate-800";

  const bulletDot = dark ? "bg-sky-300" : "bg-sky-600";

  const openLaneGuide = () => {
    openGuide?.({
      source: "lane_details",
      lane: { id: laneId, title: "Product / UX" },
      prompt:
        "User is reading the Product/UX lane details. Ask ONE question to learn what kind of products they like (games/health/sports/education/etc), then suggest a tiny first experiment.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Micro accent header */}
      <div className={`rounded-3xl border p-4 ${surface}`}>
        <div className="flex items-start gap-3">
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${chip}`}
            aria-hidden
          >
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${micro}`}>
              Details
            </div>
            <div className={`mt-1 text-base font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
              Product / UX is about designing experiences people actually use.
            </div>
            <div className={`mt-1 text-sm leading-relaxed ${body}`}>
              You’ll do best here if you like building, testing, and improving things fast—based on real people, not vibes.
            </div>
          </div>
        </div>
      </div>

      {/* What it is (mobile-first, stacked) */}
      <div className={`rounded-3xl border p-4 ${surface}`}>
        <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${micro}`}>What you’d do</div>

        <ul className="mt-3 space-y-3 text-sm">
          {[
            {
              icon: <Target className="h-4 w-4" />,
              title: "Pick the real problem",
              desc: "What’s frustrating or confusing? What’s the goal?",
            },
            {
              icon: <Users2 className="h-4 w-4" />,
              title: "Design for humans",
              desc: "Figure out what people expect, then make it obvious.",
            },
            {
              icon: <Zap className="h-4 w-4" />,
              title: "Ship + iterate",
              desc: "Try a version, learn from feedback, improve it.",
            },
          ].map((row) => (
            <li key={row.title} className="flex gap-3">
              <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${bulletDot}`} />
              <div className="min-w-0">
                <div className={`inline-flex items-center gap-2 font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-xl border ${chip}`}>
                    {row.icon}
                  </span>
                  {row.title}
                </div>
                <div className={`mt-1 ${body}`}>{row.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Starter experiment (tiny, immediate) */}
      <div className={`rounded-3xl border p-4 ${surface}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${micro}`}>Starter experiment</div>
            <div className={`mt-2 text-sm ${body}`}>
              Pick <span className="font-semibold">one app</span> you use daily. Screenshot one screen you dislike.
              Redesign it in a simple way (notes, paper, Canva, Figma—anything).
            </div>
            <div className={`mt-3 text-sm ${body}`}>
              Then ask 2 people:{" "}
              <span className={dark ? "text-slate-50 font-semibold" : "text-slate-900 font-semibold"}>
                “What do you think this button does?”
              </span>
            </div>
          </div>

          {/* Tiny accent bar */}
          <div className="hidden sm:block" aria-hidden>
            <div className={`h-16 w-2 rounded-full bg-gradient-to-b ${accentClass} opacity-70`} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openLaneGuide}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition active:scale-95 ${
              dark ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
            }`}
          >
            Ask the Guide <ArrowUpRight className="h-4 w-4 opacity-70" />
          </button>

          <button
            type="button"
            onClick={() => setProgress({ selectedSpecialtyIds: [] })}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition active:scale-95 ${
              dark ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
            }`}
            title="Optional: clear specialty picks if you’re restarting"
          >
            Reset picks
          </button>
        </div>
      </div>

      {/* Micro “what’s next” preview */}
      <div className={`rounded-3xl border p-4 ${surface}`}>
        <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${micro}`}>Next</div>
        <div className={`mt-2 text-sm ${body}`}>
          Choose 1–3 specialties so Everleap can tailor the deeper dive (health, games, sports, education, etc.).
        </div>
      </div>
    </div>
  );
}
