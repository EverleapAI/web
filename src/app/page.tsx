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
    <div className="relative flex min-h-[100svh] flex-col bg-app">
      {/* Background video */}
      <div className="pointer-events-none absolute inset-0 z-0">
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

        {/* Top + bottom scrims for readability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 top-scrim" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
      </div>

      <BrandBadge />

      {/* Centered hero card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4">
        <section className="w-full max-w-3xl">
          <div className="w-full rounded-3xl border border-white/12 bg-slate-950/70 px-6 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-md md:px-8 md:py-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
              Everleap · Your guide
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Let&apos;s talk about what&apos;s next for you.
            </h1>

            <p className="mt-4 mx-auto max-w-xl text-sm text-white/85 md:text-base">
              Big dreams start with small conversations. Let’s begin.
            </p>

            <div className="mt-7 flex justify-center md:mt-8">
              <Link
                href="/consent"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition hover:bg-white/10 active:scale-[0.99]"
              >
                Start talking to Everleap
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
