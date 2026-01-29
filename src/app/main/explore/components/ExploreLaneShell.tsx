// src/app/main/explore/components/ExploreLaneShell.tsx
"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { TabMeta } from "../utils/exploreModel";
import { LaneMediaBreak } from "./LaneMediaBreak";

export function ExploreLaneShell({
  dark,
  laneKicker,
  headline,
  supportLine,
  laneAccent,
  laneMeta,
  headerExpanded,
  onToggleHeaderExpanded,
}: {
  dark: boolean;
  laneKicker: string;
  headline: string;
  supportLine: string;
  laneAccent: string; // "bg-gradient-to-r ..." already included
  laneMeta: TabMeta;
  headerExpanded: boolean;
  onToggleHeaderExpanded: () => void;
}) {
  return (
    <div
      className={`mt-4 rounded-3xl border p-4 shadow-sm ${
        dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
      }`}
      style={{ overflowAnchor: "none" }}
    >
      <button
        type="button"
        onClick={onToggleHeaderExpanded}
        className="w-full text-left"
        aria-expanded={headerExpanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
                dark ? "text-white/80" : "text-slate-700"
              }`}
            >
              {laneKicker}
            </div>

            <div
              className={`mt-1 text-base font-semibold ${
                dark ? "text-white" : "text-slate-900"
              }`}
            >
              {headline}
            </div>

            <div
              className={`mt-1 text-sm ${
                dark ? "text-white/70" : "text-slate-600"
              }`}
            >
              {supportLine}
            </div>

            {!headerExpanded ? (
              <div
                className={`mt-2 text-xs font-semibold ${
                  dark ? "text-white/55" : "text-slate-600"
                }`}
              >
                Tap to expand
              </div>
            ) : null}

            <div className="mt-3 h-[2px] w-28 overflow-hidden rounded-full">
              <div
                className={`h-full w-full ${laneAccent} ${
                  dark ? "opacity-65" : "opacity-45"
                }`}
              />
            </div>

            {!headerExpanded ? (
              <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full">
                <div
                  className={`h-full w-full ${laneAccent} ${
                    dark ? "opacity-30" : "opacity-22"
                  }`}
                />
              </div>
            ) : null}
          </div>

          <span
            className={`mt-1 inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border ${
              dark ? "border-white/10" : "border-slate-200"
            }`}
            aria-hidden
          >
            {headerExpanded ? (
              <span
                className={`flex h-full w-full items-center justify-center ${
                  dark
                    ? "bg-white/5 text-white/80"
                    : "bg-white text-slate-800"
                }`}
              >
                <ChevronUp className="h-4 w-4" />
              </span>
            ) : (
              <span className="relative h-full w-full">
                <span
                  className={`absolute inset-0 ${laneAccent} ${
                    dark ? "opacity-55" : "opacity-45"
                  }`}
                />
                <span
                  className={`absolute inset-0 ${
                    dark ? "bg-slate-950/25" : "bg-white/20"
                  }`}
                />
                <span
                  className={`relative flex h-full w-full items-center justify-center ${
                    dark ? "text-white" : "text-slate-900"
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </span>
            )}
          </span>
        </div>
      </button>

      {headerExpanded ? (
        <div className="mt-3" style={{ overflowAnchor: "none" }}>
          <LaneMediaBreak
            media={laneMeta.media}
            dark={dark}
            accentHalo={laneMeta.badgeHalo}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleHeaderExpanded}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95 ${
                dark
                  ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              <ChevronUp className="h-4 w-4" />
              Collapse
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}