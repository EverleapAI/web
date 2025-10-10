"use client";

import * as React from "react";
import Link from "next/link";
import BrandBadge from "@/components/site/BrandBadge";

export default function HomePage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = React.useState(true);
  const [videoError, setVideoError] = React.useState(false);

  // Respect prefers-reduced-motion
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotionOk(!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Try to autoplay if allowed
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (motionOk && !videoError) {
      v.muted = true; // required for autoplay
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [motionOk, videoError]);

  return (
    <div className="relative min-h-[100svh] flex flex-col bg-app">
      {/* Background video layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {!videoError && (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            aria-hidden
          >
            <source src="/video/background.mp4" type="video/mp4" />
          </video>
        )}
        {/* Light, top-only scrim so the badge stays readable */}
        <div className="absolute inset-x-0 top-0 h-24 top-scrim pointer-events-none" />
      </div>

      {/* Floating brand badge (replaces full header on Home) */}
      <BrandBadge />

      {/* Center the hero */}
      <main className="relative z-10 flex-1 grid place-items-center px-4">
        <section className="w-full max-w-4xl text-center py-16">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
            Build a future you’re excited about—your pace, your way
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/90 max-w-3xl mx-auto">
            Everleap helps students and supporters explore options, plan paths,
            and make confident, meaningful choices—at their own pace.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <Link
              href="/consent"
              className="inline-flex items-center justify-center rounded-xl bg-[rgb(var(--accent-rgb))] px-5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-black/20 transition-transform hover:opacity-95 active:scale-[0.99]"
            >
              Get started
            </Link>

            {/* Inline, non-intrusive links */}
            <Link
              href="/contact"
              className="text-white/85 hover:text-white underline underline-offset-2 text-sm"
            >
              Questions? Contact us
            </Link>

            {/* New: Already a member? Log In */}
            <p className="text-white/85 text-sm">
              Already a member?{" "}
              <Link
                href="/login"
                className="underline underline-offset-2 hover:text-white"
              >
                Log In
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* No footer on the hero page */}
    </div>
  );
}
