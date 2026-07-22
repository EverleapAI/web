"use client";

import * as React from "react";

import type { MicroTaskBatchItem } from "@/lib/microTasks/useMicroTaskBatch";
import { accentForPage } from "./arrivalContext";
import type { JourneyStar } from "./JourneyConstellation";

type Phase = "checking" | "showing" | "done";

/**
 * Which of the three arrivals this is.
 *
 * "story"  — just came out of Story having actually answered something. A
 *            celebration and the map, already lit by how much they've used.
 * "plain"  — everything else. The question, and nothing ceremonial.
 *
 * There is no first-run state here any more. It lived here and produced TWO
 * welcomes for a new user — the narrated intro at /main/intro, then a separate
 * "Welcome to Everleap" on reaching Today. The tour now belongs to the intro,
 * which already owned that moment.
 */
export type ArrivalKind = "story" | "plain";

type JourneyState = { kind: ArrivalKind; stars: JourneyStar[] };

const STORY_FLAG = "everleap_story_answered";

/** Did this trip through Story produce an answer? Reading it consumes it. */
function takeStoryFlag(): boolean {
  try {
    if (window.sessionStorage.getItem(STORY_FLAG) !== "1") return false;
    window.sessionStorage.removeItem(STORY_FLAG);
    return true;
  } catch {
    return false;
  }
}

/**
 * Decides whether the arrival interstitial plays on this screen, and spends one
 * of the appearances if it does.
 *
 * TIMING IS THE WHOLE DESIGN HERE. The first version waited for the page's
 * guidance to load, then made two round-trips before it could decide — so Today
 * rendered fully, and the interstitial dropped on top of it a moment later. It
 * looked like a mistake, because it was one.
 *
 * So:
 *   1. Eligibility is fetched on MOUNT, in parallel with the page's own data.
 *      It is a cheap read and it is almost always back first, since guidance is
 *      the slow one.
 *   2. When the questions arrive and we already know we're eligible, the
 *      interstitial shows IMMEDIATELY and the claim is written in the
 *      background. Waiting for the write would put the flicker straight back.
 *   3. If that write comes back refused — the limit was already spent in
 *      another tab — it closes itself. Rare, and cheaper than making everyone
 *      wait for a round-trip they'll almost never need.
 *
 * Fails open: any error resolves to "done", so the page always arrives.
 */
export function useArrivalInterstitial(
  pageKey: string,
  /** null = the screen doesn't know yet. Wait; don't assume yes. */
  enabled: boolean | null = true,
  /** Where the questions come from, if not this screen's own key. */
  taskSource?: string
) {
  const [phase, setPhase] = React.useState<Phase>("checking");
  const [eligible, setEligible] = React.useState<boolean | null>(null);
  const [journey, setJourney] = React.useState<JourneyState | null>(null);
  const [tasks, setTasks] = React.useState<MicroTaskBatchItem[]>([]);
  const [timedOut, setTimedOut] = React.useState(false);
  const accent = React.useMemo(() => accentForPage(pageKey), [pageKey]);

  // React mounts effects twice in development. Claiming is a write, so without
  // this guard a dev session would spend two appearances on one arrival — the
  // same double-invoke that once made a descent open and shut itself.
  const claimed = React.useRef(false);

  // 1) Eligibility, immediately — not waiting on the page's data.
  React.useEffect(() => {
    // Undecided is NOT permission. A screen that hasn't worked out whether it
    // has enough signal must not have that read as "go ahead" — that would show
    // the interstitial to exactly the people it is meant to skip.
    if (enabled === null) return;
    if (!enabled) {
      setEligible(false);
      return;
    }
    let alive = true;

    // The page is covered while this is undecided, so it cannot be allowed to
    // hang. But the first version of this marked the user INELIGIBLE on timeout,
    // which permanently killed the show: a response arriving even slightly late
    // was ignored, so on some accounts a screen simply never asked anything.
    //
    // Now the deadline only lifts the curtain. The answer is still honoured if
    // it beats it, and if it doesn't, we skip this arrival rather than dropping
    // an interstitial onto a page the user is already reading.
    const deadline = window.setTimeout(() => {
      if (alive) setTimedOut(true);
    }, 2500);

    (async () => {
      try {
        const res = await fetch(
          `/api/guidance/interstitial?page=${encodeURIComponent(pageKey)}` +
            (taskSource ? `&source=${encodeURIComponent(taskSource)}` : ""),
          { credentials: "include", cache: "no-store" }
        );
        const state = await res.json();
        if (!alive) return;
        setTasks(Array.isArray(state?.tasks) ? state.tasks : []);
        setEligible(Boolean(state?.eligible));
      } catch {
        if (alive) setEligible(false);
      }
    })();

    return () => {
      alive = false;
      window.clearTimeout(deadline);
    };
  }, [pageKey, enabled, taskSource]);

  // 2) Decide as soon as both halves are known.
  React.useEffect(() => {
    if (claimed.current) return;

    // Too late to be an arrival: the page is already on screen.
    if (timedOut && eligible === null) {
      claimed.current = true;
      setPhase("done");
      return;
    }

    if (enabled === null) return; // screen hasn't decided yet
    if (eligible === null) return; // still checking

    if (!eligible || !tasks.length) {
      claimed.current = true;
      setPhase("done");
      return;
    }

    // Show first, write after. The server still enforces the limit, so an
    // optimistic show can never spend an appearance it wasn't owed.
    claimed.current = true;
    setPhase("showing");

    // Which arrival is this? Read the Story flag straight away — it is
    // consumed on read, so a slow request can't let a second screen claim the
    // same celebration.
    const cameFromStory = takeStoryFlag();
    void (async () => {
      try {
        // GET, not POST: this only needs the star brightness. Claiming the
        // first run belongs to the intro, which is the one place that shows it.
        const res = await fetch("/api/guidance/journey", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        const stars: JourneyStar[] = Array.isArray(data?.stars) ? data.stars : [];
        setJourney({ kind: cameFromStory ? "story" : "plain", stars });
      } catch {
        // A failed map means a plain arrival, never a broken one.
        setJourney({ kind: cameFromStory ? "story" : "plain", stars: [] });
      }
    })();

    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/guidance/interstitial", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: pageKey }),
        });
        const result = await res.json();
        if (alive && result?.claimed === false) setPhase("done");
      } catch {
        // Keep it open. A failed write costs us the count, not the user their
        // moment — and closing on them mid-question would be worse.
      }
    })();

    return () => {
      alive = false;
    };
  }, [eligible, tasks.length, pageKey, enabled, timedOut]);

  const dismiss = React.useCallback(() => setPhase("done"), []);

  return {
    showing: phase === "showing",
    decided: phase !== "checking",
    dismiss,
    tasks,
    accent,
    /**
     * Null until the map comes back. The interstitial opens on the question
     * either way — waiting for this before showing anything would put a
     * request back on the critical path and reintroduce the flicker.
     */
    journey,
  };
}
