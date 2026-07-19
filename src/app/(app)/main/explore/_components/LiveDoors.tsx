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
import { ExternalLink, MapPin } from "lucide-react";

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

export function LiveDoors({
  lane,
  slug,
  accent,
}: {
  lane: Lane;
  slug: string;
  accent: Rgb;
}) {
  const [doors, setDoors] = React.useState<LiveDoor[]>([]);
  const [needsZip, setNeedsZip] = React.useState(false);
  const [source, setSource] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/guidance/live-doors?lane=${encodeURIComponent(lane)}&path=${encodeURIComponent(slug)}`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok?: boolean; needsZip?: boolean; doors?: LiveDoor[] } | null) => {
        if (cancelled || !d?.ok) return;
        setNeedsZip(Boolean(d.needsZip));
        setDoors(d.doors ?? []);
        setSource(d.doors?.[0]?.source ?? "");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lane, slug]);

  if (needsZip) {
    return (
      <SectionCard tone="neutral" compact>
        <CardTitle as="h2">Real places near you</CardTitle>
        <RowMeta className="mt-1 block">
          Add your zip and this fills with actual places you could turn up to.
        </RowMeta>
        <Link
          href="/main/profile/edit"
          className="mt-3 inline-flex items-center gap-1.5 rounded-control px-3 py-2 text-label font-medium transition hover:brightness-110"
          style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.95) }}
        >
          <MapPin className="h-3.5 w-3.5" />
          Add your zip
        </Link>
      </SectionCard>
    );
  }

  if (doors.length === 0) return null;

  return (
    <SectionCard tone="neutral">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
          style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.92) }}
        >
          <MapPin className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <CardTitle as="h2">Real places near you</CardTitle>
          <RowMeta className="mt-1 block">
            Looked up just now{source ? ` · ${source}` : ""}
          </RowMeta>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {doors.map((d) => (
          <a
            key={d.id}
            href={d.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 rounded-panel border px-4 py-3 transition hover:brightness-110"
            style={{ borderColor: rgba(accent, 0.22), backgroundColor: rgba(accent, 0.06) }}
          >
            <span className="min-w-0 flex-1">
              <RowTitle>{d.title}</RowTitle>
              {d.note ? <RowMeta className="mt-0.5 block">{d.note}</RowMeta> : null}
            </span>
            <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-white/35" />
          </a>
        ))}
      </div>
    </SectionCard>
  );
}

export default LiveDoors;
