"use client";

import * as React from "react";

type SectionCardTone = "hero" | "teal" | "amber" | "plum" | "neutral";

type Props = {
  children: React.ReactNode;
  className?: string;
  tone?: SectionCardTone;
  compact?: boolean;
  // Full-bleed decorative layer rendered behind the (padded) content, at the
  // card level — so it fills the whole rounded card, not the inset content box.
  // Use for background atmospherics like the ConstellationAnchor.
  backdrop?: React.ReactNode;
  /**
   * VOICE vs OBJECT — the rule that gives Today its hierarchy.
   *
   * `voice` renders the content straight onto the page with no shell at all. It
   * is for the agent's read on Today / Insights / Explore: the agent is TALKING
   * to you, and you do not put a voice in a box. Everything else on the page is
   * something you can act on — a status, an offer, a question — and those are
   * objects, so they get a card.
   *
   * Before this, all four blocks on Today were cards, and every card measured
   * 1.024:1 against the page (1.00 = identical; WCAG's floor for a perceivable
   * graphical element is 3:1). So they were not four cards — they were four
   * paragraphs in a column with 28px of rounded nothing around them, and the eye
   * had no boundary anywhere to navigate by. Making the read a voice AND making
   * the rest genuinely visible is what creates the contrast; doing either alone
   * changes nothing, which is exactly what happened when we tried stripping the
   * read's (invisible) box on its own.
   */
  voice?: boolean;
  /**
   * `"r, g, b"` — give this card the accent treatment: a corner glow and a
   * tinted edge, the same recipe the Insights area cards use.
   *
   * Opt-in, because the rule has two halves. A card you READ shares one surface
   * with every other card and carries its accent only in glyph, eyebrow and CTA.
   * A card you CHOOSE BETWEEN is a navigation surface and the accent carries it.
   * Today's sections end in an action, so they earn it; the agent's read above
   * them does not, and stays a voice.
   */
  accentRgb?: string;
};

type SectionCardHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

/* =============================================================================
   Card surface — ONE near-black background for every card
   =============================================================================
   Sampled from the reference card the design settled on: the fill is NEAR-BLACK,
   only just above the #020617 page (~rgb 4-8,8-11,20-28), with a faint navy lift
   at the very top (~rgb 14,18,31) and a white/0.07 hairline. Deliberately quiet —
   the card is defined by its edge + top lift, not by a bright fill.

   An earlier iteration used rgb(22,29,54) with per-tone accent washes (amber on
   Awards, teal on Reflect); that read as a lighter, tinted card and was wrong.
   There is no accent wash now, and `tone` no longer changes the surface — a
   card's colour lives only in its glyph, eyebrow and CTA.
   ============================================================================= */

// Sampled straight from the reference card: the background is NEAR-BLACK, barely
// above the #020617 page (~rgb 4-8,8-11,20-28), with just a faint navy lift at the
// very top (~rgb 14,18,31) and a hairline edge. Every prior version used
// rgb(22,29,54) — ~10x too light — which is why the cards kept reading as a wrong,
// lighter colour. No accent wash: dark navy, almost black.
const CARD_BASE =
  "linear-gradient(180deg,rgb(14,18,31)_0%,rgb(8,12,26)_45%,rgb(4,8,20)_100%)";
const CARD_EDGE = "border border-white/[0.07]";
const CARD_LIFT = "shadow-[0_18px_46px_rgba(0,0,0,0.42)]";

// ONE central card style for every card — the near-black CARD_BASE, no accent
// wash of any kind. `tone` is still accepted so callers don't churn, but every
// card renders this same dark shell, so Today / Insights / Explore read as one
// system. THE INSIGHTS `sectionCard()` HELPER IN summaryShared.tsx MIRRORS THIS
// EXACT RECIPE — keep the two in sync.
function toneClasses(_tone: SectionCardTone) {
  void _tone;
  return {
    shell: [CARD_EDGE, `bg-[${CARD_BASE}]`, CARD_LIFT].join(" "),
    sheen: "",
  };
}

/* =============================================================================
   Component
   ============================================================================= */

export function SectionCard({
  children,
  className = "",
  tone = "neutral",
  compact = false,
  backdrop,
  voice = false,
  accentRgb,
}: Props) {
  const t = toneClasses(tone);

  // A voice, not an object — no shell, no edge, no lift. The agent's read sits on
  // the page and speaks. The backdrop still renders: the constellation is the
  // page's atmosphere, not the card's decoration.
  if (voice) {
    return (
      <section className={["relative", className].join(" ")}>
        {backdrop}
        <div className="relative z-10">{children}</div>
      </section>
    );
  }

  return (
    <section
      className={[
        "relative overflow-hidden rounded-card backdrop-blur-xl",
        compact
          ? "px-3.5 pt-3.5 pb-4 sm:px-5 sm:pt-4 sm:pb-5"
          : "px-3.5 pt-4 pb-5 sm:px-5 sm:pt-5 sm:pb-6",
        t.shell,
        className,
      ].join(" ")}
      style={
        // The accent EDGE, when a caller asks for one. Kept out of toneClasses
        // so the default card is untouched and this can only ever be opt-in.
        accentRgb ? { borderColor: `rgba(${accentRgb},0.30)` } : undefined
      }
    >
      <div
        aria-hidden="true"
        className={["pointer-events-none absolute inset-0", t.sheen].join(" ")}
      />
      {/* THE CORNER GLOW — opt-in, and NOT the thing that was stripped in July.
          What went then was a full-card accent WASH per tone, which on the
          near-black page made cards read light-blue and turned a stacked column
          into a patchwork. This is a glow anchored to one corner that fades out
          well before the far side, so the body of the card stays the same
          near-black as every other card.

          SIZED IN PERCENT, NOT PIXELS. Copied literally from the Insights area
          cards it was meant to match, it used 150x110px — which covers a large
          share of a half-width card in a 2-up grid and almost nothing of one of
          Today's full-width, much taller ones. Same recipe, a quarter of the
          effect, which is why Today still looked flat. Percentages make the glow
          the same FRACTION of the card at any size. */}
      {accentRgb ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(78% 128% at 97% -12%, rgba(${accentRgb},0.20), rgba(${accentRgb},0.06) 45%, transparent 74%)`,
          }}
        />
      ) : null}
      {backdrop}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default SectionCard;