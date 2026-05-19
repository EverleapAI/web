"use client";

// apps/web/src/app/onboarding/page.tsx

import * as React from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

import Conversation from "./components/Conversation";
import InputRenderer from "./components/InputRenderer";
import NavControls from "./components/NavControls";
import OnboardingVisual from "./components/visuals/OnboardingVisual";

import IntroScreenRenderer, {
  isIntroScreen,
} from "./components/IntroScreenRenderer";

import {
  useOnboardingFlow,
  type Answers,
  type FlowPayload,
} from "./engine/useOnboardingFlow";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

type AiProvider = "openai" | "anthropic";

type OnboardingSynthesis = {
  headline: string;
  body: string;
  signals: string[];
  bridge: string;
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
    </div>
  );
}

function shouldShowPageVisual(nodeKey: string, isIntro: boolean) {
  if (nodeKey === "summary_transition") return false;
  if (isIntro) return false;

  return true;
}

export default function OnboardingPage() {
  const router = useRouter();

  const [flow, setFlow] = React.useState<FlowPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [synthesisLoading, setSynthesisLoading] = React.useState(false);
  const [synthesis, setSynthesis] =
    React.useState<OnboardingSynthesis | null>(null);
  const [synthesisProvider, setSynthesisProvider] =
    React.useState<AiProvider | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(
    null
  );
  const [turnstileError, setTurnstileError] = React.useState<string | null>(
    null
  );

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

      if (!isSummaryNode || !synthesisProvider) return;
      if (!turnstileToken) return;
      if (synthesisRequestedRef.current) return;

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
            provider: synthesisProvider,
            flowKey: "onboarding_v1",
            answers,
            turnstileToken,
          }),
        });

        const data = await res.json();

        if (data?.ok && data?.synthesis) {
          setSynthesis(data.synthesis);
        } else {
          synthesisRequestedRef.current = false;
        }
      } catch {
        synthesisRequestedRef.current = false;
      } finally {
        setSynthesisLoading(false);
      }
    }

    generateSynthesis();
  }, [answers, currentNode, synthesisProvider, turnstileToken]);

  const progress =
    nodes.length > 0 && currentNode
      ? Math.max(
          0,
          nodes.findIndex((node) => node.id === currentNode.id) /
            Math.max(1, nodes.length - 1)
        )
      : 0;

  const showProgress = Boolean(currentNode) && !isIntroScreen(currentNode);

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

    router.push("/regauth");
  }

  function handleNext(nextAnswers = answers) {
    if (!currentNode) return;
    if (!permissionsSatisfied) return;

    if (currentNode.key === "activities") {
      setTurnstileToken(null);
      setTurnstileError(null);
      setSynthesis(null);
      setSynthesisProvider("openai");
      synthesisRequestedRef.current = false;
    }

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

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <div className="relative h-[100svh] overflow-hidden bg-slate-950 text-white">
      <main className="relative z-10 flex h-[100svh] flex-col px-5">
        <header
          className={[
            "mx-auto flex w-full max-w-[720px] shrink-0 items-center justify-center transition-all duration-500",
            showProgress
              ? "h-[30px] pt-2 opacity-100"
              : "h-[8px] pt-1 opacity-0",
          ].join(" ")}
        >
          {showProgress ? <QuestionProgress progress={progress} /> : null}
        </header>

        <section className="mx-auto flex h-full min-h-0 w-full max-w-[720px] flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shouldShowPageVisual(
              currentNode.key,
              isIntroScreen(currentNode)
            ) ? (
              <OnboardingVisual visualKey={currentNode.key} />
            ) : null}

            <div className="flex min-h-0 flex-1 flex-col justify-start pt-1">
              {isIntroScreen(currentNode) ? (
                <IntroScreenRenderer
                  node={currentNode}
                  answers={answers}
                  synthesis={synthesis}
                  synthesisLoading={synthesisLoading}
                  onAnswer={(key: string, value: string | string[]) =>
                    updateAnswer(key, value)
                  }
                />
              ) : (
                <Conversation node={currentNode} answers={answers} />
              )}

              <InputRenderer
                node={currentNode}
                question={currentQuestion}
                answers={answers}
                validationMessage={validationMessage}
                onAnswer={(key: string, value: string | string[]) =>
                  updateAnswer(key, value)
                }
                onAutoAdvance={(nextAnswers?: Answers) => {
                  if (currentQuestion?.inputType === "text") {
                    return;
                  }

                  if (currentQuestion?.inputType === "multi_choice") {
                    return;
                  }

                  window.setTimeout(() => {
                    handleNext(nextAnswers);
                  }, 180);
                }}
              />
            </div>
          </div>

          <div className="shrink-0 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-2 sm:pb-16">
            {currentNode.key === "summary_transition" &&
            !turnstileSiteKey ? (
              <div className="mx-auto mb-3 max-w-[420px] rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
                Turnstile site key is missing.
              </div>
            ) : null}

            {currentNode.key === "summary_transition" &&
            turnstileSiteKey ? (
              <div className="flex justify-center pb-3">
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
              <div className="mx-auto mb-3 max-w-[420px] rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
                {turnstileError}
              </div>
            ) : null}

            <NavControls
              canGoBack={canGoBack}
              showContinue={
                currentNode.key === "welcome" ||
                !currentQuestion ||
                isText ||
                isMultiChoice
              }
              continueDisabled={
                !permissionsSatisfied ||
                (currentNode.key === "summary_transition" &&
                  synthesisLoading)
              }
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