"use client";

// The global Achievements layer (v7): a callable-from-anywhere modal that shows
// the badge collection organised by STAGE, plus the "you just earned X" toast and
// the app-wide silent-earn detector. Everything comes from the DB via
// /api/achievements — names, copy, art, stage, and earned/locked/coming-soon
// state — so the badge system is tuned in data, not here. Mounted once in the
// main layout.
//
// Badges are binary now (earned or not). A badge is one of three states:
//   earned      — bright, its glyph in full accent
//   locked      — prerequisites not met yet (a padlock)
//   coming soon — its criterion needs a signal we don't measure yet
// Tapping a badge shows how it's earned. A stage's award badge, once earned,
// completes that Journey-map milestone.

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Check, Lock, ChevronLeft, Clock, Trophy } from "lucide-react";

import { CardBody, CardTitle, RowMeta, RowTitle } from "@/lib/ui/card";
import {
  loadAchievementsShared,
  invalidateBadgeStats,
  type BadgeV7,
  type StageV7,
} from "@/lib/achievements/useBadgeStats";
import {
  OPEN_ACHIEVEMENTS,
  BADGE_EARNED,
  ACTIONS_CHANGED,
  emitBadgeEarned,
} from "@/lib/actionsBus";

// The five authored accents → an rgb string. Gradient is given a representative
// indigo so a single-colour medal still reads (the full gradient lives on the
// stage award only).
const ACCENT_RGB: Record<string, string> = {
  cyan: "90, 160, 255",
  amber: "251, 191, 36",
  violet: "167, 139, 250",
  green: "52, 211, 153",
  gradient: "129, 140, 248",
};
function rgb(accent: string): string {
  return ACCENT_RGB[accent] ?? ACCENT_RGB.cyan;
}

// ── a single badge medal ─────────────────────────────────────────────────────
function BadgeMedal({ badge, size = 54 }: { badge: BadgeV7; size?: number }) {
  const a = rgb(badge.accent);
  const on = badge.earned;
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: on ? `rgba(${a}, 0.16)` : "rgba(255,255,255,0.04)",
        border: `1px solid ${on ? `rgba(${a}, 0.5)` : "rgba(255,255,255,0.08)"}`,
        boxShadow: on ? `inset 0 0 0 1px rgba(${a},0.1), 0 6px 18px rgba(0,0,0,0.3)` : "none",
      }}
    >
      <span
        style={{
          fontSize: size * 0.42,
          lineHeight: 1,
          color: on ? `rgb(${a})` : "rgba(255,255,255,0.32)",
          filter: on ? `drop-shadow(0 0 6px rgba(${a},0.5))` : "none",
        }}
      >
        {badge.glyph}
      </span>
      {badge.earned ? (
        <span
          className="absolute -bottom-1 -right-1 grid h-[18px] w-[18px] place-items-center rounded-full"
          style={{ background: `rgb(${a})` }}
        >
          <Check className="h-3 w-3 text-[#06210f]" strokeWidth={3} />
        </span>
      ) : badge.comingSoon ? (
        <span className="absolute -bottom-1 -right-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-white/12">
          <Clock className="h-3 w-3 text-white/60" />
        </span>
      ) : badge.locked ? (
        <span className="absolute -bottom-1 -right-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-white/10">
          <Lock className="h-2.5 w-2.5 text-white/45" />
        </span>
      ) : null}
    </span>
  );
}

// ── a tappable tile in the stage grid ────────────────────────────────────────
function BadgeTile({ badge, onOpen }: { badge: BadgeV7; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col items-center gap-2 rounded-panel px-2 py-3 text-center transition hover:bg-white/[0.04] active:opacity-80"
      style={{ opacity: badge.earned ? 1 : 0.85 }}
    >
      <BadgeMedal badge={badge} />
      <span
        className={
          "text-micro font-semibold leading-tight " +
          (badge.earned ? "text-white/90" : "text-white/55")
        }
      >
        {badge.name}
      </span>
    </button>
  );
}

// ── the detail panel for one badge ───────────────────────────────────────────
function BadgeDetail({ badge, onBack }: { badge: BadgeV7; onBack: () => void }) {
  const status = badge.earned
    ? "Earned"
    : badge.comingSoon
      ? "Coming soon"
      : badge.locked
        ? "Locked"
        : "Not yet earned";
  return (
    <div className="px-1">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-control border border-white/12 px-3 py-1.5 text-meta font-semibold text-white/75 transition hover:bg-white/[0.06]"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        All badges
      </button>

      <div className="flex flex-col items-center text-center">
        <BadgeMedal badge={badge} size={72} />
        <CardTitle as="h3" className="mt-3">
          {badge.name}
        </CardTitle>
        <span
          className="mt-1 text-micro font-bold uppercase tracking-eyebrow"
          style={{ color: badge.earned ? `rgb(${rgb(badge.accent)})` : "rgba(255,255,255,0.5)" }}
        >
          {status}
        </span>
        <CardBody as="p" className="mt-3 max-w-sm text-white/82">
          {badge.earned ? badge.description : badge.earn_hint}
        </CardBody>
        {badge.comingSoon ? (
          <RowMeta className="mt-3 block max-w-sm">
            This one needs a signal Everleap isn&rsquo;t measuring yet — it&rsquo;ll unlock on its own
            when that lands.
          </RowMeta>
        ) : badge.locked ? (
          <RowMeta className="mt-3 block max-w-sm">
            Finish what comes before it first.
          </RowMeta>
        ) : null}
      </div>
    </div>
  );
}

