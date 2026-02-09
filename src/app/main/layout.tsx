// src/app/main/layout.tsx
"use client";

import * as React from "react";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[100svh]">
      {children}
      <BottomNav />
    </div>
  );
}
