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
  Heart,
  Mountain,
  Wrench,
  MessageCircle,
  PenLine,
  Lightbulb,
  Route,
  Layers,
  CheckCheck,
  type LucideIcon,
} from "lucide-react";

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

  // The story sections. Each is now a badge in its own right — finishing
  // Motivations used to pay out nothing on its own.
  motivations: Heart,
  strengths: Mountain,
  skills: Wrench,

  // Insights.
  sounding_board: MessageCircle,
  straight_talker: PenLine,
  open_mind: Lightbulb,

  // Explore + Actions.
  wayfinder: Route,
  wide_net: Layers,
  follow_through: CheckCheck,
};

import {
  OPEN_ACHIEVEMENTS,
  BADGE_EARNED,
  ACTIONS_CHANGED,
  emitCelebrate,
  emitBadgeEarned,
  type EarnedBadge,
  type BadgeTier,
  type BadgeSurface,
} from "@/lib/actionsBus";

// What each screen is called when Awards opens scoped to it.
const SURFACE_LABEL: Record<BadgeSurface, string> = {
  today: "On Today",
  insights: "On Insights",
  explore: "On Explore",
  actions: "On Actions",
};

type Badge = {
  slug: string;
  name: string;
  description: string;
  hint: string | null;
  row: number;
  sort: number;
  accent: string;
  glyph: string;
  // Four-state tier: nothing | bronze | silver | gold (the highest reached).
  tier: BadgeTier;
  earned: boolean;
  earnedAt: string | null;
  // The tier ladder — hints + reached state for each rung.
  bronzeHint?: string | null;
  silverHint?: string | null;
  goldHint?: string | null;
  bronzeReached?: boolean;
  silverReached?: boolean;
  goldReached?: boolean;
};

// Medal color comes from the TIER, not the per-badge accent. "nothing" is a
// dim, locked grey. Flat colors — no glow anywhere on this screen.
const TIER_COLOR: Record<BadgeTier, string> = {
  nothing: "#3a3f4a",
  bronze: "#c17f43",
  silver: "#b8c0cc",
  gold: "#e8b93a",
};

