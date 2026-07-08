"use client";

// The global Achievements layer: a callable-from-anywhere badge pyramid modal
// plus the "you just unlocked X" earn toast. Everything it renders comes from
// the DB (via /api/achievements) — names, copy, art, and earned state — so the
// badge system is tuned in data, not here. Mounted once in the main layout.

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Check,
  Sparkles,
  BookOpen,
  RefreshCw,
  Compass,
  Footprints,
  Library,
  Flame,
  Anchor,
  Search,
  Hammer,
  Map as MapIcon,
  Shield,
  Globe,
  Zap,
  Crown,
  Star,
  type LucideIcon,
} from "lucide-react";

import ConstellationAnchor from "../ui/ConstellationAnchor";
import { JourneyProgressPM } from "./JourneyProgressPM";

// Placeholder badge art — a distinct line-icon per badge so the pyramid reads as
// a real collection, not fifteen identical diamonds. Stand-ins until real badge
// illustrations land; keyed by slug, falls back to a star.
const PLACEHOLDER_ICONS: Record<string, LucideIcon> = {
  first_light: Sparkles,
  story_told: BookOpen,
  first_reflection: RefreshCw,
  explorer: Compass,
  showed_up: Footprints,
  open_book: Library,
  committed: Flame,
  deep_diver: Anchor,
  curious: Search,
  craftsman: Hammer,
  pathfinder: MapIcon,
  steadfast: Shield,
  cartographer: Globe,
  relentless: Zap,
  everleaper: Crown,
};

import {
  OPEN_ACHIEVEMENTS,
  BADGE_EARNED,
  ACTIONS_CHANGED,
  emitCelebrate,
  emitBadgeEarned,
  type EarnedBadge,
} from "@/lib/actionsBus";

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
  // Tier 2 — the optional "High Signal" depth.
  hasHighSignal?: boolean;
  highSignal?: boolean;
  highSignalHint?: string | null;
  highSignalAt?: string | null;
};

const ACCENT_RGB: Record<string, string> = {
  amber: "246,178,60",
  violet: "182,160,255",
  cyan: "92,180,255",
  green: "55,211,160",
  gradient: "246,178,60",
};

function rgb(accent: string): string {
  return ACCENT_RGB[accent] ?? ACCENT_RGB.amber;
}

// ---------- one medal ----------

function Medal({
  badge,
  onClick,
  selected,
}: {
  badge: Badge;
  onClick: () => void;
  selected: boolean;
}) {
  const c = rgb(badge.accent);
  const isGradient = badge.accent === "gradient";
  const earned = badge.earned;
  // A cleared High Signal tier reads as a brighter, double-ringed star.
  const highSignal = !!badge.highSignal && earned;
  const Icon = PLACEHOLDER_ICONS[badge.slug] ?? Star;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-[64px] flex-col items-center gap-1.5 outline-none"
      aria-label={`${badge.name}${earned ? ", earned" : ", locked"}`}
    >
      {/* a soft, twinkling halo — this star is lit */}
      {earned ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[27px] h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-[elTwinkle_3.8s_ease-in-out_infinite]"
          style={{ background: `radial-gradient(circle, rgba(${c},.6), transparent 68%)`, filter: "blur(5px)" }}
        />
      ) : null}
      <span
        className="relative flex h-[54px] w-[54px] items-center justify-center rounded-full transition"
        style={
          earned
            ? {
                color: isGradient ? "#fff" : `rgb(${c})`,
                background: isGradient
                  ? "linear-gradient(135deg, rgba(246,178,60,.28), rgba(182,160,255,.28))"
                  : `rgba(${c},${highSignal ? ".26" : ".2"})`,
                border: `1px solid rgba(${c},${highSignal ? ".95" : ".75"})`,
                boxShadow: `0 0 ${highSignal ? 26 : 20}px rgba(${c},${
                  highSignal ? ".7" : ".55"
                }), inset 0 0 12px rgba(${c},.25)${
                  highSignal ? `, 0 0 0 2px rgba(${c},.85)` : ""
                }${selected ? `, 0 0 0 ${highSignal ? 4 : 3}px rgba(${c},.4)` : ""}`,
              }
            : {
                color: "rgba(238,241,251,.42)",
                background: "rgba(255,255,255,.05)",
                border: `1px ${selected ? "solid" : "dashed"} rgba(255,255,255,${
                  selected ? ".32" : ".18"
                })`,
              }
        }
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
      </span>
      <span
        className="text-center text-[9px] leading-tight"
        style={{ color: earned ? "rgba(238,241,251,.72)" : "rgba(238,241,251,.38)" }}
      >
        {badge.name}
      </span>
    </button>
  );
}

// ---------- one tier row in the detail (Complete / High Signal) ----------

