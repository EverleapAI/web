// src/app/main/explore/components/ExploreHeader.tsx
"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import type { ExploreKey, ExploreSection } from "../content/types";
import { metaForSectionKey } from "../utils/exploreModel";
import { ExploreFocusSheet } from "./ExploreFocusSheet";

export function ExploreHeader({
  sections,
  activeKey,
  onSelectKey,
  dark,
}: {
  sections: ExploreSection[];
  activeKey: ExploreKey;
  onSelectKey: (key: ExploreKey) => void;
  dark: boolean;
}) {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const activeSection =
    sections.find((s) => s.key === activeKey) ?? sections[0];
  const meta = metaForSectionKey(activeKey);

  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <div
          className={`h-5 w-[3px] rounded-full ${
            dark
              ? "bg-gradient-to-b from-sky-400/80 via-cyan-300/60 to-indigo-400/70"
              : "bg-gradient-to-b from-sky-600 via-cyan-600 to-indigo-600"
          }`}
          aria-hidden
        />

        <div className="min-w-0 flex-1">
          <div
            className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
              dark ? "text-white/70" : "text-slate-600"
            }`}
          >
            Explore
          </div>
          <div
            className={`mt-0.5 text-sm ${
              dark ? "text-white/70" : "text-slate-600"
            }`}
          >
            Let’s find what fits you.
          </div>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={`w-full rounded-2xl border px-4 py-3 text-left transition active:scale-[0.99] ${
            dark
              ? "border-white/10 bg-white/5 hover:bg-white/10"
              : "border-black/10 bg-white hover:bg-slate-50"
          }`}
          aria-label="Change explore focus"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                  dark ? "text-white/55" : "text-slate-500"
                }`}
              >
                Right now
              </div>

              <div
                className={`mt-1 flex items-center gap-2 text-base font-semibold ${
                  dark ? "text-white" : "text-slate-900"
                }`}
              >
                <span
                  className={`relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-2xl border ${
                    dark ? "border-white/10" : "border-black/10"
                  }`}
                  aria-hidden
                >
                  <span
                    className={`absolute inset-0 bg-gradient-to-br ${meta.badgeHalo}`}
                  />
                  <span className={`relative text-base ${meta.badgeText}`}>
                    {meta.badgeIcon}
                  </span>
                </span>

                <span className="truncate">{activeSection?.label}</span>
              </div>

              <div
                className={`mt-1 text-sm ${
                  dark ? "text-white/65" : "text-slate-600"
                }`}
              >
                Tap to switch lanes.
              </div>
            </div>

            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
                dark
                  ? "border-white/10 bg-white/5 text-white/80"
                  : "border-black/10 bg-white text-slate-800"
              }`}
              aria-hidden
            >
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </button>
      </div>

      <ExploreFocusSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        sections={sections}
        activeKey={activeKey}
        onSelect={onSelectKey}
        dark={dark}
      />
    </div>
  );
}