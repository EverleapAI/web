// apps/web/src/app/(app)/main/insights/fun-facts/time-twin/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PenLine,
  ScrollText,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react";

import { type TimeTwin } from "../content/timeTwins";
import {
  resolveTimeTwinVisualProfile,
  type TimeTwinVisualProfileKey,
} from "../content/timeTwinVisualProfiles";
import { TimeTwinHero } from "../components/TimeTwinHero";
import { useGeneratedInsights } from "../../hooks/useGeneratedInsights";
import { sectionCard } from "../../components/sections/summaryShared";
import { ReadAtmosphere } from "../../../components/ui/ReadAtmosphere";

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

const STORY_HREF =
  "/main/story?returnTo=" + encodeURIComponent("/main/insights/fun-facts/time-twin");

type TwinReaction = "thats_me" | "a_little" | "not_me";

const REACTION_ENDPOINT = "/api/guidance/time-twin-reaction";

const REACTION_OPTIONS: {
  v: TwinReaction;
  label: string;
  rgb: string;
  Icon: typeof Check;
}[] = [
  { v: "thats_me", label: "That’s me!", rgb: "52, 211, 153", Icon: Check },
  { v: "a_little", label: "A little like me", rgb: "245, 176, 90", Icon: Sparkles },
  { v: "not_me", label: "Definitely not me!", rgb: "236, 120, 165", Icon: X },
];

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
    figureSlug: person.imageSlug,
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


// A subtle accent-tinted card surface (corner halo + faint accent border) — the
// "gallery" treatment the other pages use, so each figure's page reads as one
// world in their own colour.
function accentCardStyle(accentRgb: string): React.CSSProperties {
  return {
    borderColor: `rgba(${accentRgb}, 0.2)`,
    background: `radial-gradient(220px 150px at 92% 0%, rgba(${accentRgb},0.14), transparent 70%), linear-gradient(180deg, rgb(14,18,31) 0%, rgb(8,12,26) 45%, rgb(4,8,20) 100%)`,
    boxShadow: `inset 0 0 0 1px rgba(${accentRgb},0.06), 0 18px 46px rgba(0,0,0,0.42)`,
  };
}

const ACCENT_CARD_CLASS = "relative overflow-hidden rounded-card border";

