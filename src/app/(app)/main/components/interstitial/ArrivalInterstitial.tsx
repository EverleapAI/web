"use client";

// The arrival interstitial — the "Something I'm wondering" question, moved off
// the page and in front of it.
//
// Why it exists: as a card the question was skimmed past. Nobody had EVER
// answered one on Insights → Skills or Fun Facts (0 of 33 and 0 of 42), while
// Today, where it sits near the top of a short screen, had 30. The question
// isn't the problem; its position is.
//
// The entry says nothing about where the user came from. Two earlier versions
// did, and both produced the same failure — "You were sizing up Dancers" above
// a question about being a doctor — because the opener and the questions were
// written by different authors with no way to agree. A retort that refers only
// to the act of asking cannot contradict what it introduces.

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { MicroTaskBatchItem } from "@/lib/microTasks/useMicroTaskBatch";
import { TodayTinyTaskCard } from "../nextSteps/TodayTinyTaskCard";
import { pickRetort, type Retort } from "./retorts";
import {
  JourneyConstellation,
  type JourneyStar,
} from "./JourneyConstellation";
import type { ArrivalKind } from "./useArrivalInterstitial";

type Props = {
  tasks: MicroTaskBatchItem[];
  /** "r, g, b" — the accent of the screen being entered. */
  accent: string;
  /** The map, once it arrives. Null means a plain arrival. */
  journey?: { kind: ArrivalKind; stars: JourneyStar[] } | null;
  /** Which screen this is, for measurement. */
  pageKey: string;
  onDone: () => void;
};

/**
 * The acts of an arrival.
 *
 * "asking"  — the questions. Every arrival has this.
 * "map"     — the five-star journey, lit by how much of each section they have
 *             used. Shown after a Story trip that produced an answer.
 *
 * The first-run welcome used to be an act here, which meant a new user met two
 * welcomes. It now lives in /main/intro, the screen already built for it.
 */
type Act = "asking" | "map";

/**
 * A short beat so the last answer registers as chosen before the panel goes.
 * Deliberately too brief to carry words: an earlier version showed a line here
 * and it was gone before it could be read, which looks like a glitch rather
 * than a moment. The reward for answering is the page, not a thank-you note.
 */
const CLOSING_MS = 260;

// Same treatment as CareerCard and the Explore specialty worlds, so this belongs
// to that family rather than looking like a system dialog.
function accentPanel(a: string): React.CSSProperties {
  return {
    borderColor: `rgba(${a}, 0.28)`,
    background: `radial-gradient(300px 200px at 85% -8%, rgba(${a},0.22), transparent 70%), linear-gradient(180deg, rgb(14,18,31) 0%, rgb(8,12,26) 45%, rgb(4,8,20) 100%)`,
    boxShadow: `inset 0 0 0 1px rgba(${a},0.08), 0 24px 64px rgba(0,0,0,0.55)`,
  };
}

// Fixed positions — a starfield that reshuffles on every render reads as noise,
// and Math.random() during render would differ between server and client.
const STARS = [
  { x: 12, y: 18, r: 1.1, d: 0 },
  { x: 31, y: 9, r: 0.8, d: 1.4 },
  { x: 58, y: 22, r: 1.3, d: 0.7 },
  { x: 74, y: 12, r: 0.9, d: 2.1 },
  { x: 88, y: 28, r: 1.0, d: 1.1 },
  { x: 21, y: 34, r: 0.7, d: 2.6 },
  { x: 46, y: 5, r: 0.9, d: 1.8 },
  { x: 66, y: 37, r: 0.8, d: 0.3 },
];

/** A faint sky inside the panel. Depth, not decoration — it's the app's idiom. */
function Starfield({ accent, still }: { accent: string; still: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      {STARS.map((star, i) => (
        <circle
          key={i}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill={`rgba(${accent},0.75)`}
          style={
            still
              ? { opacity: 0.35 }
              : {
                  animation: `everleapTwinkle 4.5s ease-in-out ${star.d}s infinite`,
                }
          }
        />
      ))}
    </svg>
  );
}

/**
 * A plain cover held over everything while we work out whether an interstitial
 * is coming.
 *
 * Gating one section of Today wasn't enough — the nav, and every other section,
 * still painted underneath and then got covered a moment later. This sits at
 * the same z-index and in the same colour as the interstitial itself, so the
 * handover is invisible: cover, then content, then the page.
 *
 * The hook gives up after a short deadline, so this can never become a blank
 * screen someone is stuck behind.
 */
