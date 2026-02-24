// src/app/main/insights/tabs/MotivationsTab.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import type { InsightsTab } from "@/app/(app)/main/insights/app/buildInsightsViewModel";

/* =============================================================================
   Types (safe extraction from VM without `any`)
   ============================================================================= */

type UnlockItem = { id: string; label: string; href?: string };
type PrimaryUnlock = { items?: UnlockItem[] };

type MotivationsLike = {
  headline?: string;
  storySoFar?: string[];
  drivers?: { label: string; strength?: number }[];
  boosts?: string[];
  drains?: string[];
  experiment?: { title?: string; steps?: string[] };
  primaryUnlock?: PrimaryUnlock;
};

type SummaryLike = {
  headline?: string;
  storySoFar?: string[];
  primaryUnlock?: PrimaryUnlock;
};

type ViewModelLike = {
  tab?: InsightsTab;
  motivations?: MotivationsLike;
  summary?: SummaryLike;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function asUnlock(v: unknown): PrimaryUnlock | null {
  if (!isRecord(v)) return null;
  const items = (v.items as unknown) ?? null;
  if (!Array.isArray(items)) return { items: [] };
  const safe = items
    .map((it): UnlockItem | null => {
      if (!isRecord(it)) return null;
      const id = asString(it.id, "");
      const label = asString(it.label, "");
      const href = typeof it.href === "string" ? it.href : undefined;
      if (!id || !label) return null;
      return { id, label, href };
    })
    .filter((x): x is UnlockItem => !!x);

  return { items: safe };
}

/* =============================================================================
   UI helpers
   ============================================================================= */

function textAffordance(dark: boolean) {
  return [
    "inline-flex items-center gap-2",
    "text-sm font-semibold",
    "transition",
    dark ? "text-white/70 hover:text-white/90" : "text-slate-700 hover:text-slate-900",
    "focus-visible:outline-none",
    dark ? "focus-visible:ring-2 focus-visible:ring-white/14" : "focus-visible:ring-2 focus-visible:ring-slate-900/10",
  ].join(" ");
}

function fadeMaskStyle(): React.CSSProperties {
  return {
    WebkitMaskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 64%, rgba(0,0,0,0) 100%)",
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 64%, rgba(0,0,0,0) 100%)",
  };
}

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[26px] border",
    "px-4 py-4 md:px-5 md:py-5",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/22" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function softDivider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function tinyLabel(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.16em]",
    dark ? "text-white/50" : "text-slate-500",
  ].join(" ");
}

function sectionTitle(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function sectionMuted(dark: boolean) {
  return dark ? "text-white/62" : "text-slate-600";
}

function bodyText(dark: boolean) {
  return dark ? "text-slate-200/90" : "text-slate-700";
}

function pillButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-xs font-semibold transition active:scale-95",
    dark ? "border-white/10 bg-white/6 text-white/78 hover:bg-white/10" : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
    dark ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function emphasisPill(dark: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1",
    "text-xs font-semibold",
    dark ? "border-white/10 bg-white/6 text-white/86" : "border-black/10 bg-white text-slate-800",
  ].join(" ");
}

