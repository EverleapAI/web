"use client";

import Link from "next/link";

export function OnboardingFooterNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between border-t border-white/10 bg-slate-950/70 px-4 py-3 text-xs text-slate-400 backdrop-blur-xl md:px-8">
      {/* Left side: Everleap wordmark */}
      <div className="font-medium tracking-wide text-slate-300">
        Everleap
      </div>

      {/* Right side: simple footer links */}
      <div className="flex items-center gap-4">
        <Link
          href="/privacy"
          className="transition hover:text-slate-200"
        >
          Privacy
        </Link>

        <Link
          href="/terms"
          className="transition hover:text-slate-200"
        >
          Terms
        </Link>

        <Link
          href="/contact"
          className="transition hover:text-slate-200"
        >
          Contact
        </Link>

        <Link
          href="/accessibility"
          className="transition hover:text-slate-200"
        >
          Accessibility
        </Link>
      </div>
    </nav>
  );
}

export default OnboardingFooterNav;
