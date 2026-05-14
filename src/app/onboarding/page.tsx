"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Conversation from "./components/Conversation";
import InputRenderer from "./components/InputRenderer";
import NavControls from "./components/NavControls";

import {
  useOnboardingFlow,
  type FlowPayload,
} from "./engine/useOnboardingFlow";

import { useAnimationState } from "./animation/useAnimationState";
import AnimatedCanvas from "./animation/AnimatedCanvas";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

const SEMANTIC_ICON_BY_NODE: Record<string, string> = {
  welcome: "/onboarding/icons/reflection-white.png",
  how_it_works: "/onboarding/icons/story-white.png",
  what_you_get: "/onboarding/icons/compass-white.png",
  progress: "/onboarding/icons/stars-white.png",
  lets_get_started: "/onboarding/icons/rudder-white.png",
};

function QuestionProgress({ progress }: { progress: number }) {
  const percent = Math.round(progress * 100);

  return (
    <div className="w-full" aria-label="Onboarding discovery progress">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
          Discovery
        </div>

        <div className="text-[11px] font-medium tabular-nums text-white/38">
          {percent}%
        </div>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(103,232,249,0.42)] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function SemanticIconStage({ nodeKey }: { nodeKey: string }) {
  const src = SEMANTIC_ICON_BY_NODE[nodeKey];

  if (!src) {
    return <div className="h-[18svh] min-h-[120px] max-h-[220px]" />;
  }

  return (
    <div className="flex h-[18svh] min-h-[120px] max-h-[220px] shrink-0 items-end justify-center sm:h-[28svh] sm:min-h-[210px] sm:max-h-[320px]">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] shadow-[0_0_60px_rgba(103,232,249,0.10)] sm:h-32 sm:w-32">
        <Image
          src={src}
          alt=""
          width={72}
          height={72}
          priority
          className="h-14 w-14 object-contain opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.16)] sm:h-20 sm:w-20"
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

  const animationState = useAnimationState({
    currentNode,
    nodes,
    answers,
  });

  const { isWelcome, isQuestions, showProgress } = animationState;

  const isMultiChoice = currentQuestion?.inputType === "multi_choice";
  const isText = currentQuestion?.inputType === "text";

  function handleComplete() {
    router.push("/regauth");
  }

  function handleNext(nextAnswers = answers) {
    if (!currentNode) return;

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
            "mx-auto flex w-full max-w-[720px] shrink-0 items-center justify-between transition-all duration-700",
            showProgress
              ? "h-[70px] pt-4 opacity-100"
              : "h-[48px] pt-2 opacity-0",
          ].join(" ")}
        >
          {showProgress ? (
            <QuestionProgress progress={animationState.progress} />
          ) : (
            <div />
          )}
        </header>

        <section className="mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col transition-all duration-700">
          <div className="min-h-0 flex flex-1 flex-col overflow-y-auto transition-all duration-700 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {isWelcome ? (
              <SemanticIconStage nodeKey={currentNode.key} />
            ) : (
              <div
                className={[
                  "shrink-0 transition-all duration-700",
                  isMultiChoice
                    ? "h-[10svh] min-h-[52px] max-h-[100px] sm:h-[16svh]"
                    : "h-[14svh] min-h-[82px] max-h-[150px] sm:h-[20svh] sm:min-h-[135px] sm:max-h-[210px]",
                ].join(" ")}
              />
            )}

            <div
              className={[
                "flex flex-col transition-all duration-700",
                isQuestions
                  ? "min-h-[180px] justify-start"
                  : "min-h-[210px] justify-start",
              ].join(" ")}
            >
              <Conversation node={currentNode} answers={answers} />

              <InputRenderer
                node={currentNode}
                question={currentQuestion}
                answers={answers}
                validationMessage={validationMessage}
                onAnswer={(key, value) => updateAnswer(key, value)}
                onAutoAdvance={(nextAnswers) => {
                  window.setTimeout(() => {
                    handleNext(nextAnswers);
                  }, 220);
                }}
              />
            </div>
          </div>

          <div className="shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 transition-all duration-700 sm:pb-6 sm:pt-4">
            <NavControls
              canGoBack={canGoBack}
              showContinue={!currentQuestion || isText || isMultiChoice}
              continueLabel="Continue"
              onBack={goBack}
              onContinue={() => handleNext()}
            />
          </div>
        </section>
      </main>
    </div>
  );
}