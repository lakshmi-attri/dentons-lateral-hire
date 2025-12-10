"use client";

import { useLCQStore } from "@/stores/lcq-store";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const INDIVIDUAL_STEPS = [
  { path: "/application", label: "Application Type" },
  { path: "/application/contact", label: "Contact Information" },
  { path: "/application/bio", label: "Biography" },
  { path: "/application/education", label: "Education" },
  { path: "/application/work-history", label: "Work History" },
  { path: "/application/financials", label: "Financials" },
  { path: "/application/clients", label: "Portable Clients" },
  { path: "/application/conflicts", label: "Conflicts" },
  { path: "/application/due-diligence", label: "Due Diligence" },
  { path: "/application/references", label: "References" },
  { path: "/application/strategy", label: "Strategy" },
  { path: "/application/team", label: "Team" },
  { path: "/application/review", label: "Review & Submit" },
];

const GROUP_STEPS = [
  { path: "/application", label: "Application Type" },
  { path: "/application/contact", label: "Contact Information" },
  { path: "/application/bio", label: "Biography" },
  { path: "/application/group-overview", label: "Group Overview" },
  { path: "/application/partners", label: "Additional Partners" },
  { path: "/application/team-members", label: "Team Members" },
  { path: "/application/education", label: "Education" },
  { path: "/application/combined-financials", label: "Combined Financials" },
  { path: "/application/conflicts", label: "Conflicts" },
  { path: "/application/due-diligence", label: "Due Diligence" },
  { path: "/application/references", label: "References" },
  { path: "/application/strategy", label: "Strategy" },
  { path: "/application/review", label: "Review & Submit" },
];

interface StepProgressProps {
  applicationId: string;
}

export function StepProgress({ applicationId }: StepProgressProps) {
  const applicationType = useLCQStore((s) => s.applicationType);
  const completedSteps = useLCQStore((s) => s.completedSteps);
  const currentStep = useLCQStore((s) => s.currentStep);

  const steps = applicationType === "group" ? GROUP_STEPS : INDIVIDUAL_STEPS;
  const completedCount = completedSteps.length;
  const totalCount = steps.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white border border-[#e5e0e7] rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-[#1c151d]">Application Progress</h3>
          <p className="text-sm text-[#7c6b80] mt-1">
            {completedCount} of {totalCount} steps completed
          </p>
        </div>
        <div className="text-2xl font-bold text-primary">{percentage}%</div>
      </div>

      <div className="w-full bg-[#f0eef1] rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.path);
          const isCurrent = currentStep === step.path;
          const isAccessible = index === 0 || completedSteps.includes(steps[index - 1].path);

          return (
            <div
              key={step.path}
              className={cn(
                "flex items-center gap-3 p-2 rounded-md transition-colors",
                isCurrent && "bg-primary/5",
                isAccessible && !isCurrent && "hover:bg-[#faf9fb]"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0",
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-primary/20 text-primary"
                    : "bg-[#f0eef1] text-[#7c6b80]"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  isCurrent
                    ? "text-[#1c151d] font-semibold"
                    : isCompleted
                    ? "text-[#1c151d]"
                    : "text-[#7c6b80]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
