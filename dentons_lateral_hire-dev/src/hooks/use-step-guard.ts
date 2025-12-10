"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useApplicationStore,
  STEP_ORDER,
  type StepPath,
} from "@/stores/application-store";

export function useStepGuard(currentStep: StepPath) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const completedSteps = useApplicationStore((s) => s.completedSteps);

  useEffect(() => {
    const stepIndex = STEP_ORDER.indexOf(currentStep);

    if (stepIndex === 0) {
      setIsChecking(false);
      return;
    }

    const previousStep = STEP_ORDER[stepIndex - 1];
    const canAccess = completedSteps.includes(previousStep);

    if (!canAccess) {
      let redirectTo: StepPath = STEP_ORDER[0];
      for (let i = stepIndex - 1; i >= 0; i--) {
        if (i === 0 || completedSteps.includes(STEP_ORDER[i - 1])) {
          redirectTo = STEP_ORDER[i];
          break;
        }
      }
      router.replace(redirectTo);
    } else {
      setIsChecking(false);
    }
  }, [currentStep, completedSteps, router]);

  return { isChecking };
}
