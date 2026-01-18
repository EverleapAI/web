// src/app/main/explore/page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

import type { ExploreKey, ExploreSection, ExploreChip } from "./content/types";
import { EXPLORE_SECTIONS } from "./content";
import { RENDERERS } from "./renderers";

/* ========= helpers ========= */

/**
 * Layout policy per lane.
 * - "structured": the lane renders ONE rich experience full-width (like Careers)
 * - "grid": the lane shows multiple chips/cards in a grid
 */
type LaneLayout = "structured" | "grid";

function laneLayoutForKey(key: ExploreKey): LaneLayout {
  switch (key) {
    case "careers":
    case "education":
    case "travel":
    case "community":
    case "hobbies":
      return "structured";
    default:
      return "grid";
  }
}

/**
 * Header copy per lane.
 */
function headerCopyForKey(
  key: ExploreKey,
  section: ExploreSection
): {
  laneKicker: string;
  headline: string;
  supportLine: string;
} {
  const laneKicker = section.label;

  switch (key) {
    case "careers":
      return {
        laneKicker,
        headline: "4 careers that fit you",
        supportLine:
          "Not a forever decision. Pick one lane, run a tiny test, then adjust.",
      };

    case "education":
      return {
        laneKicker,
        headline: "4 learning paths that fit you",
        supportLine:
          "Pick one direction. Try a small first step. If it sticks, go deeper.",
      };

    case "travel":
      return {
        laneKicker,
        headline: "4 travel styles that match your tempo",
        supportLine:
          "Pick one vibe. Try a tiny plan. Upgrade it if you actually want more.",
      };

    case "community":
      return {
        laneKicker,
        headline: "4 ways to find your people",
        supportLine:
          "Choose one setting to try. Notice: do you feel more like yourself there?",
      };

    case "hobbies":
      return {
        laneKicker,
        headline: "4 hobbies you might actually stick with",
        supportLine:
          "Try one. Don’t judge it on day one. Judge it on: “Do I want to do it again?”",
      };

    default:
      return {
        laneKicker,
        headline: "Pick a chip",
        supportLine: "Tap a card to explore.",
      };
  }
}

/* ========= Explore tab config ========= */

type LaneMedia = {
  mp4?: string;
  poster?: string;
};

type TabMeta = {
  subtitle: string;
  badgeIcon: string;
  badgeHalo: string;
  badgeText: string;
  media?: LaneMedia; // optional lane-level emotional break (MP4 first, JPG fallback)
};

function laneMediaForKey(key: ExploreKey): LaneMedia | undefined {
  switch (key) {
    case "careers":
    case "education":
    case "travel":
    case "community":
    case "hobbies":
      return {
        mp4: `/images/${key}/6.mp4`,
        poster: `/images/${key}/5.jpg`,
      };
    default:
      return undefined;
  }
}

function metaForSectionKey(key: ExploreKey): TabMeta {
  switch (key) {
    case "careers":
      return {
        subtitle: "Future jobs?",
        badgeIcon: "🧭",
        badgeHalo: "from-sky-500/35 via-cyan-400/20 to-indigo-500/20",
        badgeText: "text-sky-50",
        media: laneMediaForKey(key),
      };
    case "education":
      return {
        subtitle: "School + learning paths",
        badgeIcon: "🎓",
        badgeHalo: "from-amber-500/35 via-orange-400/18 to-rose-400/18",
        badgeText: "text-amber-50",
        media: laneMediaForKey(key),
      };
    case "travel":
      return {
        subtitle: "Places + adventures",
        badgeIcon: "🌍",
        badgeHalo: "from-emerald-500/35 via-teal-400/18 to-sky-400/18",
        badgeText: "text-emerald-50",
        media: laneMediaForKey(key),
      };
    case "community":
      return {
        subtitle: "People + belonging",
        badgeIcon: "🤝",
        badgeHalo: "from-violet-500/35 via-fuchsia-400/18 to-sky-400/18",
        badgeText: "text-violet-50",
        media: laneMediaForKey(key),
      };
    case "hobbies":
      return {
        subtitle: "Fun to explore",
        badgeIcon: "🎨",
        badgeHalo: "from-rose-500/35 via-pink-400/18 to-amber-400/18",
        badgeText: "text-rose-50",
        media: laneMediaForKey(key),
      };
    default:
      return {
        subtitle: "Browse ideas",
        badgeIcon: "✨",
        badgeHalo: "from-slate-500/25 via-slate-400/15 to-slate-300/15",
        badgeText: "text-slate-50",
      };
  }
}

/* ========= scroll helper (big tabs -> compact pills) ========= */

