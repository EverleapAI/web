"use client";

// The post-onboarding narrated intro — the app's first "I heard you" moment.
// Plays a short mission crawl while the onboarding synthesis generates in the
// background, then dissolves into the personalized read as the payoff. Runs
// exactly once (server-side claim-once), is skippable, respects reduced motion,
// and never traps: if the synthesis isn't ready within 15s it proceeds on a warm
// fallback line.

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { AskHero, CoachLine, StepEyebrow } from "@/lib/ui/coach";
import { Fireworks } from "../components/interstitial/Fireworks";
import {
  JourneyConstellation,
  type JourneyStar,
} from "../components/interstitial/JourneyConstellation";

const ONBOARDING_STORAGE_KEY = "everleap_onboarding_answers";
const MAX_WAIT_MS = 15000;
const LINE_MS = 2300;

const CRAWL_LINES = [
  "You just told me a few true things about yourself.",
  "Not a test. Not a score.",
  "I'm going to use them to help build what comes next —",
  "starting with what moves you, and where it could lead.",
  "Give me a moment. Here's what I'm already noticing…",
];

const FALLBACK_LINE =
  "You've given me enough to start with — there are already patterns worth building on. Let's begin.";

type Synthesis = {
  headline: string;
  body: string;
  signals: string[];
  bridge: string;
};

/**
 * "map" is the journey constellation — the five places of Everleap, opened one
 * star at a time.
 *
 * It used to live in the arrival interstitial as a first-run state, which meant
 * a brand-new user met TWO welcomes: this narrated crawl, and then a separate
 * "Welcome to Everleap" the moment they reached Today. Merged here because this
 * screen already owns the post-onboarding moment AND uses it to mask the
 * synthesis generating in the background — moving that timing somewhere else
 * would have cost more than it bought.
 */
type Phase = "init" | "crawl" | "reveal" | "map";

