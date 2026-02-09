// src/app/main/insights/tabs/SkillsTab.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Code2, Zap, Shield, ArrowUpRight, Layers } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import type { InsightsTab } from "@/app/main/insights/app/buildInsightsViewModel";

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
  watchOuts?: string[];

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
   UI helpers (match Insights tone: life + wash, not boxy)
   ============================================================================= */

function pillButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-xs font-semibold transition active:scale-95",
    dark ? "border-white/10 bg-white/6 text-white/78 hover:bg-white/10" : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
    dark ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

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

function washCard(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[22px] border",
    "backdrop-blur-2xl",
    dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/80",
  ].join(" ");
}

function tinyLabel(dark: boolean) {
  return ["text-xs font-semibold uppercase tracking-[0.18em]", dark ? "text-white/50" : "text-slate-500"].join(" ");
}

function sectionTitle(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function sectionMuted(dark: boolean) {
  return dark ? "text-white/65" : "text-slate-600";
}

function softDivider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function skillChipSkin(dark: boolean) {
  // Skills = cyan accent
  return dark
    ? "bg-cyan-300/16 text-cyan-100 ring-1 ring-cyan-300/18"
    : "bg-cyan-200/60 text-cyan-950 ring-1 ring-cyan-900/10";
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

  const headline = asString(skills.headline, "").trim() || "Your skills (so far)";

  const story = asStringArray(skills.storySoFar);
  const storyCollapsed = story.slice(0, 2);
  const storyExpandedItems = story.slice(0, 7);

  const storyTextCollapsed = storyCollapsed.map((s) => s.trim()).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  const storyTextExpanded = storyExpandedItems.map((s) => s.trim()).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

  const canToggleStory = storyExpandedItems.length > 0 && story.length > 2;

  const chips =
    Array.isArray(skills.skills)
      ? skills.skills
          .filter((d): d is { label: string; strength?: number } => !!d && typeof d.label === "string")
          .slice(0, 12)
      : [];

  const strongestRightNow = Array.isArray(skills.strongestRightNow)
    ? skills.strongestRightNow.filter((x): x is string => typeof x === "string").slice(0, 5)
    : [];

  const nextToBuild = Array.isArray(skills.nextToBuild)
    ? skills.nextToBuild.filter((x): x is string => typeof x === "string").slice(0, 5)
    : [];

  const watchOuts = Array.isArray(skills.watchOuts)
    ? skills.watchOuts.filter((x): x is string => typeof x === "string").slice(0, 4)
    : [];

  const experiment = isRecord(skills.experiment) ? skills.experiment : null;
  const experimentTitle = asString(experiment?.title, "One small build");
  const experimentSteps = Array.isArray(experiment?.steps)
    ? (experiment?.steps ?? []).filter((x): x is string => typeof x === "string").slice(0, 4)
    : [];

  const unlock = asUnlock(skills.primaryUnlock) ?? asUnlock(summary.primaryUnlock) ?? { items: [] };

  const [storyExpanded, setStoryExpanded] = React.useState(false);

  const narrativeText = dark ? "text-slate-200/88" : "text-slate-700";

  return (
    <section className="mb-6">
      <div className="relative">
        {/* HERO */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="relative pt-3 md:pt-4">
            <div className={`text-[24px] leading-snug md:text-[28px] ${dark ? "text-white" : "text-slate-900"}`}>
              {headline}
            </div>

            <div className="mt-3">
              {!storyExpanded ? (
                <div className="relative" style={fadeMaskStyle()}>
                  <p className={`text-[15px] leading-7 md:text-[16px] ${narrativeText}`}>
                    {storyTextCollapsed ||
                      storyTextExpanded ||
                      "Skills aren’t labels. They’re tools you can practice, prove, and stack. This page becomes real once you’ve answered a few Skills prompts."}
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
                    className={`text-[15px] leading-7 md:text-[16px] ${narrativeText}`}
                  >
                    {storyTextExpanded || storyTextCollapsed}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>

            {/* Read more/less UNDER the faded content */}
            {canToggleStory ? (
              <div className="mt-3">
                <button type="button" className={textAffordance(dark)} onClick={() => setStoryExpanded((v2) => !v2)}>
                  <span aria-hidden className="opacity-80">
                    {storyExpanded ? "▾" : "▸"}
                  </span>
                  {storyExpanded ? "Read less" : "Read more"}
                </button>
              </div>
            ) : null}

            {/* Accuracy callout (compact width) */}
            {unlock.items?.length ? (
              <div className="mt-5">
                <div className="flex justify-start">
                  <div className={[washCard(dark), "w-full px-4 py-3 md:max-w-[420px]"].join(" ")}>
                    <div className="pointer-events-none absolute inset-0">
                      <div className={["absolute -top-12 -right-14 h-40 w-40 rounded-full blur-3xl", dark ? "bg-cyan-300/12" : "bg-cyan-400/10"].join(" ")} />
                      <div className={["absolute -bottom-16 -left-14 h-44 w-44 rounded-full blur-3xl", dark ? "bg-sky-300/10" : "bg-sky-400/8"].join(" ")} />
                    </div>

                    <div className="relative">
                      <div className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                        Want a sharper skills read?
                      </div>
                      <div className={`mt-1 text-sm leading-relaxed ${sectionMuted(dark)}`}>
                        Give me one real example of something you built (even small). That’s how skills become believable.
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-2">
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
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Skill chips */}
          <div className="relative pt-3 md:pt-4">
            <div className={tinyLabel(dark)}>Tools showing up</div>

            <div className="mt-3">
              {chips.length ? (
                <div className="flex flex-wrap gap-2">
                  {chips.map((d) => (
                    <span
                      key={d.label}
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-3 py-2",
                        "text-sm font-semibold",
                        skillChipSkin(dark),
                      ].join(" ")}
                    >
                      <Wrench className="h-4 w-4 opacity-80" />
                      <span className="truncate">{d.label}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className={`text-sm ${sectionMuted(dark)}`}>
                  Nothing mapped yet — answer a few Skills questions and this will turn into a real “tool belt.”
                </div>
              )}
            </div>

            <div className={`mt-3 text-xs ${dark ? "text-white/45" : "text-slate-500"}`}>
              A skill isn’t “I’m good at it.” It’s “I can show it in a project.”
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={["my-6 h-px", softDivider(dark)].join(" ")} />

        {/* Strongest / Next to build */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={[washCard(dark), "px-4 py-4"].join(" ")}>
            <div className="pointer-events-none absolute inset-0">
              <div className={["absolute -top-14 -left-16 h-48 w-48 rounded-full blur-3xl", dark ? "bg-emerald-300/10" : "bg-emerald-400/10"].join(" ")} />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <Zap className={["h-5 w-5", dark ? "text-emerald-200" : "text-emerald-700"].join(" ")} />
                <div className={`text-base font-semibold ${sectionTitle(dark)}`}>Strongest right now</div>
              </div>

              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                The stuff you can probably do today with confidence.
              </div>

              {strongestRightNow.length ? (
                <ul className="mt-3 space-y-2">
                  {strongestRightNow.map((b, i) => (
                    <li key={`srn_${i}`} className="flex gap-2 text-sm">
                      <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                        •
                      </span>
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
          </div>

          <div className={[washCard(dark), "px-4 py-4"].join(" ")}>
            <div className="pointer-events-none absolute inset-0">
              <div className={["absolute -bottom-16 -right-16 h-52 w-52 rounded-full blur-3xl", dark ? "bg-amber-300/10" : "bg-amber-400/10"].join(" ")} />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <Layers className={["h-5 w-5", dark ? "text-amber-200" : "text-amber-700"].join(" ")} />
                <div className={`text-base font-semibold ${sectionTitle(dark)}`}>Next to build</div>
              </div>

              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                The “one level up” skill that would unlock more options.
              </div>

              {nextToBuild.length ? (
                <ul className="mt-3 space-y-2">
                  {nextToBuild.map((b, i) => (
                    <li key={`ntb_${i}`} className="flex gap-2 text-sm">
                      <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                        •
                      </span>
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

        {/* Watch outs + experiment */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={[washCard(dark), "px-4 py-4"].join(" ")}>
            <div className="pointer-events-none absolute inset-0">
              <div className={["absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl", dark ? "bg-rose-300/10" : "bg-rose-400/10"].join(" ")} />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <Shield className={["h-5 w-5", dark ? "text-rose-200" : "text-rose-700"].join(" ")} />
                <div className={`text-base font-semibold ${sectionTitle(dark)}`}>Watch outs</div>
              </div>

              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                The common traps when you’re trying to level up.
              </div>

              {watchOuts.length ? (
                <ul className="mt-3 space-y-2">
                  {watchOuts.map((w, i) => (
                    <li key={`sk_wo_${i}`} className="flex gap-2 text-sm">
                      <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                        •
                      </span>
                      <span className={dark ? "text-white/78" : "text-slate-700"}>{w}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                  We’ll generate these once we can see your “default move” (avoidance, perfectionism, boredom, etc.).
                </div>
              )}
            </div>
          </div>

          <div className={[washCard(dark), "px-4 py-4"].join(" ")}>
            <div className="pointer-events-none absolute inset-0">
              <div className={["absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl", dark ? "bg-sky-300/10" : "bg-sky-400/10"].join(" ")} />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <Code2 className={["h-5 w-5", dark ? "text-sky-200" : "text-sky-700"].join(" ")} />
                <div className={`text-base font-semibold ${sectionTitle(dark)}`}>{experimentTitle}</div>
              </div>

              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                A tiny build you can finish quickly — then you’ll have proof.
              </div>

              {experimentSteps.length ? (
                <ol className="mt-3 space-y-2">
                  {experimentSteps.map((s, i) => (
                    <li key={`sk_ex_${i}`} className="flex gap-2 text-sm">
                      <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                        {i + 1}.
                      </span>
                      <span className={dark ? "text-white/78" : "text-slate-700"}>{s}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={`mt-3 text-sm ${sectionMuted(dark)}`}>
                  Example: build something small in 45 minutes, then write 3 bullets: what you did, what was hard, what you’d do next.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`mt-5 text-xs ${dark ? "text-white/45" : "text-slate-500"}`}>
          Skills aren’t your identity. They’re leverage. Stack a few and your options explode.
        </div>
      </div>
    </section>
  );
}
