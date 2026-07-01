"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AppChrome from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

const INSIGHTS_TAB_KEYS: Record<string, string> = {
  motivations: "motivations",
  strengths: "strengths",
  skills: "skills",
  funfacts: "fun_facts",
  "fun-facts": "fun_facts",
  fun: "fun_facts",
};

function normalizePageKey(pathname: string, searchParams: URLSearchParams): string {
  if (pathname === "/main" || pathname === "/main/") return "today";

  if (pathname.startsWith("/main/insights")) {
    const rawTab = (
      searchParams.get("tab") ||
      searchParams.get("section") ||
      "summary"
    ).toLowerCase();
    return `insights_${INSIGHTS_TAB_KEYS[rawTab] ?? "summary"}`;
  }

  const section = pathname.split("/").filter(Boolean)[1] ?? "unknown";
  return section.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isQuestions = pathname?.startsWith("/main/questions");

  const searchParamsKey = searchParams?.toString() ?? "";

  React.useEffect(() => {
    if (!pathname) return;

    const pageKey = normalizePageKey(pathname, new URLSearchParams(searchParamsKey));

    fetch("/api/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_key: pageKey, target: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, searchParamsKey]);

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