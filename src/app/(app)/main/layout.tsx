// src/app/(app)/main/layout.tsx
"use client";

import * as React from "react";
import AppChrome from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppChrome>
      <div className="relative min-h-[100svh] flex flex-col">
        {/* Main content (pad bottom so BottomNav doesn't cover it) */}
        <div className="flex-1 pb-[92px]">{children}</div>

        {/* Logged-in "footer" */}
        <BottomNav />
      </div>
    </AppChrome>
  );
}