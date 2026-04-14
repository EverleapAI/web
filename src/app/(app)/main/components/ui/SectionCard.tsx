"use client";

import * as React from "react";

type SectionCardTone = "hero" | "teal" | "amber" | "plum" | "neutral";

type Props = {
  children: React.ReactNode;
  className?: string;
  tone?: SectionCardTone;
  compact?: boolean;
};

type SectionCardHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

/* =============================================================================
   Tone system
   ============================================================================= */

function toneClasses(tone: SectionCardTone) {
  switch (tone) {
    case "hero":
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(120%_90%_at_50%_0%,rgba(90,108,255,0.22)_0%,rgba(90,108,255,0.08)_26%,transparent_52%),radial-gradient(70%_60%_at_100%_0%,rgba(76,201,255,0.14)_0%,transparent_52%),linear-gradient(180deg,rgba(18,28,66,0.98)_0%,rgba(8,14,36,0.985)_44%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_22px_72px_rgba(5,10,28,0.48)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018)_22%,transparent_48%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.18),transparent_64%)]",
        clusterDotStrong: "bg-indigo-200/42",
        clusterDotMid: "bg-sky-200/28",
        clusterDotSoft: "bg-white/16",
        headerAccent: "text-[rgba(251,191,36,0.84)]",
        eyebrow:
          "text-[11px] font-semibold uppercase tracking-[0.28em] text-white/46",
        title:
          "text-[17px] font-semibold tracking-[-0.01em] text-white/88 sm:text-[18px]",
        description:
          "text-[13px] leading-6 text-white/60 sm:text-[13.5px]",
      };

    case "plum":
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(115%_88%_at_48%_0%,rgba(120,88,255,0.24)_0%,rgba(120,88,255,0.09)_24%,transparent_50%),radial-gradient(72%_58%_at_100%_0%,rgba(88,144,255,0.10)_0%,transparent_50%),linear-gradient(180deg,rgba(28,34,82,0.98)_0%,rgba(10,16,40,0.985)_44%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_22px_72px_rgba(7,10,28,0.48)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.016)_22%,transparent_48%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.18),transparent_64%)]",
        clusterDotStrong: "bg-violet-200/38",
        clusterDotMid: "bg-indigo-200/26",
        clusterDotSoft: "bg-white/15",
        headerAccent: "text-[rgba(251,191,36,0.82)]",
        eyebrow:
          "text-[11px] font-semibold uppercase tracking-[0.28em] text-white/46",
        title:
          "text-[17px] font-semibold tracking-[-0.01em] text-white/88 sm:text-[18px]",
        description:
          "text-[13px] leading-6 text-white/60 sm:text-[13.5px]",
      };

    case "teal":
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(120%_92%_at_34%_0%,rgba(42,196,170,0.26)_0%,rgba(42,196,170,0.10)_22%,transparent_48%),radial-gradient(72%_58%_at_100%_0%,rgba(90,188,255,0.10)_0%,transparent_50%),linear-gradient(180deg,rgba(14,64,72,0.98)_0%,rgba(8,16,38,0.985)_42%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_22px_72px_rgba(5,18,24,0.5)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.016)_22%,transparent_48%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.18),transparent_64%)]",
        clusterDotStrong: "bg-teal-200/38",
        clusterDotMid: "bg-emerald-200/28",
        clusterDotSoft: "bg-white/15",
        headerAccent: "text-[rgba(251,191,36,0.82)]",
        eyebrow:
          "text-[11px] font-semibold uppercase tracking-[0.28em] text-white/46",
        title:
          "text-[17px] font-semibold tracking-[-0.01em] text-white/88 sm:text-[18px]",
        description:
          "text-[13px] leading-6 text-white/60 sm:text-[13.5px]",
      };

    case "amber":
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(120%_92%_at_38%_0%,rgba(90,152,255,0.24)_0%,rgba(90,152,255,0.09)_24%,transparent_50%),radial-gradient(70%_56%_at_100%_0%,rgba(96,220,255,0.11)_0%,transparent_50%),linear-gradient(180deg,rgba(16,54,78,0.98)_0%,rgba(8,16,38,0.985)_42%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_22px_72px_rgba(5,16,24,0.5)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.016)_22%,transparent_48%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_64%)]",
        clusterDotStrong: "bg-cyan-200/38",
        clusterDotMid: "bg-sky-200/28",
        clusterDotSoft: "bg-white/15",
        headerAccent: "text-[rgba(251,191,36,0.82)]",
        eyebrow:
          "text-[11px] font-semibold uppercase tracking-[0.28em] text-white/46",
        title:
          "text-[17px] font-semibold tracking-[-0.01em] text-white/88 sm:text-[18px]",
        description:
          "text-[13px] leading-6 text-white/60 sm:text-[13.5px]",
      };

    case "neutral":
    default:
      return {
        shell: [
          "border border-white/10",
          "bg-[radial-gradient(115%_88%_at_48%_0%,rgba(90,108,255,0.15)_0%,rgba(90,108,255,0.05)_24%,transparent_50%),linear-gradient(180deg,rgba(18,24,52,0.98)_0%,rgba(8,12,30,0.985)_42%,rgba(3,7,20,1)_100%)]",
          "shadow-[0_20px_68px_rgba(5,10,24,0.46)]",
        ].join(" "),
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.016)_22%,transparent_48%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_64%)]",
        clusterDotStrong: "bg-white/28",
        clusterDotMid: "bg-white/18",
        clusterDotSoft: "bg-white/12",
        headerAccent: "text-[rgba(251,191,36,0.80)]",
        eyebrow:
          "text-[11px] font-semibold uppercase tracking-[0.28em] text-white/46",
        title:
          "text-[17px] font-semibold tracking-[-0.01em] text-white/88 sm:text-[18px]",
        description:
          "text-[13px] leading-6 text-white/60 sm:text-[13.5px]",
      };
  }
}

