// apps/web/src/app/(app)/main/explore/_components/ExploreLanding.tsx
//
// The single, reskinned landing engine for every Explore lane.
// Consumes unified ExplorePath[] + the shared profile/scorer.
// Styled on the site's SectionCard system (opaque navy, white/10 borders,
// one muted lane tone, small monochrome constellation) — not the old glass.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { ReadAtmosphere } from "../../components/ui/ReadAtmosphere";
import { HEADING_CLASS, HEADING_STYLE, PROSE_CLASS, PROSE_STYLE } from "@/lib/ui/prose";
import { CardBody, CardTitle } from "@/lib/ui/card";
import { LANE_ACCENT, laneAccent, type ExplorePath, type Lane } from "../_data/exploreSchema";
import { useExploreProfile, type UserProfileSignals } from "../_lib/exploreProfile";
import { rankPaths } from "../_lib/scorePath";
import { LANE_ICON, LANE_WORD, rgba } from "./exploreUi";
import { OnetNotice } from "./ExploreAttribution";

function getIntro(
  lane: Lane,
  profile: Pick<UserProfileSignals, "firstName" | "hasQuestionSignal"> | null
) {
  const laneWord = LANE_WORD[lane];
  if (!profile || !profile.hasQuestionSignal) {
    return {
      title: "This is where your signal becomes real paths.",
      body: `Explore turns what Everleap is picking up about you into ${laneWord} you can test and compare — but there isn't enough signal yet to make this page sharp. Answer a few quick questions and it changes immediately.`,
      cta: {
        href: `/main/questions?returnTo=/main/explore/${lane}`,
        label: "Start with a few quick questions",
      },
    };
  }
  const name = profile.firstName;
  return {
    title: name ? `${name}, here's what's worth exploring.` : "Here's what's worth exploring.",
    body: `These come from the signal Everleap is already reading in what you answer and lean toward — turned into ${laneWord} worth testing for real.`,
    cta: null,
  };
}

function PathCard({ path }: { path: ExplorePath }) {
  const accent = laneAccent(path);
  const Icon = LANE_ICON[path.lane];
  const href = `/main/explore/${path.lane}/${path.slug}`;

  return (
    <SectionCard tone="neutral" compact>
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
          style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.92) }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <CardTitle as="h2">{path.card.title}</CardTitle>
          {path.brightOutlook ? (
            <span
              className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-micro font-semibold"
              style={{
                color: "rgb(120,220,170)",
                backgroundColor: "rgba(55,211,160,0.12)",
                border: "1px solid rgba(55,211,160,0.4)",
              }}
            >
              <TrendingUp className="h-3 w-3" />
              Bright Outlook
            </span>
          ) : null}
        </div>
      </div>

      <CardBody className="mt-3">
        {path.card.hook} {path.card.description}
      </CardBody>

      <Link
        href={href}
        className="group mt-4 inline-flex items-center gap-2 text-label font-semibold text-white/85 transition hover:text-white"
      >
        <span>Open {path.card.title}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </SectionCard>
  );
}

export function ExploreLanding({
  lane,
  paths,
  serverRanked = false,
}: {
  lane: Lane;
  paths: ExplorePath[];
  // When true, `paths` are already ranked and personalized server-side (the Work
  // career-match layer) — render them in order and skip the client keyword scorer.
  serverRanked?: boolean;
}) {
  const { profile, isReady } = useExploreProfile();

  const deck = React.useMemo(() => {
    if (serverRanked) return paths.slice(0, 8).map((path) => ({ path }));
    if (!profile) return [];
    return rankPaths(paths, profile, 4);
  }, [paths, profile, serverRanked]);

  if (!isReady) return null;

  const hasServerDeck = serverRanked && paths.length > 0;
  const introProfile = hasServerDeck
    ? { firstName: profile?.firstName ?? null, hasQuestionSignal: true }
    : profile;
  const intro = getIntro(lane, introProfile);
  const showDeck = hasServerDeck || (!serverRanked && Boolean(profile?.hasQuestionSignal));

  return (
    <div className="space-y-4">
      <SectionCard tone="hero" voice backdrop={<ReadAtmosphere seed={`lane:${lane}`} accent={LANE_ACCENT[lane]} />}>
        <div className="relative max-w-2xl">
          <AgenticHeader
            glyph={
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-cyan-300/[0.08] text-cyan-200/75 ring-1 ring-cyan-300/[0.18]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            }
            eyebrow="Explore"
            accentRgb="92, 180, 255"
          />
          <h1 className={HEADING_CLASS} style={HEADING_STYLE}>
            {intro.title}
          </h1>
          <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>{intro.body}</p>
          {intro.cta ? (
            <Link
              href={intro.cta.href}
              className="group mt-4 inline-flex items-center gap-1.5 text-label font-medium text-white/82 transition hover:text-white"
            >
              <span>{intro.cta.label}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      </SectionCard>

      {showDeck ? (
        <div className="space-y-4">
          {deck.map(({ path }) => (
            <PathCard key={path.id} path={path} />
          ))}
          {paths.length === 0 ? (
            <SectionCard tone="neutral" compact>
              <p className="text-label text-white/64">No {lane} paths are registered yet.</p>
            </SectionCard>
          ) : null}
        </div>
      ) : null}

      {/* Career data on this lane is grounded in U.S. Dept. of Labor sources. */}
      {lane === "work" ? <OnetNotice className="px-1 pt-2" /> : null}
    </div>
  );
}

export default ExploreLanding;