function useCompactTabs(thresholdPx = 56): boolean {
  const [compact, setCompact] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const y = window.scrollY || 0;
      setCompact(y > thresholdPx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [thresholdPx]);

  return compact;
}

/**
 * Structured lane must render the chip whose type matches the lane key.
 * This prevents subtle bugs where section.key is "careers" but a chip is still
 * typed as a legacy lane ("recommendations"/"forYou"/etc).
 */
function preferredStructuredChip(section: ExploreSection): ExploreChip | null {
  const chips = section.chips ?? [];
  if (!chips.length) return null;

  const match = chips.find((c) => c.type === section.key);
  if (match) return match;

  // Soft fallback: chip.id equals section.key (common pattern)
  const byId = chips.find((c) => c.id === section.key);
  if (byId) return byId;

  // Fail loudly instead of silently rendering the wrong chip
  return null;
}

/* ========= lane-level emotional media break (MP4 first, JPG fallback) ========= */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(Boolean(mq.matches));
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function LaneMediaBreak({
  media,
  dark,
  accentHalo,
}: {
  media?: LaneMedia;
  dark: boolean;
  accentHalo: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [videoFailed, setVideoFailed] = React.useState(false);
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    setVideoFailed(false);
    setImageFailed(false);
  }, [media?.mp4, media?.poster]);

  if (!media?.mp4 && !media?.poster) return null;

  const wantsVideo = Boolean(media?.mp4 && !reducedMotion && !videoFailed);
  const poster = media?.poster;

  return (
    <div className="mt-3">
      <div
        className={`relative overflow-hidden rounded-2xl border ${
          dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
        }`}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentHalo} ${
            dark ? "opacity-35" : "opacity-20"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${
            dark ? "bg-slate-950/25" : "bg-white/10"
          }`}
        />

        {wantsVideo ? (
          <video
            className="relative h-[140px] w-full object-cover sm:h-[160px] lg:h-[180px]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onError={() => setVideoFailed(true)}
          >
            <source src={media!.mp4!} type="video/mp4" />
          </video>
        ) : poster && !imageFailed ? (
          <div className="relative h-[140px] w-full sm:h-[160px] lg:h-[180px]">
            <Image
              src={poster}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              className="object-cover"
              priority={false}
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <div className="relative h-[140px] w-full sm:h-[160px] lg:h-[180px]" />
        )}

        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${
            dark
              ? "bg-gradient-to-r from-slate-950/35 via-transparent to-slate-950/35"
              : "bg-gradient-to-r from-white/25 via-transparent to-white/25"
          }`}
        />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);
  const dark = isDarkTheme(themeId);

  const sections: ExploreSection[] = EXPLORE_SECTIONS as ExploreSection[];

  const [activeKey, setActiveKey] = React.useState<ExploreKey>(() => {
    const first = sections[0]?.key;
    return (first ?? "education") as ExploreKey;
  });

  const activeIndex = React.useMemo(() => {
    const idx = sections.findIndex((s) => s.key === activeKey);
    return idx === -1 ? 0 : idx;
  }, [activeKey, sections]);

  const activeSection: ExploreSection = sections[activeIndex] ?? sections[0];

  const layout = laneLayoutForKey(activeSection.key);
  const renderStructured = layout === "structured";

  const structuredChip: ExploreChip | null = React.useMemo(() => {
    if (!renderStructured) return null;
    return preferredStructuredChip(activeSection);
  }, [activeSection, renderStructured]);

  const compactTabs = useCompactTabs(64);

  const tabStripRef = React.useRef<HTMLDivElement | null>(null);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const [canScroll, setCanScroll] = React.useState({
    left: false,
    right: false,
  });

  const updateCanScroll = React.useCallback(() => {
    const el = tabStripRef.current;
    if (!el) return;

    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setCanScroll({ left, right });
  }, []);

  React.useEffect(() => {
    updateCanScroll();

    const el = tabStripRef.current;
    if (!el) return;

    const onScroll = () => updateCanScroll();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateCanScroll());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateCanScroll]);

  React.useEffect(() => {
    const btn = tabRefs.current[String(activeKey)];
    const el = tabStripRef.current;
    if (!btn || !el) return;

    btn.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeKey]);

  function nudgeStrip(dir: "left" | "right") {
    const el = tabStripRef.current;
    if (!el) return;

    const amount = Math.max(220, Math.floor(el.clientWidth * 0.65));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  function onStripWheel(e: React.WheelEvent<HTMLDivElement>) {
    const el = tabStripRef.current;
    if (!el) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (el.scrollWidth <= el.clientWidth + 2) return;

    e.preventDefault();
    el.scrollBy({ left: e.deltaY, behavior: "auto" });
  }

  const laneMeta = metaForSectionKey(activeSection.key);
  const laneAccent = `bg-gradient-to-r ${laneMeta.badgeHalo}`;

  const pageWidthClass = "max-w-5xl";

  const { laneKicker, headline, supportLine } = headerCopyForKey(
    activeSection.key,
    activeSection
  );

  /**
   * Detach structured lanes so they match the Education structure:
   * - The lane shell holds only header + media
   * - The 4 cards render OUTSIDE the shell (full-width, clearly separate)
   */
  const detachContentFromShell = renderStructured;

  return (
    <AppChrome
      themeId={themeId}
      gradientLevel={gradientLevel}
      onThemeChange={setThemeId}
      onGradientChange={setGradientLevel}
    >
      <div className={`mx-auto w-full ${pageWidthClass} px-4 pb-24 pt-3`}>
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center gap-3">
            <div
              className={`h-5 w-[3px] rounded-full ${
                dark
                  ? "bg-gradient-to-b from-sky-400/80 via-cyan-300/60 to-indigo-400/70"
                  : "bg-gradient-to-b from-sky-600 via-cyan-600 to-indigo-600"
              }`}
              aria-hidden
            />
            <div className="min-w-0">
              <div
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
                  dark ? "text-white/70" : "text-slate-600"
                }`}
              >
                Explore
              </div>
              <div
                className={`mt-0.5 text-sm ${
                  dark ? "text-white/70" : "text-slate-600"
                }`}
              >
                Let’s find what fits you.
              </div>
            </div>
          </div>
        </div>

        {/* Sticky tabs */}
        <div className="sticky top-2 z-40 -mx-4 px-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-14 -left-14 h-44 w-44 rounded-full bg-gradient-to-br from-sky-500/14 via-cyan-400/8 to-indigo-500/6 blur-3xl opacity-45" />
              <div className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-gradient-to-br from-violet-500/12 via-fuchsia-400/7 to-sky-500/6 blur-3xl opacity-35" />
            </div>

            <div className={`relative ${compactTabs ? "py-2" : "py-3"}`}>
              {canScroll.left ? (
                <button
                  type="button"
                  onClick={() => nudgeStrip("left")}
                  className={`hidden sm:inline-flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border shadow-sm transition active:scale-95 ${
                    dark
                      ? "border-white/10 bg-slate-950/50 text-white hover:bg-slate-950/70"
                      : "border-black/10 bg-white/90 text-slate-900 hover:bg-white"
                  }`}
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : null}

              {canScroll.right ? (
                <button
                  type="button"
                  onClick={() => nudgeStrip("right")}
                  className={`hidden sm:inline-flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border shadow-sm transition active:scale-95 ${
                    dark
                      ? "border-white/10 bg-slate-950/50 text-white hover:bg-slate-950/70"
                      : "border-black/10 bg-white/90 text-slate-900 hover:bg-white"
                  }`}
                  aria-label="Scroll tabs right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : null}

              <div
                ref={tabStripRef}
                onWheel={onStripWheel}
                className={`flex w-full gap-2 overflow-x-auto overscroll-x-contain scroll-smooth
                  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                  sm:px-11`}
                style={{
                  scrollPaddingLeft: 44,
                  scrollPaddingRight: 44,
                }}
              >
                {sections.map((s) => {
                  const active = s.key === activeKey;
                  const label = s.label;
                  const meta = metaForSectionKey(s.key);

                  const base =
                    "group text-left transition active:scale-[0.99] select-none shrink-0";

                  const shape = compactTabs
                    ? "rounded-full px-3 py-2"
                    : "rounded-3xl px-4 py-3";

                  const activeBg = active
                    ? dark
                      ? "bg-white/15 text-white"
                      : "bg-slate-900 text-white"
                    : dark
                    ? "text-white/85 hover:bg-white/10"
                    : "text-slate-800 hover:bg-slate-100";

                  const badgeSize = compactTabs
                    ? "h-7 w-7 rounded-2xl"
                    : "h-9 w-9 rounded-2xl";
                  const badgeText = compactTabs ? "text-sm" : "text-base";

                  return (
                    <button
                      key={s.key}
                      ref={(el) => {
                        tabRefs.current[String(s.key)] = el;
                      }}
                      type="button"
                      onClick={() => setActiveKey(s.key)}
                      className={`${base} ${shape} ${activeBg}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`relative inline-flex ${badgeSize} items-center justify-center overflow-hidden border ${
                            dark ? "border-white/10" : "border-black/10"
                          }`}
                          aria-hidden
                        >
                          <span
                            className={`absolute inset-0 bg-gradient-to-br ${meta.badgeHalo}`}
                          />
                          <span
                            className={`relative ${badgeText} ${meta.badgeText}`}
                          >
                            {meta.badgeIcon}
                          </span>
                        </span>

                        <div className="min-w-0">
                          <div
                            className={`font-semibold ${
                              compactTabs ? "text-xs" : "text-sm"
                            }`}
                          >
                            <span className="truncate">{label}</span>
                          </div>

                          {!compactTabs ? (
                            <div
                              className={`mt-1 text-[0.75rem] leading-4 ${
                                active
                                  ? "text-white/70"
                                  : dark
                                  ? "text-white/55"
                                  : "text-slate-600"
                              }`}
                            >
                              {meta.subtitle}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {canScroll.right ? (
                <div className="pointer-events-none absolute right-0 top-0 h-full w-12">
                  <div
                    className={`h-full w-full ${
                      dark
                        ? "bg-gradient-to-l from-slate-950/55 to-transparent"
                        : "bg-gradient-to-l from-white/70 to-transparent"
                    }`}
                  />
                </div>
              ) : null}

              {canScroll.left ? (
                <div className="pointer-events-none absolute left-0 top-0 h-full w-12 hidden sm:block">
                  <div
                    className={`h-full w-full ${
                      dark
                        ? "bg-gradient-to-r from-slate-950/55 to-transparent"
                        : "bg-gradient-to-r from-white/70 to-transparent"
                    }`}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Lane shell (header-only when detached lanes) */}
        <div
          className={`mt-4 rounded-3xl border p-4 shadow-sm ${
            dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
          }`}
        >
          {/* Lane header */}
          <div className="mb-3">
            <div
              className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
                dark ? "text-white/80" : "text-slate-700"
              }`}
            >
              {laneKicker}
            </div>

            <div
              className={`mt-1 text-base font-semibold ${
                dark ? "text-white" : "text-slate-900"
              }`}
            >
              {headline}
            </div>

            <div
              className={`mt-1 text-sm ${
                dark ? "text-white/70" : "text-slate-600"
              }`}
            >
              {supportLine}
            </div>

            <div className="mt-3 h-[2px] w-28 overflow-hidden rounded-full">
              <div
                className={`h-full w-full ${laneAccent} ${
                  dark ? "opacity-65" : "opacity-45"
                }`}
              />
            </div>

            {/* lane-level emotional media break (standardized: /images/<lane>/6.mp4 -> /images/<lane>/5.jpg) */}
            <LaneMediaBreak
              media={laneMeta.media}
              dark={dark}
              accentHalo={laneMeta.badgeHalo}
            />
          </div>

          {/* Lane content (keep inside shell only when NOT detached) */}
          {!detachContentFromShell ? (
            renderStructured ? (
              structuredChip ? (
                (() => {
                  const Renderer = RENDERERS[structuredChip.type];
                  return (
                    <Renderer
                      key={structuredChip.id}
                      chip={structuredChip}
                      dark={dark}
                    />
                  );
                })()
              ) : (
                <div
                  className={`rounded-2xl border p-5 ${
                    dark
                      ? "border-white/10 bg-white/5 text-white/80"
                      : "border-black/10 bg-white text-slate-700"
                  }`}
                >
                  No content found for this lane yet.
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeSection.chips.map((chip: ExploreChip) => {
                  const Renderer = RENDERERS[chip.type];
                  return <Renderer key={chip.id} chip={chip} dark={dark} />;
                })}
              </div>
            )
          ) : null}
        </div>

        {/* Detached lanes: render content OUTSIDE the shell (Education structure) */}
        {detachContentFromShell ? (
          <div className="mt-4 space-y-4">
            {renderStructured ? (
              structuredChip ? (
                (() => {
                  const Renderer = RENDERERS[structuredChip.type];
                  return (
                    <Renderer
                      key={structuredChip.id}
                      chip={structuredChip}
                      dark={dark}
                    />
                  );
                })()
              ) : (
                <div
                  className={`rounded-2xl border p-5 ${
                    dark
                      ? "border-white/10 bg-white/5 text-white/80"
                      : "border-black/10 bg-white text-slate-700"
                  }`}
                >
                  No content found for this lane yet. (Check that this lane’s
                  chip.type matches the lane key.)
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeSection.chips.map((chip: ExploreChip) => {
                  const Renderer = RENDERERS[chip.type];
                  return <Renderer key={chip.id} chip={chip} dark={dark} />;
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>

      <BottomNav />
    </AppChrome>
  );
}
