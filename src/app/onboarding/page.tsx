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

  React.useEffect(() => {
    async function load() {
      try {
        // Use the same-origin proxy (like every other API call in the app) so
        // onboarding never depends on cross-origin CORS to the API host.
        const res = await fetch(`/api/flows/onboarding_v1`, {
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

function handleComplete(finalAnswers: Answers) {
  try {
    window.localStorage.setItem(
      "everleap_onboarding_answers",
      JSON.stringify(finalAnswers)
    );
  } catch {}

  router.push("/regauth");
}
  function handleNext(nextAnswers = answers) {
    if (!currentNode) return;
    if (!permissionsSatisfied) return;

    const isFinalQuestion =
      currentNode.key === "activities" &&
      Boolean(
        Array.isArray(nextAnswers.activities)
          ? nextAnswers.activities.length
          : nextAnswers.activities
      );

    if (isFinalQuestion) {
      handleComplete(nextAnswers);
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
                (currentNode.key === "activities" &&
                  (!Array.isArray(answers.activities) ||
                    answers.activities.length === 0))
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