"use client";

// The Guide: a user's manual for the app, as a sky you fly through.
//
// Everleap's biggest complaint is that people arrive and don't know what they're
// meant to do. The one screen that explained the five places ran exactly once,
// at the end of the welcome, and claimed its flag on the way out — including on
// Skip — so anybody who tapped past it never saw it again and had no route back.
//
// This is that explanation made permanent and reachable. Nothing here is
// personalised: it is the same for everybody, authored once, with no API call
// and no per-user state.

import { GuideSky } from "./GuideSky";
import { PROSE_CLASS, PROSE_STYLE, HEADING_CLASS, HEADING_STYLE } from "@/lib/ui/prose";

export default function GuidePage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-4 sm:px-6">
      <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/40">
        The guide
      </span>
      <h1 className={`mt-2 ${HEADING_CLASS}`} style={HEADING_STYLE}>
        Everleap is one thing you feed, and four things it feeds.
      </h1>
      <p className={`mt-3 max-w-[52ch] text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
        Tap a star to see what it does. A ring around one means there&rsquo;s another sky
        inside it, and tapping takes you in.
      </p>

      <div className="mt-6">
        <GuideSky />
      </div>
    </div>
  );
}
