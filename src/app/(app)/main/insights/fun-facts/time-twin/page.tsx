// apps/web/src/app/(app)/main/insights/fun-facts/time-twin/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";

import {
  TIME_TWINS,
  getDefaultTimeTwin,
  getTimeTwinById,
  type TimeTwin,
} from "../content/timeTwins";
import { buildTimeTwinProfile } from "../app/buildTimeTwinProfile";
import { getTimeTwinSelection } from "../app/scoreTimeTwins";
import {
  TimeTwinHero,
  type TimeTwinHeroAlternate,
} from "../components/TimeTwinHero";

/* =============================================================================
   Types
============================================================================= */

type SelectionLike = {
  primary?: TimeTwin | string | null;
  primaryTwin?: TimeTwin | string | null;
  bestMatch?: TimeTwin | string | null;
  alternates?: Array<TimeTwin | string>;
  alternateTwins?: Array<TimeTwin | string>;
  ranked?: Array<TimeTwin | string>;
  matches?: Array<TimeTwin | string>;
};

type StoryBeatLike = {
  body?: string;
};

type AccentRgbLike = {
  r: number;
  g: number;
  b: number;
};

type TimeTwinWithLooseFields = TimeTwin & {
  accentRgb?: AccentRgbLike;
  storyBeats?: Array<string | StoryBeatLike>;
  heroImage?: string;
  portraitImage?: string;
  visualTheme?: string;
  portraitArchetype?: string;
  heroPattern?: string;
  mindType?: string;
  learnMoreHref?: string;
};

/* =============================================================================
   Constants
============================================================================= */

const REFLECTION_KEY_PREFIX = "everleap.timeTwin.feedback.";

/* =============================================================================
   Helpers
============================================================================= */

function reflectionStorageKey(twinId: string) {
  return `${REFLECTION_KEY_PREFIX}${twinId}`;
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function asLooseTwin(twin: TimeTwin): TimeTwinWithLooseFields {
  return twin as TimeTwinWithLooseFields;
}

function isTimeTwinLike(value: unknown): value is TimeTwin {
  return !!value && typeof value === "object" && "id" in (value as Record<string, unknown>);
}

function resolveTwin(value: TimeTwin | string | null | undefined): TimeTwin | null {
  if (!value) return null;
  if (isTimeTwinLike(value)) return value;
  if (typeof value === "string") return getTimeTwinById(value) ?? null;
  return null;
}

function dedupeTwins(input: TimeTwin[]): TimeTwin[] {
  const seen = new Set<string>();
  const output: TimeTwin[] = [];

  for (const twin of input) {
    if (!twin?.id || seen.has(twin.id)) continue;
    seen.add(twin.id);
    output.push(twin);
  }

  return output;
}

function normalizeSelection(selection: SelectionLike | null | undefined): TimeTwin[] {
  const primary =
    resolveTwin(selection?.primary) ??
    resolveTwin(selection?.primaryTwin) ??
    resolveTwin(selection?.bestMatch) ??
    null;

  const alternates = [
    ...(selection?.alternates ?? []),
    ...(selection?.alternateTwins ?? []),
    ...(selection?.ranked ?? []),
    ...(selection?.matches ?? []),
  ]
    .map(resolveTwin)
    .filter((twin): twin is TimeTwin => Boolean(twin));

  const merged = dedupeTwins([...(primary ? [primary] : []), ...alternates]);

  if (merged.length > 0) return merged;

  const fallback = getDefaultTimeTwin();
  return [fallback, ...TIME_TWINS.filter((t) => t.id !== fallback.id)];
}

function buildDisplayPool(scoredTwins: TimeTwin[], activeTwinId: string) {
  const activeTwin =
    scoredTwins.find((twin) => twin.id === activeTwinId) ??
    scoredTwins[0] ??
    getDefaultTimeTwin();

  const alternates = dedupeTwins(
    scoredTwins.filter((twin) => twin.id !== activeTwin.id),
  ).slice(0, 4);

  if (alternates.length >= 4) {
    return { activeTwin, alternates };
  }

  const filler = TIME_TWINS.filter(
    (twin) => twin.id !== activeTwin.id && !alternates.some((alt) => alt.id === twin.id),
  ).slice(0, 4 - alternates.length);

  return {
    activeTwin,
    alternates: [...alternates, ...filler].slice(0, 4),
  };
}

function rgbString(rgb?: AccentRgbLike) {
  if (!rgb) return "147, 197, 253";
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

function readingSurface() {
  return [
    "relative overflow-hidden rounded-[28px] border",
    "border-white/10 bg-white/[0.045]",
    "backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]",
  ].join(" ");
}

function sectionTitle(text: string) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-white/70" />
      <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/55">
        {text}
      </h2>
    </div>
  );
}

