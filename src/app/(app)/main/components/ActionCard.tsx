"use client";

import * as React from "react";

type SectionCardTone = "hero" | "teal" | "amber" | "plum" | "neutral";

type Props = {
  children: React.ReactNode;
  className?: string;
  tone?: SectionCardTone;
  compact?: boolean;
};

function toneClasses(tone: SectionCardTone) {
  switch (tone) {
    case "hero":
      return {
        shell:
          [
            "border-white/10",
            "bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))]",
            "shadow-[0_18px_60px_rgba(8,10,24,0.34)]",
          ].join(" "),
        glow:
          "bg-[radial-gradient(circle,rgba(244,114,182,0.18)_0%,rgba(168,85,247,0.10)_42%,transparent_72%)]",
      };

    case "teal":
      return {
        shell:
          [
            "border-white/10",
            "bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.03))]",
            "shadow-[0_18px_60px_rgba(8,10,24,0.30)]",
          ].join(" "),
        glow:
          "bg-[radial-gradient(circle,rgba(45,212,191,0.16)_0%,rgba(34,211,238,0.10)_42%,transparent_72%)]",
      };

    case "amber":
      return {
        shell:
          [
            "border-white/10",
            "bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(251,113,133,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.03))]",
            "shadow-[0_18px_60px_rgba(8,10,24,0.30)]",
          ].join(" "),
        glow:
          "bg-[radial-gradient(circle,rgba(251,191,36,0.15)_0%,rgba(251,113,133,0.10)_42%,transparent_72%)]",
      };

    case "plum":
      return {
        shell:
          [
            "border-white/10",
            "bg-[radial-gradient(circle_at_top_right,rgba(192,132,252,0.15),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.03))]",
            "shadow-[0_18px_60px_rgba(8,10,24,0.30)]",
          ].join(" "),
        glow:
          "bg-[radial-gradient(circle,rgba(192,132,252,0.15)_0%,rgba(244,114,182,0.10)_42%,transparent_72%)]",
      };

    case "neutral":
    default:
      return {
        shell:
          [
            "border-white/10",
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]",
            "shadow-[0_18px_60px_rgba(8,10,24,0.28)]",
          ].join(" "),
        glow:
          "bg-[radial-gradient(circle,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.05)_40%,transparent_72%)]",
      };
  }
}

export function SectionCard({
  children,
  className = "",
  tone = "neutral",
  compact = false,
}: Props) {
  const toneStyle = toneClasses(tone);

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[28px] border backdrop-blur-xl",
        compact ? "px-4 py-4 sm:px-5 sm:py-5" : "px-4 py-5 sm:px-5 sm:py-6",
        toneStyle.shell,
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-2xl",
          toneStyle.glow,
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%,transparent_100%)]"
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default SectionCard;