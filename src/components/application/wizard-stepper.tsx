"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { CheckCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLCQStore } from "@/stores/lcq-store";
import { INDIVIDUAL_STEPS, GROUP_STEPS } from "@/types/lcq";

export function WizardStepper() {
  const pathname = usePathname();
  const params = useParams();
  const applicationId = params?.id as string;
  const applicationType = useLCQStore((s) => s.applicationType);
  const completedSteps = useLCQStore((s) => s.completedSteps);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLAnchorElement | HTMLSpanElement>(null);

  const steps = applicationType === "group" ? GROUP_STEPS : INDIVIDUAL_STEPS;

  const normalizeStepPath = (stepPath: string) => {
    return stepPath.replace("/application", "");
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => {
      const normalizedStepPath = normalizeStepPath(step.path);

      if (normalizedStepPath === "") {
        return pathname === `/application/${applicationId}`;
      }

      return pathname === `/application/${applicationId}${normalizedStepPath}`;
    });
  };

  const currentStepIndex = getCurrentStepIndex();

  const buildStepHref = (stepPath: string) => {
    if (!applicationId) return stepPath;
    const normalizedPath = normalizeStepPath(stepPath);
    return `/application/${applicationId}${normalizedPath}`;
  };

  const isStepAccessible = (stepPath: string) => {
    const stepIndex = steps.findIndex((s) => s.path === stepPath);
    if (stepIndex === 0) return true;
    if (stepIndex === -1) return false;
    const previousStep = steps[stepIndex - 1];
    return completedSteps.includes(previousStep.path);
  };

  const scrollToActiveStep = () => {
    if (activeStepRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeStep = activeStepRef.current;

      const containerRect = container.getBoundingClientRect();
      const stepRect = activeStep.getBoundingClientRect();
      const scrollLeft = stepRect.left - containerRect.left - (containerRect.width / 2) + (stepRect.width / 2) + container.scrollLeft;
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToActiveStep, 100);
    return () => clearTimeout(timer);
  }, [pathname, currentStepIndex]);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-2 sm:gap-3 py-2 overflow-x-auto scrollbar-hide px-4 max-w-full"
    >
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.path);
        const isCurrent = index === currentStepIndex;
        const isAccessible = isStepAccessible(step.path);
        const isLocked = !isAccessible && !isCurrent;

        const content = (
          <>
            {isCompleted && !isCurrent && (
              <CheckCircle className="h-4 w-4 text-primary" />
            )}
            {isLocked && <Lock className="h-3.5 w-3.5 text-[#9a8c9e]" />}
            <span
              className={cn(
                "text-sm leading-normal whitespace-nowrap",
                isCurrent && "font-semibold",
                isCompleted && !isCurrent && "font-medium",
                isLocked && "font-normal text-[#9a8c9e]"
              )}
            >
              {index + 1}. {step.shortLabel}
            </span>
          </>
        );

        if (isLocked) {
          return (
            <span
              key={step.path}
              className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-full px-4 cursor-not-allowed bg-[#f5f3f6] text-[#9a8c9e]"
            >
              {content}
            </span>
          );
        }

        return (
          <Link
            key={step.path}
            href={buildStepHref(step.path)}
            ref={isCurrent ? (activeStepRef as React.RefObject<HTMLAnchorElement>) : undefined}
            className={cn(
              "flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-full px-4 transition-colors",
              isCompleted &&
                !isCurrent &&
                "bg-[#f0eef1] text-primary hover:bg-[#e5e0e7]",
              isCurrent && "bg-primary text-white",
              !isCompleted &&
                !isCurrent &&
                isAccessible &&
                "bg-white border border-[#e5e0e7] text-[#1c151d] hover:bg-[#f7f6f8]"
            )}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
