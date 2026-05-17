"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { APP_ROUTES } from "@/regauth/config";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";
import RegAuthVisual from "../components/RegAuthVisual";

export default function RegAuthDonePage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo =
    sanitizeReturnTo(searchParams?.get("returnTo")) || APP_ROUTES.home;

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-4 pb-8 pt-8 text-white">
      <div className="relative mx-auto flex w-full max-w-5xl items-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span
            className="relative block h-8 w-8 overflow-hidden rounded-xl ring-1 ring-white/15"
            style={{
              boxShadow: "0 10px 18px rgba(255,120,80,0.16)",
              background:
                "radial-gradient(16px 16px at 35% 35%, rgba(255,236,206,1), rgba(255,168,96,0.98) 48%, rgba(255,96,120,0.88) 78%, rgba(22,16,30,0.25) 100%)",
            }}
          />

          <span className="text-[11px] tracking-[0.26em] text-[#ffd6b2]">
            EVERLEAP
          </span>
        </Link>
      </div>

      <section className="relative mx-auto flex w-full max-w-md flex-col items-center pt-10 text-center">
        <RegAuthVisual kind="welcome" />

        <div className="mt-2 space-y-4">
          <h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
            Welcome Aboard!
          </h1>

          <div className="flex flex-col items-center gap-2">
            <Image
              src="/onboarding/icons/badges/1_onboard.png"
              alt="Onboard badge"
              width={92}
              height={92}
              priority
              className="h-[92px] w-[92px] object-contain"
            />
          </div>

          <div className="space-y-4 text-left text-[15px] leading-6 text-white/72">
            <p>Congratulations! You're already on your way.</p>

            <p>
              You have answered some important questions about where you are and
              where you are headed.
            </p>

            <p>
              This is the first of many accomplishments ahead. You're ready to
              enter Everleap.
            </p>
          </div>
        </div>

        <div className="mt-10 flex w-full items-center justify-between text-[15px] font-semibold tracking-[-0.02em]">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-white/32 transition hover:text-white/55"
          >
            Back.
          </button>

          <button
            type="button"
            onClick={() => router.replace(returnTo)}
            className="text-cyan-200 transition hover:text-cyan-100"
          >
            Enter Everleap --&gt;
          </button>
        </div>
      </section>
    </main>
  );
}