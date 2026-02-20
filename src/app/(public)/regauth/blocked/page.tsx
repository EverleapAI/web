// src/app/(public)/regauth/blocked/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { REGAUTH_ROUTES } from "@/regauth/config";

export default function RegAuthBlockedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = searchParams?.get("returnTo") || "/main";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.18em] text-neutral-400">
          RegAuth
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Sign in to continue
        </h1>
        <p className="mt-2 text-sm text-neutral-300">
          You need an account to access this area.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => router.push(`${REGAUTH_ROUTES.entry}?returnTo=${encodeURIComponent(returnTo)}`)}
          className="w-full rounded-2xl bg-white text-neutral-900 px-4 py-3 text-sm font-medium tracking-tight"
        >
          Continue
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full rounded-2xl bg-white/10 text-neutral-100 px-4 py-3 text-sm font-medium tracking-tight"
        >
          Go back
        </button>
      </div>
    </motion.div>
  );
}
