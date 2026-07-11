import type { CSSProperties } from "react";

// Low-glare dark-mode text treatment — the "Today" page recipe, shared so every
// agentic surface (Today / Insights / Explore) reads the same. Hierarchy comes
// from size + weight + spacing, NOT brightness. Reduce luminance, keep the
// stroke weight up (500) so thin antialiased text doesn't strain the eye.
//
// Canonical values are defined here; components import these instead of
// re-declaring their own colours/sizes so the whole app stays in sync.

// ── Colour ramp ──────────────────────────────────────────────────────────────
export const TEXT_PRIMARY = "#A2A6B0"; // body prose, the read, headline-as-prose
export const TEXT_SECONDARY = "#878B95"; // quiet labels + secondary links — a notch down
export const TEXT_MUTED = "#63666F"; // meta / timestamps — the quietest chrome

// ── Prose recipe ─────────────────────────────────────────────────────────────
export const PROSE_STYLE: CSSProperties = { color: TEXT_PRIMARY, fontWeight: 500 };
export const PROSE_CLASS = "leading-[1.6] tracking-[0.4px]";

// ── Size ladder (the "full ladder", identical to Today) ──────────────────────
export const PROSE_SIZE = "text-[21px]"; // hero / body agentic prose
export const LINK_SIZE = "text-[18px]"; // secondary links
export const EYEBROW_CLASS = "text-[10.5px] font-bold uppercase tracking-[0.22em]"; // modal / section eyebrow

// One shared link treatment so every tappable agentic link reads the same:
// own semantic colour, brightening on hover, with a trailing chevron.
export const LINK_CLASS =
  "group inline-flex items-center gap-1.5 font-semibold tracking-[0.01em] transition duration-150 hover:brightness-125 active:opacity-70";
