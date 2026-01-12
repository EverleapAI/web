"use client";

/**
 * Explore feedback store (module store, persisted)
 * Satisfies RecommendationsRenderer.tsx imports:
 *  - createExploreBatchFromRecommendations
 *  - initializeExploreFeedbackStore
 *  - subscribeExploreFeedbackStore
 *  - getAndMarkVisibleRecommendations
 *  - recordFeedback
 *  - shouldSuggestRecalibrate
 *  - requestRecalibration
 *  - getExploreFeedbackState
 *  - supersedeWithNewBatch
 *
 * Adds (for locked pill + toggle-reset UX):
 *  - getLatestFeedbackForRecommendation
 *  - clearFeedbackForRecommendation
 *
 * Key hardening:
 *  - getAndMarkVisibleRecommendations() is IDEMPOTENT:
 *    it only writes/emits if it actually changes seenRecIds or status.
 *    This prevents subscription loops when called inside subscriber callbacks.
 */

import type { FeedbackResponse, RecommendationItem } from "../content/contracts";

/* ============================================================================
   Types
============================================================================ */

export type ExploreBatchStatus = "active" | "recalibrating" | "exhausted";

export type ExploreFeedback = {
  feedbackId: string;
  recId: string;
  response: FeedbackResponse;
  comment: string | null;
  createdAt: string; // ISO
};

export type ExploreBatch = {
  batchId: string;
  generationRunId: string;
  createdAt: string; // ISO
  status: ExploreBatchStatus;

  recommendations: RecommendationItem[];

  // Tracking
  seenRecIds: string[]; // recs shown at least once
  feedback: ExploreFeedback[]; // latest-per-rec enforced by recordFeedback()
};

export type ExploreFeedbackState = {
  batch: ExploreBatch | null;
};

type Listener = () => void;

/* ============================================================================
   Persistence
============================================================================ */

const STORAGE_KEY = "everleap.explore.feedbackStore.v2";

