"use client";

// Demo surface for the PM's "Journey Progress" direction, so it can be viewed and
// snapshotted next to the constellation for a side-by-side critique. Temporary —
// delete once we've picked a direction.

import { JourneyProgressPM } from "../components/achievements/JourneyProgressPM";

export default function JourneyDemoPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0b0f18] px-4 py-8">
      <JourneyProgressPM />
    </div>
  );
}
