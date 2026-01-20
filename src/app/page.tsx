"use client";

import * as React from "react";
import Link from "next/link";
import BrandBadge from "@/components/site/BrandBadge";

type HeroVariant = "boy" | "girl";

const HERO_VARIANTS: { key: HeroVariant; src: string }[] = [
  { key: "boy", src: "/video/homeBoy.mp4" },
  { key: "girl", src: "/video/homeGirl.mp4" },
];

function pickHeroVariant(): HeroVariant {
  return Math.random() < 0.5 ? "boy" : "girl";
}

export default function HomePage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = React.useState(false);

  // Hydration-safe: don't randomize during SSR. Pick once after mount.
  const [hero, setHero] = React.useState<HeroVariant | null>(null);
  React.useEffect(() => {
    setHero(pickHeroVariant());
  }, []);

  // Auth gate (backed by middleware + /api/auth-check).
  // null = checking, false = not authed, true = authed
  const [authed, setAuthed] = React.useState<boolean | null>(null);

  const heroSrc =
    HERO_VARIANTS.find((h) => h.key === hero)?.src ?? HERO_VARIANTS[0].src;

  // Check whether the visitor is already authenticated
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

  // Autoplay attempt (best-effort).
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!videoError && hero) {
      v.muted = true;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [videoError, hero]);

  const shouldRenderVideo = !videoError && hero !== null;

  // Mobile reframing (gentle). We'll rely more on the card moving aside.
  const objectPos =
    hero === "boy"
      ? "object-[30%_45%]"
      : hero === "girl"
        ? "object-[70%_45%]"
        : "";

  // Mobile: dock the card away from the subject so they stay visible.
  // - Boy is typically left → card right (ml-auto)
  // - Girl is typically right → card left (mr-auto)
  const mobileCardSideClass =
    hero === "boy" ? "ml-auto" : hero === "girl" ? "mr-auto" : "mx-auto";

  return (
    <div className="relative flex min-h-[100svh] flex-col bg-app">
      {/* Background video */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {shouldRenderVideo && (
          <video
            key={hero}
            ref={videoRef}
            className={[
              "h-full w-full object-cover",
              objectPos,
              "md:object-center",
              // Respect reduced motion without JS
              "motion-reduce:hidden",
            ]
              .filter(Boolean)
              .join(" ")}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            aria-hidden
          >
            <source src={heroSrc} type="video/mp4" />
          </video>
        )}

        {/* Reduced-motion fallback (no motion). */}
        <div className="absolute inset-0 hidden motion-reduce:block">
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/65" />
        </div>

        {/* Top + bottom scrims for readability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 top-scrim" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
      </div>

      <BrandBadge />

      {/* Hero card: mobile bottom + side-docked; md+ centered */}
      <main className="relative z-10 flex flex-1 items-end justify-center px-4 pb-14 md:items-center md:pb-0">
        <section className="w-full max-w-3xl">
          {authed === false ? (
            <AuthOverlay />
          ) : (
            <div
              className={[
                // Mobile: narrower and side-docked so we don't cover the subject
                "w-full max-w-[26rem]",
                mobileCardSideClass,
                // md+: go back to centered, full-width within max-w-3xl
                "md:mx-auto md:max-w-none",
                // Card styling
                "rounded-3xl border border-white/10 bg-slate-950/58 px-6 py-7 text-center",
                "shadow-[0_18px_70px_rgba(0,0,0,0.72)] backdrop-blur-lg",
                "md:px-8 md:py-10",
              ].join(" ")}
            >
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
                  className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-white/15 backdrop-blur-sm transition hover:-translate-y-[1px] hover:bg-white/14 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
                >
                  Start talking
                </Link>
              </div>

              {authed === null && (
                <p className="mt-5 text-xs text-white/55">Checking access…</p>
              )}
            </div>
          )}
        </section>
      </main>
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
          className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition hover:bg-white/10 active:scale-[0.99]"
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
