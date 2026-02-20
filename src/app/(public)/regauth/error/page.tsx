// src/app/(public)/regauth/error/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { REGAUTH_ROUTES } from "@/regauth/config";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

function messageFor(code: string | null): { title: string; body: string } {
  switch (code) {
    case "network_error":
      return {
        title: "Connection issue",
        body: "We couldn’t reach the server. Check your connection and try again.",
      };
    case "invalid_code":
      return {
        title: "That code didn’t work",
        body: "Double-check the digits and try again.",
      };
    case "rate_limited":
      return {
        title: "Too many attempts",
        body: "Give it a moment, then try again.",
      };
    default:
      return {
        title: "Something went wrong",
        body: "Try again. If this keeps happening, come back in a few minutes.",
      };
  }
}

export default function RegAuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams?.get("code");
  const returnTo = sanitizeReturnTo(searchParams?.get("returnTo"));
  const { title, body } = messageFor(code);

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
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-neutral-300">{body}</p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() =>
            router.replace(`${REGAUTH_ROUTES.entry}?returnTo=${encodeURIComponent(returnTo)}`)
          }
          className="w-full rounded-2xl bg-white text-neutral-900 px-4 py-3 text-sm font-medium tracking-tight"
        >
          Back to sign in
        </button>

        <button
          type="button"
          onClick={() => router.replace(returnTo)}
          className="w-full rounded-2xl bg-white/10 text-neutral-100 px-4 py-3 text-sm font-medium tracking-tight border border-white/10"
        >
          Try returning
        </button>
      </div>
    </motion.div>
  );
}
