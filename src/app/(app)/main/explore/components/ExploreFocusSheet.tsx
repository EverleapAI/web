// src/app/main/explore/components/ExploreFocusSheet.tsx
"use client";

import * as React from "react";
import { X } from "lucide-react";

import type { ExploreKey, ExploreSection } from "../content/types";
import { metaForSectionKey } from "../utils/exploreModel";

export function ExploreFocusSheet({
  open,
  onClose,
  sections,
  activeKey,
  onSelect,
  dark,
}: {
  open: boolean;
  onClose: () => void;
  sections: ExploreSection[];
  activeKey: ExploreKey;
  onSelect: (key: ExploreKey) => void;
  dark: boolean;
}) {
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className={`absolute inset-0 ${
          dark ? "bg-black/55" : "bg-slate-900/35"
        }`}
        aria-label="Close"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
        <div
          className={`mx-auto w-full max-w-lg overflow-hidden rounded-3xl border shadow-xl ${
            dark ? "border-white/10 bg-slate-950" : "border-black/10 bg-white"
          }`}
        >
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <div className="min-w-0">
              <div
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
                  dark ? "text-white/70" : "text-slate-600"
                }`}
              >
                Explore
              </div>
              <div
                className={`mt-1 text-sm font-semibold ${
                  dark ? "text-white" : "text-slate-900"
                }`}
              >
                What do you want to explore right now?
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full border transition active:scale-95 ${
                dark
                  ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  : "border-black/10 bg-white text-slate-800 hover:bg-slate-50"
              }`}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-2 pb-3">
            <div className="space-y-1">
              {sections.map((s) => {
                const active = s.key === activeKey;
                const meta = metaForSectionKey(s.key);

                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      onSelect(s.key);
                      onClose();
                    }}
                    className={`w-full rounded-2xl px-3 py-3 text-left transition active:scale-[0.99] ${
                      active
                        ? dark
                          ? "bg-white/10"
                          : "bg-slate-900 text-white"
                        : dark
                        ? "hover:bg-white/5"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`relative mt-0.5 inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl border ${
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
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-sm font-semibold ${
                            dark ? "text-white" : active ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {s.label}
                        </div>
                        <div
                          className={`mt-0.5 text-xs leading-4 ${
                            active
                              ? dark
                                ? "text-white/70"
                                : "text-white/80"
                              : dark
                              ? "text-white/60"
                              : "text-slate-600"
                          }`}
                        >
                          {meta.subtitle || s.subtitle}
                        </div>
                      </div>

                      {active ? (
                        <div
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            dark ? "bg-sky-300/90" : "bg-white/90"
                          }`}
                          aria-hidden
                        />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}