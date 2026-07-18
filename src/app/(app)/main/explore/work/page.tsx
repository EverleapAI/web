"use client";

import { WorkLandingLoader } from "../_components/WorkLandingLoader";

// Careers is the first lane on the new recommendations experience: agentic entry,
// trophies, signal gate, creative career cards with feedback + missions, and a
// "wondering" tiny task. The other lanes stay on the shared ExploreLanding until
// their own phase. The personalized deck is fetched inside the loader.
export default function WorkExplorePage() {
  return <WorkLandingLoader />;
}
