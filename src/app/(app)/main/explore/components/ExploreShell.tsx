// src/app/main/explore/components/ExploreShell.tsx
"use client";

import * as React from "react";

import type { ExploreKey, ExploreSection, ExploreChip } from "../content/types";
import {
  headerCopyForKey,
  laneLayoutForKey,
  metaForSectionKey,
  preferredStructuredChip,
} from "../utils/exploreModel";

import { ExploreHeader } from "./ExploreHeader";
import { ExploreLaneShell } from "./ExploreLaneShell";
import { ExploreLaneContent } from "./ExploreLaneContent";

export function ExploreShell({
  sections,
  dark,
}: {
  sections: ExploreSection[];
  dark: boolean;
}) {
  const [activeKey, setActiveKey] = React.useState<ExploreKey>(() => {
    const first = sections[0]?.key;
    return (first ?? "education") as ExploreKey;
  });

  const activeIndex = React.useMemo(() => {
    const idx = sections.findIndex((s) => s.key === activeKey);
    return idx === -1 ? 0 : idx;
  }, [activeKey, sections]);

  const activeSection: ExploreSection = sections[activeIndex] ?? sections[0];

  const layout = laneLayoutForKey(activeSection.key);
  const renderStructured = layout === "structured";

  const structuredChip: ExploreChip | null = React.useMemo(() => {
    if (!renderStructured) return null;
    return preferredStructuredChip(activeSection);
  }, [activeSection, renderStructured]);

  const laneMeta = metaForSectionKey(activeSection.key);
  const laneAccent = `bg-gradient-to-r ${laneMeta.badgeHalo}`;

  const { laneKicker, headline, supportLine } = headerCopyForKey(
    activeSection.key,
    activeSection
  );

  const detachContentFromShell = renderStructured;

  const [headerExpandedByKey, setHeaderExpandedByKey] = React.useState<
    Record<string, boolean>
  >({});
  const [collapseAllNonceByKey, setCollapseAllNonceByKey] = React.useState<
    Record<string, number>
  >({});

  const activeLaneKeyStr = String(activeSection.key);
  const headerExpanded = Boolean(headerExpandedByKey[activeLaneKeyStr]);

  const anyCardExpandedRef = React.useRef<Record<string, boolean>>({});

  React.useEffect(() => {
    setHeaderExpandedByKey((prev) => {
      const k = String(activeSection.key);
      if (Object.prototype.hasOwnProperty.call(prev, k)) return prev;
      return { ...prev, [k]: true };
    });

    setCollapseAllNonceByKey((prev) => {
      const k = String(activeSection.key);
      if (Object.prototype.hasOwnProperty.call(prev, k)) return prev;
      return { ...prev, [k]: 0 };
    });

    const k = String(activeSection.key);
    if (anyCardExpandedRef.current[k] === undefined) {
      anyCardExpandedRef.current[k] = false;
    }
  }, [activeSection.key]);

  function requestCollapseAllCards() {
    setCollapseAllNonceByKey((prev) => ({
      ...prev,
      [activeLaneKeyStr]: (prev[activeLaneKeyStr] ?? 0) + 1,
    }));
  }

  const onAnyCardExpandedChange = React.useCallback(
    (expanded: boolean) => {
      const k = activeLaneKeyStr;
      anyCardExpandedRef.current[k] = expanded;

      if (expanded && headerExpandedByKey[k]) {
        setHeaderExpandedByKey((prev) => {
          if (!prev[k]) return prev;
          return { ...prev, [k]: false };
        });
      }
    },
    [activeLaneKeyStr, headerExpandedByKey]
  );

  function toggleHeaderExpanded() {
    const k = activeLaneKeyStr;
    const currentlyExpanded = Boolean(headerExpandedByKey[k]);
    const next = !currentlyExpanded;

    if (next && anyCardExpandedRef.current[k]) {
      requestCollapseAllCards();
    }

    setHeaderExpandedByKey((prev) => ({
      ...prev,
      [k]: next,
    }));
  }

  const collapseAllNonceForLane = collapseAllNonceByKey[activeLaneKeyStr] ?? 0;

  return (
    <div className="w-full">
      <ExploreHeader
        sections={sections}
        activeKey={activeKey}
        onSelectKey={setActiveKey}
        dark={dark}
      />

      <ExploreLaneShell
        dark={dark}
        laneKicker={laneKicker}
        headline={headline}
        supportLine={supportLine}
        laneAccent={laneAccent}
        laneMeta={laneMeta}
        headerExpanded={headerExpanded}
        onToggleHeaderExpanded={toggleHeaderExpanded}
      />

      {!detachContentFromShell ? (
        <ExploreLaneContent
          activeSection={activeSection}
          dark={dark}
          renderStructured={renderStructured}
          structuredChip={structuredChip}
          onAnyCardExpandedChange={onAnyCardExpandedChange}
          collapseAllNonce={collapseAllNonceForLane}
          detachContentFromShell={false}
        />
      ) : null}

      {detachContentFromShell ? (
        <ExploreLaneContent
          activeSection={activeSection}
          dark={dark}
          renderStructured={renderStructured}
          structuredChip={structuredChip}
          onAnyCardExpandedChange={onAnyCardExpandedChange}
          collapseAllNonce={collapseAllNonceForLane}
          detachContentFromShell={true}
        />
      ) : null}
    </div>
  );
}