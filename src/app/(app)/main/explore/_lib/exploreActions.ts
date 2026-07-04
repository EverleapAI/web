// apps/web/src/app/(app)/main/explore/_lib/exploreActions.ts
//
// Client hook for "Save to Actions" on Explore path opportunities. Loads which
// opportunities on this path the user already saved, and saves new ones. Writes
// to the app-wide user_actions store via guidance/actions.

"use client";

import * as React from "react";

export type SaveActionPayload = {
  title: string;
  description?: string | null;
  href?: string | null;
};

export function useSavedActions(lane: string, sourceRef: string) {
  const [saved, setSaved] = React.useState<Set<string>>(new Set());
  const [savingTitle, setSavingTitle] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch(`/api/guidance/actions?source_ref=${encodeURIComponent(sourceRef)}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d?.ok && Array.isArray(d.actions)) {
          setSaved(new Set(d.actions.map((a: { title: string }) => a.title)));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [sourceRef]);

  const save = React.useCallback(
    async (item: SaveActionPayload) => {
      if (saved.has(item.title)) return;
      setSavingTitle(item.title);
      try {
        const res = await fetch("/api/guidance/actions", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sourceType: "explore_path",
            sourceRef,
            lane,
            title: item.title,
            description: item.description ?? null,
            href: item.href ?? null,
          }),
        });
        if (res.ok) setSaved((prev) => new Set(prev).add(item.title));
      } catch {
        // leave unsaved; user can retry
      } finally {
        setSavingTitle(null);
      }
    },
    [saved, sourceRef, lane]
  );

  return {
    isSaved: (title: string) => saved.has(title),
    save,
    savingTitle,
  };
}
