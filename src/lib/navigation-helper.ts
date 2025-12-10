import { INDIVIDUAL_STEPS, GROUP_STEPS } from "@/types/lcq";

export function getNextStep(currentStepPath: string, applicationType: "individual" | "group" | null): string | null {
  const steps = applicationType === "group" ? GROUP_STEPS : INDIVIDUAL_STEPS;
  const currentIndex = steps.findIndex((step) => step.path === currentStepPath);

  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return null;
  }

  return steps[currentIndex + 1].path.replace("/application", "");
}

export function getPreviousStep(currentStepPath: string, applicationType: "individual" | "group" | null): string | null {
  const steps = applicationType === "group" ? GROUP_STEPS : INDIVIDUAL_STEPS;
  const currentIndex = steps.findIndex((step) => step.path === currentStepPath);

  if (currentIndex <= 0) {
    return null;
  }

  return steps[currentIndex - 1].path.replace("/application", "");
}
