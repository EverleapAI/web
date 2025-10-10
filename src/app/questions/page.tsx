// apps/web/app/questions/page.tsx
"use client";

import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ProgressBar from "@/components/site/ProgressBar";

export default function QuestionsStartPage() {
  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />

      {/* Vertically centered between header/footer + spotlight */}
      <main className="flex-1 grid place-items-center px-4 py-10 spotlight-white">
        <div className="w-full max-w-lg">
          <div className="mb-4">
            <ProgressBar value={0} />
          </div>

          <section
            className="space-y-5"
            role="region"
            aria-labelledby="qs-start-title"
          >
            <h1 id="qs-start-title" className="text-2xl font-semibold tracking-tight">
              Let’s begin with a few quick questions
            </h1>
            <p className="text-sm opacity-80">
              Answer at your own pace. You can change your answers anytime.
            </p>

            <div className="card-surface rounded-2xl p-4 space-y-3">
              <p className="text-sm opacity-80">
                We’ll start with what drives you, then move into strengths and style.
              </p>
              <div className="flex gap-3">
                <Link href="/questions/first" className="btn-primary flex-1">
                  Begin now
                </Link>
                <Link href="/dashboard" className="btn-muted flex-1">
                  Back to dashboard
                </Link>
              </div>
              <p className="text:[11px] opacity-70">
                Tip: you can use the mic on supported devices.
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
