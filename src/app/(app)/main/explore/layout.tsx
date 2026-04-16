// src/app/(app)/main/explore/layout.tsx
"use client";

import * as React from "react";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-1 pt-2 pb-24 sm:px-1.5 lg:px-2">
      {children}
    </div>
  );
}