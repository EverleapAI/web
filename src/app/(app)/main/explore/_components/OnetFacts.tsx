"use client";

// "What the data says" — the real, source-grounded O*NET facts for a Work path,
// attached server-side to the served path (see everleap-api onetCache.ts) and
// rendered on the Work detail essentials screen. Distinct from the AI-synthesized
// narrative: these are structured U.S. Dept. of Labor facts (Bright Outlook, job
// zone / education, day-to-day tasks, skills & knowledge, related careers), so a
// teen sees hard signal, not just prose. Attribution is carried by
// ExploreAttribution elsewhere on the screen.

import { TrendingUp, GraduationCap, ExternalLink } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import type { Rgb } from "../_data/exploreSchema";
import { rgba } from "./exploreUi";
import { CardTitle } from "@/lib/ui/card";

export type OnetDetail = {
  code: string;
  soc: string;
  title: string;
  brightOutlook: boolean;
  jobZone: { code: number; title: string; education: string } | null;
  tasks: string[];
  skills: string[];
  knowledge: string[];
  interests: string[];
  related: { title: string; url: string }[];
  sourceUrl: string;
};

function Chips({ items, accent }: { items: string[]; accent: Rgb }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border px-2.5 py-1 text-meta text-white/72"
          style={{ borderColor: rgba(accent, 0.28), backgroundColor: rgba(accent, 0.08) }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-micro font-semibold uppercase tracking-eyebrow text-white/40">
        {label}
      </div>
      {children}
    </div>
  );
}

export function OnetFacts({ onet, accent }: { onet: OnetDetail; accent: Rgb }) {
  const hasBody =
    onet.brightOutlook ||
    onet.jobZone ||
    onet.interests.length ||
    onet.tasks.length ||
    onet.skills.length ||
    onet.knowledge.length ||
    onet.related.length;
  if (!hasBody) return null;

  return (
    <SectionCard tone="neutral">
      <div className="flex items-center justify-between gap-3">
        <CardTitle as="h2">What the data says</CardTitle>
        {onet.brightOutlook ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-micro font-semibold"
            style={{
              color: "rgb(120,220,170)",
              backgroundColor: "rgba(55,211,160,0.12)",
              border: "1px solid rgba(55,211,160,0.4)",
            }}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Bright Outlook
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-5">
        {onet.jobZone ? (
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full"
              style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.95) }}
            >
              <GraduationCap className="h-4 w-4" />
            </span>
            <div>
              <div className="text-meta font-medium text-white/90">{onet.jobZone.title}</div>
              <div className="mt-0.5 text-meta leading-body text-white/55">
                {onet.jobZone.education}
              </div>
            </div>
          </div>
        ) : null}

        {onet.interests.length ? (
          <Block label="Who tends to thrive here">
            <Chips items={onet.interests.slice(0, 3)} accent={accent} />
          </Block>
        ) : null}

        {onet.tasks.length ? (
          <Block label="What they actually do">
            <ul className="space-y-1.5">
              {onet.tasks.slice(0, 6).map((t) => (
                <li key={t} className="flex gap-2.5 text-meta leading-body text-white/75">
                  <span
                    className="mt-[8px] h-1.5 w-1.5 flex-none rounded-full"
                    style={{ backgroundColor: rgba(accent, 0.85) }}
                  />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {onet.skills.length ? (
          <Block label="Top skills">
            <Chips items={onet.skills} accent={accent} />
          </Block>
        ) : null}

        {onet.knowledge.length ? (
          <Block label="Knowledge areas">
            <Chips items={onet.knowledge} accent={accent} />
          </Block>
        ) : null}

        {onet.related.length ? (
          <Block label="Related careers">
            <div className="flex flex-wrap gap-1.5">
              {onet.related.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-meta text-white/65 transition hover:text-white/90"
                >
                  {r.title}
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              ))}
            </div>
          </Block>
        ) : null}
      </div>
    </SectionCard>
  );
}

export default OnetFacts;
