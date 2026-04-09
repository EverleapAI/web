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
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          {children}
        </div>
      </div>
    </AppChrome>
  );
}