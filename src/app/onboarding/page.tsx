"use client";

// apps/web/src/app/onboarding/page.tsx

import * as React from "react";
import { useRouter } from "next/navigation";

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

function ProviderChoiceButtons({
  disabled,
  onChoose,
}: {
  disabled: boolean;
  onChoose: (provider: AiProvider) => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose("openai")}
        className={[
          "h-12 rounded-full border border-cyan-300/35 bg-cyan-300/12 px-5 text-[15px] font-semibold tracking-[-0.02em] text-cyan-100",
          "shadow-[0_0_24px_rgba(103,232,249,0.12)] transition",
          disabled
            ? "cursor-not-allowed opacity-45"
            : "active:scale-[0.99] hover:bg-cyan-300/18",
        ].join(" ")}
      >
        Continue with OpenAI
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose("anthropic")}
        className={[
          "h-12 rounded-full border border-white/18 bg-white/[0.045] px-5 text-[15px] font-semibold tracking-[-0.02em] text-white/88",
          "transition",
          disabled
            ? "cursor-not-allowed opacity-45"
            : "active:scale-[0.99] hover:bg-white/[0.075]",
        ].join(" ")}
      >
        Continue with Claude
      </button>
    </div>
  );
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
  }, [answers, currentNode, synthesisProvider]);

  const progress =
    nodes.length > 0 && currentNode
      ? Math.max(
          0,
          nodes.findIndex((node) => node.id === currentNode.id) /
            Math.max(1, nodes.length - 1)
        )
      : 0;

  const showProgress =
    Boolean(currentNode) && !isIntroScreen(currentNode);

  const isMultiChoice = currentQuestion?.inputType === "multi_choice";
  const isText = currentQuestion?.inputType === "text";

  const permissionAccepted = answers.permissions_accepted === "yes";

  const permissionsSatisfied =
    currentNode?.key !== "permissions" || permissionAccepted;

  const isProviderChoiceNode = currentNode?.key === "activities";

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

    if (currentNode.type === "summary") {
      handleComplete();
      return;
    }

    goNext(nextAnswers);
  }

  function handleProviderChoice(provider: AiProvider) {
    setSynthesis(null);
    setSynthesisProvider(provider);
    synthesisRequestedRef.current = false;
    handleNext();
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
    <div className="relative min-h-[100svh] overflow-hidden bg-slate-950 text-white">
      <main className="relative z-10 flex min-h-[100svh] flex-col px-5">
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

        <section className="mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col">
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
                  window.setTimeout(() => {
                    handleNext(nextAnswers);
                  }, 180);
                }}
              />
            </div>
          </div>

          <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:pb-4">
            {isProviderChoiceNode ? (
              <>
                <ProviderChoiceButtons
                  disabled={!permissionsSatisfied}
                  onChoose={handleProviderChoice}
                />

                <NavControls
                  canGoBack={canGoBack}
                  showContinue={false}
                  continueDisabled
                  continueLabel="Continue"
                  onBack={goBack}
                  onContinue={() => {}}
                />
              </>
            ) : (
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
            )}
          </div>
        </section>
      </main>
    </div>
  );
}