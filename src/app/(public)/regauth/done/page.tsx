"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { APP_ROUTES } from "@/regauth/config";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

export default function RegAuthDonePage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo =
    sanitizeReturnTo(searchParams?.get("returnTo")) || APP_ROUTES.home;

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-4 pb-8 pt-8 text-white">
      <section className="relative mx-auto flex w-full max-w-md flex-col items-center pt-12 text-center">
        <h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
          Welcome Aboard!
        </h1>

        <div className="mt-9 flex flex-col items-center">
          <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full border border-white/35 bg-white/[0.03] shadow-[0_0_18px_rgba(255,255,255,0.06)]">
            <Image
              src="/onboarding/icons/badges/1_onboard.png"
              alt="Onboard badge"
              width={48}
              height={48}
              priority
              className="h-[48px] w-[48px] object-contain"
            />
          </div>

          <div className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-white">
            Onboard
          </div>
        </div>

        <div className="mt-12 space-y-4 text-left text-[15px] font-medium leading-6 text-white/82">
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
            Continue --&gt;
          </button>
        </div>
      </section>
    </main>
  );
}