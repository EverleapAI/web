"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import BrandBadge from "@/components/site/BrandBadge";

export default function HomePage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [videoError, setVideoError] = React.useState(false);
  const [videoReady, setVideoReady] = React.useState(false);

  // Breakpoint detector (md = 768px)
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Auth gate
  const [authed, setAuthed] = React.useState<boolean | null>(null);

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

  // Autoplay attempt (iOS friendly)
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!videoError) {
      v.muted = true;

      const tryPlay = () => v.play().catch(() => {});

      tryPlay();

      const onMeta = () => {
        setVideoReady(true);
        tryPlay();
      };

      v.addEventListener("loadedmetadata", onMeta);
      return () => v.removeEventListener("loadedmetadata", onMeta);
    }

    v.pause();
  }, [videoError]);

  const shouldRenderVideo = !videoError;

  // Mobile crop (approved)
  const mobileObjectPosition = "18% 52%";
  const effectiveObjectPosition = isDesktop ? "50% 50%" : mobileObjectPosition;

  return (
    <div className="relative flex min-h-[100svh] flex-col bg-app">
      {/* ===== BACKGROUND LAYER ===== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Poster */}
        <Image
          src="/video/home.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: effectiveObjectPosition }}
        />

        {/* Video with WebM + MP4 fallback (Safari-safe) */}
        {shouldRenderVideo && (
          <video
            ref={videoRef}
            poster="/video/home.jpg"
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              videoReady ? "opacity-100" : "opacity-0",
              "motion-reduce:hidden",
            ].join(" ")}
            style={{ objectPosition: effectiveObjectPosition }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={() => setVideoReady(true)}
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoError(true)}
            aria-hidden
          >
            <source src="/video/home.webm" type="video/webm" />
            <source src="/video/home.mp4" type="video/mp4" />
          </video>
        )}

        {/* Reduced-motion overlay */}
        <div className="absolute inset-0 hidden motion-reduce:block">
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/65" />
        </div>

        {/* Scrims */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 top-scrim" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/80 via-black/45 to-transparent md:h-64" />
      </div>

      <BrandBadge />

      {/* ===== CONTENT ===== */}
      <main className="relative z-10 flex flex-1 flex-col">
        {/* Desktop/tablet centered card */}
        <div className="hidden flex-1 items-center justify-center px-4 md:flex">
          <section className="w-full max-w-3xl">
            {authed === false ? (
              <AuthOverlay />
            ) : (
              <DesktopHeroCard authed={authed} />
            )}
          </section>
        </div>

        {/* Mobile bottom sheet */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 md:hidden">
          <section className="pointer-events-auto px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
            {authed === false ? (
              <AuthOverlay />
            ) : (
              <MobileBottomSheet authed={authed} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---- cards unchanged ---- */

function DesktopHeroCard({ authed }: { authed: boolean | null }) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-slate-950/58 px-6 py-7 text-center shadow-[0_18px_70px_rgba(0,0,0,0.72)] backdrop-blur-lg md:px-8 md:py-10">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
        Everleap · figure stuff out
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
        Understand yourself. Explore what fits.
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 md:text-base">
        Big dreams start with small conversations. Let’s begin.
      </p>

      <div className="mt-7 flex justify-center md:mt-8">
        <Link
          href="/consent"
          className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-white/15 backdrop-blur-sm transition hover:-translate-y-[1px] hover:bg-white/14 active:scale-[0.99]"
        >
          Start talking
        </Link>
      </div>

      {authed === null && (
        <p className="mt-5 text-xs text-white/55">Checking access…</p>
      )}
    </div>
  );
}

function MobileBottomSheet({ authed }: { authed: boolean | null }) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-5 text-center shadow-[0_16px_60px_rgba(0,0,0,0.7)] backdrop-blur-lg">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sky-200/80">
        Everleap · figure stuff out
      </p>

      <h1 className="mt-2.5 text-2xl font-semibold tracking-tight text-white">
        Understand yourself. Explore what fits.
      </h1>

      <p className="mx-auto mt-3 max-w-[26rem] text-sm text-white/85">
        Big dreams start with small conversations. Let’s begin.
      </p>

      <div className="mt-5 flex justify-center">
        <Link
          href="/consent"
          className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-white/15 backdrop-blur-sm active:scale-[0.99]"
        >
          Start talking
        </Link>
      </div>

      {authed === null && (
        <p className="mt-4 text-xs text-white/55">Checking access…</p>
      )}
    </div>
  );
}

function AuthOverlay() {
  return (
    <div className="w-full rounded-3xl border border-white/14 bg-slate-950/75 px-6 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-md md:px-8 md:py-10">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
        Everleap · Private beta
      </p>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Authorized access only
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 md:text-base">
        This preview is currently locked. Please sign in to continue.
      </p>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 md:mt-8">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm hover:bg-white/10 active:scale-[0.99]"
        >
          Sign in
        </button>

        <p className="text-xs text-white/55">
          If you don’t see a login prompt, your browser may have cached
          credentials. Try a hard refresh or open a private window.
        </p>
      </div>
    </div>
  );
}
