"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter, useSearchParams } from "next/navigation";

import { APP_ROUTES } from "@/regauth/config";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

type OnboardingAnswers = Record<string, string | string[]>;

type OnboardingSynthesis = {
  headline: string;
  body: string;
  signals: string[];
  bridge: string;
};

type MeResponse = {
  ok?: boolean;
  user?: {
    zip_code?: string | null;
  };
};

const loadingMessages = [
  "Looking at the themes across your answers...",
  "Connecting your interests to possible directions...",
  "Finding patterns in what motivates you...",
  "Building your first Everleap insights...",
];

export default function RegAuthDonePage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [synthesis, setSynthesis] =
    React.useState<OnboardingSynthesis | null>(null);

  const [loading, setLoading] = React.useState(true);

  const [turnstileToken, setTurnstileToken] =
    React.useState<string | null>(null);

  const [turnstileError, setTurnstileError] =
    React.useState<string | null>(null);

  const [zipCode, setZipCode] = React.useState<string | null>(null);

  const [loadingIndex, setLoadingIndex] = React.useState(0);

  const synthesisRequestedRef = React.useRef(false);

  const returnTo =
    sanitizeReturnTo(searchParams?.get("returnTo")) || APP_ROUTES.home;

  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/regauth/me", {
          cache: "no-store",
        });

        const data = (await res.json()) as MeResponse;

        if (data?.ok && data?.user?.zip_code) {
          setZipCode(data.user.zip_code);
        }
      } catch {}
    }

    loadUser();
  }, []);

  React.useEffect(() => {
    if (!loading) return;

    const interval = window.setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [loading]);

  React.useEffect(() => {
    async function generateSynthesis() {
      if (!turnstileToken) return;
      if (synthesisRequestedRef.current) return;

      synthesisRequestedRef.current = true;

      try {
        setLoading(true);

        const rawAnswers = window.localStorage.getItem(
          "everleap_onboarding_answers"
        );

        if (!rawAnswers) {
          setLoading(false);
          return;
        }

        const answers = JSON.parse(
          rawAnswers
        ) as OnboardingAnswers;

        const res = await fetch("/api/onboarding/synthesis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            provider: "openai",
            flowKey: "onboarding_v1",
            answers,
            zipCode,
            turnstileToken,
          }),
        });

        const data = await res.json();

        if (data?.ok && data?.synthesis) {
          setSynthesis(data.synthesis);

          try {
            window.localStorage.setItem(
              "everleap_onboarding_synthesis",
              JSON.stringify(data.synthesis)
            );
          } catch {}
        } else {
          synthesisRequestedRef.current = false;
        }
      } catch {
        synthesisRequestedRef.current = false;
      } finally {
        setLoading(false);
      }
    }

    generateSynthesis();
  }, [turnstileToken, zipCode]);

  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-5 pb-12 pt-8 text-white">
      <section className="relative mx-auto flex w-full max-w-[620px] flex-col items-center pt-12 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="w-full"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
              delay: 0.15,
            }}
            className="flex flex-col items-center"
          >
            <div className="relative flex h-[98px] w-[98px] items-center justify-center rounded-full border border-white/35 bg-white/[0.03] shadow-[0_0_30px_rgba(255,255,255,0.07)]">
              <div className="absolute inset-[5px] rounded-full border border-white/10" />

              <Image
                src="/onboarding/icons/badges/1_onboard.png"
                alt="Onboard badge"
                width={62}
                height={62}
                priority
                className="relative z-10 h-[62px] w-[62px] object-contain"
              />
            </div>

            <div className="mt-4 text-[19px] font-semibold tracking-[-0.03em] text-white">
              Onboard
            </div>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: 0.3,
            }}
            className="mx-auto mt-10 max-w-[560px] text-[3rem] font-semibold leading-[0.95] tracking-[-0.075em] text-white sm:text-[3.6rem]"
          >
            We&apos;re already seeing some signals.
          </motion.h1>

          {loading ? (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.5,
                delay: 0.45,
              }}
              className="mt-16 flex flex-col items-center"
            >
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    animate={{
                      opacity: [0.25, 1, 0.25],
                      scale: [0.92, 1.12, 0.92],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: dot * 0.18,
                    }}
                    className="h-2 w-2 rounded-full bg-cyan-300"
                  />
                ))}
              </div>

              <div className="mt-10 max-w-[560px] text-center">
                <div className="text-[1.55rem] font-semibold leading-[1.15] tracking-[-0.045em] text-white">
                  Give us a second, Tom.
                </div>

                <div className="mt-5 text-[18px] leading-[2rem] tracking-[-0.02em] text-white/66">
                  You mentioned volunteering, creativity,
                  and wanting more direction after high school.
                </div>

                <div className="mt-10 h-[36px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loadingIndex}
                      initial={{
                        opacity: 0,
                        y: 14,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -14,
                      }}
                      transition={{
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                      className="text-[17px] tracking-[-0.02em] text-cyan-100/82"
                    >
                      {loadingMessages[loadingIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 text-[17px] leading-[1.95rem] tracking-[-0.02em] text-white/52">
                  Everleap is starting to turn those signals
                  into ideas, paths, and opportunities that
                  may fit you personally.
                </div>
              </div>

              {turnstileSiteKey ? (
                <div className="mt-10 flex justify-center">
                  <Turnstile
                    siteKey={turnstileSiteKey}
                    options={{
                      appearance: "interaction-only",
                    }}
                    onSuccess={(token) => {
                      setTurnstileError(null);
                      setTurnstileToken(token);
                    }}
                    onError={() => {
                      setTurnstileToken(null);

                      setTurnstileError(
                        "Security verification failed. Please try again."
                      );

                      synthesisRequestedRef.current = false;
                    }}
                    onExpire={() => {
                      setTurnstileToken(null);
                      synthesisRequestedRef.current = false;
                    }}
                  />
                </div>
              ) : null}

              {turnstileError ? (
                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {turnstileError}
                </div>
              ) : null}
            </motion.div>
          ) : null}

          {synthesis ? (
            <div className="mt-16 text-left">
              <motion.p
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.65,
                  ease: "easeOut",
                  delay: 0.22,
                }}
                className="max-w-[560px] text-[21px] leading-[2.3rem] tracking-[-0.03em] text-white/82"
              >
                {synthesis.body}
              </motion.p>

              <div className="mt-12 flex flex-col gap-7">
                {synthesis.signals.map((signal, index) => (
                  <motion.div
                    key={signal}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                      delay: 0.42 + index * 0.12,
                    }}
                    className="flex gap-5"
                  >
                    <div className="mt-[13px] h-[5px] w-[5px] shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.85)]" />

                    <div className="text-[17px] leading-8 tracking-[-0.02em] text-white/84">
                      {signal}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                  delay: 0.9,
                }}
                className="mt-14 max-w-[520px] text-[15px] leading-7 tracking-[-0.015em] text-white/46"
              >
                {synthesis.bridge}
              </motion.p>
            </div>
          ) : null}

          {!loading && synthesis ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
                delay: 1,
              }}
              className="mt-16 flex w-full items-center justify-between text-[15px] font-semibold tracking-[-0.02em]"
            >
              <button
                type="button"
                onClick={() => router.back()}
                className="text-white/28 transition hover:text-white/50"
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
            </motion.div>
          ) : null}
        </motion.div>
      </section>
    </main>
  );
}