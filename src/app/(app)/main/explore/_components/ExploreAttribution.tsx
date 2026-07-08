"use client";

// Source attribution for Explore. Two jobs:
//  1. Surface a path's real citations (O*NET, BLS OOH, Wikipedia, …) where the
//     grounded data is actually shown — they live in `path.sources` but were
//     never rendered.
//  2. Carry the standing O*NET Web Services attribution notice required by the
//     U.S. Department of Labor license wherever DOL occupation data appears.
//
// Rendered on Work path detail/section screens (which are grounded in O*NET/BLS)
// and, in a compact form, on the Work landing.

import type { ExplorePath } from "../_data/exploreSchema";

const ONET_NOTICE_URL = "https://services.onetcenter.org/";

/** The DOL-required O*NET attribution line. Always shown where DOL data is used. */
export function OnetNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[10.5px] leading-[1.5] text-white/35 ${className}`}>
      Incorporates information from{" "}
      <a
        href={ONET_NOTICE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/25 underline-offset-2 hover:text-white/55"
      >
        O*NET Web Services
      </a>{" "}
      by the U.S. Department of Labor, Employment and Training Administration
      (USDOL/ETA).
    </p>
  );
}

/**
 * Full attribution block for a path: its cited sources (if any) plus the O*NET
 * notice. `dolLane` (work) always shows the notice; other lanes show it only if
 * an O*NET/BLS source is actually cited.
 */
export function ExploreAttribution({ path }: { path: ExplorePath }) {
  const sources = path.sources ?? [];
  const citesDol = sources.some((s) =>
    /o\*?net|bureau of labor|bls|department of labor/i.test(`${s.source} ${s.label ?? ""}`)
  );
  const showOnetNotice = path.lane === "work" || citesDol;

  if (sources.length === 0 && !showOnetNotice) return null;

  return (
    <div className="mt-2 border-t border-white/[0.06] pt-4">
      {sources.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-white/30">
            Sources
          </span>
          {sources.map((s, i) => {
            const text = s.label ?? s.source;
            return s.url ? (
              <a
                key={`${s.source}-${i}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/55 transition hover:text-white/80"
              >
                {text}
              </a>
            ) : (
              <span
                key={`${s.source}-${i}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/45"
              >
                {text}
              </span>
            );
          })}
        </div>
      ) : null}
      {showOnetNotice ? <OnetNotice className={sources.length > 0 ? "mt-3" : ""} /> : null}
    </div>
  );
}

export default ExploreAttribution;
