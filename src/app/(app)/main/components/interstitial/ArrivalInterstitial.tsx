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
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "framer-motion";
import { X } from "lucide-react";

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
  const dragControls = useDragControls();

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

  // THE BACK GESTURE, which this had no answer to.
  //
  // On a phone, back is the gesture people trust most for "get me out of this",
  // and it used to sail straight past — the interstitial is React state, not a
  // route, so back navigated the page underneath instead of closing the thing
  // on top of it. Escape covered this on a laptop and phones have no Escape.
  //
  // Same one-entry-per-open pattern as DescentShell, including the marker guard:
  // React double-invokes effects in development, and without the guard one
  // opening pushed two entries and left a spare behind, so a back press looked
  // like it did nothing.
  const onDoneRef = React.useRef(onDone);
  React.useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  React.useEffect(() => {
    if (!window.history.state?.everleapArrival) {
      window.history.pushState({ everleapArrival: true }, "", window.location.href);
    }
    const onPop = () => onDoneRef.current();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /**
   * The single exit. Every way out goes through here — the ✕, the backdrop, a
   * swipe, Skip, Escape, and answering — so there is one path to get right and
   * no spare history entry left behind by any of them.
   */
  const leave = React.useCallback(() => {
    if (window.history.state?.everleapArrival) {
      window.history.back();
      // If that pop never arrives, close anyway rather than leave a dead
      // control. Closing twice costs nothing; no way out costs everything.
      window.setTimeout(() => onDoneRef.current(), 220);
      return;
    }
    onDoneRef.current();
  }, []);

  /** Left without answering — ✕, backdrop, swipe, Skip, Escape, or back. */
  const abandon = React.useCallback(() => {
    track(pageKey, "interstitial_skipped");
    leave();
  }, [pageKey, leave]);

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
    window.setTimeout(leave, CLOSING_MS);
  }, [kind, leave]);

  const finish = React.useCallback(() => {
    setClosing(true);
    window.setTimeout(leave, CLOSING_MS);
  }, [leave]);


  if (!mounted) return null;

  // A SHEET, NOT A TAKEOVER (2026-07-22).
  //
  // This used to be an opaque full-screen panel: the page vanished, and the only
  // way back was a 13px "Skip for now" at 30% white, sitting OUTSIDE the panel
  // and below it — so on a phone, whenever the card ran past the fold, the
  // visible screen was a question with no exit on it at all. Tom, on a phone:
  // "you cannot see how to get out of it."
  //
  // Now the page stays where it is, dimmed, behind. That single change is what
  // makes it feel escapable — you can SEE the thing you asked for the whole
  // time, so the sheet reads as something on top of your screen rather than
  // somewhere you have been sent. Five ways out, all going through `leave`:
  // the ✕, the backdrop, a swipe down, Skip, Escape, and the back gesture.
  //
  // Still portalled to body: MAIN establishes its own stacking context, so a
  // fixed overlay inside it cannot sit above the app nav.
  return createPortal(
    <div
      className="fixed inset-0 z-[101] flex items-end justify-center sm:items-center sm:px-5 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label="One question before you continue"
    >
      <style>{`
        @keyframes everleapTwinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.85; }
        }
      `}</style>

      {/* The page, dimmed but present. Tapping it is the most instinctive
          dismissal there is, so it is wired to the same exit as everything
          else rather than being inert decoration. */}
      <motion.button
        type="button"
        aria-label="Close"
        onClick={abandon}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 h-full w-full cursor-default bg-[#050912]/75 backdrop-blur-[2px]"
      />

      <motion.div
        drag={reduce ? false : "y"}
        dragControls={dragControls}
        // Only the header starts a drag. With the whole sheet draggable, a
        // scroll inside it fights the dismissal and one of the two always
        // loses — usually the scroll, which strands longer questions.
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          // Distance OR speed — a flick is as clear an intention as a haul.
          if (info.offset.y > 110 || info.velocity.y > 550) abandon();
        }}
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        // Capped to the viewport, and a flex column so the scroller below can
        // take the leftover. Without the cap the sheet grew to fit its content
        // and ran off the bottom of the screen — the answer options and Skip
        // were below the fold on a 390px phone, which is the exact failure this
        // whole change exists to end. Caught by looking at a screenshot; the
        // hit-test alone reported the ✕ as fine and said nothing about it.
        className="relative flex max-h-[92vh] w-full max-w-md flex-col sm:max-h-[85vh]"
      >
        {/* The sheet chrome wraps BOTH acts, so the way out is in the same
            place whichever one you are looking at. It used to be attached to
            the question act only, which meant the map had no exit but Escape. */}
        <div
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-card border border-b-0 sm:rounded-card sm:border-b"
          style={accentPanel(a)}
        >
          <Starfield accent={a} still={Boolean(reduce)} />

          {/* Header: the grab handle and the ✕, and the only place a drag can
              start. `touch-none` stops the browser claiming the gesture for a
              scroll before framer-motion sees it. */}
          <div
            onPointerDown={(event) => {
              if (!reduce) dragControls.start(event);
            }}
            // A REAL ROW, not an overlay. The ✕ was `absolute` over the top of
            // the content, and the task card's own eyebrow carries an 84px
            // constellation svg that lands in exactly that corner — later in
            // the DOM, same stacking level, so it covered the button. The ✕
            // rendered perfectly and swallowed every click. Giving the header
            // its own height fixes the collision and the overlap at once.
            className="relative z-10 flex shrink-0 touch-none items-center px-5 pb-2 pt-3 sm:px-6"
          >
            <div className="flex-1" />

            {/* Reads as "this thing slides" without a word of instruction.
                Pointless on desktop, where there is no swipe. */}
            <div className="h-1 w-9 rounded-chip bg-white/25 sm:hidden" aria-hidden />

            <div className="flex flex-1 justify-end">
              <button
                type="button"
                onClick={abandon}
                // The header starts a drag on pointerdown and framer-motion
                // captures the pointer when it does, which would swallow the
                // click on its way to this button.
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="Close"
                // 44px of tap target. The old exit was a 13px text link at 30%
                // white BELOW the panel — off-screen on a phone whenever the
                // card ran past the fold, which is what "you cannot see how to
                // get out of it" was.
                className="-my-2 -mr-2 flex h-11 w-11 items-center justify-center rounded-control text-white/55 transition hover:bg-white/[0.07] hover:text-white/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrolls INSIDE the sheet, so the sheet itself never grows past the
              viewport and pushes its own controls off-screen. */}
          <div
            className="relative min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6"
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
          >
            <AnimatePresence mode="wait">
              {closing ? null : act === "map" ? (
                <motion.div
                  key="map"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p
                    className="mb-2 text-micro font-bold uppercase tracking-eyebrow"
                    style={{ color: `rgb(${a})` }}
                  >
                    How far you&rsquo;ve come
                  </p>
                  <p className="mb-5 text-body leading-7 text-white/78">
                    Every part of Everleap you&rsquo;ve spent time in burns a
                    little brighter. This is yours right now.
                  </p>

                  <JourneyConstellation
                    stars={stars}
                    requireAll={false}
                    onComplete={finish}
                    reduce={Boolean(reduce)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="asking"
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <TodayTinyTaskCard
                    dark
                    tasks={tasks}
                    eyebrow={retort.eyebrow}
                    intro={retort.body}
                    accent={a}
                    showProgress
                    onAllAnswered={handleAllAnswered}
                  />

                  {/* Kept alongside the ✕ because it says something the icon
                      cannot: that not answering is allowed. Legible now — it
                      was white/30, which is not an offer anyone can read. */}
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={abandon}
                      className="rounded-control px-3 py-2 text-meta font-medium text-white/55 transition hover:text-white/85"
                    >
                      Skip for now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export default ArrivalInterstitial;
