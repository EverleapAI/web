"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

/* =============================================================================
Helpers
============================================================================= */

function shellSurface(dark: boolean) {
  return dark
    ? "border border-white/10 bg-white/[0.055] backdrop-blur-2xl"
    : "border border-black/10 bg-white/70 backdrop-blur-xl";
}

/* =============================================================================
Play Path Placeholder Page
============================================================================= */

export default function PlayPathPage() {
  const params = useParams();
  const pathId = params?.pathId as string | undefined;

  const dark =
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true;

  return (
    <div className="relative min-h-screen w-full overflow-hidden px-5 pb-28 pt-8">
      {/* Back */}
      <Link
        href="/main/explore/play"
        className="mb-6 inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Play
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Sparkles className="h-4 w-4" />
          Play Path
        </div>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {pathId ? pathId.replace(/-/g, " ") : "Play"}
        </h1>

        <p className="mt-3 max-w-[520px] text-sm opacity-75 leading-relaxed">
          This Play path is being built. Soon this space will explore what it
          feels like to pursue this activity, how people get started, how skills
          grow over time, and where it can lead if you keep going.
        </p>
      </div>

      {/* Coming Soon Card */}
      <section
        className={`rounded-3xl p-6 ${shellSurface(
          dark
        )} shadow-[0_10px_30px_rgba(0,0,0,0.12)]`}
      >
        <h2 className="text-lg font-semibold mb-2">Coming Soon</h2>

        <p className="text-sm opacity-80 leading-relaxed">
          The Play lane is still under construction. Soon you'll be able to
          explore sports, creative pursuits, and skill-based hobbies — from the
          first steps of learning to the deeper path of mastery and community.
        </p>
      </section>
    </div>
  );
}