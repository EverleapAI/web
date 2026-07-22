"use client";

// One programme, explained — the level below the listing.
//
// A row that ends in an outbound link sends a sixteen-year-old to a government
// site written for adults and calls that depth. This is where we actually say
// what the thing is: what it costs before you go, how it works step by step, and
// how the countries differ — as objects rather than paragraphs, because the
// numbers are the decision and prose buries them.
//
// Everything here is hand-checked. No generated copy reaches this page: a wrong
// figure about money or a visa is a different order of mistake from a wrong
// sentence, and it would be read as fact by someone planning a year.

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { SectionCard } from "../../../../../components/ui/SectionCard";
import { HEADING_CLASS, HEADING_STYLE, PROSE_CLASS, PROSE_STYLE } from "@/lib/ui/prose";
import { RowMeta, RowTitle } from "@/lib/ui/card";
import { LANE_ACCENT } from "../../../../_data/exploreSchema";
import { SPECIALTY_ACCENTS, accentCard } from "../../../../_components/exploreUi";

type Destination = {
  slug: string;
  name: string;
  ages: string;
  length: string;
  needs: string;
  href: string;
  note?: string;
};

type Detail = {
  whatItIs: string;
  howItWorks: string[];
  upfront: { label: string; value: string; note?: string }[];
  goodToKnow?: string[];
  destinations?: Destination[];
};

type Way = {
  id: string;
  name: string;
  href: string;
  blurb: string;
  cost: "funded" | "free" | "low" | "paid";
  scholarship: string | null;
  ages: string;
  timing: string | null;
  eligibility: string | null;
  detail: Detail | null;
};

const COST_LABEL: Record<Way["cost"], string> = {
  funded: "Fully funded",
  free: "Free",
  low: "Low cost",
  paid: "Costs money",
};

const COST_TONE: Record<Way["cost"], string> = {
  funded: "#6FE3AE",
  free: "#6FE3AE",
  low: "#F0C878",
  paid: "rgba(255,255,255,0.5)",
};

/**
 * The age window, drawn.
 *
 * "18–30" as text is a fact you read past. As a band with the open stretch lit,
 * it's a shape — you can see how much of it is yours, which is the thing someone
 * actually wants to know.
 */
