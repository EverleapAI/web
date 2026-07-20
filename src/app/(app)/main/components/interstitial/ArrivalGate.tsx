"use client";

// One wrapper that puts the arrival interstitial in front of a screen.
//
// There are eight places the "Something I'm wondering" card used to live, and
// wiring each by hand would mean eight chances to get the curtain, the ordering
// or the flicker wrong. They all do the same thing, so they all use this.
//
// WHY THE CONTENT IS HIDDEN RATHER THAN COVERED.
//
// The first version covered the page with a portalled curtain. That works for
// screens which render a skeleton first (Today, the Work landing) and fails for
// every screen that server-renders real content — Insights and Explore both
// leaked visible frames at 3-500ms. A portal cannot beat server-rendered HTML,
// because a portal needs a DOM to attach to and the HTML has already painted by
// then. Measured, not assumed.
//
// So the children arrive HIDDEN, in the server output, and are revealed once we
// know whether a question is coming. Nothing paints and then gets covered,
// because nothing paints at all.
//
// They are hidden with `visibility`, not unmounted: unmounting would reset each
// screen's state and refire its loads for a decision that resolves in a few
// hundred milliseconds.

import * as React from "react";

import type { MicroTaskBatchItem } from "@/lib/microTasks/useMicroTaskBatch";
import { ArrivalCurtain, ArrivalInterstitial } from "./ArrivalInterstitial";
import { useArrivalInterstitial } from "./useArrivalInterstitial";

type Props = {
  /** Same key the screen uses everywhere else: micro-tasks, guidance, events. */
  pageKey: string;
  tasks: MicroTaskBatchItem[] | null | undefined;
  /** True once the screen's own data has loaded and `tasks` is meaningful. */
  ready: boolean;
  /**
   * Set false when this screen has nothing to stand in front of.
   *
   * On the Insights tabs, a user without enough Story signal gets an agentic
   * entry explaining exactly that and inviting them to answer more. Asking a
   * question BEFORE that explanation is the same request twice in the wrong
   * order — and the interstitial arrives without the context that makes it make
   * sense. Let the page do its job.
   */
  enabled?: boolean;
  children: React.ReactNode;
};

// The failsafe matters more than it looks. If JavaScript dies before the gate
// resolves — a chunk fails to load, an error boundary catches something — the
// content would stay hidden forever and the app would look broken. This reveals
// it from CSS alone, with no JS involved, so the worst case is a slow screen
// rather than a blank one.
const HIDE_CSS = `
@keyframes elArrivalFailsafe { to { visibility: visible; } }
.el-arrival-hold {
  visibility: hidden;
  animation: elArrivalFailsafe 0s linear 6s forwards;
}
`;

export function ArrivalGate({
  pageKey,
  tasks,
  ready,
  enabled = true,
  children,
}: Props) {
  const arrival = useArrivalInterstitial(pageKey, tasks, ready, enabled);

  return (
    <>
      <style>{HIDE_CSS}</style>

      {/* Covers the app nav too, which the hidden wrapper cannot reach — it
          lives inside MAIN's stacking context. Only once mounted; the hidden
          children are what prevent the pre-hydration flash. */}
      {arrival.holdCurtain || arrival.showing ? <ArrivalCurtain /> : null}

      {arrival.showing ? (
        <ArrivalInterstitial
          tasks={arrival.tasks}
          accent={arrival.accent}
          onDone={arrival.dismiss}
        />
      ) : null}

      <div className={arrival.holdCurtain ? "el-arrival-hold" : undefined}>
        {children}
      </div>
    </>
  );
}

export default ArrivalGate;
