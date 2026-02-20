// src/app/main/explore/components/ExploreLaneContent.tsx
"use client";

import * as React from "react";

import type { ExploreSection, ExploreChip } from "../content/types";
import { RENDERERS } from "../renderers";

export function ExploreLaneContent({
  activeSection,
  dark,
  renderStructured,
  structuredChip,
  onAnyCardExpandedChange,
  collapseAllNonce,
  detachContentFromShell,
}: {
  activeSection: ExploreSection;
  dark: boolean;
  renderStructured: boolean;
  structuredChip: ExploreChip | null;
  onAnyCardExpandedChange?: (expanded: boolean) => void;
  collapseAllNonce?: number;
  detachContentFromShell: boolean;
}) {
  const StructuredRenderer = React.useMemo(() => {
    if (!renderStructured || !structuredChip) return null;
    return RENDERERS[structuredChip.type] as React.ComponentType<{
      chip: ExploreChip;
      dark: boolean;
      onAnyCardExpandedChange?: (expanded: boolean) => void;
      collapseAllNonce?: number;
    }>;
  }, [renderStructured, structuredChip]);

  const content = renderStructured ? (
    structuredChip && StructuredRenderer ? (
      <StructuredRenderer
        key={structuredChip.id}
        chip={structuredChip}
        dark={dark}
        onAnyCardExpandedChange={onAnyCardExpandedChange}
        collapseAllNonce={collapseAllNonce}
      />
    ) : (
      <div
        className={`rounded-2xl border p-5 ${
          dark
            ? "border-white/10 bg-white/5 text-white/80"
            : "border-black/10 bg-white text-slate-700"
        }`}
      >
        No content found for this lane yet. (Check that this lane’s chip.type
        matches the lane key.)
      </div>
    )
  ) : (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {activeSection.chips.map((chip: ExploreChip) => {
        const Renderer = RENDERERS[chip.type];
        return <Renderer key={chip.id} chip={chip} dark={dark} />;
      })}
    </div>
  );

  if (!detachContentFromShell) {
    return <div className="mt-4">{content}</div>;
  }

  return (
    <div className="mt-4 space-y-4" style={{ overflowAnchor: "none" }}>
      {content}
    </div>
  );
}