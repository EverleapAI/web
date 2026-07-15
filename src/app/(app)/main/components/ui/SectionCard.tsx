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
};

type SectionCardHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

/* =============================================================================
   Tone system — A CARD YOU CAN ACTUALLY SEE
   =============================================================================
   Every tone used to bottom out on the same rgba(6,10,26) gradient over a
   #020617 page. Measured, that is 1.024:1 — and 1.00 is *identical*. The border
   (white at alpha 0.03) reached 1.045:1; the sheen ran at 0.012 and the shadow
   was dark-on-dark. So the cards were not subtle, they were absent, and Today
   read as four undifferentiated paragraphs in a column because the eye had no
   boundary anywhere to navigate by.

   The base is now rgb(22,29,54) — about 1.23:1 against the page. Still quiet
   (WCAG wants 3:1 before it counts as a *perceivable* graphical element, and we
   are deliberately below that: this is atmosphere, not a control), but it is now
   an edge you can actually find. The hairline goes to white/0.07, which is a real
   line rather than a rumour of one.

   Each tone keeps its accent wash on top, so Awards still reads amber-ish and
   Reflect still reads teal-ish; only the surface underneath them changed.
   ============================================================================= */

const CARD_BASE =
  "linear-gradient(180deg,rgb(22,29,54)_0%,rgb(18,24,46)_55%,rgb(15,20,40)_100%)";
const CARD_EDGE = "border border-white/[0.07]";
const CARD_LIFT = "shadow-[0_18px_46px_rgba(0,0,0,0.42)]";
const CARD_SHEEN =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018)_26%,transparent_52%)]";

// ONE background for every card: the plain dark navy CARD_BASE, nothing tinting
// it. The tones used to each bake an accent radial into the *background* — amber
// on Awards, teal on Reflect, and a center-top BLUE glow on neutral — so the page
// read as a patchwork, and once everything flattened to that neutral tone every
// card wore the same light-blue glow (Tom: "you made all the cards a light blue
// background, it's supposed to be that dark background"). No radial now — a card's
// identity lives entirely in its glyph, eyebrow and CTA (Today's "Reflect on your
// actions": teal chip + eyebrow + pill over a plain navy card). `tone` is still
// accepted so callers don't churn, but it no longer changes the surface.
function toneClasses(_tone: SectionCardTone) {
  void _tone;
  return {
    shell: [CARD_EDGE, `bg-[${CARD_BASE}]`, CARD_LIFT].join(" "),
    sheen: CARD_SHEEN,
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
    >
      <div
        aria-hidden="true"
        className={["pointer-events-none absolute inset-0", t.sheen].join(" ")}
      />
      {backdrop}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default SectionCard;