function safeRead(): ExploreFeedbackState | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExploreFeedbackState;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function safeWrite(next: ExploreFeedbackState) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(
    16
  )}`;
}

/* ============================================================================
   Store core
============================================================================ */

let state: ExploreFeedbackState = safeRead() ?? { batch: null };
const listeners = new Set<Listener>();

function emit() {
  for (const l of Array.from(listeners)) l();
}

/**
 * Only persist + emit if the batch meaningfully changes.
 */
function setState(updater: (prev: ExploreFeedbackState) => ExploreFeedbackState) {
  const next = updater(state);

  // Simple structural guard: if batch is referentially identical, skip.
  if (next.batch === state.batch) return;

  state = next;
  safeWrite(state);
  emit();
}

function sameStringSet(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  for (const x of b) if (!setA.has(x)) return false;
  return true;
}

function listEquals(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/* ============================================================================
   New helpers (for locked pill / toggle reset)
============================================================================ */

/**
 * Returns the most recent (and in practice: the only) feedback for a recId.
 * Safe for renderer usage.
 */
export function getLatestFeedbackForRecommendation(
  recId: string
): ExploreFeedback | null {
  const b = state.batch;
  if (!b) return null;

  // There should be at most 1 entry per recId after recordFeedback(),
  // but we defensively pick the latest.
  const matches = b.feedback.filter((f) => f.recId === recId);
  if (!matches.length) return null;

  let latest = matches[0];
  for (let i = 1; i < matches.length; i++) {
    if (matches[i].createdAt > latest.createdAt) latest = matches[i];
  }
  return latest;
}

/**
 * Clears stored feedback for a recommendation.
 * Does NOT change seenRecIds (we still consider it "seen").
 * Returns true if something was removed.
 */
export function clearFeedbackForRecommendation(recId: string): boolean {
  const b = state.batch;
  if (!b) return false;

  const hadAny = b.feedback.some((f) => f.recId === recId);
  if (!hadAny) return false;

  setState((prev) => {
    const batch = prev.batch;
    if (!batch) return prev;

    const nextFeedback = batch.feedback.filter((f) => f.recId !== recId);

    // If nothing changes, avoid emit
    if (nextFeedback.length === batch.feedback.length) return prev;

    return {
      batch: {
        ...batch,
        feedback: nextFeedback,
      },
    };
  });

  return true;
}

/* ============================================================================
   Public API (used by renderer)
============================================================================ */

export function getExploreFeedbackState(): ExploreFeedbackState {
  return state;
}

export function subscribeExploreFeedbackStore(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function createExploreBatchFromRecommendations(
  recs: RecommendationItem[],
  generationRunId: string
): ExploreBatch {
  return {
    batchId: uid("batch"),
    generationRunId,
    createdAt: nowIso(),
    status: "active",
    recommendations: recs,
    seenRecIds: [],
    feedback: [],
  };
}

export function initializeExploreFeedbackStore(batch: ExploreBatch) {
  setState(() => ({ batch }));
}

export function supersedeWithNewBatch(batch: ExploreBatch) {
  // Replace everything; treat as a brand new run.
  setState(() => ({ batch }));
}

/**
 * Compute which recommendations should be visible now (up to 4),
 * preferring unseen. This does NOT mutate store.
 */
function computeVisible(batch: ExploreBatch): RecommendationItem[] {
  const all = batch.recommendations ?? [];
  if (!all.length) return [];

  const seen = new Set(batch.seenRecIds);
  const unseen = all.filter((r) => !seen.has(r.recId));

  if (unseen.length >= 4) return unseen.slice(0, 4);
  if (unseen.length > 0) {
    const fillers = all
      .filter((r) => !unseen.includes(r))
      .slice(0, 4 - unseen.length);
    return [...unseen, ...fillers];
  }

  // If everything seen, keep stable first 4
  return all.slice(0, 4);
}

/**
 * Returns up to 4 recommendations to show and marks them as seen.
 * IDEMPOTENT: if nothing changes, no emit.
 */
export function getAndMarkVisibleRecommendations(): RecommendationItem[] {
  const b = state.batch;
  if (!b) return [];

  const pick = computeVisible(b);
  if (!pick.length) return pick;

  const pickIds = pick.map((r) => r.recId);
  const prevSeen = b.seenRecIds;
  const nextSeenSet = new Set(prevSeen);
  for (const id of pickIds) nextSeenSet.add(id);
  const nextSeen = Array.from(nextSeenSet);

  // Determine next status (only changes from active -> exhausted here)
  let nextStatus: ExploreBatchStatus = b.status;
  if (
    nextStatus === "active" &&
    b.recommendations.length > 0 &&
    nextSeen.length >= b.recommendations.length
  ) {
    nextStatus = "exhausted";
  }

  // If seen set and status are unchanged, do NOT write/emit.
  const seenUnchanged = sameStringSet(prevSeen, nextSeen);
  const statusUnchanged = nextStatus === b.status;

  if (seenUnchanged && statusUnchanged) {
    return pick;
  }

  // Keep seenRecIds stable-ish: preserve existing order, then append new ids in pick order.
  const orderedNextSeen: string[] = [];
  const prevSet = new Set(prevSeen);
  for (const id of prevSeen) orderedNextSeen.push(id);
  for (const id of pickIds) if (!prevSet.has(id)) orderedNextSeen.push(id);

  setState((prev) => {
    const batch = prev.batch;
    if (!batch) return prev;

    // If batch changed externally between read and write, bail
    if (batch.batchId !== b.batchId) return prev;

    // Avoid emitting if somehow equal
    if (listEquals(batch.seenRecIds, orderedNextSeen) && batch.status === nextStatus) {
      return prev;
    }

    return {
      batch: {
        ...batch,
        seenRecIds: orderedNextSeen,
        status: nextStatus,
      },
    };
  });

  return pick;
}

/**
 * Record feedback for a given recommendation.
 * - Ensures only ONE feedback entry per recId (replaces any previous one)
 * - Ensures that rec is marked seen
 * - May transition to exhausted if everything is now seen
 */
export function recordFeedback(input: {
  rec: RecommendationItem;
  response: FeedbackResponse;
  comment: string | null;
}): ExploreFeedback | null {
  const b = state.batch;
  if (!b) return null;

  const fb: ExploreFeedback = {
    feedbackId: uid("fb"),
    recId: input.rec.recId,
    response: input.response,
    comment: input.comment,
    createdAt: nowIso(),
  };

  setState((prev) => {
    const batch = prev.batch;
    if (!batch) return prev;

    // Replace existing feedback for this recId (prevents duplicates / overuse confusion)
    const nextFeedback = [
      ...batch.feedback.filter((f) => f.recId !== input.rec.recId),
      fb,
    ];

    const seenSet = new Set(batch.seenRecIds);
    const hadRec = seenSet.has(input.rec.recId);
    if (!hadRec) seenSet.add(input.rec.recId);

    // Keep order stable
    const nextSeen = hadRec ? batch.seenRecIds : [...batch.seenRecIds, input.rec.recId];

    let nextStatus: ExploreBatchStatus = batch.status;

    if (
      nextStatus === "active" &&
      batch.recommendations.length > 0 &&
      nextSeen.length >= batch.recommendations.length
    ) {
      nextStatus = "exhausted";
    }

    return {
      batch: {
        ...batch,
        feedback: nextFeedback,
        seenRecIds: nextSeen,
        status: nextStatus,
      },
    };
  });

  return fb;
}

/**
 * Suggest recalibration when there's meaningful negative signal,
 * or when exhausted with any feedback.
 */
export function shouldSuggestRecalibrate(): boolean {
  const b = state.batch;
  if (!b) return false;
  if (b.status === "recalibrating") return false;

  const hasDisagreeWithComment = b.feedback.some(
    (f) => f.response === "disagree" && Boolean((f.comment ?? "").trim())
  );

  const hasAnyFeedback = b.feedback.length > 0;
  const exhausted = b.status === "exhausted";

  return hasDisagreeWithComment || (exhausted && hasAnyFeedback);
}

/**
 * Transition into recalibrating state.
 * Renderer shows the banner; later you can supersedeWithNewBatch().
 */
export function requestRecalibration() {
  setState((prev) => {
    const batch = prev.batch;
    if (!batch) return prev;
    if (batch.status === "recalibrating") return prev;

    return {
      batch: {
        ...batch,
        status: "recalibrating",
      },
    };
  });
}
