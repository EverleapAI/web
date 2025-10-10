"use client";

import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />

      {/* Vertically centered between header/footer + soft spotlight */}
      <main className="flex-1 grid place-items-center px-4 py-10 spotlight-white">
        <div className="w-full max-w-lg">
          <section className="card-surface rounded-2xl">
            <form
              className="space-y-4 p-5"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! This is a stub. Wire this to your API or email next.");
              }}
            >
              <h1 className="text-2xl font-semibold tracking-tight">
                Contact Everleap
              </h1>

              <p className="text-sm opacity-80">
                Have a question or need a hand? Send us a note and we’ll get back to you.
              </p>

              <div>
                <label className="sr-only" htmlFor="name">Your name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name — e.g. Jordan"
                  autoComplete="name"
                  className="w-full rounded-xl border border-[color:var(--hairline)] bg-white px-3 py-3 outline-none placeholder:opacity-60 focus:ring-2 focus:ring-[rgb(var(--accent-rgb))]/40"
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email — e.g. you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[color:var(--hairline)] bg-white px-3 py-3 outline-none placeholder:opacity-60 focus:ring-2 focus:ring-[rgb(var(--accent-rgb))]/40"
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="message">How can we help?</label>
                <textarea
                  id="message"
                  placeholder="How can we help?"
                  rows={5}
                  className="w-full rounded-xl border border-[color:var(--hairline)] bg-white px-3 py-3 outline-none placeholder:opacity-60 focus:ring-2 focus:ring-[rgb(var(--accent-rgb))]/40"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Send message
              </button>

              <div className="pt-2 text-center text-xs opacity-70">
                Or email us at{" "}
                <Link
                  href="mailto:info@everleap.demoland.site"
                  className="underline underline-offset-2"
                >
                  info@everleap.demoland.site
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
