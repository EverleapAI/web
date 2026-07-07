"use client";

// The global Achievements layer: a callable-from-anywhere badge pyramid modal
// plus the "you just unlocked X" earn toast. Everything it renders comes from
// the DB (via /api/achievements) — names, copy, art, and earned state — so the
// badge system is tuned in data, not here. Mounted once in the main layout.

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

import ConstellationAnchor from "../ui/ConstellationAnchor";

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
  starRef,
}: {
  badge: Badge;
  onClick: () => void;
  selected: boolean;
  starRef?: (el: HTMLElement | null) => void;
}) {
  const c = rgb(badge.accent);
  const isGradient = badge.accent === "gradient";
  const earned = badge.earned;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-[58px] flex-col items-center gap-1.5 outline-none"
      aria-label={`${badge.name}${earned ? ", earned" : ", locked"}`}
    >
      {/* a soft, twinkling halo — this star is lit */}
      {earned ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[23px] h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-[elTwinkle_3.8s_ease-in-out_infinite]"
          style={{ background: `radial-gradient(circle, rgba(${c},.55), transparent 68%)`, filter: "blur(5px)" }}
        />
      ) : null}
      <span
        ref={starRef}
        className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full text-[17px] transition"
        style={
          earned
            ? {
                color: isGradient ? "#fff" : `rgb(${c})`,
                background: isGradient
                  ? "linear-gradient(135deg, rgba(246,178,60,.24), rgba(182,160,255,.24))"
                  : `rgba(${c},.16)`,
                border: `1px solid rgba(${c},.7)`,
                boxShadow: `0 0 18px rgba(${c},.5), inset 0 0 10px rgba(${c},.22)${
                  selected ? `, 0 0 0 3px rgba(${c},.35)` : ""
                }`,
              }
            : {
                color: "rgba(238,241,251,.32)",
                background: "rgba(255,255,255,.025)",
                border: `1px ${selected ? "solid" : "dashed"} rgba(255,255,255,${
                  selected ? ".28" : ".13"
                })`,
              }
        }
      >
        {earned ? badge.glyph : "◇"}
      </span>
      <span
        className="text-center text-[8.5px] leading-tight"
        style={{ color: earned ? "rgba(238,241,251,.68)" : "rgba(238,241,251,.3)" }}
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

  // Measure the laid-out medals and connect each to its 1-2 nearest neighbours
  // in the row above — the pyramid becomes a real constellation. Earned-to-earned
  // links glow; the rest are faint. Re-measures on resize.
  const pyramidRef = React.useRef<HTMLDivElement | null>(null);
  const medalEls = React.useRef<Map<string, HTMLElement>>(new Map());
  const [edges, setEdges] = React.useState<
    Array<{ x1: number; y1: number; x2: number; y2: number; strong: boolean }>
  >([]);
  const [box, setBox] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });

  React.useLayoutEffect(() => {
    if (!open || !badges || badges.length === 0) return;
    const measure = () => {
      const cont = pyramidRef.current;
      if (!cont) return;
      const cb = cont.getBoundingClientRect();
      if (cb.width === 0) return;
      const centers = new Map<string, { x: number; y: number; earned: boolean }>();
      for (const b of badges) {
        const el = medalEls.current.get(b.slug);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        centers.set(b.slug, {
          x: r.left + r.width / 2 - cb.left,
          y: r.top + r.height / 2 - cb.top,
          earned: b.earned,
        });
      }
      const es: Array<{ x1: number; y1: number; x2: number; y2: number; strong: boolean }> = [];
      // Vertical lattice: each star to its 1-2 nearest in the row above.
      for (let k = 1; k < rows.length; k++) {
        const above = rows[k - 1].items;
        for (const item of rows[k].items) {
          const p = centers.get(item.slug);
          if (!p) continue;
          const cand = above
            .map((a) => ({ a, q: centers.get(a.slug) }))
            .filter(
              (o): o is { a: Badge; q: { x: number; y: number; earned: boolean } } => !!o.q
            )
            .sort((u, v) => Math.abs(u.q.x - p.x) - Math.abs(v.q.x - p.x));
          const links = Math.min(2, cand.length);
          for (let i = 0; i < links; i++) {
            const q = cand[i].q;
            es.push({ x1: p.x, y1: p.y, x2: q.x, y2: q.y, strong: p.earned && cand[i].a.earned });
          }
        }
      }
      // Horizontal links: adjacent stars in the same row, so a lit tier reads as
      // a connected chain, not five separate points.
      for (const row of rows) {
        for (let i = 0; i < row.items.length - 1; i++) {
          const a = centers.get(row.items[i].slug);
          const b2 = centers.get(row.items[i + 1].slug);
          if (!a || !b2) continue;
          es.push({ x1: a.x, y1: a.y, x2: b2.x, y2: b2.y, strong: a.earned && b2.earned });
        }
      }
      setBox({ w: cb.width, h: cb.height });
      setEdges(es);
    };
    const raf = requestAnimationFrame(measure);
    const cont = pyramidRef.current;
    const ro = new ResizeObserver(measure);
    if (cont) ro.observe(cont);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [open, badges, rows]);

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
                "radial-gradient(125% 82% at 50% -8%, #172150 0%, #0b1230 34%, #060a1c 62%, #03040e 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-[0.6]">
            <ConstellationAnchor seed="your-constellation" accent={{ r: 182, g: 160, b: 255 }} />
          </div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(72% 44% at 50% 4%, rgba(182,160,255,0.16), transparent 62%), radial-gradient(96% 40% at 50% 114%, rgba(246,178,60,0.14), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36"
            style={{ background: "linear-gradient(to top, rgba(246,138,60,0.11), transparent)" }}
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
                  <div ref={pyramidRef} className="relative">
                    <svg
                      className="pointer-events-none absolute inset-0 overflow-visible"
                      width={box.w}
                      height={box.h}
                      aria-hidden="true"
                    >
                      {edges.map((e, i) => (
                        <line
                          key={i}
                          x1={e.x1}
                          y1={e.y1}
                          x2={e.x2}
                          y2={e.y2}
                          strokeLinecap="round"
                          stroke={e.strong ? "rgba(191,175,255,0.55)" : "rgba(255,255,255,0.07)"}
                          strokeWidth={e.strong ? 1.3 : 1}
                          style={
                            e.strong
                              ? { filter: "drop-shadow(0 0 3px rgba(182,160,255,0.55))" }
                              : undefined
                          }
                        />
                      ))}
                    </svg>
                    <div className="relative flex flex-col items-center gap-5">
                      {rows.map((row) => (
                        <div key={row.n} className="flex justify-center gap-3.5">
                          {row.items.map((b) => (
                            <Medal
                              key={b.slug}
                              badge={b}
                              selected={selected?.slug === b.slug}
                              onClick={() => setSelected(b)}
                              starRef={(el) => {
                                if (el) medalEls.current.set(b.slug, el);
                                else medalEls.current.delete(b.slug);
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
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
