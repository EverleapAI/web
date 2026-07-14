import type { CSSProperties, ElementType, ReactNode } from "react";

import { EYEBROW_CLASS, TEXT_HEADING, TEXT_PRIMARY, TEXT_SECONDARY } from "./prose";

/* =============================================================================
   THE COACH STEP — ONE SHELL FOR THE WHOLE FUNNEL
   =============================================================================
   Onboarding, Story, the question flows, the intro reveal and the ready screen are
   the same thing five times: an eyebrow, a thing the coach says, some prose, a way
   to answer, and a way forward. They were five independent full-page
   implementations, and a survey found ELEVEN distinct hero recipes across the one
   funnel — of which exactly ONE sat on the type ladder.

   The tell is that the SAME widget diverged: the answer textarea is 17px in
   InputRenderer, 15px in Story and 15px in QuestionFlow. Nobody decided that. It is
   what happens when a widget has no single home.

   THERE WAS ALSO A DECOY. `components/onboarding/CoachShell.tsx` was a complete
   coach shell — pill, eyebrow, progress, title, subtitle, footnote — with its own
   slate palette and its own text-3xl/text-sm ladder, and NOTHING IMPORTED IT. It
   looked exactly like the file you would fix, and fixing it would have changed
   nothing on screen. It is deleted; this is the real one.

   WHAT THIS OWNS: rhythm and type. WHAT IT DOES NOT OWN: animation, state, page
   chrome (background, progress header, safe-area padding). Those stay with the
   pages — Conversation animates with framer-motion, Story with CSS keyframes, and
   forcing those together would have been a rewrite of the pre-pilot funnel rather
   than a typography fix.

   EVERY WEIGHT IS A VARIABLE. The funnel hard-coded font-semibold and font-medium
   everywhere and imported nothing from the design system, so onboarding prose ran a
   full weight step (500) heavier than every other agentic surface — the exact
   "UI label, not prose" recipe the reading pass inverted away from. It also meant
   the phone tuner moved nothing here.
   ============================================================================= */

type Align = "left" | "center";

type TypeProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
};

/* ── The two voices ───────────────────────────────────────────────────────────
   A question and a statement are not the same size, and that difference is the
   only hierarchy this surface has.

   ASK  (26 → 32)  the coach asking you something. It shares the page with options
                   and an input, so it cannot fill the screen.
   TELL (32 → 43)  the coach saying something — a transition, a completion, an
                   intro. It IS the screen, so it gets the full voice.

   Both were previously five arbitrary rem literals between 1.42rem and 2.7rem.
   ────────────────────────────────────────────────────────────────────────────── */

// ONE VOICE (see prose.ts). The coach ASKING and the coach TELLING are the same
// person speaking, so they are the same treatment as everything else it says: the
// read. This collapses the old 26→43px question/statement heroes onto the 21px
// read — because a coach asking you something out loud does not SHOUT it in 43px;
// it just says it, in the same voice as the sentence before. AskHero / TellHero /
// CoachLine are kept as distinct names for call-site intent but render identically.
const HERO_STYLE: CSSProperties = {
  color: TEXT_PRIMARY,
  fontWeight: "var(--read-weight, 400)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--read-tracking, 0em)",
};

/** The coach asking — the read. */
export function AskHero({ children, className = "", as: Tag = "h1", style }: TypeProps) {
  return (
    <Tag
      className={["text-balance text-read leading-read", className].join(" ")}
      style={{ ...HERO_STYLE, ...style }}
    >
      {children}
    </Tag>
  );
}

/** The coach telling — the read, same as asking. One voice. */
export function TellHero({ children, className = "", as: Tag = "h1", style }: TypeProps) {
  return (
    <Tag
      className={["text-balance text-read leading-read", className].join(" ")}
      style={{ ...HERO_STYLE, ...style }}
    >
      {children}
    </Tag>
  );
}

