"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import Conversation from "./components/Conversation";
import InputRenderer from "./components/InputRenderer";
import NavControls from "./components/NavControls";

import { useOnboardingFlow, type FlowPayload } from "./engine/useOnboardingFlow";
import { useAnimationState } from "./animation/useAnimationState";
import AnimatedCanvas from "./animation/AnimatedCanvas";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
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
  } = useOnboardingFlow(flow);

  const animationState = useAnimationState({
    currentNode,
    nodes,
    answers,
  });

  function handleComplete() {
    router.push("/main");
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
    return <div className="min-h-[100svh] bg-slate-950 p-10 text-white">Loading…</div>;
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
      <AnimatedCanvas state={animationState} />

      <main className="relative z-10 flex min-h-[100svh] flex-col justify-center px-5 pb-20 pt-16">
        <div className="mx-auto w-full max-w-[720px]">
          <Conversation node={currentNode} answers={answers} />

          <InputRenderer
            node={currentNode}
            question={currentQuestion}
            answers={answers}
            onAnswer={(key, value) => updateAnswer(key, value)}
            onAutoAdvance={(nextAnswers) => {
  handleNext(nextAnswers);
}}
          />

          <NavControls
            canGoBack={canGoBack}
            showContinue={
              !currentQuestion ||
              currentQuestion.inputType === "text" ||
              currentQuestion.inputType === "multi_choice"
            }
            continueLabel={currentNode.type === "summary" ? "Enter Everleap" : "Continue"}
            onBack={goBack}
            onContinue={handleNext}
          />
        </div>
      </main>
    </div>
  );
}