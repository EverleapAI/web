// apps/web/src/app/(app)/main/explore/_components/NearDescent.tsx
//
// "Try it near you" gone deep — the real-world landing (the prime directive: the
// whole point is getting out and doing it). A full-screen browser of real ways to
// try this specialty: near you, online, or virtual — plus the honey door to
// design your own mission. Every row is a door OUT of the app.

"use client";

import * as React from "react";
import { ArrowRight, ExternalLink, Globe, Loader2, MapPin, Video, Wand2 } from "lucide-react";

import { DescentShell } from "./DescentShell";
import { OpportunityCard } from "./OpportunityCard";
import type { Lane, Opportunity } from "../_data/exploreSchema";

const HONEY = "244, 192, 103";

const MODE = {
  local: { label: "Near you", Icon: MapPin, rgb: "52, 211, 153" },
  virtual: { label: "Virtual", Icon: Video, rgb: "167, 139, 250" },
  remote: { label: "Online", Icon: Globe, rgb: "96, 176, 255" },
  hybrid: { label: "Hybrid", Icon: Globe, rgb: "96, 176, 255" },
  travel: { label: "Travel", Icon: MapPin, rgb: "245, 176, 90" },
} as const;

function bucket(mode?: string): keyof typeof MODE {
  return mode && mode in MODE ? (mode as keyof typeof MODE) : "remote";
}

// One card treatment for every door, here and in the constellation. The old one
// here used text-label over text-meta on a flat fill — a rung below the card
// ladder, which is why these read as small and grey on a phone.
function renderOpp(o: Opportunity) {
  return (
    <OpportunityCard
      key={o.id}
      title={o.title}
      note={o.note}
      href={o.href}
      mode={o.mode}
      provider={o.provider}
    />
  );
}

