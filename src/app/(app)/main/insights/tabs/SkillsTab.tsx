// src/app/main/insights/tabs/SkillsTab.tsx
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

type SkillsLike = {
  headline?: string;
  storySoFar?: string[];

  // “skills map” / tags
  skills?: { label: string; strength?: number }[];

  // supporting blocks
  strongestRightNow?: string[];
  nextToBuild?: string[];

  experiment?: { title?: string; steps?: string[] };

  primaryUnlock?: PrimaryUnlock;
};

type SummaryLike = {
  primaryUnlock?: PrimaryUnlock;
};

type ViewModelLike = {
  tab?: InsightsTab;
  skills?: SkillsLike;
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
   UI helpers (cinematic, one reading surface)
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
    dark
      ? "border-white/10 bg-white/6 text-white/78 hover:bg-white/10"
      : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
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
        dark ? "bg-cyan-300/75 ring-1 ring-cyan-300/20" : "bg-cyan-500/80 ring-1 ring-cyan-900/10",
      ].join(" ")}
    />
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export function SkillsTab(props: {
  dark: boolean;
  mounted: boolean;
  vm: unknown;
  router: AppRouterInstance;
}) {
  const { dark, vm, router } = props;

  const v = (isRecord(vm) ? (vm as ViewModelLike) : ({} as ViewModelLike)) as ViewModelLike;

  const skills = (v.skills ?? {}) as SkillsLike;
  const summary = (v.summary ?? {}) as SummaryLike;

  const headline = asString(skills.headline, "").trim() || "Skills";

  const story = asStringArray(skills.storySoFar);
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

  const tools =
    Array.isArray(skills.skills)
      ? skills.skills
          .filter((d): d is { label: string; strength?: number } => !!d && typeof d.label === "string")
          .slice(0, 7)
      : [];

  const strongestRightNow = Array.isArray(skills.strongestRightNow)
    ? skills.strongestRightNow.filter((x): x is string => typeof x === "string").slice(0, 5)
    : [];

  const nextToBuild = Array.isArray(skills.nextToBuild)
    ? skills.nextToBuild.filter((x): x is string => typeof x === "string").slice(0, 5)
    : [];

  const experiment = isRecord(skills.experiment) ? skills.experiment : null;
  const experimentTitle = asString(experiment?.title, "One small build");
  const experimentSteps = Array.isArray(experiment?.steps)
    ? (experiment?.steps ?? []).filter((x): x is string => typeof x === "string").slice(0, 4)
    : [];

  const unlock = asUnlock(skills.primaryUnlock) ?? asUnlock(summary.primaryUnlock) ?? { items: [] };

  const [storyExpanded, setStoryExpanded] = React.useState(false);

  const storyFallback =
    "Skills aren’t labels. They’re tools you can practice, prove, and stack. Give me one real example of something you made and this gets believable fast.";

  return (
    <section className="mb-6">
      <div className="relative">
        <div className={readingSurface(dark)}>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              className={[
                "absolute -top-14 -right-14 h-48 w-48 rounded-full blur-3xl",
                dark ? "bg-cyan-300/10" : "bg-cyan-400/8",
              ].join(" ")}
            />
            <div
              className={[
                "absolute -bottom-20 -left-16 h-56 w-56 rounded-full blur-3xl",
                dark ? "bg-sky-300/7" : "bg-sky-400/6",
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
            {/* Headline + narrative */}
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
                    key="skills_storyExpanded"
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

            {/* Sharpen CTA (inline) */}
            {unlock.items?.length ? (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className={emphasisPill(dark)}>
                  <span aria-hidden className="opacity-85">✦</span>
                  Add one proof point
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

            <div className={["my-6 h-px", softDivider(dark)].join(" ")} />

            {/* Tools showing up (editorial list, not chips) */}
            <div>
              <div className={tinyLabel(dark)}>Tools showing up</div>
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                The skills you’re already touching — even if you don’t call them “skills” yet.
              </div>

              {tools.length ? (
                <ul className="mt-3 space-y-2.5">
                  {tools.map((t) => (
                    <li key={t.label} className="flex gap-3">
                      {railDot(dark)}
                      <div className="min-w-0">
                        <div className={`text-[15px] font-semibold leading-6 ${sectionTitle(dark)}`}>{t.label}</div>
                        <div className={`text-[13px] leading-6 ${sectionMuted(dark)}`}>
                          This becomes “real” when it shows up in something you can point to.
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                  Nothing mapped yet — answer a few Skills questions and this becomes a real tool belt.
                </div>
              )}
            </div>

            <div className={["my-6 h-px", softDivider(dark)].join(" ")} />

            {/* Now vs next (two columns, still inside one surface) */}
            <div>
              <div className={tinyLabel(dark)}>Momentum</div>
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                What you can use today — and what to build next to unlock more doors.
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className={`text-base font-semibold ${sectionTitle(dark)}`}>Strongest right now</div>
                  <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>The stuff you can probably do today with confidence.</div>

                  {strongestRightNow.length ? (
                    <ul className="mt-3 space-y-2">
                      {strongestRightNow.map((b, i) => (
                        <li key={`srn_${i}`} className="flex gap-2 text-sm">
                          <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>•</span>
                          <span className={dark ? "text-white/78" : "text-slate-700"}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                      We’ll populate this from your answers and your “proof” (projects, logs, outcomes).
                    </div>
                  )}
                </div>

                <div>
                  <div className={`text-base font-semibold ${sectionTitle(dark)}`}>Next to build</div>
                  <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                    The “one level up” skill that would unlock more options.
                  </div>

                  {nextToBuild.length ? (
                    <ul className="mt-3 space-y-2">
                      {nextToBuild.map((b, i) => (
                        <li key={`ntb_${i}`} className="flex gap-2 text-sm">
                          <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>•</span>
                          <span className={dark ? "text-white/78" : "text-slate-700"}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                      Once we see what you like + what you’ve already touched, we can pick a smart “next brick.”
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={["my-6 h-px", softDivider(dark)].join(" ")} />

            {/* Experiment */}
            <div>
              <div className={tinyLabel(dark)}>One small build</div>
              <div className={`mt-1 text-base font-semibold ${sectionTitle(dark)}`}>{experimentTitle}</div>
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                Finish something small fast — then you’ll have proof.
              </div>

              {experimentSteps.length ? (
                <ol className="mt-3 space-y-2">
                  {experimentSteps.map((s, i) => (
                    <li key={`sk_ex_${i}`} className="flex gap-2 text-sm">
                      <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>{i + 1}.</span>
                      <span className={dark ? "text-white/78" : "text-slate-700"}>{s}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                  Example: 45 minutes. Make one tiny artifact. Then write 3 bullets: what you shipped, what was hard, what you’d do next.
                </div>
              )}
            </div>

            <div className={`mt-6 text-xs ${dark ? "text-white/45" : "text-slate-500"}`}>
              Skills aren’t your identity. They’re leverage. Stack a few and your options explode.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}