"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
    }, 2200);

    return () => window.clearInterval(interval);
  }, [loading]);

  React.useEffect(() => {
    async function generateSynthesis() {
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

        const answers = JSON.parse(rawAnswers) as OnboardingAnswers;

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
  }, [zipCode]);

  const progress = loading
    ? Math.min(92, 18 + loadingIndex * 22)
    : 100;

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-5 pb-12 pt-8 text-white">
      <section className="relative mx-auto flex w-full max-w-[720px] flex-col items-center pt-10 text-center">
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
              delay: 0.1,
            }}
            className="flex flex-col items-center"
          >
            <div className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full border border-white/35 bg-white/[0.03] shadow-[0_0_34px_rgba(103,232,249,0.08)]">
              <div className="absolute inset-[5px] rounded-full border border-white/10" />

              <Image
                src="/onboarding/icons/badges/1_onboard.png"
                alt="Onboard badge"
                width={66}
                height={66}
                priority
                className="relative z-10 h-[66px] w-[66px] object-contain"
              />
            </div>

            <div className="mt-4 text-[20px] font-semibold tracking-[-0.035em] text-white">
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
              delay: 0.22,
            }}
            className="mx-auto mt-10 max-w-[620px] text-[3.15rem] font-semibold leading-[0.95] tracking-[-0.078em] text-white sm:text-[3.85rem]"
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
                delay: 0.35,
              }}
              className="mt-10 flex flex-col items-center"
            >
              <p className="mx-auto max-w-[620px] text-[20px] leading-8 tracking-[-0.025em] text-white/72">
                I&apos;m putting your answers together so I can get a clearer
                picture of what motivates you and where you might thrive.
              </p>

              <div className="mt-10 w-full max-w-[620px]">
                <div className="relative h-[42px]">
                  <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/12" />

                  <motion.div
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: "easeOut",
                    }}
                    className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.65)]"
                  />

                  <motion.div
                    animate={{
                      left: `${progress}%`,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: "easeOut",
                    }}
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.95)]"
                  />

                  <div className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-200/45 bg-cyan-300/12 shadow-[0_0_24px_rgba(103,232,249,0.25)]">
                    <motion.div
                      animate={{
                        scale: [0.9, 1.12, 0.9],
                        opacity: [0.55, 1, 0.55],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="h-2.5 w-2.5 rounded-full bg-cyan-200"
                    />
                  </div>

                  <div className="absolute right-0 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border border-white/18 bg-white/[0.02]" />
                </div>

                <div className="mt-4 min-h-[28px] text-[17px] tracking-[-0.02em] text-cyan-100/88">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loadingIndex}
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -12,
                      }}
                      transition={{
                        duration: 0.42,
                        ease: "easeOut",
                      }}
                    >
                      {loadingMessages[loadingIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  delay: 0.65,
                  ease: "easeOut",
                }}
                className="mt-8 max-w-[560px] rounded-[26px] border border-white/10 bg-white/[0.035] px-6 py-6 text-left shadow-[0_0_30px_rgba(0,0,0,0.18)]"
              >
                <div className="flex gap-4">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-orange-300 to-pink-500 shadow-[0_0_18px_rgba(251,146,60,0.35)]" />

                  <div className="space-y-5 text-[18px] leading-8 tracking-[-0.022em] text-white/78">
                    <p>
                      So far, I&apos;m seeing that you care about making a
                      positive impact and you come alive around creativity,
                      performing, and expressing yourself.
                    </p>

                    <p>
                      That&apos;s a promising combination. I&apos;m taking a
                      moment to shape this into something useful.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="mt-8 text-[15px] leading-6 tracking-[-0.015em] text-white/38">
                This usually takes less than 10 seconds.
              </div>
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
                className="max-w-[620px] text-[22px] leading-[2.35rem] tracking-[-0.032em] text-white/84"
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
                className="mt-14 max-w-[560px] text-[15px] leading-7 tracking-[-0.015em] text-white/46"
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
              className="mt-16 flex w-full items-center justify-between text-[16px] font-semibold tracking-[-0.02em]"
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