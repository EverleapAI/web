"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import {
  TIME_TWINS,
  getTimeTwinById,
  getDefaultTimeTwin,
  type TimeTwin,
} from "../content/timeTwins";

import { TimeTwinHero } from "../components/TimeTwinHero";

/* =============================================================================
   Helpers
============================================================================= */

type TwinVisualFields = {
  visualTheme?: string;
  portraitArchetype?: string;
  heroPattern?: string;
};

type TwinNarrativeFields = {
  intro?: string;
  connection?: string;
  reflection?: string;
  whyYou?: string[];
  storyBeats?: Array<{ body?: string }>;
};

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[28px] border",
    "px-4 py-4 md:px-6 md:py-5",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/20" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function subtleDivider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function sectionKicker(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.18em]",
    dark ? "text-white/45" : "text-slate-600",
  ].join(" ");
}

function bodyText(dark: boolean) {
  return dark ? "text-slate-200/90" : "text-slate-700";
}

function mutedText(dark: boolean) {
  return dark ? "text-white/65" : "text-slate-600";
}

function pillBase(dark: boolean, active: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold",
    "backdrop-blur-xl transition active:scale-95 select-none",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
    dark ? "border-white/10" : "border-black/10",
    active
      ? dark
        ? "bg-white/[0.10] text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
        : "bg-white text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.10)]"
      : dark
        ? "bg-white/[0.035] text-white/74 hover:bg-white/[0.06]"
        : "bg-white/80 text-slate-800 hover:bg-white",
  ].join(" ");
}

function safeLine(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function rgba(
  accent: { r: number; g: number; b: number } | undefined,
  alpha: number
) {
  const c = accent ?? { r: 255, g: 150, b: 230 };
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

function joinSentences(lines: string[]) {
  return lines.map(safeLine).filter(Boolean).join(" ");
}

function ensurePeriod(text: string) {
  const t = safeLine(text);
  if (!t) return "";
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function buildNarrative(twin: TimeTwin) {
  const t = twin as TimeTwin & TwinNarrativeFields;

  const intro = safeLine(t.intro);
  const connection = safeLine(t.connection);
  const reflection = safeLine(t.reflection);

  if (intro || connection || reflection) {
    return [intro, connection, reflection].filter(Boolean);
  }

  const beats = (t.storyBeats ?? [])
    .map((beat) => safeLine(beat?.body))
    .filter(Boolean);

  const whyYou = (t.whyYou ?? []).map(safeLine).filter(Boolean);

  const paragraph1 = joinSentences(beats.slice(0, 2));

  const paragraph2 = joinSentences([
    beats[2] ?? "",
    beats[3] ?? "",
    whyYou[0] ?? "",
    whyYou[1] ?? "",
  ]);

  const paragraph3 = joinSentences([
    whyYou.slice(2).join(" "),
    ensurePeriod(safeLine(twin.superpower)),
    ensurePeriod(safeLine(twin.watchout)),
  ]);

  return [paragraph1, paragraph2, paragraph3].filter(Boolean);
}

/* =============================================================================
   Page
============================================================================= */

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const themeId: SpotlightThemeId = "nightDusk";
  const dark = isDarkTheme(themeId);

  const twinIdRaw = searchParams?.get("twin") ?? searchParams?.get("id") ?? "";

  const twin = React.useMemo<TimeTwin>(
    () => getTimeTwinById(twinIdRaw) ?? getDefaultTimeTwin(),
    [twinIdRaw]
  );

  const accentRgb = twin.accentRgb ?? { r: 255, g: 150, b: 230 };

  const visualTwin = twin as TimeTwin & TwinVisualFields;
  const narrative = React.useMemo(() => buildNarrative(twin), [twin]);

  function goBack() {
    router.push("/main/insights?tab=funFacts");
  }

  function pickTwin(nextId: string) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("twin", nextId);
    router.replace(`/main/insights/fun-facts/time-twin?${params.toString()}`);
  }

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-3 pb-24 pt-0 sm:px-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          onClick={goBack}
          className={[
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
            "transition active:scale-95",
            dark
              ? "border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.07]"
              : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <section className="mb-6">
        <div className={readingSurface(dark)}>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              className="absolute left-1/2 top-0 h-[220px] w-[420px] -translate-x-1/2 rounded-full blur-3xl md:h-[250px] md:w-[480px]"
              style={{ background: rgba(accentRgb, dark ? 0.075 : 0.09) }}
            />
          </div>

          <div className="relative">
            <div className={sectionKicker(dark)}>Fun Facts</div>

            <div className="mt-3">
              <TimeTwinHero
                name={twin.name}
                era={twin.era}
                tagline={twin.tagline}
                mindType={twin.mindType}
                heroImage={twin.heroImage}
                portraitImage={twin.portraitImage}
                visualTheme={visualTwin.visualTheme}
                portraitArchetype={visualTwin.portraitArchetype}
                heroPattern={visualTwin.heroPattern}
                accentRgb={accentRgb}
              />
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {TIME_TWINS.slice(0, 10).map((t) => {
                  const isActive = t.id === twin.id;
                  const chipAccent = t.accentRgb ?? accentRgb;

                  return (
                    <button
                      key={t.id}
                      onClick={() => pickTwin(t.id)}
                      className={pillBase(dark, isActive)}
                      style={
                        isActive
                          ? {
                              borderColor: rgba(chipAccent, dark ? 0.38 : 0.22),
                              boxShadow: `0 0 0 1px ${rgba(
                                chipAccent,
                                dark ? 0.14 : 0.08
                              )}, 0 10px 24px rgba(0,0,0,0.14)`,
                            }
                          : undefined
                      }
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        aria-hidden
                        style={{
                          background: rgba(chipAccent, isActive ? 0.95 : 0.56),
                          boxShadow: `0 0 12px ${rgba(
                            chipAccent,
                            isActive ? 0.42 : 0.22
                          )}`,
                        }}
                      />
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

            <div className="mx-auto max-w-[700px]">
              <div className="space-y-5 md:space-y-6">
                {narrative.map((paragraph, index) => (
                  <p
                    key={`${twin.id}-paragraph-${index}`}
                    className={[
                      "text-[15px] leading-7 md:text-[17px] md:leading-8",
                      bodyText(dark),
                    ].join(" ")}
                  >
                    {paragraph}
                  </p>
                ))}

                {safeLine(twin.tryThisWeek) && (
                  <div className="pt-1">
                    <p
                      className={[
                        "text-[13px] font-semibold uppercase tracking-[0.16em]",
                        dark ? "text-white/48" : "text-slate-600",
                      ].join(" ")}
                    >
                      Try this
                    </p>
                    <p
                      className={[
                        "mt-2 text-[15px] leading-7 md:text-[16px] md:leading-8",
                        dark ? "text-white/88" : "text-slate-800",
                      ].join(" ")}
                    >
                      {safeLine(twin.tryThisWeek)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className={["text-[13px]", mutedText(dark)].join(" ")}>
                Explore the real story behind this mind.
              </div>

              <a
                href={String(twin.learnMore)}
                target="_blank"
                rel="noreferrer"
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-xl transition active:scale-95",
                  dark
                    ? "border-white/10 bg-white/[0.05] text-white/85 hover:bg-white/[0.08]"
                    : "border-black/10 bg-white text-slate-800 hover:bg-slate-50",
                ].join(" ")}
                style={{
                  borderColor: rgba(accentRgb, dark ? 0.2 : 0.12),
                  boxShadow: `0 0 20px ${rgba(accentRgb, dark ? 0.1 : 0.07)}`,
                }}
              >
                Learn more
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}