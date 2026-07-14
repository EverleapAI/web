"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

type Category = "motivations" | "strengths" | "skills";

function normalizeCategory(raw: string | null): Category | null {
  const v = (raw ?? "").toLowerCase().trim();
  if (v === "motivations") return "motivations";
  if (v === "strengths") return "strengths";
  if (v === "skills") return "skills";
  return null;
}

function label(cat: Category) {
  if (cat === "motivations") return "Motivations";
  if (cat === "strengths") return "Strengths";
  return "Skills";
}

// Only allow internal redirects.
function safeNext(raw: string | null): string {
  const v = (raw ?? "").trim();
  if (!v) return "/main";
  if (!v.startsWith("/")) return "/main";
  if (v.startsWith("//")) return "/main";
  return v;
}

function extractCatFromNext(next: string): Category | null {
  // expects something like /main/questions?cat=motivations&returnTo=%2Fmain
  try {
    const url = new URL(next, "http://local");
    return normalizeCategory(url.searchParams.get("cat"));
  } catch {
    return null;
  }
}

export default function ReadyPage(): React.JSX.Element {
  const router = useRouter();
  const params = useSearchParams();

  const next = safeNext(params?.get("next"));
  const cat = extractCatFromNext(next);

  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const t1 = window.setTimeout(() => setReady(true), 650);
    const t2 = window.setTimeout(() => router.replace(next), 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [next, router]);

  const headline = cat ? `One quick section: ${label(cat)}.` : "One quick thing.";
  const sub =
    cat === "motivations"
      ? "These help Everleap understand what energizes you, what drains you, and what actually fits your day-to-day."
      : cat === "strengths"
        ? "These help Everleap see where you naturally shine — so it can recommend paths that will actually use your strengths."
        : cat === "skills"
          ? "These help Everleap shape practical next steps — not overwhelming goals — built around momentum."
          : "A few short questions help Everleap get specific instead of generic.";

  return (
    <main className="min-h-[70svh] px-6 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="rounded-card border border-white/10 bg-white/[0.014] backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.62)] p-7 md:p-9"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-card"
            style={{
              background:
                "radial-gradient(900px 520px at 20% 10%, rgba(90,145,255,0.20), transparent 60%)," +
                "radial-gradient(900px 520px at 72% 20%, rgba(125,211,252,0.14), transparent 64%)," +
                "radial-gradient(900px 520px at 60% 92%, rgba(255,180,120,0.18), transparent 64%)," +
                "radial-gradient(120% 120% at 50% 50%, transparent 0%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0.70) 100%)",
              opacity: 0.9,
            }}
          />

          <div className="relative">
            <div className="text-micro tracking-eyebrow text-white/70">EVERLEAP</div>

            <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-white">
              {headline}
            </h1>

            <p className="mt-4 max-w-[62ch] text-label leading-7 text-white/70">
              {sub}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.replace(next)}
                className="h-11 rounded-2xl bg-white text-black px-5 font-semibold hover:bg-white/95 active:scale-[0.99] transition"
              >
                Continue now
              </button>

              <div className="text-sm text-white/55">
                {ready ? "Redirecting…" : "One second…"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}