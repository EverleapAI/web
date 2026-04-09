"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import AppChrome from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isQuestions = pathname?.startsWith("/main/questions");

  return (
    <AppChrome flushContent={isQuestions}>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className={`min-h-0 flex-1 ${isQuestions ? "" : "pb-[92px]"}`}>
          {children}
        </div>

        {!isQuestions ? <BottomNav /> : null}
      </div>
    </AppChrome>
  );
}