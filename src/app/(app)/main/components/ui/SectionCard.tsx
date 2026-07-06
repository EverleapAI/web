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
};

type SectionCardHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

/* =============================================================================
   Tone system (FINAL CALMED)
   ============================================================================= */

function toneClasses(tone: SectionCardTone) {
  switch (tone) {
    case "hero":
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(120%_90%_at_50%_0%,rgba(90,108,255,0.08)_0%,rgba(90,108,255,0.035)_22%,transparent_42%),radial-gradient(70%_60%_at_100%_0%,rgba(76,201,255,0.035)_0%,transparent_42%),linear-gradient(180deg,rgba(10,16,40,0.995)_0%,rgba(4,8,24,0.998)_44%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_22px_72px_rgba(5,10,28,0.52)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.012),rgba(255,255,255,0.004)_22%,transparent_48%)]",
      };

    case "plum":
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(115%_88%_at_48%_0%,rgba(120,88,255,0.08)_0%,rgba(120,88,255,0.03)_22%,transparent_42%),radial-gradient(72%_58%_at_100%_0%,rgba(88,144,255,0.035)_0%,transparent_42%),linear-gradient(180deg,rgba(10,16,40,0.995)_0%,rgba(4,8,24,0.998)_44%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_22px_72px_rgba(7,10,28,0.52)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.012),rgba(255,255,255,0.004)_22%,transparent_48%)]",
      };

    case "teal":
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(120%_92%_at_34%_0%,rgba(42,196,170,0.09)_0%,rgba(42,196,170,0.035)_20%,transparent_40%),radial-gradient(72%_58%_at_100%_0%,rgba(90,188,255,0.035)_0%,transparent_42%),linear-gradient(180deg,rgba(10,16,40,0.995)_0%,rgba(4,8,24,0.998)_42%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_22px_72px_rgba(5,18,24,0.54)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.012),rgba(255,255,255,0.004)_22%,transparent_48%)]",
      };

    case "amber":
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(120%_92%_at_38%_0%,rgba(90,152,255,0.08)_0%,rgba(90,152,255,0.03)_22%,transparent_42%),radial-gradient(70%_56%_at_100%_0%,rgba(96,220,255,0.035)_0%,transparent_42%),linear-gradient(180deg,rgba(10,16,40,0.995)_0%,rgba(4,8,24,0.998)_42%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_22px_72px_rgba(5,16,24,0.54)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.012),rgba(255,255,255,0.004)_22%,transparent_48%)]",
      };

    case "neutral":
    default:
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(115%_88%_at_48%_0%,rgba(90,108,255,0.06)_0%,rgba(90,108,255,0.025)_20%,transparent_40%),linear-gradient(180deg,rgba(10,16,40,0.995)_0%,rgba(4,8,24,0.998)_42%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_20px_68px_rgba(5,10,24,0.52)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.012),rgba(255,255,255,0.004)_22%,transparent_48%)]",
      };
  }
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
}: Props) {
  const t = toneClasses(tone);

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[28px] backdrop-blur-xl",
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