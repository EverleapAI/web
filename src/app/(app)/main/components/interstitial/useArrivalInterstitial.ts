"use client";

import * as React from "react";

import type { MicroTaskBatchItem } from "@/lib/microTasks/useMicroTaskBatch";
import { accentForPage } from "./arrivalContext";

type Phase = "checking" | "showing" | "done";

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
  tasks: MicroTaskBatchItem[] | null | undefined,
  ready: boolean,
  enabled = true
) {
  const [phase, setPhase] = React.useState<Phase>("checking");
  const [eligible, setEligible] = React.useState<boolean | null>(null);
  const accent = React.useMemo(() => accentForPage(pageKey), [pageKey]);

  // React mounts effects twice in development. Claiming is a write, so without
  // this guard a dev session would spend two appearances on one arrival — the
  // same double-invoke that once made a descent open and shut itself.
  const claimed = React.useRef(false);

  const unanswered = React.useMemo(
    () => (tasks ?? []).filter((task) => task.selected_option_index == null),
    [tasks]
  );

  // 1) Eligibility, immediately — not waiting on the page's data.
  React.useEffect(() => {
    if (!enabled) {
      setEligible(false);
      return;
    }
    let alive = true;

    // The page is covered while this is undecided, so it cannot be allowed to
    // hang. If the answer isn't back in time, assume no interstitial and let
    // the user through — being slightly late with a question is nothing next to
    // holding someone behind a blank screen.
    const deadline = window.setTimeout(() => {
      if (alive) setEligible((current) => (current === null ? false : current));
    }, 1500);

    (async () => {
      try {
        const res = await fetch(
          `/api/guidance/interstitial?page=${encodeURIComponent(pageKey)}`,
          { credentials: "include", cache: "no-store" }
        );
        const state = await res.json();
        if (alive) setEligible(Boolean(state?.eligible));
      } catch {
        if (alive) setEligible(false);
      }
    })();

    return () => {
      alive = false;
      window.clearTimeout(deadline);
    };
  }, [pageKey, enabled]);

  // A screen whose data never loads must not leave the curtain up forever.
  // `ready` comes from each screen's own fetch, and any one of them can fail,
  // 401, or simply never resolve — without this the user is stranded behind a
  // blank cover with no way out.
  //
  // The first version of this waited 4s, which was SHORTER than Today's own
  // guidance fetch: the gate concluded there were no questions and skipped the
  // interstitial entirely on the one screen it was built for. The window has to
  // be longer than a slow-but-normal page load, and it is only reached by users
  // who are eligible anyway (see holdCurtain below), so it costs nobody else.
  const [gaveUp, setGaveUp] = React.useState(false);
  React.useEffect(() => {
    if (ready) return;
    const id = window.setTimeout(() => setGaveUp(true), 10000);
    return () => window.clearTimeout(id);
  }, [ready]);

  // 2) Decide as soon as both halves are known.
  React.useEffect(() => {
    if (claimed.current) return;

    if (gaveUp && !ready) {
      claimed.current = true;
      setPhase("done");
      return;
    }

    if (eligible === null) return; // still checking
    if (!ready) return; // page data not in yet

    if (!eligible || !unanswered.length) {
      claimed.current = true;
      setPhase("done");
      return;
    }

    // Show first, write after. The server still enforces the limit, so an
    // optimistic show can never spend an appearance it wasn't owed.
    claimed.current = true;
    setPhase("showing");

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
  }, [eligible, ready, gaveUp, unanswered.length, pageKey]);

  const dismiss = React.useCallback(() => setPhase("done"), []);

  return {
    showing: phase === "showing",
    decided: phase !== "checking",
    /**
     * Whether to cover the page while we decide.
     *
     * Only users who are actually ELIGIBLE wait behind the curtain. Everyone
     * else — most people, most of the time, since this retires after three
     * appearances per screen — sees their page immediately and never knows this
     * exists. Holding a blank cover in front of someone who was never going to
     * be asked anything is pure cost.
     */
    holdCurtain:
      eligible === null || (eligible === true && phase === "checking"),
    dismiss,
    tasks: unanswered,
    accent,
  };
}
