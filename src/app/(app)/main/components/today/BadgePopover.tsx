"use client";

import * as React from "react";

type BadgePopoverProps = {
  title: string;
  description: string;
};

export function BadgePopover({
  title,
  description,
}: BadgePopoverProps) {
  return (
    <div className="absolute left-1/2 top-[76px] z-20 w-[190px] -translate-x-1/2 rounded-2xl border border-white/12 bg-slate-950/95 px-3 py-3 text-left shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="text-[12px] font-semibold tracking-[-0.01em] text-white">
        {title}
      </div>

      <div className="mt-1 text-[11px] leading-5 text-white/68">
        {description}
      </div>
    </div>
  );
}