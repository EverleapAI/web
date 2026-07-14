import type { CSSProperties } from "react";

// Low-glare dark-mode text treatment — the "Today" page recipe, shared so every
// agentic surface (Today / Insights / Explore) reads the same. Hierarchy comes
// from size + weight + spacing, NOT brightness. Reduce luminance, keep the
// stroke weight up (500) so thin antialiased text doesn't strain the eye.
//
// Canonical values are defined here; components import these instead of
// re-declaring their own colours/sizes so the whole app stays in sync.

// ── Colour ramp ──────────────────────────────────────────────────────────────
export const TEXT_HEADING = "#ABAFB9"; // titles / masthead — a hair brighter than prose
export const TEXT_PRIMARY = "#A2A6B0"; // body prose, the read, headline-as-prose
export const TEXT_SECONDARY = "#878B95"; // quiet labels + secondary links — a notch down
export const TEXT_MUTED = "#63666F"; // meta / timestamps — the quietest chrome

// ── Prose recipe ─────────────────────────────────────────────────────────────
//
// The read is set in the reading face (Source Serif 4, wired up in layout.tsx as
// --font-read). The chrome around it — labels, buttons, counts, nav — stays in
// the UI sans, which is what it is. The split is the point: when the agent talks
// it should not look like a status bar.
//
// Weight 440, not the 425 the refresh doc asks for. 425 is now a REAL weight
// (the face is variable, so it no longer rounds to 400) — but a serif carries
// thinner strokes than the sans it replaces, and thin strokes on a dark ground
// are what produce halation. 440 lands the doc's intent rather than its number.
//
// Tracking goes to 0. The old +0.4px existed to stop the sans from tightening up
// at low brightness; the serif already has the sidebearings for it, and holding
// the sans's tracking on a serif just makes it look loose.
export const PROSE_STYLE: CSSProperties = {
  color: TEXT_PRIMARY,
  fontFamily: "var(--font-read), Georgia, Cambria, serif",
  fontWeight: 440,
  fontOpticalSizing: "auto",
};
export const PROSE_CLASS = "leading-[1.52] md:leading-[1.55] tracking-normal";

// ── Measure ──────────────────────────────────────────────────────────────────
//
// The single biggest thing wrong with the old read, and the one the refresh doc
// gets exactly right. Every agentic surface was capped at `max-w-[560px]`, which
// at 21px is about 53 characters — well past the point where the eye starts
// losing its place on the return sweep.
//
// This was always a DESKTOP problem. On a phone the viewport already clamped the
// line to ~33ch, so mobile was accidentally compliant and desktop was the thing
// that read like a dashboard. In `ch`, not px, so it stays honest if the size or
// the face ever changes.
export const PROSE_MEASURE = "max-w-[32ch] md:max-w-[42ch]";

/** 28px between paragraphs. Was 14px — the read had no room to breathe. */
export const PROSE_GAP = "space-y-7";

// ── Size ladder (the "full ladder", identical to Today) ──────────────────────
export const PROSE_SIZE = "text-[21px] md:text-[22px]"; // hero / body agentic prose
export const LINK_SIZE = "text-[18px]"; // secondary links
export const EYEBROW_CLASS = "text-[10.5px] font-bold uppercase tracking-[0.22em]"; // modal / section eyebrow

// One shared link treatment so every tappable agentic link reads the same:
// own semantic colour, brightening on hover, with a trailing chevron.
export const LINK_CLASS =
  "group inline-flex items-center gap-1.5 font-semibold tracking-[0.01em] transition duration-150 hover:brightness-125 active:opacity-70";

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
