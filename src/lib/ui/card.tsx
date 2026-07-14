import type { CSSProperties, ElementType, ReactNode } from "react";

import { TEXT_HEADING, TEXT_PRIMARY, TEXT_SECONDARY } from "./prose";

/* =============================================================================
   THE CARD'S TYPOGRAPHY, AS COMPONENTS RATHER THAN ADVICE
   =============================================================================
   `CARD_TITLE_CLASS` / `CARD_BODY_CLASS` already existed in prose.ts and stated
   the rule correctly. Two components imported them. Twenty-eight did not, and a
   survey of the app found TWENTY-TWO distinct card-title recipes — titles landing
   on 13, 15, 16.8, 17, 19, 19.2, 21, 24, 26 and 32px, in six different colours.

   That is not carelessness, it is structure: `SectionCard` is pure chrome. It sets
   the radius, gradient, border and shadow and imposes NO typography — it does not
   even take a title. (It carried a `SectionCardHeaderProps` type that no component
   ever consumed.) So every card had to hand-build its own heading, and hand-built
   headings drift. A constant is a suggestion you have to remember to import; the
   ESLint ratchet cannot help, because `text-body font-semibold tracking-title` is
   a perfectly legal combination of legal tokens.

   The fix is to make the header a THING rather than a convention. These components
   are the only sanctioned way to set type inside a card.

   WEIGHTS ARE VARIABLES, AND THAT IS LOAD-BEARING. Every hand-rolled title was a
   hard `font-semibold`, so the reading tuner's weight dials moved the five
   prose-importing components and left every card title behind — tuning the app on
   a phone would have been tuning against a lie. Everything here reads
   `--title-weight` or `--read-weight`, so one dial now moves the whole app.
   ============================================================================= */

/* ── The ladder ───────────────────────────────────────────────────────────────
   Four rungs, and the app needs exactly four. The 22 recipes were not expressing
   22 intentions — they were expressing these four, badly.

     VOICE  21px  the agent talking (HEADING_CLASS in prose.ts — not here)
     TITLE  19px  a card's own title
     BODY   17px  a card's prose
     ROW    15px  a title INSIDE a card — list rows, menu items, tiles
     META   13px  a row's supporting line

   A row title is deliberately NOT a card title. Flattening every heading to 19px
   would be the same mistake in the other direction: a five-item menu inside a card
   is not five cards. The rule is that each rung has ONE recipe, not that there is
   one rung.
   ────────────────────────────────────────────────────────────────────────────── */

// ONE VOICE (see prose.ts): a card's title and its body are the SAME spoken
// treatment as the read — 21px, regular, one brightness. A card is not a titled
// article; it is more of the agent talking. `CardTitle` and `CardBody` are kept as
// separate names for call-site intent, but they render identically now.
export const CARD_BODY_STYLE: CSSProperties = {
  color: TEXT_PRIMARY,
  fontWeight: "var(--read-weight, 400)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--read-tracking, 0em)",
};

export const CARD_TITLE_STYLE: CSSProperties = { ...CARD_BODY_STYLE };

export const ROW_TITLE_STYLE: CSSProperties = {
  color: TEXT_HEADING,
  fontWeight: "var(--title-weight, 600)" as CSSProperties["fontWeight"],
};

export const ROW_META_STYLE: CSSProperties = {
  color: TEXT_SECONDARY,
  fontWeight: "var(--read-weight, 400)" as CSSProperties["fontWeight"],
};

type TypeProps = {
  children: ReactNode;
  /** Extra layout classes only — margins, truncation, width. Never type. */
  className?: string;
  /** The element to render. Pick for the document outline, not for the look. */
  as?: ElementType;
  style?: CSSProperties;
};

/**
 * A card's title. 19px — the agent's read, one rung down.
 *
 * `as` exists because the heading LEVEL is a document-outline decision and the
 * SIZE is a design decision, and conflating them is how we ended up with an h4 at
 * 15px next to an h2 at 19px, both meaning "this card is called this". Choose `as`
 * for the outline; the type is the same either way.
 */
export function CardTitle({ children, className = "", as: Tag = "h3", style }: TypeProps) {
  return (
    <Tag
      className={["text-read leading-read", className].join(" ")}
      style={{ ...CARD_TITLE_STYLE, ...style }}
    >
      {children}
    </Tag>
  );
}

/** A card's prose. 17px, regular, bright — the read's own recipe, one rung down. */
export function CardBody({ children, className = "", as: Tag = "p", style }: TypeProps) {
  return (
    <Tag className={["text-read leading-read", className].join(" ")} style={{ ...CARD_BODY_STYLE, ...style }}>
      {children}
    </Tag>
  );
}

/** A title INSIDE a card: list rows, menu items, stat tiles. 15px. */
export function RowTitle({ children, className = "", as: Tag = "span", style }: TypeProps) {
  return (
    <Tag className={["text-label leading-body", className].join(" ")} style={{ ...ROW_TITLE_STYLE, ...style }}>
      {children}
    </Tag>
  );
}

/** A row's supporting line. 13px, quiet. */
export function RowMeta({ children, className = "", as: Tag = "span", style }: TypeProps) {
  return (
    <Tag className={["text-meta leading-body", className].join(" ")} style={{ ...ROW_META_STYLE, ...style }}>
      {children}
    </Tag>
  );
}
