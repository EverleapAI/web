"use client";

// The global Achievements layer: a callable-from-anywhere badge pyramid modal
// plus the "you just unlocked X" earn toast. Everything it renders comes from
// the DB (via /api/achievements) — names, copy, art, and earned state — so the
// badge system is tuned in data, not here. Mounted once in the main layout.

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

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

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[58px] flex-col items-center gap-1.5 outline-none"
      aria-label={`${badge.name}${earned ? ", earned" : ", locked"}`}
    >
      <span
        className="flex h-[46px] w-[46px] items-center justify-center rounded-full text-[17px] transition"
        style={
          earned
            ? {
                color: isGradient ? "#fff" : `rgb(${c})`,
                background: isGradient
                  ? "linear-gradient(135deg, rgba(246,178,60,.22), rgba(182,160,255,.22))"
                  : `rgba(${c},.14)`,
                border: `1px solid rgba(${c},.6)`,
                boxShadow: `0 0 16px rgba(${c},.4)${
                  selected ? `, 0 0 0 3px rgba(${c},.3)` : ""
                }`,
              }
            : {
                color: "rgba(238,241,251,.34)",
                background: "rgba(255,255,255,.03)",
                border: `1px ${selected ? "solid" : "dashed"} rgba(255,255,255,${
                  selected ? ".28" : ".12"
                })`,
              }
        }
      >
        {earned ? badge.glyph : "◇"}
      </span>
      <span
        className="text-center text-[8.5px] leading-tight"
        style={{ color: earned ? "rgba(238,241,251,.62)" : "rgba(238,241,251,.32)" }}
      >
        {badge.name}
      </span>
    </button>
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
          className="fixed inset-0 z-[120] overflow-y-auto"
          style={{ background: "rgba(4,6,14,.96)", backdropFilter: "blur(6px)" }}
          initial={reduce ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="mx-auto flex min-h-full max-w-[460px] flex-col px-5 py-6">
            {/* header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[17px] font-semibold tracking-[-0.01em] text-white">
                  Achievements
                </div>
                <div className="mt-1 text-[11px] text-white/40">
                  {earnedCount} of {total} earned
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/55 transition hover:text-white"
                aria-label="Close achievements"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* pyramid */}
            <div className="flex flex-1 flex-col items-center justify-start pb-8 pt-10">
              {loading && !badges ? (
                <div className="text-[13px] text-white/40">Loading…</div>
              ) : (
                <div className="flex flex-col items-center gap-3.5">
                  {rows.map((row) => (
                    <div key={row.n} className="flex justify-center gap-2.5">
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
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[15px]"
                      style={{
                        color: selected.earned
                          ? `rgb(${rgb(selected.accent)})`
                          : "rgba(238,241,251,.35)",
                        background: `rgba(${rgb(selected.accent)},${
                          selected.earned ? ".14" : ".06"
                        })`,
                        border: `1px solid rgba(${rgb(selected.accent)},${
                          selected.earned ? ".5" : ".2"
                        })`,
                      }}
                    >
                      {selected.earned ? selected.glyph : "◇"}
                    </span>
                    <div className="flex-1">
                      <div className="text-[14.5px] font-semibold text-white">
                        {selected.name}
                      </div>
                      <div
                        className="text-[10.5px] font-semibold uppercase tracking-[0.1em]"
                        style={{
                          color: selected.earned
                            ? `rgba(${rgb(selected.accent)},.9)`
                            : "rgba(238,241,251,.35)",
                        }}
                      >
                        {selected.earned ? "Earned" : "Locked"}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.5] text-white/70">
                    {selected.earned
                      ? selected.description
                      : selected.hint ?? selected.description}
                  </p>
                </motion.div>
              ) : (
                <div className="text-center text-[11.5px] text-white/30">
                  Tap a badge to see how it&apos;s earned.
                </div>
              )}
            </AnimatePresence>
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

export default function AchievementsLayer() {
  return (
    <>
      <AchievementsModal />
      <BadgeEarnToast />
      <BadgeSync />
    </>
  );
}
