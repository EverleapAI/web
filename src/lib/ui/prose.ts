import type { CSSProperties } from "react";

// The reading treatment for every agentic surface (Today / Insights / Explore),
// shared so they all read the same.
//
// Prose is BRIGHT and REGULAR-WEIGHT. This is the opposite of the "low-glare"
// recipe that used to live here (dim #A2A6B0 at weight 500, +0.4px tracking),
// and the reversal was deliberate: dim + semibold + letter-spaced is how a UI
// *label* is set, so the read came out looking like dashboard chrome. Editorial
// body text — the CNN/Apple News register we're after — is the inverse: high
// luminance, weight 400, zero tracking. Hierarchy comes from size and spacing;
// brightness is what separates "content" from "chrome", so prose gets to be the
// brightest thing on the page and the chrome steps down from it.
//
// Canonical values are defined here; components import these instead of
// re-declaring their own colours/sizes so the whole app stays in sync.

// ── Colour ramp ──────────────────────────────────────────────────────────────
export const TEXT_HEADING = "#F7F9FC"; // titles / masthead — reads as white
export const TEXT_PRIMARY = "#E3E7EF"; // body prose, the read, headline-as-prose
export const TEXT_SECONDARY = "#AEB3BF"; // quiet labels + secondary links — a notch down
export const TEXT_MUTED = "#7E838E"; // meta / timestamps — the quietest chrome

// ── Prose recipe ─────────────────────────────────────────────────────────────
// Weight and tracking come from CSS variables (--read-weight / --read-tracking,
// defaulted in globals.css) so they can be settled on a real phone with the dev
// tuner instead of argued about on a laptop. The app now ships Inter, a variable
// SANS, so intermediate weights (450, 500) are real on every device — previously
// Segoe UI had no 500 at all and silently rounded them to 400.
export const PROSE_STYLE: CSSProperties = {
  color: TEXT_PRIMARY,
  fontWeight: "var(--read-weight, 400)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--read-tracking, 0em)",
};
export const PROSE_CLASS = "leading-read";

// ── Size ladder (the "full ladder", identical to Today) ──────────────────────
export const PROSE_SIZE = "text-read"; // hero / body agentic prose
export const LINK_SIZE = "text-body"; // secondary links
export const EYEBROW_CLASS = "text-micro font-bold uppercase tracking-eyebrow"; // modal / section eyebrow

// ── The agent's opening line ─────────────────────────────────────────────────
// These pages are a CONVERSATION, not an article, so the first sentence is not a
// headline — it is the agent starting to talk. It therefore sits on the SAME rung
// as the prose it opens (21px), one weight above it (600) and a touch brighter.
// Hierarchy comes from weight and spacing, never from a bigger size.
//
// Insights already worked this way and was the only surface getting it right.
// Today and Explore both set it as a 26px semibold headline, which made the agent
// announce itself instead of speak. Today / Insights / Explore now share this.
export const HEADING_CLASS = `${PROSE_SIZE} ${PROSE_CLASS}`;
export const HEADING_STYLE: CSSProperties = {
  color: TEXT_HEADING,
  // Tunable, because there is a real open question here: if these pages are a
  // conversation, an agent's FIRST sentence is not bolder than its second — so
  // the opening line arguably wants the same weight as the prose, not a step
  // above it. --heading-weight defaults to 600 (a step above); set it equal to
  // --read-weight to hear the agent speak in one voice.
  fontWeight: "var(--heading-weight, 600)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--read-tracking, 0em)",
};

// One shared link treatment so every tappable agentic link reads the same:
// own semantic colour, brightening on hover, with a trailing chevron.
export const LINK_CLASS =
  "group inline-flex items-center gap-1.5 font-semibold tracking-normal transition duration-150 hover:brightness-125 active:opacity-70";

// ── Read trimming ────────────────────────────────────────────────────────────
// The visible "read" everywhere is trimmed to Today's length so the treatment
// matches: a tight opening, with the whole picture one tap away in a "More"
// modal. Mirrors TodayHeart's firstSentences/capRead.

/** First n sentences of a block (keeps sentence boundaries — never a mid chop). */
export function firstSentences(text: string | null | undefined, n: number): string {
  if (!text) return "";
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return (parts.length ? parts : [String(text).trim()]).slice(0, n).join(" ");
}

/** Trim to ~maxChars by dropping whole trailing sentences (never mid-sentence). */
export function capRead(text: string | null | undefined, maxChars: number): string {
  const t = (text ?? "").trim();
  if (t.length <= maxChars) return t;
  const sentences = t.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > maxChars && out) break;
    out = next;
  }
  return out || t.slice(0, maxChars).replace(/\s+\S*$/, "").trim();
}

/** The canonical visible read: first 2 sentences, capped ~220 chars — Today's target. */
export function leadRead(text: string | null | undefined): string {
  return capRead(firstSentences(text, 2), 220);
}
