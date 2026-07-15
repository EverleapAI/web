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
import { TimeTwinHero } from "../components/TimeTwinHero";
import { TimeTwinPortrait } from "../components/TimeTwinPortrait";
import { useGeneratedInsights } from "../../hooks/useGeneratedInsights";
import { sectionCard } from "../../components/sections/summaryShared";

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
  imageSlug?: string;
};

type GeneratedTimeTwinPayload = {
  primary?: TimeTwinPersonPayload;
  alternates?: TimeTwinPersonPayload[];
};

/* =============================================================================
   Constants
============================================================================= */

const SERIF =
  '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif';

const REFLECTION_ENDPOINT = "/api/guidance/time-twin-reflection";

function figureImageUrl(slug?: string): string {
  return slug ? `/api/guidance/time-twin-figure-image?slug=${encodeURIComponent(slug)}` : "";
}

/* =============================================================================
   Helpers
============================================================================= */

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
    portraitImage: figureImageUrl(person.imageSlug),
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

// Same near-black card surface as every other card in the app.
function readingSurface() {
  return sectionCard(true);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-white/70" />
      <h2 className="text-[0.72rem] font-semibold uppercase tracking-eyebrow text-white/55">
        {children}
      </h2>
    </div>
  );
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
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Load the saved reflection for the active twin from the server.
  const activeTwinRefId = activeTwin?.id;
  React.useEffect(() => {
    if (!activeTwinRefId) return;

    let cancelled = false;
    setReflection("");
    setSaveState("idle");

    (async () => {
      try {
        const res = await fetch(
          `${REFLECTION_ENDPOINT}?twinId=${encodeURIComponent(activeTwinRefId)}`,
          { cache: "no-store" }
        );
        const data = await res.json().catch(() => null);
        if (!cancelled && data?.ok) {
          setReflection(typeof data.reflection === "string" ? data.reflection : "");
        }
      } catch {
        // leave empty on failure
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTwinRefId]);

  const handleReflectionChange = React.useCallback(
    (value: string) => {
      if (!activeTwinRefId) return;
      setReflection(value);
      setSaveState("saving");

      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await fetch(REFLECTION_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ twinId: activeTwinRefId, reflection: value }),
          });
          setSaveState("saved");
        } catch {
          setSaveState("idle");
        }
      }, 700);
    },
    [activeTwinRefId]
  );

  React.useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const handleSelectTwin = React.useCallback((twinId: string) => {
    setActiveTwinId((current) => (current === twinId ? current : twinId));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

          <div className={[sectionCard(true), "px-5 py-4 text-sm text-white/56"].join(" ")}>
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
          <div className={[sectionCard(true), "px-5 py-4 text-sm text-white/56"].join(" ")}>
            Loading your Time Twin…
          </div>
        </div>
      </main>
    );
  }

  const accentRgb = rgbString(activeTwin.accentRgb);
  const beats = activeTwin.storyBeats ?? [];
  const whyYou = activeTwin.whyYou ?? [];
  const facts = activeTwin.tiles ?? [];

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

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/main/insights?tab=funFacts"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white/82 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Fun Facts
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.72rem] uppercase tracking-eyebrow text-white/48">
            <Sparkles className="h-3.5 w-3.5" />
            Time Twin
          </div>
        </div>

        <header className="max-w-3xl">
          <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-eyebrow text-white/45">
            Insights → Fun Facts
          </p>
          <h1
            className="text-3xl leading-display tracking-tight text-white sm:text-4xl md:text-[2.7rem]"
            style={{ fontFamily: SERIF, fontWeight: 600 }}
          >
            A mind from another era that rhymes with yours.
          </h1>
          <p className="mt-3 max-w-2xl text-label leading-7 text-white/68 sm:text-body">
            This is not a clone of you. It is a historical echo — someone whose way of
            seeing, making, questioning, or enduring overlaps with your own pattern.
          </p>
        </header>

        {/* Hero — gallery plate */}
        <TimeTwinHero
          key={activeTwin.id}
          name={activeTwin.name}
          era={activeTwin.era}
          tagline={activeTwin.tagline ?? ""}
          mindType={activeTwin.mindType ?? ""}
          visualTheme={activeTwin.visualTheme}
          accentRgb={activeTwin.accentRgb ?? { r: 147, g: 197, b: 253 }}
          imageUrl={activeTwin.portraitImage || undefined}
        />

        {/* Others echoing in your orbit */}
        {alternates.length > 0 ? (
          <section>
            <SectionTitle>Others echoing in your orbit</SectionTitle>
            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {alternates.map((twin) => {
                const alt = rgbString(twin.accentRgb);
                return (
                  <button
                    key={twin.id}
                    type="button"
                    onClick={() => handleSelectTwin(twin.id)}
                    className={cn(
                      "group flex w-[150px] flex-shrink-0 flex-col items-center gap-2 rounded-panel border px-3 py-3 text-center transition",
                      "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                    )}
                    style={{ boxShadow: `inset 0 0 0 1px rgba(${alt}, 0.06)` }}
                    aria-label={`Switch to ${twin.name}`}
                  >
                    <span
                      className="rounded-control p-1"
                      style={{ border: `1px solid rgba(${alt}, 0.32)` }}
                    >
                      <TimeTwinPortrait
                        seed={twin.name}
                        accentRgb={twin.accentRgb}
                        size={56}
                        rounded={11}
                        static
                        imageUrl={twin.portraitImage || undefined}
                      />
                    </span>
                    <span
                      className="text-meta font-semibold leading-tight text-white/88"
                      style={{ fontFamily: SERIF }}
                    >
                      {twin.name}
                    </span>
                    <span className="text-micro uppercase tracking-eyebrow text-white/45">
                      {twin.era}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left column — the story + why + facts */}
          <div className="space-y-6">
            <section className={cn(readingSurface(), "px-5 py-5 sm:px-6 sm:py-6")}>
              <SectionTitle>The story</SectionTitle>

              <div className="space-y-4 text-label leading-7 text-white/78 sm:text-label">
                {beats.length > 0 ? (
                  beats.map((beat, index) => (beat.body ? <p key={index}>{beat.body}</p> : null))
                ) : (
                  <p className="text-white/56">The story is still being written.</p>
                )}
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

            {whyYou.length > 0 ? (
              <section className={cn(readingSurface(), "px-5 py-5 sm:px-6 sm:py-6")}>
                <SectionTitle>Why this rhymes with you</SectionTitle>
                <ul className="space-y-3">
                  {whyYou.map((line, index) => (
                    <li key={index} className="flex gap-3 text-label leading-7 text-white/78">
                      <span
                        className="mt-[10px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: `rgb(${accentRgb})` }}
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {facts.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {facts.map((fact, index) => (
                  <div
                    key={index}
                    className={cn(readingSurface(), "px-4 py-4")}
                  >
                    <div className="text-[0.68rem] font-semibold uppercase tracking-eyebrow text-white/44">
                      {fact.title}
                    </div>
                    <p className="mt-1.5 text-label leading-6 text-white/76">{fact.body}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right column — reflection */}
          <aside className="space-y-4">
            <section className={cn(readingSurface(), "px-5 py-5 sm:px-6 sm:py-6")}>
              <SectionTitle>Your reflection</SectionTitle>

              <p className="mb-3 text-sm leading-6 text-white/63">
                What feels familiar here? What feels surprising? You do not have to be the
                same person to recognize a shared pattern.
              </p>

              <textarea
                value={reflection}
                onChange={(event) => handleReflectionChange(event.target.value)}
                placeholder={`Write a few thoughts about ${activeTwin.name}…`}
                className={cn(
                  "min-h-[160px] w-full rounded-panel border border-white/12 bg-black/20 px-4 py-3",
                  "text-label leading-7 text-white placeholder:text-white/28",
                  "outline-none transition focus:border-white/20 focus:bg-black/26"
                )}
              />

              <p className="mt-3 text-xs text-white/42">
                {saveState === "saving"
                  ? "Saving…"
                  : saveState === "saved"
                    ? "Saved to your account."
                    : "Saved automatically to your account."}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

