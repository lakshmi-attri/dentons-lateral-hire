"use client";

import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { Settings, LogOut, Lock, CheckCircle, LayoutDashboard, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useLCQStore } from "@/stores/lcq-store";
import { INDIVIDUAL_STEPS, GROUP_STEPS } from "@/types/lcq";

// Admin navigation items
const adminNavItems = [
  {
    label: "Applications",
    href: "/applications",
    icon: FileText,
  },
];

// Settings removed from navigation
const bottomItems: Array<{
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const applicationType = useLCQStore((s) => s.applicationType);
  const completedSteps = useLCQStore((s) => s.completedSteps);
  const applicationId = params?.id as string | undefined;

  const isApplicationRoute = pathname?.startsWith("/application/");
  const steps = applicationType === "group" ? GROUP_STEPS : INDIVIDUAL_STEPS;

  const normalizeStepPath = (stepPath: string) => {
    return stepPath.replace("/application", "");
  };

  const getCurrentStepIndex = () => {
    if (!isApplicationRoute || !applicationId) return -1;
    return steps.findIndex((step) => {
      const normalizedStepPath = normalizeStepPath(step.path);
      if (normalizedStepPath === "") {
        return pathname === `/application/${applicationId}`;
      }
      return pathname === `/application/${applicationId}${normalizedStepPath}`;
    });
  };

  const currentStepIndex = getCurrentStepIndex();

  // Calculate progress percentage
  const completedCount = completedSteps.length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

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

  const handleLogout = () => {
    logout();
    router.push('/sign-in');
  };

  return (
    <aside className="w-64 shrink-0 border-r border-[#e5e0e7] bg-white p-6 overflow-y-auto">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-4">
          {/* Admin Navigation */}
          {isAdmin && (
            <div className="flex flex-col gap-1 mb-2">
              {adminNavItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-[#7c6b80] hover:bg-[#f0eef1]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <p className="text-sm font-medium leading-normal">
                      {item.label}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Partner Application Steps */}
          {!isAdmin && isApplicationRoute && applicationId && (
            <div className="flex flex-col gap-3">
              <div className="px-3">
                <h3 className="text-xs font-semibold text-[#7c6b80] uppercase tracking-wider mb-3 text-center">
                  Application Progress
                </h3>
                <div className="flex justify-center mb-3">
                  <div className="relative inline-flex items-center justify-center">
                    {/* Circular Progress Ring */}
                    <svg
                      className="transform -rotate-90"
                      width="100"
                      height="100"
                      viewBox="0 0 100 100"
                    >
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#e5e0e7"
                        strokeWidth="8"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#70317d"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 45 * (1 - progressPercentage / 100)
                        }`}
                        className="transition-all duration-300 ease-in-out"
                      />
                    </svg>
                    {/* Percentage text in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-[#1c151d]">
                          {progressPercentage}
                        </span>
                        <span className="text-sm font-medium text-[#7c6b80]">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#7c6b80]">
                    {completedCount} of {totalSteps} steps completed
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-semibold text-[#7c6b80] uppercase tracking-wider px-3 mb-1">
                  Steps
                </h4>
                {steps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.path);
                  const isCurrent = index === currentStepIndex;
                  const isAccessible = isStepAccessible(step.path);
                  const isLocked = !isAccessible && !isCurrent;

                  if (isLocked) {
                    return (
                      <div
                        key={step.path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9a8c9e] cursor-not-allowed bg-[#f5f3f6] border border-[#e5e0e7]"
                      >
                        <div className="flex items-center justify-center h-6 w-6 shrink-0 rounded-full bg-[#e5e0e7]">
                          <Lock className="h-3 w-3" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-[#9a8c9e]">
                            Step {index + 1}
                          </span>
                          <span className="text-sm font-normal leading-normal truncate">
                            {step.shortLabel}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={step.path}
                      href={buildStepHref(step.path)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border",
                        isCurrent &&
                          "bg-primary text-white border-primary shadow-sm",
                        isCompleted &&
                          !isCurrent &&
                          "bg-[#f0eef1] text-primary border-[#e5e0e7] hover:bg-[#e5e0e7] hover:border-primary/30",
                        !isCompleted &&
                          !isCurrent &&
                          isAccessible &&
                          "text-[#1c151d] bg-white border-[#e5e0e7] hover:bg-[#f7f6f8] hover:border-primary/30"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center h-6 w-6 shrink-0 rounded-full text-xs font-semibold transition-colors",
                          isCurrent && "bg-white text-primary",
                          isCompleted &&
                            !isCurrent &&
                            "bg-primary text-white",
                          !isCompleted &&
                            !isCurrent &&
                            isAccessible &&
                            "bg-[#e5e0e7] text-[#7c6b80]"
                        )}
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isCurrent && "text-white/80",
                            isCompleted &&
                              !isCurrent &&
                              "text-primary/70",
                            !isCompleted &&
                              !isCurrent &&
                              isAccessible &&
                              "text-[#7c6b80]"
                          )}
                        >
                          Step {index + 1}
                        </span>
                        <span
                          className={cn(
                            "text-sm leading-normal truncate",
                            isCurrent && "font-semibold",
                            isCompleted && !isCurrent && "font-medium",
                            !isCompleted && !isCurrent && "font-normal"
                          )}
                        >
                          {step.shortLabel}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {/* Settings removed from navigation
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-[#7c6b80] hover:bg-[#f0eef1]"
                )}
              >
                <item.icon className="h-5 w-5" />
                <p className="text-sm font-medium leading-normal">
                  {item.label}
                </p>
              </Link>
            );
          })}
          */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-[#7c6b80] hover:bg-[#f0eef1] w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <p className="text-sm font-medium leading-normal">
              Log Out
            </p>
          </button>
        </div>
      </div>
    </aside>
  );
}
