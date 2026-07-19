// apps/web/src/app/(app)/main/explore/_components/LiveDoors.tsx
//
// The one part of a path that isn't written in advance.
//
// Everything else on the screen was generated once and cached, which is right —
// what a day doing this feels like doesn't change. But whether a club still
// meets, or a nursery is still open, is exactly the kind of thing a reader can
// tell is stale. So this strip is fetched when the page renders: real venues
// from OpenStreetMap, or real registered organisations from IRS filings.
//
// It renders nothing at all unless there is something real to show. A "near you"
// section with nothing near you is worse than no section.

"use client";

import * as React from "react";
import Link from "next/link";
import { Compass, ExternalLink, Globe, MapPin } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { CardTitle, RowMeta, RowTitle } from "@/lib/ui/card";
import type { Lane, Rgb } from "../_data/exploreSchema";
import { rgba } from "./exploreUi";

type LiveDoor = {
  id: string;
  title: string;
  note?: string;
  href: string;
  source: string;
  local: boolean;
};

function DoorRow({ door, accent }: { door: LiveDoor; accent: Rgb }) {
  return (
    <a
      href={door.href}
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-3 rounded-panel border px-4 py-3 transition hover:brightness-110"
      style={{ borderColor: rgba(accent, 0.22), backgroundColor: rgba(accent, 0.06) }}
    >
      <span className="min-w-0 flex-1">
        <RowTitle>{door.title}</RowTitle>
        {door.note ? <RowMeta className="mt-0.5 block">{door.note}</RowMeta> : null}
      </span>
      <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-white/35" />
    </a>
  );
}

export function LiveDoors({
  lane,
  slug,
  accent,
}: {
  lane: Lane;
  slug: string;
  accent: Rgb;
}) {
  const [nearby, setNearby] = React.useState<LiveDoor[]>([]);
  const [online, setOnline] = React.useState<LiveDoor[]>([]);
  const [needsZip, setNeedsZip] = React.useState(false);
  const [scope, setScope] = React.useState<"local" | "national">("local");

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/guidance/live-doors?lane=${encodeURIComponent(lane)}&path=${encodeURIComponent(slug)}`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          d: {
            ok?: boolean;
            needsZip?: boolean;
            nearbyScope?: string;
            nearby?: LiveDoor[];
            online?: LiveDoor[];
          } | null
        ) => {
          if (cancelled || !d?.ok) return;
          setNeedsZip(Boolean(d.needsZip));
          setScope(d.nearbyScope === "national" ? "national" : "local");
          setNearby(d.nearby ?? []);
          setOnline(d.online ?? []);
        }
      )
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lane, slug]);

  // Nothing to show at all — stay silent rather than render an empty shell.
  if (nearby.length === 0 && online.length === 0 && !needsZip) return null;

  return (
    <SectionCard tone="neutral">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
          style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.92) }}
        >
          <Compass className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <CardTitle as="h2">Ways in, right now</CardTitle>
          <RowMeta className="mt-1 block">Looked up as this page loaded</RowMeta>
        </div>
      </div>

      {/* Nearby, when we know where "near" is. Never labelled "near you" unless
          the results genuinely are. */}
      {nearby.length > 0 ? (
        <div className="mt-4">
          <RowMeta className="mb-2.5 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {scope === "local" ? "Places near you" : "Places to start"}
          </RowMeta>
          <div className="space-y-2.5">
            {nearby.map((d) => (
              <DoorRow key={d.id} door={d} accent={accent} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Online is not the leftovers. For plenty of this it's where a person
          actually starts, and for someone without transport it may be the only
          route — so it always shows, with or without a zip. */}
      {online.length > 0 ? (
        <div className="mt-4">
          <RowMeta className="mb-2.5 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            Online and virtual — open to anyone
          </RowMeta>
          <div className="space-y-2.5">
            {online.map((d) => (
              <DoorRow key={d.id} door={d} accent={accent} />
            ))}
          </div>
        </div>
      ) : null}

      {/* The offer sits at the bottom: an addition, not a gate. */}
      {needsZip ? (
        <div className="mt-5 border-t border-white/10 pt-4">
          <RowMeta className="block">
            Add your zip and this also fills with real places near you — the clubs,
            classes and groups where you live. It’s only used to look up what’s
            nearby, and you can skip it.
          </RowMeta>
          <Link
            href="/main/profile/edit"
            className="mt-3 inline-flex items-center gap-1.5 rounded-control px-3.5 py-2 text-label font-medium transition hover:brightness-110"
            style={{ backgroundColor: rgba(accent, 0.14), color: rgba(accent, 0.95) }}
          >
            <MapPin className="h-3.5 w-3.5" />
            Add your zip
          </Link>
        </div>
      ) : null}
    </SectionCard>
  );
}

export default LiveDoors;
