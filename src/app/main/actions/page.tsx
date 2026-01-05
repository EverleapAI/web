// src/app/main/actions/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ListChecks, Target, Sparkles } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";

export default function ActionsLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* top padding for your existing header chrome (if any) */}
      <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
              <ListChecks className="h-5 w-5 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-white">
                Turn ideas into steps.
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Actions are small, finite tasks that move a goal forward. Keep
                them easy. Build momentum.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Target className="h-4 w-4" />
              <span>Attach actions to goals (or create a goal later).</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Sparkles className="h-4 w-4" />
              <span>Completing actions improves your insights over time.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/main/actions/list")}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-3 text-xs text-white/50">
            Placeholder-first page (like Guide/Explore). We’ll refine structure
            later.
          </p>
        </div>
      </div>

      <BottomNav activeKey="actions" />
    </div>
  );
}