/* =============================================================================
   Header helpers
   ============================================================================= */

export function getSectionCardHeaderClasses(tone: SectionCardTone = "neutral") {
  const t = toneClasses(tone);

  return {
    accent: t.headerAccent,
    eyebrow: t.eyebrow,
    title: t.title,
    description: t.description,
  };
}

export function SectionCardHeader({
  eyebrow,
  title,
  description,
  action,
  className = "",
}: SectionCardHeaderProps) {
  return (
    <div className={["flex items-start justify-between gap-4", className].join(" ")}>
      <div className="min-w-0">
        {eyebrow ? <div className="mb-2">{eyebrow}</div> : null}
        <div>{title}</div>
        {description ? <div className="mt-1.5">{description}</div> : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function CardCluster({
  tone,
  compact,
}: {
  tone: ReturnType<typeof toneClasses>;
  compact: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute right-4 top-4 z-[1]",
        compact ? "scale-90 opacity-90" : "opacity-100",
      ].join(" ")}
    >
      <div className={["absolute -inset-6 rounded-full blur-2xl", tone.clusterGlow].join(" ")} />

      <div className="relative h-12 w-12">
        <span
          className={[
            "absolute right-1 top-1 h-1.5 w-1.5 rounded-full",
            tone.clusterDotStrong,
          ].join(" ")}
        />
        <span
          className={[
            "absolute right-5 top-0.5 h-1 w-1 rounded-full",
            tone.clusterDotMid,
          ].join(" ")}
        />
        <span
          className={[
            "absolute right-0 top-6 h-1 w-1 rounded-full",
            tone.clusterDotMid,
          ].join(" ")}
        />
        <span
          className={[
            "absolute right-4 top-5 h-1.5 w-1.5 rounded-full",
            tone.clusterDotSoft,
          ].join(" ")}
        />
        <span
          className={[
            "absolute right-8 top-7 h-1 w-1 rounded-full",
            tone.clusterDotMid,
          ].join(" ")}
        />
        <span
          className={[
            "absolute right-2 top-10 h-1 w-1 rounded-full",
            tone.clusterDotSoft,
          ].join(" ")}
        />
      </div>
    </div>
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export function SectionCard({
  children,
  className = "",
  tone = "neutral",
  compact = false,
}: Props) {
  const t = toneClasses(tone);

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[28px] backdrop-blur-xl",
        compact ? "px-4 py-4 sm:px-5 sm:py-5" : "px-4 py-5 sm:px-5 sm:py-6",
        t.shell,
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={["pointer-events-none absolute inset-0", t.sheen].join(" ")}
      />

      {tone !== "neutral" ? <CardCluster tone={t} compact={compact} /> : null}

      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default SectionCard;