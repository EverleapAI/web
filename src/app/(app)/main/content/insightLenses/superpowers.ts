// src/app/main/content/insightLenses/superpowers.ts
import type { InsightLensDefinition } from "./types";

/**
 * Source inspiration: “My Superpowers” from the legacy Everleap report. :contentReference[oaicite:2]{index=2}
 * Keep it punchy + teen-friendly; we can expand later once the backend is generating this.
 */
export const SUPERPOWERS_LENS: InsightLensDefinition = {
  id: "superpowers",
  kicker: "Lens",
  title: "Superpowers",
  subtitle: "What you naturally do well when it matters.",
  body:
    "These are the strengths that tend to show up even when you’re tired, busy, or under pressure. " +
    "Think of them like your “default advantages” — the stuff you can lean on while you build the rest.",
  bullets: [
    "Strategic leadership: you can see the goal, organize the pieces, and move people toward it.",
    "Creative problem solving: you don’t just solve puzzles — you invent better ways through them.",
    "Team communication: even if you’re still leveling up, you can collaborate and keep the group aligned.",
  ],
};