function TierRow({
  done,
  accentRgb,
  label,
  sub,
}: {
  done: boolean;
  accentRgb: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full"
        style={
          done
            ? { background: `rgb(${accentRgb})`, color: "#04150f" }
            : { border: `2px solid rgba(${accentRgb},0.7)` }
        }
      >
        {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
      <div className="flex-1">
        <div
          className="text-[13.5px] font-semibold"
          style={{ color: done ? "#fff" : "rgba(238,241,251,.82)" }}
        >
          {label}
        </div>
        <div className="mt-0.5 text-[12.5px] leading-[1.45] text-white/60">{sub}</div>
      </div>
    </div>
  );
}

// ---------- the modal ----------

function AchievementsModal() {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [badges, setBadges] = React.useState<Badge[] | null>(null);
  const [earnedCount, setEarnedCount] = React.useState(0);
  const [selected, setSelected] = React.useState<Badge | null>(null);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/achievements", {
        credentials: "include",
        cache: "no-store",
      });
      const d = await r.json();
      if (d?.ok && Array.isArray(d.badges)) {
        setBadges(d.badges as Badge[]);
        setEarnedCount(Number(d.earnedCount ?? 0));
      }
    } catch {
      /* leave prior */
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh the pyramid when a badge is earned elsewhere (so an open modal updates).
  React.useEffect(() => {
    if (!open) return;
    const onEarn = () => void load();
    window.addEventListener(BADGE_EARNED, onEarn);
    return () => window.removeEventListener(BADGE_EARNED, onEarn);
  }, [open, load]);

  React.useEffect(() => {
    const onOpen = () => {
      setSelected(null);
      setOpen(true);
      void load();
    };
    window.addEventListener(OPEN_ACHIEVEMENTS, onOpen);
    return () => window.removeEventListener(OPEN_ACHIEVEMENTS, onOpen);
  }, [load]);

  // Lock body scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Group into pyramid rows: apex (row 1) at the top, foundational (row 5) at the base.
  const rows = React.useMemo(() => {
    const map = new Map<number, Badge[]>();
    for (const b of badges ?? []) {
      const arr = map.get(b.row) ?? [];
      arr.push(b);
      map.set(b.row, arr);
    }
    return [1, 2, 3, 4, 5]
      .map((n) => ({
        n,
        items: (map.get(n) ?? []).sort((a, b) => a.sort - b.sort),
      }))
      .filter((r) => r.items.length > 0);
  }, [badges]);

  const total = badges?.length ?? 0;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="ach"
          className="fixed inset-0 z-[120]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
        >
          {/* cosmic ground: deep gradient → drifting starfield → nebula tints → ember horizon */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(125% 88% at 50% -4%, #313a7a 0%, #1d2556 30%, #131a3e 56%, #0c1128 82%, #080b1e 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-[0.9]">
            <ConstellationAnchor
              seed="your-constellation"
              accent={{ r: 198, g: 182, b: 255 }}
              showLinks={false}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(74% 48% at 50% 2%, rgba(182,160,255,0.28), transparent 62%), radial-gradient(100% 44% at 50% 114%, rgba(246,178,60,0.22), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
            style={{ background: "linear-gradient(to top, rgba(246,146,66,0.16), transparent)" }}
          />
          <style>{`@keyframes elTwinkle{0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(.9)}50%{opacity:.95;transform:translate(-50%,-50%) scale(1.1)}}`}</style>

          {/* scrolling content over the fixed sky */}
          <div className="relative h-full overflow-y-auto">
            <div className="mx-auto flex min-h-full max-w-[460px] flex-col px-5 py-7">
              {/* header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[rgb(182,160,255)]">
                    Achievements
                  </div>
                  <div className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em] text-white">
                    Your constellation
                  </div>
                  <div className="mt-1 text-[11.5px] text-white/45">
                    <span className="tabular-nums text-white/75">{earnedCount}</span> of {total} stars
                    lit
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/55 backdrop-blur-sm transition hover:text-white"
                  aria-label="Close achievements"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* pyramid + constellation lattice */}
              <div className="flex flex-1 flex-col items-center justify-center py-10">
                {loading && !badges ? (
                  <div className="text-[13px] text-white/40">Reading your sky…</div>
                ) : (
                  <div className="relative flex flex-col items-center gap-5">
                    {rows.map((row) => (
                      <div key={row.n} className="flex justify-center gap-3.5">
                        {row.items.map((b) => (
                          <Medal
                            key={b.slug}
                            badge={b}
                            selected={selected?.slug === b.slug}
                            onClick={() => setSelected(b)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            {/* selected detail */}
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.slug}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-[16px]"
                      style={{
                        color: selected.earned
                          ? `rgb(${rgb(selected.accent)})`
                          : "rgba(238,241,251,.35)",
                        background: `rgba(${rgb(selected.accent)},${
                          selected.earned ? ".16" : ".06"
                        })`,
                        border: `1px solid rgba(${rgb(selected.accent)},${
                          selected.earned ? ".65" : ".2"
                        })`,
                        boxShadow: selected.earned
                          ? `0 0 16px rgba(${rgb(selected.accent)},.45)`
                          : "none",
                      }}
                    >
                      {selected.earned ? selected.glyph : "◇"}
                    </span>
                    <div>
                      <div className="text-[15px] font-semibold text-white">
                        {selected.name}
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
                        {selected.highSignal
                          ? "High Signal"
                          : selected.earned
                          ? "Earned"
                          : "Not yet earned"}
                      </div>
                    </div>
                  </div>

                  {/* the badge's own story — what this one means */}
                  <p className="mt-3.5 text-[12.5px] leading-[1.5] text-white/70">
                    {selected.description}
                  </p>

                  {/* How you earn it: the two real tiers, each with its own path. */}
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      How you earn it
                    </div>
                    <div className="mt-3 space-y-3.5">
                      <TierRow
                        done={selected.earned}
                        accentRgb="55,211,160"
                        label="Complete"
                        sub={selected.hint ?? selected.description}
                      />
                      {selected.hasHighSignal ? (
                        <TierRow
                          done={!!selected.highSignal}
                          accentRgb={rgb(selected.accent)}
                          label="High Signal"
                          sub={selected.highSignalHint ?? "Go deeper on this one."}
                        />
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-[11.5px] text-white/30">
                  Tap a badge to see how it&apos;s earned.
                </div>
              )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ---------- earn toast ----------

function BadgeEarnToast() {
  const reduce = useReducedMotion();
  const [queue, setQueue] = React.useState<EarnedBadge[]>([]);

  React.useEffect(() => {
    const onEarn = (e: Event) => {
      const badge = (e as CustomEvent).detail as EarnedBadge | undefined;
      if (!badge) return;
      setQueue((q) => [...q, badge]);
      emitCelebrate(window.innerWidth / 2, window.innerHeight * 0.4);
      window.setTimeout(
        () => setQueue((q) => q.filter((b) => b.slug !== badge.slug)),
        4000
      );
    };
    window.addEventListener(BADGE_EARNED, onEarn);
    return () => window.removeEventListener(BADGE_EARNED, onEarn);
  }, []);

  if (queue.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[130] flex flex-col items-center gap-2 px-4"
      style={{ top: "calc(env(safe-area-inset-top) + 20px)" }}
    >
      {queue.map((b) => {
        const c = rgb(b.accent ?? "amber");
        return (
          <motion.div
            key={b.slug}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border px-4 py-2.5 backdrop-blur-xl"
            style={{
              background: "rgba(12,18,38,.95)",
              borderColor: `rgba(${c},.4)`,
              boxShadow: `0 14px 44px rgba(3,7,20,.6), 0 0 26px rgba(${c},.25)`,
            }}
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-[14px]"
              style={{ color: `rgb(${c})`, background: `rgba(${c},.16)` }}
            >
              {b.glyph ?? "◆"}
            </span>
            <div className="pr-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: `rgb(${c})` }}>
                Badge unlocked
              </div>
              <div className="text-[13.5px] font-semibold text-white">{b.name}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Silent earn detector: on load and after any action change, evaluate badges
// (the GET awards server-side) and toast anything just unlocked. Awarding is
// idempotent, so whichever call inserts a badge is the only one that reports it
// as newlyEarned — no double toasts.
function BadgeSync() {
  React.useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        const r = await fetch("/api/achievements", {
          credentials: "include",
          cache: "no-store",
        });
        const d = await r.json();
        if (!alive || !d?.ok || !Array.isArray(d.newlyEarned)) return;
        for (const b of d.newlyEarned as Badge[]) {
          emitBadgeEarned({
            slug: b.slug,
            name: b.name,
            glyph: b.glyph,
            accent: b.accent,
          });
        }
      } catch {
        /* ignore */
      }
    };
    const onChanged = () => void check();
    void check();
    window.addEventListener(ACTIONS_CHANGED, onChanged);
    return () => {
      alive = false;
      window.removeEventListener(ACTIONS_CHANGED, onChanged);
    };
  }, []);
  return null;
}

// ---------- the PM "Journey Progress" modal ----------
// A thin fullscreen shell around the PM's embedded module, opened by the same
// Awards trophy. Flip USE_JOURNEY to swap between this and the constellation
// while we're comparing the two directions.
function JourneyModal() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_ACHIEVEMENTS, onOpen);
    return () => window.removeEventListener(OPEN_ACHIEVEMENTS, onOpen);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="journey"
          className="fixed inset-0 z-[120] overflow-y-auto bg-[#0b0f18]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="mx-auto max-w-[460px] px-4 py-6">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/55 transition hover:text-white"
                aria-label="Close achievements"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <JourneyProgressPM />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// The Awards trophy opens the constellation (the shipped direction). Set to true
// to preview the PM's Journey grid instead — kept for reference.
const USE_JOURNEY = false;

export default function AchievementsLayer() {
  return (
    <>
      {USE_JOURNEY ? <JourneyModal /> : <AchievementsModal />}
      <BadgeEarnToast />
      <BadgeSync />
    </>
  );
}
