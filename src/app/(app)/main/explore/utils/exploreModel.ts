// src/app/main/explore/utils/exploreModel.ts
import type { ExploreKey, ExploreSection, ExploreChip } from "../content/types";

/* =============================================================================
   Lane layout policy
   ============================================================================= */

export type LaneLayout = "structured" | "grid";

export function laneLayoutForKey(key: ExploreKey): LaneLayout {
  switch (key) {
    case "careers":
    case "education":
    case "travel":
    case "community":
    case "hobbies":
      return "structured";
    default:
      return "grid";
  }
}

/* =============================================================================
   Lane header copy
   ============================================================================= */

export function headerCopyForKey(
  key: ExploreKey,
  section: ExploreSection
): { laneKicker: string; headline: string; supportLine: string } {
  const laneKicker = section.label;

  switch (key) {
    case "careers":
      return {
        laneKicker,
        headline: "4 careers that fit you",
        supportLine:
          "Not a forever decision. Pick one lane, run a tiny test, then adjust.",
      };

    case "education":
      return {
        laneKicker,
        headline: "4 learning paths that fit you",
        supportLine:
          "Pick one direction. Try a small first step. If it sticks, go deeper.",
      };

    case "travel":
      return {
        laneKicker,
        headline: "4 travel styles that match your tempo",
        supportLine:
          "Pick one vibe. Try a tiny plan. Upgrade it if you actually want more.",
      };

    case "community":
      return {
        laneKicker,
        headline: "4 ways to find your people",
        supportLine:
          "Choose one setting to try. Notice: do you feel more like yourself there?",
      };

    case "hobbies":
      return {
        laneKicker,
        headline: "4 hobbies you might actually stick with",
        supportLine:
          "Try one. Don’t judge it on day one. Judge it on: “Do I want to do it again?”",
      };

    default:
      return {
        laneKicker,
        headline: "Pick a chip",
        supportLine: "Tap a card to explore.",
      };
  }
}

/* =============================================================================
   Focus selector meta (used for accents + media)
   ============================================================================= */

export type LaneMedia = { jpg?: string };

export type TabMeta = {
  subtitle: string;
  badgeIcon: string; // emoji
  badgeHalo: string; // tailwind gradient string
  badgeText: string; // tailwind text class
  media?: LaneMedia; // optional lane-level emotional break (JPG only)
};

function laneMediaForKey(key: ExploreKey): LaneMedia | undefined {
  switch (key) {
    case "careers":
    case "education":
    case "travel":
    case "community":
    case "hobbies":
      return { jpg: `/images/${key}/5.jpg` };
    default:
      return undefined;
  }
}

export function metaForSectionKey(key: ExploreKey): TabMeta {
  switch (key) {
    case "careers":
      return {
        subtitle: "Future jobs?",
        badgeIcon: "🧭",
        badgeHalo: "from-sky-500/35 via-cyan-400/20 to-indigo-500/20",
        badgeText: "text-sky-50",
        media: laneMediaForKey(key),
      };
    case "education":
      return {
        subtitle: "School + learning paths",
        badgeIcon: "🎓",
        badgeHalo: "from-amber-500/35 via-orange-400/18 to-rose-400/18",
        badgeText: "text-amber-50",
        media: laneMediaForKey(key),
      };
    case "travel":
      return {
        subtitle: "Places + adventures",
        badgeIcon: "🌍",
        badgeHalo: "from-emerald-500/35 via-teal-400/18 to-sky-400/18",
        badgeText: "text-emerald-50",
        media: laneMediaForKey(key),
      };
    case "community":
      return {
        subtitle: "People + belonging",
        badgeIcon: "🤝",
        badgeHalo: "from-violet-500/35 via-fuchsia-400/18 to-sky-400/18",
        badgeText: "text-violet-50",
        media: laneMediaForKey(key),
      };
    case "hobbies":
      return {
        subtitle: "Fun to explore",
        badgeIcon: "🎨",
        badgeHalo: "from-rose-500/35 via-pink-400/18 to-amber-400/18",
        badgeText: "text-rose-50",
        media: laneMediaForKey(key),
      };
    default:
      return {
        subtitle: "Browse ideas",
        badgeIcon: "✨",
        badgeHalo: "from-slate-500/25 via-slate-400/15 to-slate-300/15",
        badgeText: "text-slate-50",
      };
  }
}

/* =============================================================================
   Structured lane safety
   ============================================================================= */

/**
 * Structured lane must render the chip whose type matches the lane key.
 * This prevents subtle bugs where section.key is "careers" but a chip is still
 * typed as a legacy lane ("recommendations"/"forYou"/etc).
 */
export function preferredStructuredChip(
  section: ExploreSection
): ExploreChip | null {
  const chips = section.chips ?? [];
  if (!chips.length) return null;

  const match = chips.find((c) => c.type === section.key);
  if (match) return match;

  // Soft fallback: chip.id equals section.key (common pattern)
  const byId = chips.find((c) => c.id === section.key);
  if (byId) return byId;

  // Fail loudly instead of silently rendering the wrong chip
  return null;
}