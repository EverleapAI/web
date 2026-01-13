"use client";

import * as React from "react";
import Link from "next/link";
import BrandBadge from "@/components/site/BrandBadge";

export default function HomePage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = React.useState(true);
  const [videoError, setVideoError] = React.useState(false);

  // Auth gate (backed by middleware + /api/auth-check).
  // null = checking, false = not authed, true = authed
  const [authed, setAuthed] = React.useState<boolean | null>(null);

  // Respect prefers-reduced-motion
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotionOk(!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Check whether the visitor is already authenticated.
  // IMPORTANT: This requires you to create:
  //   src/app/api/auth-check/route.ts  (simple GET that returns 200 JSON)
  // And to protect the site with middleware Basic Auth.
  React.useEffect(() => {
    let alive = true;

    fetch("/api/auth-check", { cache: "no-store" })
      .then((r) => {
        if (!alive) return;
        setAuthed(r.ok);
      })
      .catch(() => {
        if (!alive) return;
        setAuthed(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  // Try to autoplay if allowed (and if we're not showing the auth overlay)
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // If we’re showing the overlay, we can still let the video run (looks nice),
    // but we’ll pause if reduced motion is requested or video errored.
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
          {/* If NOT authenticated, show a “lock screen” overlay card on top of the video */}
          {authed === false ? (
            <AuthOverlay />
          ) : (
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

              {/* While auth status is still being checked, keep things subtle */}
              {authed === null && (
                <p className="mt-5 text-xs text-white/55">
                  Checking access…
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function AuthOverlay() {
  // NOTE:
  // This UI does NOT handle credentials itself (do NOT put passwords in React).
  // Real protection is done by Basic Auth in middleware (server-side).
  // Clicking Sign in forces a reload; the browser will prompt for username/password.
  return (
    <div className="w-full rounded-3xl border border-white/14 bg-slate-950/75 px-6 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-md md:px-8 md:py-10">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
        Everleap · Private beta
      </p>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Authorized access only
      </h1>

      <p className="mt-4 mx-auto max-w-xl text-sm text-white/80 md:text-base">
        This preview is currently locked. Please sign in to continue.
      </p>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 md:mt-8">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition hover:bg-white/10 active:scale-[0.99]"
        >
          Sign in
        </button>

        <p className="text-xs text-white/55">
          If you don’t see a login prompt, your browser may have cached credentials.
          Try a hard refresh or open a private window.
        </p>
      </div>
    </div>
  );
}
