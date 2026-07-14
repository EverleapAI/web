"use client";

// The PM's proposed direction, built faithfully from his two mockups: an embedded
// "JOURNEY PROGRESS" card of numbered badges with vibrant gradient rings + earned
// checkmarks, and a tap-to-open detail popover with a two-tier state
// (Complete / High Signal) and an actionable "How You Earn It". Populated with our
// real /api/achievements data so it's an apples-to-apples comparison against the
// constellation. Standalone so both can be snapshotted and critiqued.

import * as React from "react";
import {
  X,
  Info,
  Check,
  Cog,
  Rocket,
  Lightbulb,
  Palette,
  Dumbbell,
  MonitorSmartphone,
  Send,
  Network,
  Car,
  Target,
  ListChecks,
  Compass,
  BookOpen,
  Flame,
  Star,
  type LucideIcon,
} from "lucide-react";

import { RowMeta, RowTitle } from "@/lib/ui/card";

type Badge = {
  slug: string;
  name: string;
  description: string;
  hint: string | null;
  row: number;
  sort: number;
  accent: string;
  glyph: string;
  earned: boolean;
  earnedAt: string | null;
};

// Distinct icon + vibrant ring per slot, cycled to mirror the mock's variety.
const ICONS: LucideIcon[] = [
  Cog,
  Rocket,
  Lightbulb,
  Palette,
  Dumbbell,
  MonitorSmartphone,
  Send,
  Network,
  Car,
  Target,
  ListChecks,
  Compass,
  BookOpen,
  Flame,
  Star,
];

const RINGS: string[] = [
  "linear-gradient(135deg,#ff5fa2,#a855f7,#6366f1)",
  "linear-gradient(135deg,#6366f1,#8b5cf6,#c084fc)",
  "linear-gradient(135deg,#34d399,#10b981,#0d9488)",
  "linear-gradient(135deg,#38bdf8,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#22d3ee,#3b82f6,#6366f1)",
  "linear-gradient(135deg,#34d399,#22d3ee,#3b82f6)",
  "linear-gradient(135deg,#a3e635,#eab308,#f59e0b)",
  "linear-gradient(135deg,#f472b6,#fb7185,#f59e0b)",
  "linear-gradient(135deg,#38bdf8,#818cf8,#c084fc)",
  "linear-gradient(135deg,#2dd4bf,#22d3ee,#38bdf8)",
  "linear-gradient(135deg,#c084fc,#e879f9,#f472b6)",
  "linear-gradient(135deg,#60a5fa,#34d399,#a3e635)",
  "linear-gradient(135deg,#fbbf24,#fb923c,#f472b6)",
  "linear-gradient(135deg,#f87171,#fb923c,#fbbf24)",
  "linear-gradient(135deg,#818cf8,#38bdf8,#2dd4bf)",
];

// ---------- one badge in the grid ----------

function BadgeCell({
  badge,
  index,
  onClick,
}: {
  badge: Badge;
  index: number;
  onClick: () => void;
}) {
  const Icon = ICONS[index % ICONS.length];
  const ring = RINGS[index % RINGS.length];
  const earned = badge.earned;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center outline-none"
      aria-label={`${badge.name}${earned ? ", earned" : ", locked"}`}
    >
      <div className="relative">
        {/* gradient ring (or a flat grey ring when not yet earned) */}
        <div
          className="rounded-full p-[2.5px]"
          style={{
            background: earned ? ring : "rgba(255,255,255,0.14)",
            opacity: earned ? 1 : 0.55,
          }}
        >
          <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-[#0e1522]">
            <Icon
              className="h-[24px] w-[24px]"
              strokeWidth={1.6}
              style={{ color: earned ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.4)" }}
            />
          </div>
        </div>
        {earned ? (
          <span className="absolute -bottom-1 left-1/2 grid h-[19px] w-[19px] -translate-x-1/2 place-items-center rounded-full border-2 border-[#141a27] bg-[#14b8a6]">
            <Check className="h-[11px] w-[11px] text-white" strokeWidth={3} />
          </span>
        ) : null}
      </div>
      <span
        className="mt-2.5 text-meta font-bold tabular-nums"
        style={{ color: earned ? "#fff" : "rgba(255,255,255,0.4)" }}
      >
        {index + 1}
      </span>
    </button>
  );
}

// ---------- the tap-to-open detail popover ----------

function DetailPopover({
  badge,
  index,
  onClose,
}: {
  badge: Badge;
  index: number;
  onClose: () => void;
}) {
  const Icon = ICONS[index % ICONS.length];
  const ring = RINGS[index % RINGS.length];
  const earned = badge.earned;

  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-black/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[300px] rounded-2xl border border-white/10 bg-[#1b2333] p-5 shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-[2px]" style={{ background: earned ? ring : "rgba(255,255,255,0.16)" }}>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0e1522]">
                <Icon className="h-[18px] w-[18px] text-white/90" strokeWidth={1.6} />
              </div>
            </div>
            <RowTitle as="div">{badge.name}</RowTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/45 transition hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* two-tier state */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <span
              className="grid h-6 w-6 place-items-center rounded-full"
              style={{
                background: earned ? "#14b8a6" : "transparent",
                border: earned ? "none" : "2px solid rgba(255,255,255,0.25)",
              }}
            >
              {earned ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : null}
            </span>
            <RowMeta>Complete</RowMeta>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-6 w-6 rounded-full border-2 border-[#3b82f6]" />
            <RowMeta>High Signal</RowMeta>
          </div>
        </div>

        {/* how you earn it */}
        <div className="mt-5">
          <RowTitle as="div">How You Earn It:</RowTitle>
          <RowMeta as="div" className="mt-1">
            {badge.hint ? (
              badge.hint
            ) : (
              <>
                Answer the <span className="font-medium text-[#5b9dff]">{badge.name}</span> questions
              </>
            )}
          </RowMeta>
        </div>
      </div>
    </div>
  );
}

// ---------- the module ----------

export function JourneyProgressPM() {
  const [badges, setBadges] = React.useState<Badge[] | null>(null);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/achievements", { credentials: "include", cache: "no-store" });
        const d = await r.json();
        if (alive && d?.ok && Array.isArray(d.badges)) {
          // Order the same way the pyramid does (base first) so numbering reads
          // foundational → advanced.
          const sorted = [...(d.badges as Badge[])].sort(
            (a, b) => b.row - a.row || a.sort - b.sort
          );
          setBadges(sorted);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="relative mx-auto max-w-[440px] rounded-panel border border-white/[0.07] bg-[#141a27] p-5">
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#6366f1]">
            <Star className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          </span>
          <span className="text-meta font-bold uppercase tracking-eyebrow text-white/90">
            Journey Progress
          </span>
        </div>
        <Info className="h-4 w-4 text-white/35" />
      </div>

      {/* grid */}
      {badges ? (
        <div className="grid grid-cols-4 gap-x-3 gap-y-6">
          {badges.map((b, i) => (
            <BadgeCell key={b.slug} badge={b} index={i} onClick={() => setOpenIndex(i)} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-meta text-white/40">Loading…</div>
      )}

      {openIndex !== null && badges?.[openIndex] ? (
        <DetailPopover
          badge={badges[openIndex]}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </div>
  );
}

export default JourneyProgressPM;
