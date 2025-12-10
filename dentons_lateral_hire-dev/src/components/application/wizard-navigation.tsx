"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLCQStore } from "@/stores/lcq-store";
import { Loader2 } from "lucide-react";

interface WizardNavigationProps {
  applicationId: string;
  backHref?: string;
  nextHref: string;
  nextLabel?: string;
  showBack?: boolean;
  currentStep: string;
  onSubmit?: () => Promise<boolean> | boolean;
  isSubmitting?: boolean;
  isValid?: boolean;
}

export function WizardNavigation({
  applicationId,
  backHref,
  nextHref,
  nextLabel = "Save & Continue",
  showBack = true,
  currentStep,
  onSubmit,
  isSubmitting = false,
  isValid = true,
}: WizardNavigationProps) {
  const router = useRouter();
  const markStepComplete = useLCQStore((s) => s.markStepComplete);
  const markClean = useLCQStore((s) => s.markClean);
  const saveAsDraft = useLCQStore((s) => s.saveAsDraft);

  const buildHref = (href: string) => {
    if (href.includes('[id]')) {
      return href.replace('[id]', applicationId);
    }
    return `/application/${applicationId}${href}`;
  };

  const handleNext = async () => {
    if (onSubmit) {
      const success = await onSubmit();
      if (!success) return;
    }
    markStepComplete(currentStep);
    saveAsDraft();
    markClean();
    router.push(buildHref(nextHref));
  };

  const handleBack = () => {
    if (backHref) {
      router.push(buildHref(backHref));
    }
  };

  const handleSaveDraft = () => {
    saveAsDraft();
    markClean();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-4">
      <button
        type="button"
        onClick={handleSaveDraft}
        className="text-sm font-bold text-primary hover:underline"
      >
        Save as Draft
      </button>
      <div className="flex gap-4">
        {showBack && backHref && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            className="h-12 px-6 bg-gray-200 text-[#1c151d] text-base font-bold hover:bg-gray-300"
          >
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting || !isValid}
          className="h-12 px-6 bg-primary text-white text-base font-bold shadow-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            nextLabel
          )}
        </Button>
      </div>
    </div>
  );
}