// useEffect runs AFTER the browser paints, so a curtain that mounts in one
// gets a visible frame of the page first — which is the flicker, again. A
// layout effect runs after render but BEFORE paint, so the second render lands
// without anything reaching the screen. Falls back to useEffect on the server,
// where useLayoutEffect warns and does nothing useful.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function ArrivalCurtain() {
  // Must render nothing on the server AND on the first client render, or the
  // markup differs and React throws a hydration mismatch — which regenerates
  // the tree and reintroduces exactly the flicker this exists to prevent.
  const [mounted, setMounted] = React.useState(false);
  useIsomorphicLayoutEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] bg-[#070b18]" aria-hidden />,
    document.body
  );
}

/**
 * Record what happened, so "is three per screen too noisy" has an answer.
 *
 * We could already see when a question was asked and when it was answered, but
 * never when someone dismissed one — so the appearance limit could only ever be
 * argued about. Shown-versus-skipped is the number that settles it.
 *
 * Fire and forget: telemetry must never delay or break the thing it measures.
 */
function track(pageKey: string, eventType: "interstitial_shown" | "interstitial_skipped") {
  try {
    void fetch("/api/track/event", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_key: pageKey, event_type: eventType }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never let measurement break the screen
  }
}

export function ArrivalInterstitial({ tasks, accent: a, journey, pageKey, onDone }: Props) {
  const reduce = useReducedMotion();
  const [closing, setClosing] = React.useState(false);

  const kind = journey?.kind ?? "plain";
  const stars = journey?.stars ?? [];

  // Every arrival opens on the question. The map, when it is earned, comes
  // after — never before, because the question is the point and the map is the
  // reward for answering it.
  const [act, setAct] = React.useState<Act>("asking");

  // Chosen once, in a lazy initializer rather than an effect, so it's ready on
  // the first render. pickRetort touches window, so this must never run on the
  // server — it doesn't, because the curtain below keeps this component out of
  // the server tree entirely.
  const [retort] = React.useState<Retort>(() => pickRetort());

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Once per opening, not per render.
  const recorded = React.useRef(false);
  React.useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    track(pageKey, "interstitial_shown");
  }, [pageKey]);

  /** Left without answering — Skip, Escape, or backing out. */
  const abandon = React.useCallback(() => {
    track(pageKey, "interstitial_skipped");
    onDone();
  }, [pageKey, onDone]);

  // Never trap. Even if the questions fail to render, this gets them out.
  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") abandon();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abandon]);

  const handleAllAnswered = React.useCallback(() => {
    // A Story exit earns the map. Everyone else has done what was asked and
    // should be let through.
    if (kind === "story") {
      setAct("map");
      return;
    }
    setClosing(true);
    window.setTimeout(onDone, CLOSING_MS);
  }, [kind, onDone]);

  const finish = React.useCallback(() => {
    setClosing(true);
    window.setTimeout(onDone, CLOSING_MS);
  }, [onDone]);


  if (!mounted) return null;

  // Portalled to body so it covers the app nav — a fixed overlay inside MAIN
  // cannot, because MAIN establishes its own stacking context.
  return createPortal(
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[101] flex items-center justify-center overflow-y-auto bg-[#070b18] px-5 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="A few questions before you continue"
    >
      <style>{`
        @keyframes everleapTwinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.85; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(65% 45% at 50% 32%, rgba(${a},0.18), transparent 72%)`,
        }}
      />

      <div className="relative w-full max-w-md">
        <AnimatePresence mode="wait">
          {closing ? null : act === "map" ? (
            <motion.div
              key="map"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="overflow-hidden rounded-card border px-5 py-6 sm:px-6"
                style={accentPanel(a)}
              >
                <p
                  className="mb-2 text-micro font-bold uppercase tracking-eyebrow"
                  style={{ color: `rgb(${a})` }}
                >
                  How far you&rsquo;ve come
                </p>
                <p className="mb-5 text-body leading-7 text-white/78">
                  Every part of Everleap you&rsquo;ve spent time in burns a little
                  brighter. This is yours right now.
                </p>

                <JourneyConstellation
                  stars={stars}
                  requireAll={false}
                  onComplete={finish}
                  reduce={Boolean(reduce)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="asking"
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div
                className="relative overflow-hidden rounded-card border px-5 py-6 sm:px-6"
                style={accentPanel(a)}
              >
                <Starfield accent={a} still={Boolean(reduce)} />

                <div className="relative">
                  <TodayTinyTaskCard
                    dark
                    tasks={tasks}
                    eyebrow={retort.eyebrow}
                    intro={retort.body}
                    accent={a}
                    showProgress
                    onAllAnswered={handleAllAnswered}
                  />
                </div>
              </div>

              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={abandon}
                  className="text-meta font-medium text-white/30 transition hover:text-white/55"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body
  );
}

export default ArrivalInterstitial;