function SectionTitle({
  children,
  accentRgb = "147, 197, 253",
  icon,
}: {
  children: React.ReactNode;
  accentRgb?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {icon ? (
        <span
          className="flex h-6 w-6 items-center justify-center rounded-control"
          style={{ background: `rgba(${accentRgb},0.14)`, color: `rgba(${accentRgb},0.98)` }}
        >
          {icon}
        </span>
      ) : (
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: `rgba(${accentRgb},0.9)` }} />
      )}
      <h2
        className="text-[0.72rem] font-semibold uppercase tracking-eyebrow"
        style={{ color: `rgba(${accentRgb},0.9)` }}
      >
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

  const { activeTwin } = React.useMemo(() => {
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

  const currentIndex = scoredTwins.findIndex((t) => t.id === activeTwinId);
  const [advanceBanner, setAdvanceBanner] = React.useState<string | null>(null);
  const [reaction, setReaction] = React.useState<TwinReaction | null>(null);
  const [showAnswerMore, setShowAnswerMore] = React.useState(false);
  const [storyDone, setStoryDone] = React.useState<boolean | null>(null);

  // The stable library slug the reaction is keyed by (falls back to the id).
  const activeFigureSlug = activeTwin?.figureSlug || activeTwin?.id || "";

  // Whether any Story questions remain — decides the end-of-queue behaviour.
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/story/next")
      .then((r) => r.json())
      .then((d: { ok?: boolean; done?: boolean }) => {
        if (!cancelled) setStoryDone(d?.ok ? !!d.done : null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Load this figure's saved reaction whenever the active twin changes, so a
  // "That's me!" lock or an "A little like me" tap survives a reload.
  React.useEffect(() => {
    if (!activeFigureSlug) return;
    let cancelled = false;
    setReaction(null);
    fetch(`${REACTION_ENDPOINT}?figureSlug=${encodeURIComponent(activeFigureSlug)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d: { ok?: boolean; reaction?: TwinReaction | null }) => {
        if (!cancelled && d?.ok) setReaction(d.reaction ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeFigureSlug]);

  const persistReaction = React.useCallback(
    (slug: string, next: TwinReaction | null) => {
      if (!slug) return;
      fetch(REACTION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ figureSlug: slug, reaction: next ?? "" }),
      }).catch(() => {});
    },
    []
  );

  const scrollTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Only "Definitely not me!" advances through the queue; the reaction for the
  // next figure loads fresh via the effect above.
  const advanceTwin = React.useCallback(() => {
    const next = currentIndex + 1;
    if (currentIndex >= 0 && next < scoredTwins.length) {
      setActiveTwinId(scoredTwins[next].id);
      setAdvanceBanner("Here’s another mind we think is like you.");
      scrollTop();
    } else if (storyDone === false) {
      // Still questions to answer — send them to sharpen the matches.
      setShowAnswerMore(true);
    } else {
      // Nothing more to answer — loop back to the top of the queue.
      if (scoredTwins.length) setActiveTwinId(scoredTwins[0].id);
      setAdvanceBanner("Well, let’s take a look at those again.");
      scrollTop();
    }
  }, [currentIndex, scoredTwins, storyDone]);

  const reactTwin = (v: TwinReaction) => {
    if (!activeFigureSlug) return;
    if (v === "not_me") {
      // "Definitely not me!" — log it, then move on to the next in the queue.
      persistReaction(activeFigureSlug, "not_me");
      advanceTwin();
      return;
    }
    // "That's me!" and "A little like me" both persist and STAY put — the pills
    // never disappear, the chosen one just lights up (tap it again to clear).
    const next: TwinReaction | null = reaction === v ? null : v;
    setReaction(next);
    setAdvanceBanner(null);
    persistReaction(activeFigureSlug, next);
  };

  // Playful manual browse — step to the next figure in the queue, wrapping
  // around, with no "N of 5" counter. Just "show me another".
  const cycleTwin = React.useCallback(
    (dir: 1 | -1) => {
      if (scoredTwins.length < 2 || currentIndex < 0) return;
      const nextIndex =
        (currentIndex + dir + scoredTwins.length) % scoredTwins.length;
      setActiveTwinId(scoredTwins[nextIndex].id);
      setAdvanceBanner(null);
      setShowAnswerMore(false);
      scrollTop();
    },
    [currentIndex, scoredTwins]
  );

  if (fetchDone && !activeTwin) {
    return (
      <main className="relative min-h-screen text-white">
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
      <main className="relative min-h-screen text-white">
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
    <main className="relative min-h-screen text-white">
      {/* Same background as Today: the app's very dark ground (AppChrome shows
          through) with a muted constellation, not a colored wash. */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <ReadAtmosphere seed="time-twin" accent={{ r: 120, g: 150, b: 220 }} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-12 pt-5 sm:px-6 lg:px-8">
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

        <header>
          <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-eyebrow text-white/45">
            Insights → Fun Facts
          </p>
          <h1
            className="text-read leading-read tracking-tight text-white"
            style={{ fontFamily: SERIF, fontWeight: 600 }}
          >
            A mind from another era that rhymes with yours.
          </h1>
          <p className="mt-3 text-read leading-read text-white/68">
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

        {/* Playful browse — step through the matched minds by hand. No counter,
            no "N of 5"; it's just a little fun. */}
        {scoredTwins.length > 1 ? (
          <div className="mx-auto flex w-full max-w-3xl justify-center">
            <div
              className="inline-flex items-center gap-1 rounded-full border p-1"
              style={{
                borderColor: `rgba(${accentRgb},0.24)`,
                background: `rgba(${accentRgb},0.06)`,
              }}
            >
              <button
                type="button"
                onClick={() => cycleTwin(-1)}
                aria-label="Show a different mind"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => cycleTwin(1)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-meta font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Show me another
              </button>
              <button
                type="button"
                onClick={() => cycleTwin(1)}
                aria-label="Show a different mind"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {/* React to the match — the alternates are the queue, revealed one at a
            time as you rule figures out. */}
        <section className="mx-auto w-full max-w-3xl">
          {advanceBanner ? (
            <div
              className="mb-3 flex items-center gap-2 rounded-panel border px-3.5 py-2 text-meta"
              style={{
                borderColor: `rgba(${accentRgb},0.3)`,
                background: `rgba(${accentRgb},0.08)`,
                color: `rgba(${accentRgb},0.95)`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {advanceBanner}
            </div>
          ) : null}

          {showAnswerMore ? (
            <div className={cn(ACCENT_CARD_CLASS, "px-5 py-5")} style={accentCardStyle(accentRgb)}>
              <h2 className="text-body font-semibold text-white">None of these feel like you?</h2>
              <p className="mt-1.5 text-meta leading-read text-white/64">
                Answer a few more Story questions and we’ll find you fresh matches.
              </p>
              <Link
                href={STORY_HREF}
                className="mt-3 inline-flex items-center gap-1.5 text-label font-semibold"
                style={{ color: `rgba(${accentRgb},0.98)` }}
              >
                Answer a few questions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-2 px-0.5 text-meta text-white/50">Does this feel like you?</div>
              <div className="grid grid-cols-3 gap-2">
                {REACTION_OPTIONS.map(({ v, label, rgb, Icon }) => {
                  const selected = reaction === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => reactTwin(v)}
                      aria-pressed={selected}
                      className="flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                      style={{
                        borderColor: `rgba(${rgb},${selected ? 0.85 : 0.3})`,
                        background: selected
                          ? `linear-gradient(180deg, rgba(${rgb},0.28), rgba(${rgb},0.12))`
                          : `linear-gradient(180deg, rgba(${rgb},0.14), rgba(${rgb},0.05))`,
                        color: `rgba(${rgb},0.97)`,
                        boxShadow: selected ? `inset 0 0 0 1px rgba(${rgb},0.5)` : undefined,
                      }}
                    >
                      <Icon size={18} strokeWidth={2.1} />
                      <span className="text-meta font-semibold leading-tight text-white/85">{label}</span>
                    </button>
                  );
                })}
              </div>

              {reaction === "thats_me" ? (
                <div className="mt-2.5 flex items-center gap-2 px-0.5">
                  <Check className="h-4 w-4" style={{ color: "rgb(52, 211, 153)" }} />
                  <span className="text-meta font-semibold" style={{ color: "rgb(52, 211, 153)" }}>
                    {activeTwin.name} is your Time Twin.
                  </span>
                </div>
              ) : reaction === "a_little" ? (
                <p className="mt-2 px-0.5 text-meta text-white/55">
                  Noted — a little like you. Keep browsing, or settle on this one.
                </p>
              ) : null}
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left column — the story + why + facts */}
          <div className="space-y-6">
            <section
              className={cn(ACCENT_CARD_CLASS, "px-5 py-5 sm:px-6 sm:py-6")}
              style={accentCardStyle(accentRgb)}
            >
              <SectionTitle accentRgb={accentRgb} icon={<ScrollText className="h-3.5 w-3.5" />}>
                The story
              </SectionTitle>

              <div className="space-y-4 text-read leading-read text-white/78">
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
              <section
                className={cn(ACCENT_CARD_CLASS, "px-5 py-5 sm:px-6 sm:py-6")}
                style={accentCardStyle(accentRgb)}
              >
                <SectionTitle accentRgb={accentRgb} icon={<Sparkles className="h-3.5 w-3.5" />}>
                  Why this rhymes with you
                </SectionTitle>
                <ul className="space-y-3">
                  {whyYou.map((line, index) => (
                    <li key={index} className="flex gap-3 text-read leading-read text-white/78">
                      <span
                        className="mt-[14px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
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
                    className={cn(ACCENT_CARD_CLASS, "px-4 py-4")}
                    style={accentCardStyle(accentRgb)}
                  >
                    <div
                      className="text-[0.68rem] font-semibold uppercase tracking-eyebrow"
                      style={{ color: `rgba(${accentRgb},0.85)` }}
                    >
                      {fact.title}
                    </div>
                    <p className="mt-1.5 text-read leading-read text-white/76">{fact.body}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right column — reflection */}
          <aside className="space-y-4">
            <section
              className={cn(ACCENT_CARD_CLASS, "px-5 py-5 sm:px-6 sm:py-6")}
              style={accentCardStyle(accentRgb)}
            >
              <SectionTitle accentRgb={accentRgb} icon={<PenLine className="h-3.5 w-3.5" />}>
                Your reflection
              </SectionTitle>

              <p className="mb-3 text-read leading-read text-white/63">
                What feels familiar here? What feels surprising? You do not have to be the
                same person to recognize a shared pattern.
              </p>

              <textarea
                value={reflection}
                onChange={(event) => handleReflectionChange(event.target.value)}
                placeholder={`Write a few thoughts about ${activeTwin.name}…`}
                className={cn(
                  "min-h-[160px] w-full rounded-panel border border-white/12 bg-black/20 px-4 py-3",
                  "text-read leading-read text-white placeholder:text-white/28",
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

