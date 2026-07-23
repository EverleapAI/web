"use client";

import * as React from "react";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No lane rail. Home leads with the five "worlds" grid, which is itself the
  // lane picker, and every lane page owns a "Back to Explore" link the way the
  // Insights sub-pages do — so you travel between worlds rather than clicking
  // tabs above them.
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[720px] flex-1 flex-col px-[4px] pb-24 pt-2">
      {children}
    </div>
  );
}
