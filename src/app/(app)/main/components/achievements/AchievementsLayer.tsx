"use client";

// The global Achievements layer: a callable-from-anywhere badge pyramid modal
// plus the "you just unlocked X" earn toast. Everything it renders comes from
// the DB (via /api/achievements) — names, copy, art, and earned state — so the
// badge system is tuned in data, not here. Mounted once in the main layout.

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Check,
  ChevronRight,
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
  // Where the next rung is actually earned. Null on gold — nothing left to do.
  nextTier?: BadgeTier | null;
  nextRoute?: string | null;
  nextCta?: string | null;
  nextCurrent?: number | null;
  nextTarget?: number | null;
};

// Medal color comes from the TIER, not the per-badge accent. "nothing" is a
// dim, locked grey. Flat colors — no glow anywhere on this screen.
const GOLD_INK = "rgba(232,199,126,0.92)";

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
  /** Carries the medal's own element so the detail can open over it. */
  onClick: (el: HTMLElement) => void;
  selected: boolean;
}) {
  const earned = badge.earned;
  const tint = TIER_COLOR[badge.tier];
  const c = hexRgb(tint);
  const Icon = PLACEHOLDER_ICONS[badge.slug] ?? Star;

  return (
    <button
      type="button"
      // Opening by slug ("Next up: Everleaper") has no click to take a rect from,
      // so it finds the medal in the DOM by this attribute instead.
      data-slug={badge.slug}
      onClick={(e) => onClick(e.currentTarget)}
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
        className="text-center text-micro leading-tight"
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
          className="text-meta font-semibold"
          style={{ color: reached ? tint : "rgba(238,241,251,.6)" }}
        >
          {TIER_LABEL[tier]}
        </div>
        <div className="mt-0.5 text-meta leading-body text-white/60">{sub}</div>
      </div>
    </div>
  );
}

// ---------- the modal ----------

