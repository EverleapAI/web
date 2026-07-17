// apps/web/src/app/(app)/main/insights/components/sections/InsightsBackLink.tsx
//
// The "← Back to Insights" link at the top of every Insights sub-tab (not the
// summary). It replaces the old horizontal tab rail as the way back out: you
// enter an area from the summary's area cards, and this returns you to the
// summary. `replace` keeps it out of history so Back doesn't ping-pong.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function InsightsBackLink({ label = "Back to Insights" }: { label?: string }) {
  return (
    <Link
      href="/main/insights?tab=summary"
      replace
      className="group mb-1 inline-flex items-center gap-1.5 text-label font-medium text-white/55 transition hover:text-white/85"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  );
}

export default InsightsBackLink;