function AgeWindow({ from, to, accent }: { from: number; to: number; accent: string }) {
  const FLOOR = 14;
  const CEIL = 34;
  const span = CEIL - FLOOR;
  const left = ((from - FLOOR) / span) * 100;
  const width = ((to - from) / span) * 100;
  return (
    <div aria-label={`Open from age ${from} to ${to}`}>
      <div className="relative h-2.5 w-full overflow-hidden rounded-chip bg-white/[0.06]">
        <div
          className="absolute inset-y-0 rounded-chip"
          style={{ left: `${left}%`, width: `${width}%`, background: `rgba(${accent},0.75)` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-micro text-white/40">
        <span>{FLOOR}</span>
        <span style={{ color: `rgba(${accent},0.92)` }}>
          open {from}–{to}
        </span>
        <span>{CEIL}</span>
      </div>
    </div>
  );
}

function parseAgeWindow(ages: string): { from: number; to: number } | null {
  const m = ages.match(/(\d{2})\s*[–-]\s*(\d{2})/);
  if (!m) return null;
  return { from: Number(m[1]), to: Number(m[2]) };
}

export default function WayDetailPage({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  const { kind, id } = use(params);
  const accent = LANE_ACCENT.world;
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;

  const [way, setWay] = React.useState<Way | null>(null);
  const [missing, setMissing] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/guidance/world-ways?id=${encodeURIComponent(id)}`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && d.way) setWay(d.way);
        else setMissing(true);
      })
      .catch((e) => {
        if ((e as { name?: string })?.name !== "AbortError") setMissing(true);
      });
    return () => controller.abort();
  }, [id]);

  const window_ = way ? parseAgeWindow(way.ages) : null;

  return (
    <div className="space-y-5">
      <Link
        href={`/main/explore/world/ways/${kind}`}
        className="inline-flex items-center gap-1.5 text-label font-medium transition hover:brightness-125"
        style={{ color: `rgba(${accentRgb},0.92)` }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {missing && !way ? <RowMeta className="block px-1">We don&rsquo;t have this one.</RowMeta> : null}

      {way ? (
        <>
          <SectionCard tone="hero" voice>
            <div>
              <span
                className="text-micro font-semibold uppercase tracking-eyebrow"
                style={{ color: COST_TONE[way.cost] }}
              >
                {COST_LABEL[way.cost]}
              </span>
              <h1 className={`mt-1 ${HEADING_CLASS}`} style={HEADING_STYLE}>
                {way.name}
              </h1>
              <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
                {way.detail?.whatItIs ?? way.blurb}
              </p>
            </div>
          </SectionCard>

          {window_ ? (
            <div className="rounded-card border px-4 py-4" style={accentCard(SPECIALTY_ACCENTS[0])}>
              <RowTitle className="mb-3 block text-body">When you can go</RowTitle>
              <AgeWindow from={window_.from} to={window_.to} accent={SPECIALTY_ACCENTS[0]} />
              {way.eligibility ? (
                <RowMeta className="mt-3 block text-label leading-snug text-white/70">
                  {way.eligibility}
                </RowMeta>
              ) : null}
            </div>
          ) : null}

          {/* The money is the decision, so it gets its own object rather than a
              sentence. Up-front costs only — we never invent what someone would
              earn out there. */}
          {way.detail?.upfront?.length ? (
            <div className="rounded-card border px-4 py-4" style={accentCard(SPECIALTY_ACCENTS[1])}>
              <RowTitle className="mb-1 block text-body">What it costs before you go</RowTitle>
              <div className="mt-3 divide-y divide-white/[0.07]">
                {way.detail.upfront.map((u) => (
                  <div key={u.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <span className="min-w-0">
                      <RowTitle className="block text-label">{u.label}</RowTitle>
                      {u.note ? (
                        <RowMeta className="mt-0.5 block text-micro leading-snug text-white/45">
                          {u.note}
                        </RowMeta>
                      ) : null}
                    </span>
                    <span
                      className="shrink-0 text-label font-semibold"
                      style={{ color: `rgba(${SPECIALTY_ACCENTS[1]},0.95)` }}
                    >
                      {u.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {way.detail?.howItWorks?.length ? (
            <div className="rounded-card border px-4 py-4" style={accentCard(SPECIALTY_ACCENTS[2])}>
              <RowTitle className="mb-3 block text-body">How it actually works</RowTitle>
              <ol className="space-y-3">
                {way.detail.howItWorks.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-chip text-micro font-semibold"
                      style={{
                        background: `rgba(${SPECIALTY_ACCENTS[2]},0.16)`,
                        color: `rgba(${SPECIALTY_ACCENTS[2]},0.95)`,
                      }}
                    >
                      {i + 1}
                    </span>
                    <RowMeta className="block text-label leading-snug text-white/75">{step}</RowMeta>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {/* Countries as a real choice. They differ more than anyone expects,
              and the differences are what decides which one is open to you. */}
          {way.detail?.destinations?.length ? (
            <div className="space-y-3">
              <h2 className="px-1 text-micro font-semibold uppercase tracking-eyebrow text-white/45">
                Where you could go, and how they differ
              </h2>
              {way.detail.destinations.map((d, i) => (
                <div
                  key={d.slug}
                  className="rounded-card border px-4 py-4"
                  style={accentCard(SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length])}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <RowTitle className="block text-body">{d.name}</RowTitle>
                    <span className="shrink-0 text-micro text-white/45">{d.length}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-micro text-white/55">
                    <span>{/^\D/.test(d.ages) ? d.ages : `Ages ${d.ages}`}</span>
                    <span>Needs {d.needs}</span>
                  </div>
                  {d.note ? (
                    <RowMeta className="mt-2 block text-label leading-snug text-white/70">
                      {d.note}
                    </RowMeta>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-label font-medium text-white/80 transition hover:text-white"
                    >
                      Official page
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Link
                      href={`/main/explore/world/${d.slug}`}
                      className="text-label font-medium underline-offset-2 hover:underline"
                      style={{
                        color: `rgba(${SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]},0.92)`,
                      }}
                    >
                      What {d.name} is actually like
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {way.detail?.goodToKnow?.length ? (
            <div className="rounded-card border px-4 py-4" style={accentCard(SPECIALTY_ACCENTS[4])}>
              <RowTitle className="mb-3 block text-body">Worth knowing</RowTitle>
              <ul className="space-y-2">
                {way.detail.goodToKnow.map((g, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-1 shrink-0"
                      style={{ color: `rgba(${SPECIALTY_ACCENTS[4]},0.9)` }}
                    >
                      ✦
                    </span>
                    <RowMeta className="block text-label leading-snug text-white/75">{g}</RowMeta>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {way.scholarship ? (
            <div className="rounded-card border px-4 py-4" style={accentCard(SPECIALTY_ACCENTS[3])}>
              <RowTitle className="mb-1 block text-body">If you can&rsquo;t pay for it</RowTitle>
              <RowMeta className="block text-label leading-snug text-white/75">
                {way.scholarship}
              </RowMeta>
            </div>
          ) : null}

          {!way.detail?.destinations?.length ? (
            <a
              href={way.href}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-between rounded-control border border-white/10 bg-white/[0.03] px-4 py-3 text-label text-white/80 transition hover:border-white/20 hover:text-white"
            >
              <span>Go to {way.name}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