function AchievementsModal() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [badges, setBadges] = React.useState<Badge[] | null>(null);
  const [earnedCount, setEarnedCount] = React.useState(0);
  const [selected, setSelected] = React.useState<Badge | null>(null);
  const [loading, setLoading] = React.useState(false);
  // A badge asked for by slug ("Next up: Steadfast" was tapped). The badges are
  // fetched on open, so the one we want does not exist yet when the event fires —
  // we hold the slug and select it the moment the list lands.
  const [wantSlug, setWantSlug] = React.useState<string | null>(null);

  // The detail opens OVER the badge you tapped. It used to render below the grid,
  // where the answer to "what is this one?" sat off-screen and had to be scrolled
  // to — the tap looked like it did nothing.
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [anchor, setAnchor] = React.useState<{ top: number; left: number } | null>(
    null
  );
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  /**
   * Where a medal sits inside the grid. The detail card is placed from this, and
   * it stays INVISIBLE until it has one (`opacity: pos ? 1 : 0`) — so anything
   * that opens a badge must supply an anchor or the card silently never appears.
   */
  const anchorTo = React.useCallback((el: HTMLElement) => {
    const grid = gridRef.current;
    if (!grid) return;
    const g = grid.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    setAnchor({ top: b.top - g.top, left: b.left - g.left + b.width / 2 });
  }, []);

  const pick = React.useCallback(
    (badge: Badge, el: HTMLElement) => {
      // Same badge again closes it.
      if (selected?.slug === badge.slug) {
        setSelected(null);
        return;
      }
      anchorTo(el);
      setPos(null);
      setSelected(badge);
    },
    [selected, anchorTo]
  );

  // Place the card centred on the medal, then pull it back inside the grid on
  // every edge — a badge in the last column or bottom row must not push it off.
  React.useLayoutEffect(() => {
    if (!selected || !anchor) return;
    const grid = gridRef.current;
    const card = cardRef.current;
    if (!grid || !card) return;

    const left = Math.max(
      0,
      Math.min(anchor.left - card.offsetWidth / 2, grid.offsetWidth - card.offsetWidth)
    );
    const top = Math.max(
      0,
      Math.min(anchor.top - 12, grid.offsetHeight - card.offsetHeight)
    );
    setPos({ top, left });
  }, [selected, anchor]);

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

  // Awards is one collection, however you got here. It used to split the grid into
  // "On Today" / "Everything else" depending on the page you opened it from, which
  // made the same badge move around and read as several different sets.
  React.useEffect(() => {
    const onOpen = (e: Event) => {
      const slug =
        (e as CustomEvent<{ slug?: string } | null>).detail?.slug ?? null;
      setSelected(null);
      setWantSlug(slug);
      setOpen(true);
      void load();
    };
    window.addEventListener(OPEN_ACHIEVEMENTS, onOpen);
    return () => window.removeEventListener(OPEN_ACHIEVEMENTS, onOpen);
  }, [load]);

  // The list has landed — open the badge we were asked for, ANCHORED to its medal.
  //
  // This used to just setSelected() and stop. The card then rendered with no
  // anchor, which means no `pos`, which means opacity 0 — the modal opened, the
  // grid appeared, and the badge you asked for was mounted and fully built but
  // invisible. It seemed to work the first time only because a stale anchor from
  // an earlier tap happened to still be in state.
  //
  // Layout effect, not effect: the medals are in the DOM by the time this runs
  // (same commit), so we can measure the real element and place the card before
  // the browser paints, with no flash of a card in the wrong place.
  React.useLayoutEffect(() => {
    if (!wantSlug || !badges) return;

    const badge = badges.find((x) => x.slug === wantSlug);
    if (!badge) {
      setWantSlug(null);
      return;
    }

    const grid = gridRef.current;
    const el = grid?.querySelector<HTMLElement>(
      `[data-slug="${CSS.escape(wantSlug)}"]`
    );
    // The grid renders in the same commit that `badges` lands, so a miss here
    // means the modal shell hasn't mounted yet. Keep the slug and try next tick
    // rather than selecting a badge we cannot place.
    if (!el) return;

    anchorTo(el);
    setPos(null);
    setSelected(badge);
    setWantSlug(null);
  }, [wantSlug, badges, anchorTo]);

  // A refresh replaces every badge object, so an open card would keep rendering
  // the numbers it was opened with — including right after you earn the rung it
  // is telling you to go and earn. Re-point it at the new object.
  React.useEffect(() => {
    if (!selected || !badges) return;
    const fresh = badges.find((b) => b.slug === selected.slug);
    if (fresh && fresh !== selected) setSelected(fresh);
  }, [badges, selected]);

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

  const rows = React.useMemo(() => {
    const ordered = [...(badges ?? [])].sort(
      (a, b) => a.row - b.row || a.sort - b.sort
    );
    const out: { n: number; items: Badge[] }[] = [];
    for (let i = 0; i < ordered.length; i += PER_ROW) {
      out.push({ n: i / PER_ROW, items: ordered.slice(i, i + PER_ROW) });
    }
    return out;
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
                  <div className="text-micro font-bold uppercase tracking-eyebrow text-[rgb(182,160,255)]">
                    Achievements
                  </div>
                  <div className="mt-1.5 text-read font-semibold tracking-title text-white">
                    Your constellation
                  </div>
                  <div className="mt-1 text-micro text-white/45">
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
                  <div className="text-meta text-white/40">Reading your sky…</div>
                ) : (
                  <div
                    ref={gridRef}
                    className="relative flex w-full flex-col items-center gap-5"
                  >
                    {rows.map((row) => (
                      <div key={row.n} className="flex justify-center gap-3.5">
                        {row.items.map((b) => (
                          <Medal
                            key={b.slug}
                            badge={b}
                            selected={selected?.slug === b.slug}
                            onClick={(el) => pick(b, el)}
                          />
                        ))}
                      </div>
                    ))}

                    {/* Tapping the sky behind the card puts it away. */}
                    {selected ? (
                      <button
                        type="button"
                        aria-label="Close badge details"
                        onClick={() => setSelected(null)}
                        className="absolute inset-0 z-10 cursor-default"
                      />
                    ) : null}

                    {/* The detail, opened OVER the badge you tapped. */}
                    <AnimatePresence mode="wait">
                      {selected ? (
                        <motion.div
                          key={selected.slug}
                          ref={cardRef}
                          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                          animate={{ opacity: pos ? 1 : 0, scale: 1 }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.16 }}
                          className="absolute z-20 w-[min(320px,100%)] rounded-2xl border border-white/12 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                          style={{
                            top: pos?.top ?? 0,
                            left: pos?.left ?? 0,
                            background: "#111726",
                          }}
                        >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      aria-label="Close badge details"
                      className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <span
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-body"
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
                      <div className="text-label font-semibold text-white">
                        {selected.name}
                      </div>
                      <div
                        className="text-micro font-semibold uppercase tracking-eyebrow"
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
                  <p className="mt-3.5 text-meta leading-body text-white/70">
                    {selected.description}
                  </p>

                  {/* How you earn it: the three real rungs, each with its own path.
                      Rungs with no hint are skipped for this badge. */}
                  <div className="mt-4">
                    <div className="text-micro font-semibold uppercase tracking-eyebrow text-white/45">
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

                  {/* The door out of the badge.
                      The ladder tells you what the next rung wants; on its own that
                      is a scoreboard, and the user is left to work out which of five
                      screens will move it. The badge knows: the condition blocking
                      the rung IS the destination. So the card ends with the one
                      thing it was missing — a way to go and earn it.

                      Gold has no button, because gold has nothing left to do. */}
                  {selected.nextTier ? (
                    <div className="mt-5 border-t border-white/[0.06] pt-4">
                      {typeof selected.nextCurrent === "number" &&
                      typeof selected.nextTarget === "number" &&
                      selected.nextTarget > 0 ? (
                        <div className="mb-3 text-meta tabular-nums text-white/45">
                          {selected.nextCurrent} of {selected.nextTarget} toward{" "}
                          <span className="font-semibold text-white/65">
                            {TIER_LABEL[selected.nextTier]}
                          </span>
                        </div>
                      ) : null}

                      {selected.nextRoute && selected.nextCta ? (
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            setSelected(null);
                            router.push(selected.nextRoute!);
                          }}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-label font-semibold transition hover:brightness-110 active:opacity-80"
                          style={{
                            color: GOLD_INK,
                            background: "rgba(232,199,126,0.10)",
                            border: "1px solid rgba(232,199,126,0.30)",
                          }}
                        >
                          <span>{selected.nextCta}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        // Some badges have no door, and pretending otherwise would be
                        // worse than saying so. Steadfast and Showed Up are earned by
                        // COMING BACK — there is no button anywhere in the app that
                        // makes a day pass. The only instruction we could give is
                        // "leave and return tomorrow", which is not advice, so we say
                        // the true thing instead of inventing a destination.
                        <p className="text-meta leading-body text-white/45">
                          There&apos;s nothing to tap for this one. It moves on its
                          own when you come back another day.
                        </p>
                      )}
                    </div>
                  ) : null}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {!selected ? (
                <div className="text-center text-micro text-white/30">
                  Tap a badge to see how it&apos;s earned.
                </div>
              ) : null}
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
              className="flex h-7 w-7 items-center justify-center rounded-full text-label"
              style={{ color: tint, background: `rgba(${c},.16)` }}
            >
              {b.glyph ?? "◆"}
            </span>
            <div className="pr-1">
              <div
                className="text-micro font-bold uppercase tracking-eyebrow"
                style={{ color: tint }}
              >
                {TIER_LABEL[tier]} unlocked
              </div>
              <div className="text-meta font-semibold text-white">{b.name}</div>
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
