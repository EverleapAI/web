"use client";

import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-app relative flex flex-col">
      {/* optional subtle scrim */}
      <div className="absolute inset-0 tint-scrim" />

      <div className="relative z-10 flex-1 flex flex-col">
        <SiteHeader />

        {/* Vertically centered between header/footer */}
        <main className="flex-1 grid place-items-center px-4 py-10">
          <section className="w-full max-w-lg rounded-2xl card-surface ring-1 ring-black/5 shadow-sm p-6 text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight drop-shadow-sm">
              Page not found
            </h1>
            <p className="text-sm opacity-80">
              We couldn’t find what you were looking for.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="flex-1 rounded-xl bg-tint/90 px-4 py-3 text-sm font-semibold text-white text-center shadow-sm ring-1 ring-black/5 transition-transform hover:bg-tint active:scale-[0.99]"
              >
                Go home
              </Link>
              <Link
                href="/contact"
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-center shadow-sm ring-1 ring-black/10 bg-white/90 transition-transform hover:bg-white active:scale-[0.99]"
              >
                Contact us
              </Link>
            </div>

            <p className="text-[11px] opacity-70">
              If you entered a URL, check the spelling and try again.
            </p>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
