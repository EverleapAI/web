"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Conversation from "./components/Conversation";
import InputRenderer from "./components/InputRenderer";
import NavControls from "./components/NavControls";

import IntroScreenRenderer, {
  isIntroScreen,
} from "./components/IntroScreenRenderer";

import {
  useOnboardingFlow,
  type FlowPayload,
} from "./engine/useOnboardingFlow";

import { useAnimationState } from "./animation/useAnimationState";
import AnimatedCanvas from "./animation/AnimatedCanvas";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

type OnboardingSynthesis = {
  headline: string;
  body: string;
  signals: string[];
  bridge: string;
};

const SEMANTIC_ICON_BY_NODE: Record<string, string> = {
  welcome: "/onboarding/icons/reflection-white.png",
  how_it_works: "/onboarding/icons/story-white.png",
  what_you_get: "/onboarding/icons/compass-white.png",
  progress: "/onboarding/icons/stars-white.png",
  lets_get_started: "/onboarding/icons/rudder-white.png",
};

function QuestionProgress({ progress }: { progress: number }) {
  const totalDots = 5;

  const activeDots = Math.max(
    1,
    Math.min(totalDots, Math.round(progress * totalDots))
  );

  return (
    <div
      className="flex w-full flex-col items-center"
      aria-label="Onboarding progress"
    >
      <div className="flex items-center gap-2">
        <div className="text-[13px] font-medium tracking-[-0.01em] text-white">
          Onboarding
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalDots }).map((_, index) => {
            const active = index < activeDots;

            return (
              <div
                key={index}
                className={[
                  "h-[7px] w-[7px] rounded-full transition-all duration-500",
                  active
                    ? "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]"
                    : "bg-white/16",
                ].join(" ")}
              />
            );
          })}
        </div>
      </div>

      <div className="relative mt-3 h-[42px] w-full overflow-hidden">
        <div className="absolute inset-x-[-8%] top-4">
          <svg
            viewBox="0 0 1200 120"
            className="h-full w-full opacity-80"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="progressWaveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(94,234,212,0.15)" />
                <stop offset="35%" stopColor="rgba(103,232,249,0.95)" />
                <stop offset="70%" stopColor="rgba(167,139,250,0.82)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>
            </defs>

            <path
              d="
                M0,70
                C140,30 240,105 360,68
                C500,26 610,90 740,58
                C900,18 1030,82 1200,38
              "
              fill="none"
              stroke="url(#progressWaveGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SemanticIconStage({ nodeKey }: { nodeKey: string }) {
  const src = SEMANTIC_ICON_BY_NODE[nodeKey];

  if (!src) {
    return <div className="h-[14svh] min-h-[90px] max-h-[180px]" />;
  }

  return (
    <div className="flex h-[16svh] min-h-[100px] max-h-[200px] shrink-0 items-end justify-center sm:h-[24svh] sm:min-h-[180px] sm:max-h-[260px]">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/8 bg-white/[0.025] sm:h-28 sm:w-28">
        <Image
          src={src}
          alt=""
          width={72}
          height={72}
          priority
          className="h-14 w-14 object-contain opacity-88 sm:h-16 sm:w-16"
        />
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();

  const [flow, setFlow] = React.useState<FlowPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [synthesisLoading, setSynthesisLoading] =
    React.useState(false);

  const [synthesis, setSynthesis] =
    React.useState<OnboardingSynthesis | null>(null);

  const synthesisRequestedRef = React.useRef(false);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${getApiBaseUrl()}/flows/onboarding_v1`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!data.ok || !data.flow) {
          throw new Error("Invalid flow response");
        }

        setFlow(data.flow);
      } catch {
        setError("Failed to load onboarding");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const {
    nodes,
    currentNode,
    currentQuestion,
    answers,
    goNext,
    goBack,
    updateAnswer,
    canGoBack,
    validationMessage,
  } = useOnboardingFlow(flow);

  React.useEffect(() => {
    async function generateSynthesis() {
      if (!currentNode) return;

      const isSummaryNode =
        currentNode.key === "summary_transition" ||
        currentNode.type === "summary";

      if (!isSummaryNode) {
        return;
      }

      if (synthesisRequestedRef.current) {
        return;
      }

      synthesisRequestedRef.current = true;

      try {
        setSynthesisLoading(true);

        const res = await fetch("/api/onboarding/synthesis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            provider: "anthropic",
            flowKey: "onboarding_v1",
            answers,
          }),
        });

        const data = await res.json();

        if (data?.ok && data?.synthesis) {
          setSynthesis(data.synthesis);
        }
      } catch {
        // silent fallback
      } finally {
        setSynthesisLoading(false);
      }
    }

    generateSynthesis();
  }, [answers, currentNode]);

  const animationState = useAnimationState({
    currentNode,
    nodes,
    answers,
  });

  const { isIntro, isQuestions, showProgress } = animationState;

  const isMultiChoice = currentQuestion?.inputType === "multi_choice";
  const isText = currentQuestion?.inputType === "text";

  const permissionAccepted = answers.permissions_accepted === "yes";

  const permissionsSatisfied =
    currentNode?.key !== "permissions" || permissionAccepted;

  function handleComplete() {
    try {
      window.localStorage.setItem(
        "everleap_onboarding_answers",
        JSON.stringify(answers)
      );
    } catch {}

    router.push("/regauth/zip");
  }

  function handleNext(nextAnswers = answers) {
    if (!currentNode) return;

    if (!permissionsSatisfied) return;

    if (currentNode.type === "summary") {
      handleComplete();
      return;
    }

    goNext(nextAnswers);
  }

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-10 text-white">
        Loading…
      </div>
    );
  }

  if (error || !flow || !currentNode) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-10 text-white">
        Error loading onboarding
      </div>
    );
  }

  return (
    <div className="relative h-[100svh] overflow-hidden bg-slate-950 text-white">
      {isQuestions ? <AnimatedCanvas state={animationState} /> : null}

      <main className="relative z-10 flex h-[100svh] flex-col px-5">
        <header
          className={[
            "mx-auto flex w-full max-w-[720px] shrink-0 items-center justify-between transition-all duration-500",
            showProgress
              ? "h-[68px] pt-4 opacity-100"
              : "h-[34px] pt-2 opacity-0",
          ].join(" ")}
        >
          {showProgress ? (
            <QuestionProgress progress={animationState.progress} />
          ) : (
            <div />
          )}
        </header>

        <section className="mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col">
          <div className="min-h-0 flex flex-1 flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {isIntro && !isIntroScreen(currentNode) ? (
              <SemanticIconStage nodeKey={currentNode.key} />
            ) : !isIntroScreen(currentNode) ? (
              <div
                className={[
                  "shrink-0",
                  isMultiChoice
                    ? "h-[8svh] min-h-[40px] max-h-[80px]"
                    : "h-[12svh] min-h-[70px] max-h-[130px]",
                ].join(" ")}
              />
            ) : null}

            <div
              className={[
                "flex flex-col",
                isQuestions ? "min-h-[160px]" : "min-h-[200px]",
              ].join(" ")}
            >
              {isIntroScreen(currentNode) ? (
                <IntroScreenRenderer
                  node={currentNode}
                  answers={answers}
                  synthesis={synthesis}
                  synthesisLoading={synthesisLoading}
                  onAnswer={(key, value) => updateAnswer(key, value)}
                />
              ) : (
                <Conversation node={currentNode} answers={answers} />
              )}

              <InputRenderer
                node={currentNode}
                question={currentQuestion}
                answers={answers}
                validationMessage={validationMessage}
                onAnswer={(key, value) => updateAnswer(key, value)}
                onAutoAdvance={(nextAnswers) => {
                  window.setTimeout(() => {
                    handleNext(nextAnswers);
                  }, 180);
                }}
              />
            </div>
          </div>

          <div className="shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:pb-5">
            <NavControls
              canGoBack={canGoBack}
              showContinue={!currentQuestion || isText || isMultiChoice}
              continueDisabled={
                !permissionsSatisfied ||
                (currentNode.key === "summary_transition" &&
                  synthesisLoading)
              }
              continueLabel={
                currentNode.type === "summary"
                  ? "Enter Everleap"
                  : "Continue"
              }
              onBack={goBack}
              onContinue={() => handleNext()}
            />
          </div>
        </section>
      </main>
    </div>
  );
}