// ── the earn toast ───────────────────────────────────────────────────────────
function EarnToast({ badge, onDone }: { badge: BadgeV7; onDone: () => void }) {
  React.useEffect(() => {
    const t = window.setTimeout(onDone, 3800);
    return () => window.clearTimeout(t);
  }, [onDone]);
  const a = rgb(badge.accent);
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="pointer-events-none fixed left-1/2 top-4 z-[130] flex -translate-x-1/2 items-center gap-3 rounded-full border px-4 py-2.5"
      style={{
        borderColor: `rgba(${a},0.4)`,
        background: "rgba(10,15,28,0.95)",
        boxShadow: "0 16px 44px rgba(3,7,20,0.6)",
      }}
    >
      <span style={{ fontSize: 20, color: `rgb(${a})`, filter: `drop-shadow(0 0 6px rgba(${a},0.6))` }}>
        {badge.glyph}
      </span>
      <span className="text-label font-semibold text-white/90">
        Badge earned — {badge.name}
      </span>
    </motion.div>
  );
}

// ── the layer ────────────────────────────────────────────────────────────────
export default function AchievementsLayer() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [stages, setStages] = React.useState<StageV7[]>([]);
  const [counts, setCounts] = React.useState({ earned: 0, total: 0 });
  const [selected, setSelected] = React.useState<BadgeV7 | null>(null);
  const [toast, setToast] = React.useState<BadgeV7 | null>(null);

  React.useEffect(() => setMounted(true), []);

  const bySlug = React.useCallback(
    (slug: string): BadgeV7 | null => {
      for (const st of stages) for (const b of st.badges) if (b.slug === slug) return b;
      return null;
    },
    [stages]
  );

  // Fetch + detect silent earns. loadAchievementsShared awards server-side and
  // only the inserting call reports newlyEarned, so this is the one place a toast
  // fires — no double-announce.
  const refresh = React.useCallback(async (announce: boolean) => {
    const payload = await loadAchievementsShared().catch(() => null);
    if (!payload) return;
    const nextStages = (payload.stages ?? []) as StageV7[];
    setStages(nextStages);
    setCounts({ earned: Number(payload.earnedCount ?? 0), total: Number(payload.total ?? 0) });

    if (announce && payload.newlyEarned?.length) {
      // Toast the first newly-earned (find its full badge in the fresh stages).
      const first = payload.newlyEarned[0];
      const full = nextStages.flatMap((s) => s.badges).find((b) => b.slug === first.slug);
      if (full) {
        setToast(full);
        emitBadgeEarned({ slug: full.slug, name: full.name });
      }
    }
  }, []);

  // Open from anywhere.
  React.useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent).detail as { slug?: string } | null;
      setOpen(true);
      setSelected(null);
      refresh(true).then(() => {
        if (detail?.slug) {
          const b = bySlug(detail.slug);
          if (b) setSelected(b);
        }
      });
    }
    window.addEventListener(OPEN_ACHIEVEMENTS, onOpen);
    return () => window.removeEventListener(OPEN_ACHIEVEMENTS, onOpen);
  }, [refresh, bySlug]);

  // Silent-earn detector: on mount and whenever activity changes, re-evaluate and
  // toast anything newly earned even with the modal shut.
  React.useEffect(() => {
    const idle =
      "requestIdleCallback" in window
        ? (cb: () => void) =>
            (window as unknown as { requestIdleCallback: (c: () => void, o?: { timeout: number }) => number })
              .requestIdleCallback(cb, { timeout: 2000 })
        : (cb: () => void) => window.setTimeout(cb, 600);
    const handle = idle(() => void refresh(true));

    function onActivity() {
      invalidateBadgeStats();
      void refresh(true);
    }
    window.addEventListener(ACTIONS_CHANGED, onActivity);
    window.addEventListener(BADGE_EARNED, onActivity);
    return () => {
      window.removeEventListener(ACTIONS_CHANGED, onActivity);
      window.removeEventListener(BADGE_EARNED, onActivity);
      const w = window as unknown as { cancelIdleCallback?: (h: number) => void };
      if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(handle);
      else window.clearTimeout(handle as number);
    };
  }, [refresh]);

  const close = React.useCallback(() => {
    setOpen(false);
    setSelected(null);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>{toast ? <EarnToast badge={toast} onDone={() => setToast(null)} /> : null}</AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Your badges"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-card border border-b-0 sm:rounded-card sm:border-b"
              style={{
                background: "linear-gradient(180deg, #0c1428 0%, #070d1c 60%)",
                boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)",
              }}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <span
                  className="grid h-8 w-8 place-items-center rounded-control"
                  style={{ background: "rgba(232,199,126,0.13)", color: "rgba(232,199,126,0.92)" }}
                >
                  <Trophy className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <RowTitle className="block text-white/90">Your badges</RowTitle>
                  <RowMeta className="block">
                    {counts.earned} of {counts.total} earned
                  </RowMeta>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full text-white/55 transition hover:bg-white/[0.07] hover:text-white/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                {selected ? (
                  <BadgeDetail badge={selected} onBack={() => setSelected(null)} />
                ) : (
                  <div className="space-y-7">
                    {stages.map((stage) => (
                      <section key={stage.key}>
                        <div className="mb-3 flex items-center gap-2.5">
                          <span className="text-label font-bold uppercase tracking-eyebrow text-white/55">
                            {stage.name}
                          </span>
                          {stage.complete ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-micro font-semibold text-emerald-300">
                              <Check className="h-3 w-3" strokeWidth={3} /> Complete
                            </span>
                          ) : (
                            <span className="text-micro text-white/40">
                              {stage.requiredEarned}/{stage.requiredTotal} required
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-1 sm:grid-cols-4">
                          {stage.badges.map((b) => (
                            <BadgeTile key={b.slug} badge={b} onOpen={() => setSelected(b)} />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>,
    document.body
  );
}