const TIER_LABEL: Record<BadgeTier, string> = {
  nothing: "Not yet earned",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

// ---------- one medal ----------

// Convert a #rrggbb hex to "r,g,b" so we can build low-alpha fills from the
// tier color without hardcoding a second palette.
function hexRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

function Medal({
  badge,
  onClick,
  selected,
}: {
  badge: Badge;
  onClick: () => void;
  selected: boolean;
}) {
  const earned = badge.earned;
  const tint = TIER_COLOR[badge.tier];
  const c = hexRgb(tint);
  const Icon = PLACEHOLDER_ICONS[badge.slug] ?? Star;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-[64px] flex-col items-center gap-1.5 outline-none"
      aria-label={`${badge.name}${earned ? `, ${TIER_LABEL[badge.tier]}` : ", locked"}`}
    >
      {/* Flat, tier-colored medal. No glow — a thin ring in the tier color. */}
      <span
        className="relative flex h-[54px] w-[54px] items-center justify-center rounded-full transition"
        style={
          earned
            ? {
                color: tint,
                background: `rgba(${c},.16)`,
                border: `1px solid ${tint}`,
                boxShadow: selected ? `0 0 0 2px rgba(${c},.55)` : "none",
              }
            : {
                color: "rgba(238,241,251,.32)",
                background: "rgba(255,255,255,.04)",
                border: `1px ${selected ? "solid" : "dashed"} ${
                  selected ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.16)"
                }`,
                boxShadow: "none",
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

// ---------- one rung in the detail ladder (Bronze / Silver / Gold) ----------

function TierRung({
  tier,
  reached,
  sub,
}: {
  tier: "bronze" | "silver" | "gold";
  reached: boolean;
  sub: string;
}) {
  const tint = TIER_COLOR[tier];
  const c = hexRgb(tint);
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full"
        style={
          reached
            ? { background: tint, color: "#0a0f1c" }
            : { border: `1.5px solid rgba(${c},0.45)` }
        }
      >
        {reached ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
      <div className="flex-1">
        <div
          className="text-[13.5px] font-semibold"
          style={{ color: reached ? tint : "rgba(238,241,251,.6)" }}
        >
          {TIER_LABEL[tier]}
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

  // The screen Awards was opened FROM, if any. Scopes the grid; null from the footer.
  const [surface, setSurface] = React.useState<BadgeSurface | null>(null);
  const [surfaceSlugs, setSurfaceSlugs] = React.useState<
    Partial<Record<BadgeSurface, string[]>>
  >({});

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

        // `surfaces` rides along on this same response — the block on each page
        // is drawn from it, so scoping costs no extra request.
        const surfaces = (d.surfaces ?? {}) as Partial<
          Record<BadgeSurface, { slugs?: string[] }>
        >;
        const slugs: Partial<Record<BadgeSurface, string[]>> = {};
        for (const [key, value] of Object.entries(surfaces)) {
          if (Array.isArray(value?.slugs)) {
            slugs[key as BadgeSurface] = value.slugs;
          }
        }
        setSurfaceSlugs(slugs);
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
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ surface?: BadgeSurface } | null>).detail;
      setSurface(detail?.surface ?? null);
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

  // A grid, not a pyramid. The old layout hard-coded rows 1-5, so every badge
  // added beyond the original fifteen was silently invisible here — earned, but
  // never shown. It also meant the badge set could only ever grow by a whole
  // triangular row, which is the shape dictating the product.
  //
  // Badges now flow four per row in their defined order (row_index, then sort),
  // with a ragged last row. Same as the PM's own prototype, which was a grid all
  // along.
  const PER_ROW = 4;

  // Opened from a page, Awards leads with the badges THAT page can move, under
  // its own heading, and the rest of the collection follows. Opened from the
  // footer, it's one unlabelled grid — the whole sky, as before.
  const sections = React.useMemo(() => {
    const ordered = [...(badges ?? [])].sort(
      (a, b) => a.row - b.row || a.sort - b.sort
    );

    const toRows = (items: Badge[]) => {
      const out: { n: number; items: Badge[] }[] = [];
      for (let i = 0; i < items.length; i += PER_ROW) {
        out.push({ n: i / PER_ROW, items: items.slice(i, i + PER_ROW) });
      }
      return out;
    };

    const scoped = surface ? surfaceSlugs[surface] : undefined;
    if (!scoped || scoped.length === 0) {
      return [{ key: "all", label: null, rows: toRows(ordered) }];
    }

    const here = new Set(scoped);
    const onScreen = ordered.filter((b) => here.has(b.slug));
    const elsewhere = ordered.filter((b) => !here.has(b.slug));

    return [
      { key: "here", label: SURFACE_LABEL[surface!], rows: toRows(onScreen) },
      { key: "rest", label: "Everything else", rows: toRows(elsewhere) },
    ].filter((s) => s.rows.length > 0);
  }, [badges, surface, surfaceSlugs]);

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
          {/* Flat solid ground — no radial glow, no starfield, no twinkle. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "#0a0f1c" }}
          />

          {/* scrolling content over the fixed background */}
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/55 transition hover:text-white"
                  aria-label="Close achievements"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* The badge grid. Scrollable: the set is no longer capped at a
                  triangle, so it can outgrow a phone screen. */}
              <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto py-10">
                {loading && !badges ? (
                  <div className="text-[13px] text-white/40">Reading your sky…</div>
                ) : (
                  <div className="relative flex w-full flex-col items-center gap-7">
                    {sections.map((section) => (
                      <div
                        key={section.key}
                        className="flex w-full flex-col items-center gap-5"
                      >
                        {section.label ? (
                          <div className="w-full text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                            {section.label}
                          </div>
                        ) : null}

                        {section.rows.map((row) => (
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
                          ? TIER_COLOR[selected.tier]
                          : "rgba(238,241,251,.35)",
                        background: `rgba(${hexRgb(TIER_COLOR[selected.tier])},${
                          selected.earned ? ".16" : ".06"
                        })`,
                        border: `1px solid ${
                          selected.earned
                            ? TIER_COLOR[selected.tier]
                            : "rgba(238,241,251,.2)"
                        }`,
                        boxShadow: "none",
                      }}
                    >
                      {selected.earned ? selected.glyph : "◇"}
                    </span>
                    <div>
                      <div className="text-[15px] font-semibold text-white">
                        {selected.name}
                      </div>
                      <div
                        className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                        style={{
                          color: selected.earned
                            ? TIER_COLOR[selected.tier]
                            : "rgba(238,241,251,.4)",
                        }}
                      >
                        {TIER_LABEL[selected.tier]}
                      </div>
                    </div>
                  </div>

                  {/* the badge's own story — what this one means */}
                  <p className="mt-3.5 text-[12.5px] leading-[1.5] text-white/70">
                    {selected.description}
                  </p>

                  {/* How you earn it: the three real rungs, each with its own path.
                      Rungs with no hint are skipped for this badge. */}
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      How you earn it
                    </div>
                    <div className="mt-3 space-y-3.5">
                      {selected.bronzeHint ? (
                        <TierRung
                          tier="bronze"
                          reached={!!selected.bronzeReached}
                          sub={selected.bronzeHint}
                        />
                      ) : null}
                      {selected.silverHint ? (
                        <TierRung
                          tier="silver"
                          reached={!!selected.silverReached}
                          sub={selected.silverHint}
                        />
                      ) : null}
                      {selected.goldHint ? (
                        <TierRung
                          tier="gold"
                          reached={!!selected.goldReached}
                          sub={selected.goldHint}
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
        const tier: BadgeTier = b.tier ?? "bronze";
        const tint = TIER_COLOR[tier];
        const c = hexRgb(tint);
        return (
          <motion.div
            key={b.slug}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border px-4 py-2.5"
            style={{
              background: "#0a0f1c",
              borderColor: `rgba(${c},.5)`,
              boxShadow: "none",
            }}
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-[14px]"
              style={{ color: tint, background: `rgba(${c},.16)` }}
            >
              {b.glyph ?? "◆"}
            </span>
            <div className="pr-1">
              <div
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: tint }}
              >
                {TIER_LABEL[tier]} unlocked
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
        for (const b of d.newlyEarned as {
          slug: string;
          name: string;
          tier?: BadgeTier;
        }[]) {
          emitBadgeEarned({
            slug: b.slug,
            name: b.name,
            tier: b.tier,
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