function railDot(dark: boolean) {
  return (
    <span
      aria-hidden
      className={[
        "mt-[6px] h-2 w-2 shrink-0 rounded-full",
        dark ? "bg-amber-300/75 ring-1 ring-amber-300/20" : "bg-amber-500/80 ring-1 ring-amber-900/10",
      ].join(" ")}
    />
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export function MotivationsTab(props: {
  dark: boolean;
  mounted: boolean;
  vm: unknown;
  router: AppRouterInstance;
}) {
  const { dark, vm, router } = props;

  const v = (isRecord(vm) ? (vm as ViewModelLike) : ({} as ViewModelLike)) as ViewModelLike;

  const motivations = (v.motivations ?? {}) as MotivationsLike;
  const summary = (v.summary ?? {}) as SummaryLike;

  const headline = asString(motivations.headline, "").trim() || "Motivations";

  const story = asStringArray(motivations.storySoFar);
  const storyCollapsed = story.slice(0, 2);
  const storyExpandedItems = story.slice(0, 7);

  const storyTextCollapsed = storyCollapsed
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const storyTextExpanded = storyExpandedItems
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const canToggleStory = storyExpandedItems.length > 0 && story.length > 2;

  const drivers =
    Array.isArray(motivations.drivers)
      ? motivations.drivers
          .filter((d): d is { label: string; strength?: number } => !!d && typeof d.label === "string")
          .slice(0, 5)
      : [];

  const boosts = Array.isArray(motivations.boosts)
    ? motivations.boosts.filter((x): x is string => typeof x === "string").slice(0, 5)
    : [];

  const drains = Array.isArray(motivations.drains)
    ? motivations.drains.filter((x): x is string => typeof x === "string").slice(0, 5)
    : [];

  const experiment = isRecord(motivations.experiment) ? motivations.experiment : null;
  const experimentTitle = asString(experiment?.title, "One small experiment");
  const experimentSteps = Array.isArray(experiment?.steps)
    ? (experiment?.steps ?? []).filter((x): x is string => typeof x === "string").slice(0, 4)
    : [];

  // Pull state-aware nudge from motivations first, then summary
  const unlock = asUnlock(motivations.primaryUnlock) ?? asUnlock(summary.primaryUnlock) ?? { items: [] };

  const [storyExpanded, setStoryExpanded] = React.useState(false);

  const storyFallback =
    "Tell me what pulls you forward, what drains you, and what lights you up. Then I can reflect it back with precision.";

  return (
    <section className="mb-6">
      <div className="relative">
        {/* One main reading surface */}
        <div className={readingSurface(dark)}>
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
          >
            <div
              className={[
                "absolute -top-14 -right-14 h-48 w-48 rounded-full blur-3xl",
                dark ? "bg-amber-300/10" : "bg-amber-400/8",
              ].join(" ")}
            />
            <div
              className={[
                "absolute -bottom-20 -left-16 h-56 w-56 rounded-full blur-3xl",
                dark ? "bg-rose-300/7" : "bg-rose-400/6",
              ].join(" ")}
            />
            <div
              className={[
                "absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl",
                dark ? "bg-emerald-300/6" : "bg-emerald-400/5",
              ].join(" ")}
            />
          </div>

          <div className="relative">
            {/* Header / narrative */}
            <div className={`text-[24px] leading-snug md:text-[28px] ${sectionTitle(dark)}`}>{headline}</div>

            <div className="mt-3">
              {!storyExpanded ? (
                <div className="relative" style={fadeMaskStyle()}>
                  <p className={`text-[15px] leading-7 md:text-[16px] ${bodyText(dark)}`}>
                    {storyTextCollapsed || storyTextExpanded || storyFallback}
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <motion.p
                    key="mot_storyExpanded"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className={`text-[15px] leading-7 md:text-[16px] ${bodyText(dark)}`}
                  >
                    {storyTextExpanded || storyTextCollapsed || storyFallback}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>

            {canToggleStory ? (
              <div className="mt-3">
                <button
                  type="button"
                  className={textAffordance(dark)}
                  onClick={() => setStoryExpanded((v2) => !v2)}
                >
                  <span aria-hidden className="opacity-80">
                    {storyExpanded ? "▾" : "▸"}
                  </span>
                  {storyExpanded ? "Read less" : "Read more"}
                </button>
              </div>
            ) : null}

            {/* State-aware nudge (compact, not a second “card”) */}
            {unlock.items?.length ? (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className={emphasisPill(dark)}>
                  <span aria-hidden className="opacity-85">✦</span>
                  Make this sharper
                </span>

                {unlock.items.slice(0, 2).map((it) =>
                  it.href ? (
                    <button
                      key={it.id}
                      type="button"
                      className={pillButton(dark)}
                      onClick={() => router.push(it.href!)}
                    >
                      <ArrowUpRight className="h-4 w-4 opacity-80" />
                      <span>{it.label}</span>
                    </button>
                  ) : null
                )}
              </div>
            ) : null}

            {/* Divider */}
            <div className={["my-6 h-px", softDivider(dark)].join(" ")} />

            {/* Drivers (editorial list) */}
            <div>
              <div className={tinyLabel(dark)}>Your drivers</div>
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                The things that pull you forward — not “traits,” not a test.
              </div>

              {drivers.length ? (
                <ul className="mt-3 space-y-2.5">
                  {drivers.map((d) => (
                    <li key={d.label} className="flex gap-3">
                      {railDot(dark)}
                      <div className="min-w-0">
                        <div className={`text-[15px] font-semibold leading-6 ${sectionTitle(dark)}`}>{d.label}</div>
                        <div className={`text-[13px] leading-6 ${sectionMuted(dark)}`}>
                          When this is present, your momentum comes easier.
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                  Nothing mapped yet — answer a few Motivation questions and these will appear.
                </div>
              )}
            </div>

            {/* Divider */}
            <div className={["my-6 h-px", softDivider(dark)].join(" ")} />

            {/* Energy map: Boosts + Drains (inside same reading surface) */}
            <div>
              <div className={tinyLabel(dark)}>Energy map</div>
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                What gives you momentum — and what quietly taxes you.
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Boosts */}
                <div>
                  <div className={`text-base font-semibold ${sectionTitle(dark)}`}>Boosts</div>
                  <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                    Conditions where you naturally get traction.
                  </div>

                  {boosts.length ? (
                    <ul className="mt-3 space-y-2">
                      {boosts.map((b, i) => (
                        <li key={`boost_${i}`} className="flex gap-2 text-sm">
                          <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                            •
                          </span>
                          <span className={dark ? "text-white/78" : "text-slate-700"}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                      We’ll fill this with specifics once you’ve answered more questions.
                    </div>
                  )}
                </div>

                {/* Drains */}
                <div>
                  <div className={`text-base font-semibold ${sectionTitle(dark)}`}>Drains</div>
                  <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                    Not “weakness.” Just stuff that costs you energy.
                  </div>

                  {drains.length ? (
                    <ul className="mt-3 space-y-2">
                      {drains.map((b, i) => (
                        <li key={`drain_${i}`} className="flex gap-2 text-sm">
                          <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                            •
                          </span>
                          <span className={dark ? "text-white/78" : "text-slate-700"}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                      As we learn more, this becomes useful for choosing environments that fit you.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className={["my-6 h-px", softDivider(dark)].join(" ")} />

            {/* One small experiment (the only distinct callout inside the surface) */}
            <div>
              <div className={tinyLabel(dark)}>One small experiment</div>
              <div className={`mt-1 text-base font-semibold ${sectionTitle(dark)}`}>{experimentTitle}</div>
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                A tiny test that makes your motivation read clearer.
              </div>

              {experimentSteps.length ? (
                <ol className="mt-3 space-y-2">
                  {experimentSteps.map((s, i) => (
                    <li key={`ex_${i}`} className="flex gap-2 text-sm">
                      <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                        {i + 1}.
                      </span>
                      <span className={dark ? "text-white/78" : "text-slate-700"}>{s}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                  We’ll turn this into a real “do this today” micro-plan once the backend is wired.
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className={`mt-6 text-xs ${dark ? "text-white/45" : "text-slate-500"}`}>
              Motivation isn’t “who you are.” It’s what makes your brain light up — and what makes it shut down.
              We use it to pick environments and next steps that fit you.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}