export default function IntroPage(): React.JSX.Element {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [phase, setPhase] = React.useState<Phase>("init");
  const [lineIndex, setLineIndex] = React.useState(0);
  const [synth, setSynth] = React.useState<Synthesis | null>(null);
  const [stars, setStars] = React.useState<JourneyStar[]>([]);
  const readyRef = React.useRef(false);

  // Claim the journey as seen, then leave. Claiming on the way OUT — including
  // on Skip — means the welcome is offered exactly once, whether or not they
  // took the tour. Fire and forget: a failed claim costs a repeat, not the exit.
  const goHome = React.useCallback(() => {
    void fetch("/api/guidance/journey", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
    router.replace("/main");
  }, [router]);

  // 1) First-run gate + fire the onboarding claim (which kicks off the synthesis
  //    + Today generation). Non-first-time visitors skip straight to Today.
  React.useEffect(() => {
    let alive = true;
    (async () => {
      let firstTime = true;
      try {
        const r = await fetch("/api/guidance/intro-seen", { method: "POST" });
        const d = await r.json();
        firstTime = d?.firstTime === true;
      } catch {
        firstTime = false;
      }
      if (!alive) return;
      if (!firstTime) {
        goHome();
        return;
      }

      try {
        const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (raw) {
          const answers = JSON.parse(raw);
          if (answers && Object.keys(answers).length > 0) {
            let zipCode = "";
            try {
              zipCode = localStorage.getItem("everleap_zip") || "";
            } catch {}
            const res = await fetch("/api/onboarding/claim", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answers, zipCode }),
            });
            if (res.ok) localStorage.removeItem(ONBOARDING_STORAGE_KEY);
          }
        }
      } catch {
        // generation may still have fired on a prior attempt; continue.
      }
      if (!alive) return;
      setPhase("crawl");
    })();
    return () => {
      alive = false;
    };
  }, [goHome]);

  // 2) Poll the synthesis until ready or the max wait elapses.
  React.useEffect(() => {
    if (phase !== "crawl") return;
    let alive = true;
    let timer = 0;
    const deadline = Date.now() + MAX_WAIT_MS;

    async function poll() {
      try {
        const r = await fetch("/api/guidance/onboarding-synthesis", {
          cache: "no-store",
        });
        const d = await r.json();
        if (alive && d?.status === "ready" && d?.synthesis) {
          setSynth(d.synthesis as Synthesis);
          readyRef.current = true;
          return;
        }
      } catch {
        // keep trying
      }
      if (!alive) return;
      if (Date.now() > deadline) {
        readyRef.current = true; // proceed on fallback
        return;
      }
      timer = window.setTimeout(poll, 1500);
    }

    poll();
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [phase]);

  // Load the five stars when the tour opens. Unlit for a brand-new account,
  // which is exactly right: this is the map before you have been anywhere.
  React.useEffect(() => {
    if (phase !== "map") return;
    let alive = true;
    fetch("/api/guidance/journey", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d?.stars)) setStars(d.stars as JourneyStar[]);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [phase]);

  // 3) Advance the crawl; hold on the last line until the synthesis is ready.
  React.useEffect(() => {
    if (phase !== "crawl") return;

    if (lineIndex < CRAWL_LINES.length - 1) {
      const t = window.setTimeout(
        () => setLineIndex((i) => i + 1),
        reduce ? 900 : LINE_MS
      );
      return () => window.clearTimeout(t);
    }

    const t = window.setInterval(() => {
      if (readyRef.current) {
        window.clearInterval(t);
        setPhase("reveal");
      }
    }, 250);
    return () => window.clearInterval(t);
  }, [phase, lineIndex, reduce]);

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-slate-950 text-white">
      {/* soft cosmic glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-[38%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(182,160,255,0.18), transparent 70%)" }}
      />

      {phase !== "reveal" ? (
        <button
          type="button"
          onClick={goHome}
          className="fixed right-5 top-5 z-[210] text-meta text-white/35 transition hover:text-white/70"
          style={{ fontWeight: "var(--title-weight, 600)" as React.CSSProperties["fontWeight"] }}
        >
          Skip
        </button>
      ) : null}

      <div className="relative z-[1] flex min-h-full flex-col items-center justify-center px-6 py-14">
        <div className="w-full max-w-[420px] text-center">
        <AnimatePresence mode="wait">
          {phase === "map" ? (
            <motion.div
              key="map"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0.25 : 0.6 }}
              className="relative"
            >
              {/* Confined to the top band and dimmed. Full-bleed, they burst
                  straight through the constellation and turn the five stars
                  into noise — the map is the thing being read here, the
                  celebration is the frame around it. */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-36 opacity-50">
                <Fireworks reduce={Boolean(reduce)} />
              </div>
              <div className="relative">
                <StepEyebrow className="mb-3" style={{ color: "rgb(182,160,255)" }}>
                  Welcome to Everleap
                </StepEyebrow>
                <CoachLine className="mb-6 text-balance">
                  Everleap is five places. Tap each star to see what&apos;s there —
                  then I&apos;ll let you in.
                </CoachLine>
                <JourneyConstellation
                  stars={stars}
                  requireAll
                  onComplete={goHome}
                  reduce={Boolean(reduce)}
                />
              </div>
            </motion.div>
          ) : phase !== "reveal" ? (
            <motion.div
              key={`line-${lineIndex}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18, filter: "blur(6px)" }}
              transition={{ duration: reduce ? 0.25 : 0.7, ease: "easeOut" }}
            >
              <CoachLine className="text-balance">{CRAWL_LINES[lineIndex]}</CoachLine>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reduce ? 0.25 : 0.8, ease: "easeOut" }}
            >
              <StepEyebrow className="mb-4" style={{ color: "rgb(182,160,255)" }}>
                What I&apos;m noticing
              </StepEyebrow>

              {synth?.headline ? <AskHero>{synth.headline}</AskHero> : null}

              <CoachLine className="mt-4 text-left">{synth?.body ?? FALLBACK_LINE}</CoachLine>

              {synth?.signals?.length ? (
                <div className="mt-6 flex flex-col gap-2 text-left">
                  {synth.signals.slice(0, 3).map((s, i) => (
                    <motion.div
                      key={i}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduce ? 0 : 0.5 + i * 0.18, duration: 0.5 }}
                      className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(182,160,255)]" />
                      <span className="text-meta leading-snug text-white/72">{s}</span>
                    </motion.div>
                  ))}
                </div>
              ) : null}

              <motion.button
                type="button"
                onClick={() => setPhase("map")}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0.1 : 1.15, duration: 0.5 }}
                className="mt-8 w-full rounded-full px-5 py-3.5 text-label transition hover:brightness-110"
                style={{
                  fontWeight: "var(--title-weight, 600)" as React.CSSProperties["fontWeight"],
                  color: "rgb(182,160,255)",
                  background: "rgba(182,160,255,0.14)",
                  border: "1px solid rgba(182,160,255,0.34)",
                }}
              >
                Show me around →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
