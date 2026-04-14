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
        shell:
          [
            "border-r-0 border-l-white/12 border-t-white/10 border-b-white/10",
            "bg-[linear-gradient(135deg,rgba(22,30,64,0.90)_0%,rgba(10,16,38,0.98)_42%,rgba(6,10,24,1)_100%),radial-gradient(circle_at_top_left,rgba(129,140,248,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.10),transparent_32%),radial-gradient(ellipse_at_center,rgba(4,8,20,0.42)_0%,transparent_56%)]",
            "shadow-[0_18px_60px_rgba(10,12,30,0.30)]",
          ].join(" "),
        rail:
          "bg-[linear-gradient(180deg,rgba(129,140,248,0.84),rgba(96,165,250,0.48))]",
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.028),transparent_34%,transparent_100%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.14),transparent_64%)]",
        clusterDotStrong: "bg-indigo-200/38",
        clusterDotMid: "bg-sky-200/24",
        clusterDotSoft: "bg-white/14",
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
        shell:
          [
            "border-r-0 border-l-indigo-200/16 border-t-indigo-100/12 border-b-indigo-100/12",
            "bg-[linear-gradient(135deg,rgba(34,46,96,0.88)_0%,rgba(12,18,44,0.98)_42%,rgba(6,10,24,1)_100%),radial-gradient(circle_at_top_left,rgba(129,140,248,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.06),transparent_30%),radial-gradient(ellipse_at_center,rgba(4,8,20,0.42)_0%,transparent_56%)]",
            "shadow-[0_18px_60px_rgba(10,14,30,0.28)]",
          ].join(" "),
        rail:
          "bg-[linear-gradient(180deg,rgba(129,140,248,0.74),rgba(96,165,250,0.44))]",
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_34%,transparent_100%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.14),transparent_64%)]",
        clusterDotStrong: "bg-violet-200/34",
        clusterDotMid: "bg-indigo-200/22",
        clusterDotSoft: "bg-white/13",
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
        shell:
          [
            "border-r-0 border-l-emerald-200/18 border-t-emerald-100/14 border-b-emerald-100/14",
            "bg-[linear-gradient(135deg,rgba(18,76,74,0.86)_0%,rgba(8,18,42,0.98)_42%,rgba(6,10,24,1)_100%),radial-gradient(circle_at_top_left,rgba(52,211,153,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.06),transparent_30%),radial-gradient(ellipse_at_center,rgba(4,8,20,0.42)_0%,transparent_56%)]",
            "shadow-[0_18px_60px_rgba(8,24,28,0.30)]",
          ].join(" "),
        rail:
          "bg-[linear-gradient(180deg,rgba(94,234,212,0.82),rgba(52,211,153,0.46))]",
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_34%,transparent_100%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.14),transparent_64%)]",
        clusterDotStrong: "bg-teal-200/34",
        clusterDotMid: "bg-emerald-200/24",
        clusterDotSoft: "bg-white/13",
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
        shell:
          [
            "border-r-0 border-l-cyan-200/18 border-t-cyan-100/14 border-b-cyan-100/14",
            "bg-[linear-gradient(135deg,rgba(20,64,96,0.88)_0%,rgba(8,18,42,0.98)_42%,rgba(6,10,24,1)_100%),radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(103,232,249,0.06),transparent_30%),radial-gradient(ellipse_at_center,rgba(4,8,20,0.42)_0%,transparent_56%)]",
            "shadow-[0_18px_60px_rgba(8,22,34,0.30)]",
          ].join(" "),
        rail:
          "bg-[linear-gradient(180deg,rgba(103,232,249,0.82),rgba(56,189,248,0.46))]",
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_34%,transparent_100%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_64%)]",
        clusterDotStrong: "bg-cyan-200/34",
        clusterDotMid: "bg-sky-200/24",
        clusterDotSoft: "bg-white/13",
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
        shell:
          [
            "border-r-0 border-l-white/12 border-t-white/10 border-b-white/10",
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
            "shadow-[0_18px_60px_rgba(8,10,24,0.28)]",
          ].join(" "),
        rail:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.36))]",
        sheen:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%,transparent_100%)]",
        clusterGlow:
          "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_64%)]",
        clusterDotStrong: "bg-white/24",
        clusterDotMid: "bg-white/16",
        clusterDotSoft: "bg-white/10",
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
        "relative overflow-hidden rounded-[28px] border border-r-0 backdrop-blur-xl",
        compact ? "px-4 py-4 sm:px-5 sm:py-5" : "px-4 py-5 sm:px-5 sm:py-6",
        t.shell,
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-y-3 left-0 w-[3px] rounded-r-full",
          t.rail,
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          t.sheen,
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[18px] right-0 w-px bg-transparent"
      />

      {tone !== "neutral" ? <CardCluster tone={t} compact={compact} /> : null}

      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default SectionCard;