export function NearDescent({
  opps,
  specialtyTitle,
  lane,
  parentTitle,
  accent,
  creating,
  onClose,
  onStartMission,
}: {
  opps: Opportunity[];
  specialtyTitle: string;
  lane: Lane;
  /** The path this branch belongs to — for World, the place itself. */
  parentTitle: string;
  accent: string;
  creating: boolean;
  onClose: () => void;
  onStartMission: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // The user's zip makes "near you" real — location-scoped searches for actual
  // local firms, programs, and meetups.
  const [zip, setZip] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetch("/api/me", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((d: { user?: { zip_code?: string | null } }) => setZip(d?.user?.zip_code ?? null))
      .catch(() => {});
  }, []);
  const search = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;

  // What "near you" can honestly mean differs by lane. Employers make sense for
  // a career; they are nonsense for a place. A World path is somewhere else in
  // the world, so "near you" has to mean the ways that culture reaches where you
  // already are — its food, its language, its diaspora community — never a
  // search for Ghanaian forts down the road from San Rafael.
  const localDoors: Opportunity[] = !zip
    ? []
    : lane === "world"
      ? [
          { id: "z1", title: `${parentTitle} food near you`, note: "The most direct way to meet a culture without leaving home", href: search(`${parentTitle} restaurant OR grocery near ${zip}`), mode: "local" },
          { id: "z2", title: `${parentTitle} cultural events near you`, note: "Festivals, exhibitions and community events where you live", href: search(`${parentTitle} cultural event OR festival OR community near ${zip}`), mode: "local" },
          { id: "z3", title: `People who speak the language, near you`, note: "Language groups and conversation meetups nearby", href: `https://www.meetup.com/find/?keywords=${encodeURIComponent(parentTitle + " language")}&location=us--${encodeURIComponent(zip)}`, mode: "local" },
        ]
      : lane === "work"
        ? [
            { id: "z1", title: `${specialtyTitle} firms & employers near you`, note: "See who does this work in your area — a real place to email or visit", href: search(`${specialtyTitle} firm OR employer near ${zip}`), mode: "local" },
            { id: "z2", title: "Programs, camps & classes near you", note: "Hands-on ways to try it close to home", href: search(`${specialtyTitle} summer program OR camp OR class near ${zip}`), mode: "local" },
            { id: "z3", title: "Meetups & events near you", note: "Find people who do this, gathering nearby", href: `https://www.meetup.com/find/?keywords=${encodeURIComponent(specialtyTitle)}&location=us--${encodeURIComponent(zip)}`, mode: "local" },
          ]
        : [
            // Learning, Impact and Play: places you could turn up and do it.
            { id: "z1", title: `${specialtyTitle} classes & groups near you`, note: "Somewhere local that already does this", href: search(`${specialtyTitle} class OR group OR club near ${zip}`), mode: "local" },
            { id: "z2", title: `Places to try ${specialtyTitle.toLowerCase()} nearby`, note: "Community centres, libraries and clubs close to home", href: search(`where to try ${specialtyTitle} near ${zip}`), mode: "local" },
            { id: "z3", title: "Meetups & events near you", note: "Find people who do this, gathering nearby", href: `https://www.meetup.com/find/?keywords=${encodeURIComponent(specialtyTitle)}&location=us--${encodeURIComponent(zip)}`, mode: "local" },
          ];

  // "Near you" gets its own treatment (zip-aware); the rest group normally.
  const nearItems = [...localDoors, ...opps.filter((o) => bucket(o.mode) === "local")];
  const order: (keyof typeof MODE)[] = ["remote", "virtual", "hybrid", "travel"];
  const groups = order
    .map((k) => ({ k, items: opps.filter((o) => bucket(o.mode) === k) }))
    .filter((g) => g.items.length);

  if (!mounted) return null;

  return (
    // A single screen rather than a sequence, so the shell shows no progress rail.
    <DescentShell accent={accent} step={0} total={1} onClose={onClose} backTo={specialtyTitle}>
      <>
        <h1 className="text-title font-semibold leading-display tracking-title">Ways to actually try it.</h1>
        <p className="mt-2 text-read leading-read text-white/72">
          Real ways to get a taste of {specialtyTitle} — near you, online, or from your couch. The
          only way to really know is to go do one.
        </p>

        {/* The honey door — design your own real-world mission. */}
        <button
          type="button"
          onClick={onStartMission}
          disabled={creating}
          className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 font-semibold transition hover:brightness-105 disabled:opacity-70"
          style={{ background: `linear-gradient(180deg,#ffdf9e,rgb(${HONEY}))`, color: "#1a1204" }}
        >
          <span className="inline-flex items-center gap-2.5"><Wand2 className="h-5 w-5" /> Try {specialtyTitle} — design your own mission</span>
          {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
        </button>

        {/* Near you — the prime-directive group, made real by the user's zip. */}
        <div className="mt-6">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-control" style={{ background: `rgba(${MODE.local.rgb},0.14)`, color: `rgb(${MODE.local.rgb})` }}>
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${MODE.local.rgb},0.9)` }}>
              Near you{zip ? ` · ${zip}` : ""}
            </div>
          </div>
          {!zip ? (
            <a href="/main/profile/edit" className="mb-2.5 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition hover:brightness-110" style={{ borderColor: `rgba(${MODE.local.rgb},0.35)`, background: `rgba(${MODE.local.rgb},0.08)` }}>
              <span className="text-label font-semibold" style={{ color: `rgb(${MODE.local.rgb})` }}>Add your zip → see real local firms, programs & meetups</span>
              <ArrowRight className="h-4 w-4 shrink-0" style={{ color: `rgb(${MODE.local.rgb})` }} />
            </a>
          ) : null}
          {nearItems.length ? (
            <div className="space-y-2.5">
              {nearItems.map((o) => renderOpp(o))}
            </div>
          ) : null}
        </div>

        {groups.map((g) => {
          const meta = MODE[g.k];
          return (
            <div key={g.k} className="mt-6">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-control" style={{ background: `rgba(${meta.rgb},0.14)`, color: `rgb(${meta.rgb})` }}>
                  <meta.Icon className="h-3.5 w-3.5" />
                </span>
                <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${meta.rgb},0.9)` }}>{meta.label}</div>
              </div>
              <div className="space-y-2.5">{g.items.map((o) => renderOpp(o))}</div>
            </div>
          );
        })}

        <p className="mt-8 text-center text-meta text-white/40" style={{ color: `rgba(${accent},0.6)` }}>
          Going and doing beats reading, every time.
        </p>
      </>
    </DescentShell>
  );
}

export default NearDescent;
