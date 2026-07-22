"use client";

import { WorldWaysLanding } from "../_components/WorldWaysLanding";

// World opens on the six ways of going, not on 153 countries.
//
// The catalog was the front door and it was the wrong altitude: a country is our
// deepest content, and leading with it asked someone to care about Nepal before
// anything underneath could matter. Browsing places now lives at
// /main/explore/world/places, one tap away rather than unavoidable.
export default function WorldExplorePage() {
  return <WorldWaysLanding />;
}
