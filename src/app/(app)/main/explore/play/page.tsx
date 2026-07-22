"use client";

import { PlayKindsLanding } from "../_components/PlayKindsLanding";

// Play opens on five kinds of playing, not twenty activities in a heap.
//
// All twenty on one screen was too much to choose between, and every row left
// the app. The activity page underneath holds the real places and the outbound
// links, two internal steps in rather than the first thing anyone meets.
export default function PlayExplorePage() {
  return <PlayKindsLanding />;
}