function extractNarrative(twin: TimeTwin) {
  const looseTwin = asLooseTwin(twin);
  const beats = looseTwin.storyBeats ?? [];

  const getBody = (beat: string | StoryBeatLike | undefined) => {
    if (!beat) return "";
    if (typeof beat === "string") return beat;
    return beat.body ?? "";
  };

  return {
    intro: getBody(beats[0]),
    connection: getBody(beats[1]),
    reflection: getBody(beats[2]),
  };
}

/* =============================================================================
   Page
============================================================================= */

export default function TimeTwinPage() {
  const [isReady, setIsReady] = React.useState(false);
  const [scoredTwins, setScoredTwins] = React.useState<TimeTwin[]>([]);
  const [activeTwinId, setActiveTwinId] = React.useState<string>("");
  const [reflection, setReflection] = React.useState("");
  const [selectionEpoch, setSelectionEpoch] = React.useState(0);

  React.useEffect(() => {
    try {
      const profile = buildTimeTwinProfile();

      const rawSelection = getTimeTwinSelection(profile) ?? null;
      const normalized = normalizeSelection(
  rawSelection as unknown as SelectionLike | null,
);

      const primary = normalized[0] ?? getDefaultTimeTwin();

      setScoredTwins(normalized);
      setActiveTwinId(primary.id);
    } catch {
      const fallback = getDefaultTimeTwin();
      setScoredTwins([fallback, ...TIME_TWINS.filter((t) => t.id !== fallback.id)]);
      setActiveTwinId(fallback.id);
    } finally {
      setIsReady(true);
    }
  }, []);

  const { activeTwin, alternates } = React.useMemo(() => {
    return buildDisplayPool(scoredTwins, activeTwinId);
  }, [activeTwinId, scoredTwins]);

  const heroAlternates = React.useMemo<TimeTwinHeroAlternate[]>(() => {
    return alternates.map((twin) => {
      const looseTwin = asLooseTwin(twin);

      return {
        id: twin.id,
        name: twin.name,
        accentRgb: looseTwin.accentRgb ?? { r: 147, g: 197, b: 253 },
      };
    });
  }, [alternates]);

  React.useEffect(() => {
    if (!activeTwin?.id) return;

    try {
      const saved = window.localStorage.getItem(reflectionStorageKey(activeTwin.id)) ?? "";
      setReflection(saved);
    } catch {
      setReflection("");
    }
  }, [activeTwin.id]);

  const handleReflectionChange = React.useCallback(
    (value: string) => {
      setReflection(value);

      try {
        window.localStorage.setItem(reflectionStorageKey(activeTwin.id), value);
      } catch {
        // no-op
      }
    },
    [activeTwin.id],
  );

  const handleSelectTwin = React.useCallback((twinId: string) => {
    setActiveTwinId((current) => {
      if (current === twinId) return current;
      return twinId;
    });
    setSelectionEpoch((value) => value + 1);
  }, []);

  const narrative = extractNarrative(activeTwin);
  const activeLooseTwin = asLooseTwin(activeTwin);
  const accentRgb = rgbString(activeLooseTwin.accentRgb);

  return (
    <main className="min-h-screen bg-[#070b17] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 18% 20%, rgba(${accentRgb}, 0.18), transparent 24%),
            radial-gradient(circle at 78% 24%, rgba(120, 119, 255, 0.12), transparent 22%),
            radial-gradient(circle at 52% 76%, rgba(${accentRgb}, 0.12), transparent 30%),
            linear-gradient(180deg, #07101f 0%, #0a1020 38%, #070b17 100%)
          `,
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/main/insights/fun-facts"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white/82 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Fun Facts
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.22em] text-white/48">
            <Sparkles className="h-3.5 w-3.5" />
            Time Twin
          </div>
        </div>

        <header className="max-w-3xl">
          <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/45">
            Insights → Fun Facts
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.8rem]">
            A mind from another era that rhymes with yours.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/68 sm:text-[16px]">
            This is not a clone of you. It is a historical echo — someone whose way of
            seeing, making, questioning, or enduring overlaps with your own pattern.
          </p>
        </header>

        <section
          className={cn(
            readingSurface(),
            "relative overflow-hidden px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6",
          )}
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background: `
                radial-gradient(circle at 50% 42%, rgba(${accentRgb}, 0.12), transparent 28%),
                linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))
              `,
            }}
          />

          <div className="relative">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-white/44">
                  Primary resonance
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {activeTwin.name}
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  {activeTwin.era}
                  {activeTwin.tagline ? ` · ${activeTwin.tagline}` : ""}
                </p>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.22em] text-white/46 sm:inline-flex">
                Tap the stars to explore alternates
              </div>
            </div>

            <div className="relative z-10">
              <TimeTwinHero
                key={`${activeTwin.id}-${selectionEpoch}`}
                name={activeTwin.name}
                era={activeTwin.era}
                tagline={activeTwin.tagline ?? ""}
                mindType={activeLooseTwin.mindType ?? ""}
                heroImage={activeLooseTwin.heroImage}
                portraitImage={activeLooseTwin.portraitImage}
                visualTheme={activeLooseTwin.visualTheme as
                  | "inventor-parchment"
                  | "inventor-electric"
                  | "scientist-luminous"
                  | "logic-victorian"
                  | "code-shadow"
                  | "cosmic-wonder"
                  | "geometry-marble"
                  | "future-dusk"
                  | "painter-bloom"
                  | "ink-moon"
                  | undefined}
                portraitArchetype={activeLooseTwin.portraitArchetype as
                  | "inventor"
                  | "scientist"
                  | "mathematician"
                  | "coder"
                  | "cosmic-guide"
                  | "philosopher"
                  | "futurist"
                  | "artist"
                  | "writer"
                  | undefined}
                heroPattern={activeLooseTwin.heroPattern as
                  | "sketch"
                  | "coil"
                  | "glass"
                  | "diagram"
                  | "grid"
                  | "stars"
                  | "geometry"
                  | "skyline"
                  | "paint"
                  | "ink"
                  | undefined}
                accentRgb={activeLooseTwin.accentRgb ?? { r: 147, g: 197, b: 253 }}
                alternates={heroAlternates}
                onSelectAlternate={handleSelectTwin}
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className={cn(readingSurface(), "px-5 py-5 sm:px-6 sm:py-6")}>
            {sectionTitle("Bio + why this fits you")}

            <div className="space-y-4 text-[15px] leading-7 text-white/76 sm:text-[15.5px]">
              {narrative.intro ? <p>{narrative.intro}</p> : null}
              {narrative.connection ? <p>{narrative.connection}</p> : null}
              {narrative.reflection ? <p>{narrative.reflection}</p> : null}
            </div>

            {typeof activeLooseTwin.learnMoreHref === "string" &&
            activeLooseTwin.learnMoreHref.length > 0 ? (
              <div className="mt-5">
                <a
                  href={activeLooseTwin.learnMoreHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-sm text-white/78 transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  Learn more about {activeTwin.name}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : null}
          </section>

          <aside className="space-y-6">
            <section className={cn(readingSurface(), "px-5 py-5 sm:px-6 sm:py-6")}>
              {sectionTitle("Your reflection")}

              <p className="mb-3 text-sm leading-6 text-white/63">
                What feels familiar here? What feels surprising? You do not have to be the
                same person to recognize a shared pattern.
              </p>

              <textarea
                value={reflection}
                onChange={(event) => handleReflectionChange(event.target.value)}
                placeholder={`Write a few thoughts about ${activeTwin.name}…`}
                className={cn(
                  "min-h-[220px] w-full rounded-[22px] border border-white/12 bg-black/20 px-4 py-3",
                  "text-[15px] leading-7 text-white placeholder:text-white/28",
                  "outline-none transition focus:border-white/20 focus:bg-black/26",
                )}
              />

              <p className="mt-3 text-xs text-white/42">
                Saved automatically for this Time Twin.
              </p>
            </section>
          </aside>
        </div>

        {!isReady ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/56">
            Loading your Time Twin…
          </div>
        ) : null}
      </div>
    </main>
  );
}