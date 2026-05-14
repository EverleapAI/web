"use client";

import * as React from "react";

import AppChrome from "@/components/site/AppChrome";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppChrome flushContent>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#040817] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.06),transparent_34%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(168,85,247,0.06),transparent_28%)]" />

          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#040817] via-[#040817]/92 to-transparent" />
        </div>

        <div className="relative min-h-0 flex-1">
          {children}
        </div>
      </div>
    </AppChrome>
  );
}