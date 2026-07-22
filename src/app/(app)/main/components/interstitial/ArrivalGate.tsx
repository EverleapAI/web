"use client";

// One wrapper that puts the arrival interstitial in front of a screen.
//
// There are eight places the "Something I'm wondering" card used to live, and
// wiring each by hand would mean eight chances to get the ordering wrong. They
// all do the same thing, so they all use this.
//
// THE PAGE IS NO LONGER HIDDEN WHILE WE DECIDE (2026-07-22).
//
// It used to be. The interstitial was an opaque full-screen panel, so a page
// that painted and was then covered looked like a mistake — and preventing that
// took a curtain, a hidden-children trick and a CSS failsafe, four separate
// causes deep. All of that existed to hide a handover that no longer happens.
//
// The interstitial is a bottom sheet now, and the page being visible behind it
// is the entire point: it is what makes the sheet feel like something on top of
// your screen rather than somewhere you have been sent. A sheet arriving over a
// rendered page reads as a sheet. So the page renders immediately, always, and
// the sheet arrives when it is ready.
//
// `ArrivalCurtain` and the hide CSS are gone with it. If a full-screen act ever
// comes back, they are in git history — but do not reach for them to solve a
// flicker the sheet does not have.
//
// The gate fetches its OWN questions rather than being handed them by the
// screen. Taking them from each screen's pipeline meant the interstitial could
// only appear once that pipeline finished — about ten seconds on Explore, whose
// tasks come from a generation endpoint. The page rendered, the user started
// reading, and the interstitial arrived on top: it looked like the screen
// rendered twice, because from the outside it did.

import * as React from "react";

import { ArrivalInterstitial } from "./ArrivalInterstitial";
import { useArrivalInterstitial } from "./useArrivalInterstitial";

type Props = {
  /** Same key the screen uses everywhere else: micro-tasks, guidance, events. */
  pageKey: string;
  /**
   * Set false when this screen has nothing to stand in front of.
   *
   * On the Insights tabs, a user without enough Story signal gets an agentic
   * entry explaining exactly that and inviting them to answer more. Asking a
   * question BEFORE that explanation is the same request twice in the wrong
   * order — and the interstitial arrives without the context that makes it make
   * sense. Let the page do its job.
   */
  enabled?: boolean | null;
  /**
   * Where this screen's questions come from, when they aren't generated under
   * its own key. The Work landing keeps its own appearance budget but borrows
   * Explore's questions.
   */
  taskSource?: string;
  children: React.ReactNode;
};

export function ArrivalGate({
  pageKey,
  enabled = true,
  taskSource,
  children,
}: Props) {
  const arrival = useArrivalInterstitial(pageKey, enabled, taskSource);

  return (
    <>
      {arrival.showing ? (
        <ArrivalInterstitial
          tasks={arrival.tasks}
          accent={arrival.accent}
          journey={arrival.journey}
          pageKey={pageKey}
          onDone={arrival.dismiss}
        />
      ) : null}

      {children}
    </>
  );
}

export default ArrivalGate;
