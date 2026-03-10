// src/app/main/explore/components/LaneMediaBreak.tsx
"use client";

import * as React from "react";
import Image from "next/image";

import type { LaneMedia } from "../utils/exploreModel";

export function LaneMediaBreak({
  media,
  dark,
  accentHalo,
}: {
  media?: LaneMedia;
  dark: boolean;
  accentHalo: string;
}) {
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    setImageFailed(false);
  }, [media?.jpg]);

  if (!media?.jpg) return null;

  return (
    <div className="mt-3" style={{ overflowAnchor: "none" }}>
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

        {!imageFailed ? (
          <div className="relative h-[140px] w-full sm:h-[160px] lg:h-[180px]">
            <Image
              src={media.jpg}
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