/** The coach's prose — the read, same as the hero. */
export function CoachLine({ children, className = "", as: Tag = "p", style }: TypeProps) {
  return (
    <Tag
      className={["text-pretty text-read leading-read", className].join(" ")}
      style={{ ...HERO_STYLE, ...style }}
    >
      {children}
    </Tag>
  );
}

/** The quiet line under a question — "Pick as many as you like." 15px. */
export function StepHelper({ children, className = "", as: Tag = "p", style }: TypeProps) {
  return (
    <Tag
      className={["text-label leading-body", className].join(" ")}
      style={{
        color: TEXT_SECONDARY,
        fontWeight: "var(--read-weight, 400)" as CSSProperties["fontWeight"],
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * An answer option's label. 15px.
 *
 * `selected` is the ONLY thing that changes it, and it changes weight + brightness
 * rather than size — the three implementations of this control previously disagreed
 * on all three (13px vs 15px, semibold vs medium, white vs white/80).
 */
export function OptionLabel({
  children,
  className = "",
  as: Tag = "div",
  selected = false,
  style,
}: TypeProps & { selected?: boolean }) {
  return (
    <Tag
      className={["text-label leading-body", className].join(" ")}
      style={{
        color: selected ? TEXT_HEADING : TEXT_PRIMARY,
        fontWeight: (selected
          ? "var(--title-weight, 600)"
          : "var(--read-weight, 400)") as CSSProperties["fontWeight"],
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/** The eyebrow above a step. Delegates to the one that already exists. */
export function StepEyebrow({ children, className = "", as: Tag = "div", style }: TypeProps) {
  return (
    <Tag className={[EYEBROW_CLASS, className].join(" ")} style={{ color: TEXT_SECONDARY, ...style }}>
      {children}
    </Tag>
  );
}

/* ── The shell ────────────────────────────────────────────────────────────────
   Slots, not a rewrite. A page passes what it has; the shell owns the vertical
   rhythm and hands each slot to the right voice above. `hero`/`prose` accept plain
   strings (the common case) or nodes (when the page needs to animate them, which
   is why they are not forced through the components here).
   ────────────────────────────────────────────────────────────────────────────── */

export type CoachStepProps = {
  /** "ask" = a question, shares the page (26→32). "tell" = a statement, IS the page (32→43). */
  tone?: "ask" | "tell";
  align?: Align;
  /** Narrow for questions with options beside them; wide for a statement that fills the screen. */
  measure?: "narrow" | "wide";
  eyebrow?: ReactNode;
  hero?: ReactNode;
  prose?: ReactNode;
  /** The interaction — options, a textarea, nothing. */
  children?: ReactNode;
  /** Back / Continue. */
  nav?: ReactNode;
  className?: string;
};

export function CoachStep({
  tone = "ask",
  align = "left",
  measure = "narrow",
  eyebrow,
  hero,
  prose,
  children,
  nav,
  className = "",
}: CoachStepProps) {
  const Hero = tone === "tell" ? TellHero : AskHero;
  const centered = align === "center";

  return (
    <section
      className={[
        "flex w-full flex-col",
        measure === "wide" ? "max-w-[640px]" : "max-w-[440px]",
        centered ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      ].join(" ")}
    >
      {eyebrow ? <StepEyebrow className="mb-4">{eyebrow}</StepEyebrow> : null}

      {hero ? (
        typeof hero === "string" ? (
          <Hero>{hero}</Hero>
        ) : (
          hero
        )
      ) : null}

      {prose ? (
        <div className={["mt-4 w-full space-y-3", centered ? "mx-auto" : ""].join(" ")}>
          {typeof prose === "string" ? <CoachLine>{prose}</CoachLine> : prose}
        </div>
      ) : null}

      {children ? <div className="mt-6 w-full">{children}</div> : null}

      {nav ? <div className="mt-8 w-full">{nav}</div> : null}
    </section>
  );
}
