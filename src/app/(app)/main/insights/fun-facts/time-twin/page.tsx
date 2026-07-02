// apps/web/src/app/(app)/main/insights/fun-facts/time-twin/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";

import { type TimeTwin } from "../content/timeTwins";
import {
  resolveTimeTwinVisualProfile,
  type TimeTwinVisualProfileKey,
} from "../content/timeTwinVisualProfiles";
import {
  TimeTwinHero,
  type TimeTwinHeroAlternate,
} from "../components/TimeTwinHero";
import { useGeneratedInsights } from "../../hooks/useGeneratedInsights";

/* =============================================================================
   Types
============================================================================= */

type TimeTwinPersonPayload = {
  name: string;
  era: string;
  tagline: string;
  mindType: string;
  visualProfileKey: TimeTwinVisualProfileKey;
  whyYou: string[];
  tiles: { title: string; body: string }[];
  storyBeats: { body: string }[];
  superpower: string;
  watchout: string;
  tryThisWeek: string;
  learnMoreHref: string;
};

type GeneratedTimeTwinPayload = {
  primary?: TimeTwinPersonPayload;
  alternates?: TimeTwinPersonPayload[];
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

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "twin"
  );
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

function personToTimeTwin(person: TimeTwinPersonPayload): TimeTwin {
  const visual = resolveTimeTwinVisualProfile(person.visualProfileKey);

  return {
    id: slugify(person.name),
    name: person.name,
    era: person.era,
    tagline: person.tagline,
    heroImage: "",
    portraitImage: "",
    visualTheme: visual.visualTheme,
    portraitArchetype: visual.portraitArchetype,
    heroPattern: visual.heroPattern,
    accentRgb: visual.accentRgb,
    mindType: person.mindType,
    whyYou: person.whyYou,
    tiles: person.tiles,
    storyBeats: person.storyBeats,
    superpower: person.superpower,
    watchout: person.watchout,
    tryThisWeek: person.tryThisWeek,
    learnMore: person.learnMoreHref,
  };
}

function buildDisplayPool(scoredTwins: TimeTwin[], activeTwinId: string) {
  const activeTwin =
    scoredTwins.find((twin) => twin.id === activeTwinId) ?? scoredTwins[0] ?? null;

  if (!activeTwin) return { activeTwin: null, alternates: [] as TimeTwin[] };

  const alternates = dedupeTwins(
    scoredTwins.filter((twin) => twin.id !== activeTwin.id)
  ).slice(0, 4);

  return { activeTwin, alternates };
}

function rgbString(rgb?: { r: number; g: number; b: number }) {
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
  const beats = twin.storyBeats ?? [];

  return {
    intro: beats[0]?.body ?? "",
    connection: beats[1]?.body ?? "",
    reflection: beats[2]?.body ?? "",
  };
}

/* =============================================================================
   Page
============================================================================= */

export default function TimeTwinPage() {
  const { payload, fetchDone } = useGeneratedInsights<GeneratedTimeTwinPayload>(
    "/api/guidance/insights-time-twin"
  );

  const [activeTwinId, setActiveTwinId] = React.useState<string>("");
  const [reflection, setReflection] = React.useState("");
  const [selectionEpoch, setSelectionEpoch] = React.useState(0);

  const scoredTwins = React.useMemo<TimeTwin[]>(() => {
    if (!payload?.primary) return [];

    const primary = personToTimeTwin(payload.primary);
    const alternates = (payload.alternates ?? []).map(personToTimeTwin);

    return dedupeTwins([primary, ...alternates]);
  }, [payload]);

  React.useEffect(() => {
    if (scoredTwins.length === 0) return;
    setActiveTwinId((current) =>
      scoredTwins.some((twin) => twin.id === current) ? current : scoredTwins[0].id
    );
  }, [scoredTwins]);

  const { activeTwin, alternates } = React.useMemo(() => {
    return buildDisplayPool(scoredTwins, activeTwinId);
  }, [activeTwinId, scoredTwins]);

  const heroAlternates = React.useMemo<TimeTwinHeroAlternate[]>(() => {
    return alternates.map((twin) => ({
      id: twin.id,
      name: twin.name,
      accentRgb: twin.accentRgb,
    }));
  }, [alternates]);

  React.useEffect(() => {
    if (!activeTwin?.id) return;

    try {
      const saved = window.localStorage.getItem(reflectionStorageKey(activeTwin.id)) ?? "";
      setReflection(saved);
    } catch {
      setReflection("");
    }
  }, [activeTwin?.id]);

  const handleReflectionChange = React.useCallback(
    (value: string) => {
      if (!activeTwin?.id) return;
      setReflection(value);

      try {
        window.localStorage.setItem(reflectionStorageKey(activeTwin.id), value);
      } catch {
        // no-op
      }
    },
    [activeTwin?.id]
  );

  const handleSelectTwin = React.useCallback((twinId: string) => {
    setActiveTwinId((current) => {
      if (current === twinId) return current;
      return twinId;
    });
    setSelectionEpoch((value) => value + 1);
  }, []);

  if (fetchDone && !activeTwin) {
    return (
      <main className="min-h-screen bg-[#070b17] text-white">
        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-12 pt-5 sm:px-6">
          <Link
            href="/main/insights?tab=funFacts"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white/82 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Fun Facts
          </Link>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/56">
            Still building your Time Twin — answer a few Story questions and check back
            in a bit.
          </div>
        </div>
      </main>
    );
  }

  if (!activeTwin) {
    return (
      <main className="min-h-screen bg-[#070b17] text-white">
        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-12 pt-5 sm:px-6">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/56">
            Loading your Time Twin…
          </div>
        </div>
      </main>
    );
  }

  const narrative = extractNarrative(activeTwin);
  const accentRgb = rgbString(activeTwin.accentRgb);

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
            href="/main/insights?tab=funFacts"
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
            "relative overflow-hidden px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6"
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
                mindType={activeTwin.mindType ?? ""}
                heroImage={activeTwin.heroImage}
                portraitImage={activeTwin.portraitImage}
                visualTheme={activeTwin.visualTheme}
                portraitArchetype={activeTwin.portraitArchetype}
                heroPattern={activeTwin.heroPattern}
                accentRgb={activeTwin.accentRgb ?? { r: 147, g: 197, b: 253 }}
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

            {activeTwin.learnMore ? (
              <div className="mt-5">
                <a
                  href={activeTwin.learnMore}
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
                  "outline-none transition focus:border-white/20 focus:bg-black/26"
                )}
              />

              <p className="mt-3 text-xs text-white/42">
                Saved automatically for this Time Twin.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
