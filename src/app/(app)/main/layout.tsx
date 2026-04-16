"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

type Rgb = { r: number; g: number; b: number };

type ExploreLaneTab = {
  id: "work" | "learning" | "world" | "impact" | "play";
  label: string;
  href: string;
  accent: Rgb;
};

const EXPLORE_LANES: readonly ExploreLaneTab[] = [
  {
    id: "work",
    label: "Work",
    href: "/main/explore/work",
    accent: { r: 120, g: 200, b: 255 },
  },
  {
    id: "learning",
    label: "Learning",
    href: "/main/explore/learning",
    accent: { r: 190, g: 140, b: 255 },
  },
  {
    id: "world",
    label: "World",
    href: "/main/explore/world",
    accent: { r: 255, g: 190, b: 90 },
  },
  {
    id: "impact",
    label: "Impact",
    href: "/main/explore/impact",
    accent: { r: 110, g: 231, b: 183 },
  },
  {
    id: "play",
    label: "Play",
    href: "/main/explore/play",
    accent: { r: 249, g: 168, b: 212 },
  },
] as const;

function tabPillBaseClass() {
  return [
    "relative inline-flex items-center gap-2",
    "rounded-full border",
    "px-3.5 py-2",
    "text-sm font-semibold tracking-[-0.01em]",
    "backdrop-blur-xl",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-200",
    "active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30 focus-visible:ring-offset-0",
    "select-none",
    "whitespace-nowrap",
    "shrink-0",
  ].join(" ");
}

function tabPillStyle(args: {
  selected: boolean;
  accent: Rgb;
}): React.CSSProperties {
  const { selected, accent } = args;
  const c = `${accent.r}, ${accent.g}, ${accent.b}`;

  const inactiveBg = `rgba(${c}, 0.08)`;
  const inactiveBorder = `rgba(${c}, 0.22)`;
  const activeBg = `linear-gradient(180deg, rgba(${c}, 0.24), rgba(255,255,255,0.05))`;
  const glow = `0 0 0 1px rgba(${c}, 0.28), 0 14px 30px rgba(0,0,0,0.38)`;
  const idleShadow =
    "inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 16px rgba(0,0,0,0.22)";

  return selected
    ? {
        background: activeBg,
        borderColor: `rgba(${c}, 0.36)`,
        color: "rgba(255,255,255,0.9)",
        boxShadow: glow,
      }
    : {
        background: inactiveBg,
        borderColor: inactiveBorder,
        color: "rgba(255,255,255,0.72)",
        boxShadow: idleShadow,
      };
}

function tabDotStyle(args: {
  selected: boolean;
  accent: Rgb;
}): React.CSSProperties {
  const { selected, accent } = args;
  const c = `${accent.r}, ${accent.g}, ${accent.b}`;

  return {
    background: selected ? `rgba(${c}, 0.9)` : `rgba(${c}, 0.42)`,
    boxShadow: selected
      ? `0 0 10px rgba(${c}, 0.34)`
      : `0 0 6px rgba(${c}, 0.18)`,
  };
}

function ExploreLaneRail({
  pathname,
  lanes,
}: {
  pathname: string;
  lanes: readonly ExploreLaneTab[];
}) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLAnchorElement | null>>([]);

  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateRailState = React.useCallback(() => {
    const viewport = viewportRef.current;
    const items = itemRefs.current;

    if (!viewport || items.length === 0) return;

    const viewportRect = viewport.getBoundingClientRect();
    const first = items[0];
    const last = items[items.length - 1];

    if (!first || !last) return;

    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();

    const firstClipped = firstRect.left < viewportRect.left + 2;
    const lastClipped = lastRect.right > viewportRect.right - 2;

    setCanScrollLeft(firstClipped);
    setCanScrollRight(lastClipped);
  }, []);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onScroll = () => updateRailState();
    const onResize = () => updateRailState();

    updateRailState();

    viewport.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const t1 = setTimeout(updateRailState, 0);
    const t2 = setTimeout(updateRailState, 120);
    const t3 = setTimeout(updateRailState, 300);

    return () => {
      viewport.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [updateRailState, lanes, pathname]);

  function scrollRailBy(direction: "left" | "right") {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const delta = Math.max(180, Math.floor(viewport.clientWidth * 0.6));

    viewport.scrollBy({
      left: direction === "left" ? -delta : delta,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative mb-3">
      {canScrollLeft ? (
        <button
          type="button"
          onClick={() => scrollRailBy("left")}
          className="hidden md:inline-flex absolute left-[-6px] top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full border backdrop-blur-xl"
          style={{
            background: "rgba(12,18,32,0.7)",
            borderColor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.78)",
          }}
          aria-label="Scroll explore lanes left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : null}

      <div
        ref={viewportRef}
        className="overflow-x-auto pb-1 pr-6 md:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-2">
          {lanes.map((lane, i) => {
            const active =
              pathname === lane.href || pathname.startsWith(`${lane.href}/`);

            return (
              <Link
                key={lane.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={lane.href}
                aria-current={active ? "page" : undefined}
                className={tabPillBaseClass()}
                style={tabPillStyle({
                  selected: active,
                  accent: lane.accent,
                })}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={tabDotStyle({
                    selected: active,
                    accent: lane.accent,
                  })}
                />
                <span>{lane.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {canScrollRight ? (
        <button
          type="button"
          onClick={() => scrollRailBy("right")}
          className="hidden md:inline-flex absolute right-[-6px] top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full border backdrop-blur-xl"
          style={{
            background: "rgba(12,18,32,0.7)",
            borderColor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.78)",
          }}
          aria-label="Scroll explore lanes right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[720px] flex-1 flex-col px-3 pt-3 pb-6">
      <ExploreLaneRail pathname={pathname} lanes={EXPLORE_LANES} />
      {children}
    </div>
  );
}