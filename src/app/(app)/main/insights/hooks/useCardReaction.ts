"use client";

import * as React from "react";

export type CardReactionValue = "energized" | "not_for_me" | "curious";

// Loads and persists a one-tap reaction for a single Insights item card.
// Latest-only: setReaction(value) upserts; setReaction(null) clears. Optimistic
// so the pill lights instantly; the POST is fire-and-forget.
export function useCardReaction(pageKey: string, itemKey: string) {
  const [reaction, setReactionState] = React.useState<CardReactionValue | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setReactionState(null);
    if (!pageKey || !itemKey) return;

    fetch(
      `/api/guidance/insights-card-reaction?pageKey=${encodeURIComponent(
        pageKey
      )}&itemKey=${encodeURIComponent(itemKey)}`,
      { credentials: "include", cache: "no-store" }
    )
      .then((r) => r.json())
      .then((d: { ok?: boolean; reaction?: CardReactionValue | null }) => {
        if (!cancelled) setReactionState(d?.ok ? d.reaction ?? null : null);
      })
      .catch(() => {
        if (!cancelled) setReactionState(null);
      });

    return () => {
      cancelled = true;
    };
  }, [pageKey, itemKey]);

  const setReaction = React.useCallback(
    (next: CardReactionValue | null) => {
      setReactionState(next);
      if (!pageKey || !itemKey) return;
      fetch(`/api/guidance/insights-card-reaction`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pageKey, itemKey, reaction: next ?? "" }),
      }).catch(() => {});
    },
    [pageKey, itemKey]
  );

  return { reaction, setReaction };
}
