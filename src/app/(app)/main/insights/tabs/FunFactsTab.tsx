"use client";

import * as React from "react";
import { Sparkles, Clock3, ArrowUpRight } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import type { InsightsTab } from "@/app/(app)/main/insights/app/buildInsightsViewModel";
import { TIME_TWINS } from "../fun-facts/content/timeTwins";

/* =============================================================================
   Types (safe extraction from VM without `any`)
   ============================================================================= */

type FunFactsLike = {
  headline?: string;
  storySoFar?: string[];
  timeTwin?: {
    title?: string;
    subtitle?: string;
    teaser?: string;
    href?: string;
    badges?: string[];
    twinId?: string;
  };
};

type ViewModelLike = {
  tab?: InsightsTab;
  funFacts?: FunFactsLike;
  summary?: { headline?: string };
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

/* =============================================================================
   UI helpers (match Insights: cinematic, calm, minimal)
   ============================================================================= */

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[26px] border",
    "px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/22" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
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

function softDivider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function badge(dark: boolean) {
  return [
    "inline-flex items-center rounded-full border px-2.5 py-1",
    "text-[11px] font-semibold",
    dark ? "border-white/10 bg-white/6 text-white/70" : "border-black/10 bg-white text-slate-700",
  ].join(" ");
}

function buildTimeTwinHref(rawHref: string, twinId: string) {
  const trimmed = rawHref.trim();

  if (!trimmed) {
    return `/main/insights/fun-facts/time-twin?twin=${encodeURIComponent(twinId)}`;
  }

  if (trimmed.includes("/main/insights/fun-facts/time-twin")) {
    return trimmed.includes("?")
      ? `${trimmed}&twin=${encodeURIComponent(twinId)}`
      : `${trimmed}?twin=${encodeURIComponent(twinId)}`;
  }

  if (trimmed.includes("/main/insights/fun/time-twin")) {
    const corrected = trimmed.replace(
      "/main/insights/fun/time-twin",
      "/main/insights/fun-facts/time-twin"
    );
    return corrected.includes("?")
      ? `${corrected}&twin=${encodeURIComponent(twinId)}`
      : `${corrected}?twin=${encodeURIComponent(twinId)}`;
  }

  return `/main/insights/fun-facts/time-twin?twin=${encodeURIComponent(twinId)}`;
}

/* =============================================================================
   Component
   ============================================================================= */

export function FunFactsTab(props: {
  dark: boolean;
  mounted: boolean;
  vm: unknown;
  router: AppRouterInstance;
}) {
  const { dark, vm, router } = props;

  const v = (isRecord(vm) ? (vm as ViewModelLike) : ({} as ViewModelLike)) as ViewModelLike;

  const fun = (v.funFacts ?? {}) as FunFactsLike;

  const headline = asString(fun.headline, "").trim() || "Fun facts";
  const story = asStringArray(fun.storySoFar);

  const timeTwin = isRecord(fun.timeTwin)
    ? (fun.timeTwin as FunFactsLike["timeTwin"])
    : undefined;

  const ttTitle = asString(timeTwin?.title, "Time Twin");
  const ttSubtitle = asString(timeTwin?.subtitle, "A playful historical mirror.");
  const ttTeaser = asString(
    timeTwin?.teaser,
    "Not a personality match. More like: a vibe + a path — the kind of person your story rhymes with."
  );

  const vmTwinId = asString(timeTwin?.twinId, "").trim();
  const defaultTwinId = vmTwinId || TIME_TWINS[0]?.id || "leonardo";

  const ttHref = buildTimeTwinHref(asString(timeTwin?.href, ""), defaultTwinId);

  const ttBadges =
    Array.isArray(timeTwin?.badges) && timeTwin?.badges?.length
      ? (timeTwin?.badges ?? [])
          .filter((x): x is string => typeof x === "string")
          .slice(0, 6)
      : ["creative", "technical", "real-world impact"];

  return (
    <section className="mb-6">
      <div className="relative">
        <div className={readingSurface(dark)}>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              className={[
                "absolute -top-16 -right-16 h-52 w-52 rounded-full blur-3xl",
                dark ? "bg-violet-300/10" : "bg-violet-400/8",
              ].join(" ")}
            />
            <div
              className={[
                "absolute -bottom-24 -left-16 h-60 w-60 rounded-full blur-3xl",
                dark ? "bg-fuchsia-300/8" : "bg-fuchsia-400/6",
              ].join(" ")}
            />
            <div
              className={[
                "absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl",
                dark ? "bg-sky-300/6" : "bg-sky-400/5",
              ].join(" ")}
            />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className={`text-[24px] leading-snug md:text-[28px] ${sectionTitle(dark)}`}>
                  {headline}
                </div>
                <div className={`mt-2 text-[15px] leading-7 md:text-[16px] ${bodyText(dark)}`}>
                  Lighter, weirder, more playful — still grounded. This lane is
                  for the stuff that makes you smile *and* notice something true.
                </div>
              </div>

              <div
                className={[
                  "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                  dark
                    ? "border-white/10 bg-white/6 text-white/60"
                    : "border-black/10 bg-white text-slate-600",
                ].join(" ")}
                aria-hidden
              >
                ✦
              </div>
            </div>

            {story.length ? (
              <div className="mt-4">
                <div className={tinyLabel(dark)}>Coach note</div>
                <div className={`mt-1 text-sm leading-7 ${sectionMuted(dark)}`}>
                  {story.slice(0, 2).join(" ").trim()}
                </div>
              </div>
            ) : null}

            <div className={["my-5 h-px sm:my-6", softDivider(dark)].join(" ")} />

            <div>
              <div className={tinyLabel(dark)}>Featured</div>

              <div className="mt-2 flex items-start gap-3">
                <div
                  className={[
                    "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border",
                    dark ? "border-white/10 bg-white/6" : "border-black/10 bg-white",
                  ].join(" ")}
                  aria-hidden
                >
                  <Clock3
                    className={["h-5 w-5", dark ? "text-violet-200" : "text-violet-700"].join(" ")}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`text-base font-semibold ${sectionTitle(dark)}`}>
                      {ttTitle}
                    </div>
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        dark
                          ? "bg-white/6 text-white/70 ring-1 ring-white/10"
                          : "bg-black/5 text-slate-700 ring-1 ring-black/10",
                      ].join(" ")}
                    >
                      <Sparkles className="h-3.5 w-3.5 opacity-80" />
                      Fun Facts
                    </span>
                  </div>

                  <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                    {ttSubtitle}
                  </div>

                  <div className={`mt-3 text-[15px] leading-7 ${bodyText(dark)}`}>
                    {ttTeaser}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {ttBadges.map((b) => (
                      <span key={b} className={badge(dark)}>
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className={pillButton(dark)}
                      onClick={() => router.push(ttHref)}
                    >
                      <ArrowUpRight className="h-4 w-4 opacity-80" />
                      <span>Open Time Twin</span>
                    </button>
                  </div>

                  <div className={`mt-3 text-xs ${dark ? "text-white/45" : "text-slate-500"}`}>
                    This is meant to be *fun*. If it’s off, tell us later —
                    Everleap uses that feedback.
                  </div>
                </div>
              </div>
            </div>

            <div className={["my-5 h-px sm:my-6", softDivider(dark)].join(" ")} />

            <div>
              <div className={tinyLabel(dark)}>Coming next</div>
              <div className={`mt-2 text-sm leading-7 ${sectionMuted(dark)}`}>
                More playful reads will live here over time — little mirrors,
                small “you would probably…”, and curious patterns that don’t
                belong in the serious tabs.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}