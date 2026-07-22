// apps/web/src/app/(app)/main/insights/components/sections/InsightsUnlockCTA.tsx
//
// The signal-level call-to-action on the Motivations / Strengths / Skills tabs.
// Two colourful variants, by how much of the category the user has answered:
//   "low"     (<20%)   — amber. Nothing to show yet: "there's a lot we could
//                        show you here, we just don't have enough — unlock it."
//   "partial" (20-99%) — sky.   Content IS shown alongside it: "we've got enough
//                        for some early thinking, finish the category to sharpen."
// Both are deliberately COLOURFUL so they read as the one thing to act on, and
// both link to the next question in that category in Story.
//
// The card itself is `UnlockCard` — the shared loud-card shell, also used by the
// story nudge on Today. This file now only decides WHICH nudge and WHAT it says.

"use client";

import * as React from "react";
import { Sparkles, TrendingUp } from "lucide-react";

import { UnlockCard } from "@/app/(app)/main/components/ui/UnlockCard";

export function InsightsUnlockCTA({
  dark,
  category,
  href,
  variant = "low",
}: {
  dark: boolean;
  /** Display label for the category, e.g. "Motivations". Unused for "funfacts". */
  category?: string;
  href: string;
  variant?: "low" | "partial" | "funfacts";
}) {
  void dark; // this page is always dark (nightDusk); kept for a consistent API
  const categoryLower = (category ?? "").toLowerCase();

  const cfg =
    variant === "funfacts"
      ? {
          accent: "232, 121, 249", // fuchsia — Fun Facts' own colour
          Icon: Sparkles,
          eyebrow: "More to notice",
          cta: "Answer more questions",
        }
      : variant === "partial"
        ? {
            accent: "96, 176, 255", // sky — "you're on your way"
            Icon: TrendingUp,
            eyebrow: "You're on your way",
            cta: `Finish ${category} questions`,
          }
        : {
            accent: "251, 191, 36", // amber — "there's more to unlock"
            Icon: Sparkles,
            eyebrow: "There's a lot more here",
            cta: `Answer ${category} questions`,
          };
  const { accent, Icon } = cfg;

  return (
    <UnlockCard accent={accent} Icon={Icon} eyebrow={cfg.eyebrow} href={href} cta={cfg.cta}>
      {variant === "funfacts" ? (
        <p>
          Fun facts come from the surprising crossovers in everything you&rsquo;ve
          shared — the more questions you answer, the more of them (and the
          stranger ones) we can surface.
        </p>
      ) : variant === "partial" ? (
        <p>
          We&rsquo;ve got enough here to show you some early thinking about your{" "}
          {categoryLower} — but there&rsquo;s more to this category, and finishing it
          lets us do it real justice. A few more {category} questions and this
          sharpens.
        </p>
      ) : (
        <p>
          There&rsquo;s a lot we can show you about your {categoryLower} — the patterns
          behind them, what&rsquo;s really driving them, and where they show up in your
          life. We just don&rsquo;t have enough from you yet to say any of it with
          confidence. A few {category} questions is all it takes to unlock it.
        </p>
      )}
    </UnlockCard>
  );
}

export default InsightsUnlockCTA;
