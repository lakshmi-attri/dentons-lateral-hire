"use client";

import { CheckCircle, RefreshCw, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStatus = "completed" | "in_progress" | "upcoming";

export interface TimelineStage {
  id: string;
  title: string;
  status: TimelineStatus;
  statusText: string;
  icon: "check" | "sync" | "groups" | "award";
}

const iconMap = {
  check: CheckCircle,
  sync: RefreshCw,
  groups: Users,
  award: Award,
};

interface TimelineProps {
  stages: TimelineStage[];
}

export function Timeline({ stages }: TimelineProps) {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-x-4">
      {stages.map((stage, index) => {
        const Icon = iconMap[stage.icon];
        const isLast = index === stages.length - 1;
        const isCompleted = stage.status === "completed";
        const isInProgress = stage.status === "in_progress";
        const isUpcoming = stage.status === "upcoming";

        const lineColor =
          isCompleted || isInProgress
            ? "bg-primary"
            : "bg-[#e5e0e7]";
        const nextLineColor =
          index < stages.length - 1 &&
          (stages[index + 1].status === "completed" ||
            stages[index + 1].status === "in_progress")
            ? "bg-primary"
            : "bg-[#e5e0e7]";

        return (
          <div key={stage.id} className="contents">
            <div
              className={cn(
                "flex flex-col items-center gap-1",
                index === 0 && "pt-3",
                isLast && "pb-3"
              )}
            >
              {index > 0 && (
                <div
                  className={cn(
                    "w-[2px] h-2",
                    isCompleted || isInProgress
                      ? "bg-primary"
                      : "bg-[#e5e0e7]"
                  )}
                />
              )}

              <div
                className={cn(
                  "relative text-3xl flex items-center justify-center",
                  isCompleted && "text-primary",
                  isInProgress && "text-primary",
                  isUpcoming && "text-[#e5e0e7]"
                )}
              >
                <Icon
                  className={cn(
                    "h-8 w-8",
                    isUpcoming && "stroke-[1.5]"
                  )}
                  fill={isCompleted ? "currentColor" : "none"}
                />
                {isInProgress && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping" />
                )}
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "w-[2px] h-full grow",
                    nextLineColor
                  )}
                />
              )}
            </div>

            <div
              className={cn(
                "flex flex-1 flex-col pt-3",
                !isLast && "pb-10"
              )}
            >
              <p
                className={cn(
                  "text-lg leading-normal",
                  isCompleted && "text-[#1c151d] font-medium",
                  isInProgress && "text-primary font-bold",
                  isUpcoming && "text-[#7c6b80] font-medium"
                )}
              >
                {stage.title}
              </p>
              <p
                className={cn(
                  "text-base font-normal leading-normal",
                  isCompleted && "text-[#7c6b80]",
                  isInProgress && "text-[#7c6b80]",
                  isUpcoming && "text-[#e5e0e7]"
                )}
              >
                Status: {stage.statusText}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
