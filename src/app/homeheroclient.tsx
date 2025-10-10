// src/app/homeheroclient.tsx
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = { tosVersion: string };

export default function HomeHeroClient({ tosVersion }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  function setCookie(name: string, value: string, days = 365) {
    const maxAge = days * 24 * 60 * 60;
    const parts = [
      `${name}=${encodeURIComponent(value)}`,
      `Max-Age=${maxAge}`,
      "Path=/",
      "SameSite=Lax",
    ];
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      parts.push("Secure");
    }
    document.cookie = parts.join("; ");
  }

  function agreeAndStart() {
    setCookie("EL_TOS", tosVersion);
    setCookie("EL_Returning", "1");
    setOpen(false);
    router.push("/welcome/");
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src="/video/background.mp4"
        poster="/video/poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Background"
      />
      {/* Reduced-motion fallback */}
      <div className="absolute inset-0 hidden motion-reduce:block bg-[radial-gradient(circle_at_30%_20%,#0b3b2e_0%,#0a0f0e_65%)]" />

      {/* Scrim */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Tiny brand mark */}
      <div className="relative z-10 p-5">
        <div className="inline-flex select-none rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-white/85 backdrop-blur-sm">
          everleap
        </div>
      </div>

      {/* Centered content */}
      <div className="relative z-10 grid min-h-[calc(100svh-56px)] place-items-center px-6 pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="text-4xl md:text-5xl font-semibold text-white/95"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,.6)" }}
          >
            Welcome to Everleap.
          </h1>
          <p
            className="mt-3 text-white/90 text-base md:text-lg"
            style={{ textShadow: "0 3px 18px rgba(0,0,0,.55)" }}
          >
            Explore who you are, what moves you, and what’s ahead. Together, we’ll map a path that
            feels like yours.
          </p>

          <div className="mt-8 flex justify-center">
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <Button className="rounded-xl px-5 py-2.5 text-base shadow-sm bg-white text-black hover:bg-white/90">
                  Start your journey
                </Button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[1000] bg-black/50" />
                <Dialog.Content
                  className="
                    fixed inset-0 z-[1001] m-auto w-[min(92vw,720px)]
                    rounded-2xl border border-white/20 bg-white/90 p-0 backdrop-blur-md shadow-2xl
                  "
                >
                  <div className="border-b px-5 py-4">
                    <Dialog.Title className="text-lg font-semibold">Terms of Service</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-slate-600">
                      I’ll use your contact info to keep your progress safe and help you sign back in.
                      I don’t sell your data.
                    </Dialog.Description>
                  </div>

                  <div className="max-h-[55vh] overflow-auto px-5 py-4 text-sm text-slate-700">
                    <p className="mb-3">
                      Everleap uses your contact information to create and protect your account, save
                      progress, and personalize guidance. You can request deletion at any time.
                    </p>
                    <h3 className="mt-4 font-medium">Summary</h3>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      <li>We store the minimum needed to run your account and recommendations.</li>
                      <li>You control your data and can export or delete it on request.</li>
                      <li>We’ll contact you only for account security or important updates.</li>
                    </ul>
                    <p className="mt-4">
                      By selecting <strong>I Agree</strong>, you accept Everleap’s Terms of Service and
                      Privacy Policy. You may withdraw consent in settings at any time.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t px-5 py-4">
                    <div className="text-xs text-slate-600">
                      <a className="underline hover:no-underline" href="/terms/">
                        Terms
                      </a>
                      <span className="px-1.5 text-slate-400">•</span>
                      <a className="underline hover:no-underline" href="/privacy/">
                        Privacy
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="rounded-lg border bg-white/70 text-slate-900 hover:bg-white"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="rounded-lg bg-black text-white hover:bg-black/90"
                        onClick={agreeAndStart}
                      >
                        I Agree
                      </Button>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>

      {/* Micro-footer */}
      <footer className="relative z-10 px-5 pb-5">
        <div
          className="text-xs text-white/80"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,.55)" }}
        >
          <a className="underline hover:no-underline" href="/privacy/">
            Privacy
          </a>
          <span className="px-1.5">•</span>
          <a className="underline hover:no-underline" href="/terms/">
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}
