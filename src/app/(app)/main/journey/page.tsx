"use client";

// Your journey — for now a placeholder that wears the Guide's treatment.
//
// (This route was a temporary "JourneyProgressPM" critique demo; it's now the
// real Journey tab's home.) This is where the personalised journey will live:
// the five-star JourneyConstellation that today only appears once, at the end of
// the welcome (/main/intro), lit by how much of each part of Everleap someone has
// used. Until that moves here, the screen mirrors the Guide (same sky, same
// shape) and points at the real Guide, so the Journey tab has a home from day one.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GuideSky } from "../guide/GuideSky";
import { PROSE_CLASS, PROSE_STYLE, HEADING_CLASS, HEADING_STYLE } from "@/lib/ui/prose";

export default function JourneyPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-4 sm:px-6">
      <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/40">
        Your journey
      </span>
      <h1 className={`mt-2 ${HEADING_CLASS}`} style={HEADING_STYLE}>
        The map of how far you&rsquo;ve come is on its way here.
      </h1>
      <p className={`mt-3 max-w-[52ch] text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
        Soon this will be your own constellation, brightening with every part of
        Everleap you spend time in. For now, here is the map of the app itself.
      </p>

      {/* A door to the manual. The one thing this placeholder adds over the Guide. */}
      <Link
        href="/main/guide"
        className="mt-5 inline-flex items-center gap-2 rounded-control border border-white/12 bg-white/[0.04] px-4 py-2.5 text-label font-medium text-white/85 transition hover:bg-white/[0.08]"
      >
        Open the Lunorica Guide
        <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mt-6">
        <GuideSky />
      </div>
    </div>
  );
}
