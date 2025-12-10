"use client";

import { useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Users, Check, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  applicationTypeSchema,
  type ApplicationTypeFormData,
} from "@/lib/schemas/lcq/application-type";
import { useLCQStore } from "@/stores/lcq-store";
import { cn } from "@/lib/utils";

function ApplicationTypeContent() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const applicationType = useLCQStore((s) => s.applicationType);
  const applicationTypeLocked = useLCQStore((s) => s.applicationTypeLocked);
  const setApplicationType = useLCQStore((s) => s.setApplicationType);
  const lockApplicationType = useLCQStore((s) => s.lockApplicationType);
  const canChangeApplicationType = useLCQStore((s) => s.canChangeApplicationType);
  const markStepComplete = useLCQStore((s) => s.markStepComplete);
  const groupOverview = useLCQStore((s) => s.groupOverview);
  const updateGroupOverview = useLCQStore((s) => s.updateGroupOverview);
  const loadApplication = useLCQStore((s) => s.loadApplication);

  useEffect(() => {
    if (applicationId) {
      loadApplication(applicationId);
    }
  }, [applicationId, loadApplication]);

  const form = useForm<ApplicationTypeFormData>({
    resolver: zodResolver(applicationTypeSchema),
    defaultValues: {
      applicationType: applicationType || undefined,
      estimatedPartners: groupOverview.partnersJoiningDentons || undefined,
      estimatedAssociates: groupOverview.associatesJoining || undefined,
      estimatedStaff: groupOverview.staffJoining || undefined,
      firmPracticeName: groupOverview.firmName || "",
    },
  });

  useEffect(() => {
    form.reset({
      applicationType: applicationType || undefined,
      estimatedPartners: groupOverview.partnersJoiningDentons || undefined,
      estimatedAssociates: groupOverview.associatesJoining || undefined,
      estimatedStaff: groupOverview.staffJoining || undefined,
      firmPracticeName: groupOverview.firmName || "",
    });
  }, [applicationType, groupOverview, form]);


  const selectedType = form.watch("applicationType");

  const onSubmit = (data: ApplicationTypeFormData) => {
    console.log('Form submitted with data:', data);
    setApplicationType(data.applicationType);
    if (data.applicationType === "group") {
      updateGroupOverview({
        firmName: data.firmPracticeName || "",
        partnersJoiningDentons: data.estimatedPartners || 0,
        associatesJoining: data.estimatedAssociates || 0,
        staffJoining: data.estimatedStaff || 0,
      });
    }
    lockApplicationType();
    markStepComplete("/application");
    const saveAsDraft = useLCQStore.getState().saveAsDraft;
    const markClean = useLCQStore.getState().markClean;
    saveAsDraft();
    markClean();
    console.log('Navigating to contact page');
    router.push(`/application/${applicationId}/contact`);
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  const isTypeLocked = !canChangeApplicationType();

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">
          Lateral Candidate Questionnaire
        </h1>
        <p className="text-[#7c6b80] mt-2">
          Form: 2025
        </p>
      </div>

      {/* LCQ Introduction */}
      <Card className="border border-[#e5e0e7] shadow-sm mb-6 bg-[#f7f6f8]">
        <CardContent className="p-6">
          <div className="space-y-4 text-sm text-[#1c151d] leading-relaxed">
            <p>
              Thank you for your interest in Dentons. This Lateral Candidate Questionnaire is being submitted for a position at Dentons US LLP; it is one important element of our discussions with you. We appreciate that it represents a comprehensive and detailed request for information.
            </p>
            <p>
              We understand that you have fulfilled and will continue to fulfill all fiduciary duties and legal and ethical obligations you may have to your current firm or company. You should feel free to consult your own counsel, state bar guidance, or other advisors regarding those obligations.
            </p>
            <p>
              No representation has been made to you regarding the likelihood of Dentons offering you a position. All applications must be approved by Dentons, and are subject to our due diligence, conflict clearance, and any necessary partnership approvals. Dentons will not base its decision based on the answer to any particular question in this Lateral Candidate Questionnaire, but will fully consider the totality of the facts and circumstances regarding the information you provide.
            </p>
            <p className="font-medium">
              If you have any questions about this questionnaire, please discuss with your contact at Dentons. Again, thank you for your interest in our firm.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
              <FormField
                control={form.control}
                name="applicationType"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-base font-semibold text-[#1c151d]">
                        How are you applying?
                      </FormLabel>
                      {isTypeLocked && (
                        <div className="flex items-center gap-1 text-sm text-[#7c6b80]">
                          <Lock className="w-4 h-4" />
                          <span>Type locked</span>
                        </div>
                      )}
                    </div>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <button
                          type="button"
                          onClick={() => !isTypeLocked && field.onChange("individual")}
                          disabled={isTypeLocked}
                          className={cn(
                            "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200",
                            field.value === "individual"
                              ? "border-primary bg-primary/5"
                              : "border-[#e5e0e7] bg-white hover:border-[#c9c0cc] hover:bg-[#faf9fb]",
                            isTypeLocked && "opacity-60 cursor-not-allowed hover:border-[#e5e0e7] hover:bg-white"
                          )}
                        >
                          {field.value === "individual" && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
                              field.value === "individual"
                                ? "bg-primary text-white"
                                : "bg-[#f0eef1] text-[#7c6b80]"
                            )}
                          >
                            <User className="w-7 h-7" />
                          </div>
                          <h3 className="text-lg font-semibold text-[#1c151d]">
                            Individual Partner
                          </h3>
                          <p className="text-sm text-[#7c6b80] text-center mt-2 leading-relaxed">
                            I am applying as an individual partner to join Dentons
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => !isTypeLocked && field.onChange("group")}
                          disabled={isTypeLocked}
                          className={cn(
                            "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200",
                            field.value === "group"
                              ? "border-primary bg-primary/5"
                              : "border-[#e5e0e7] bg-white hover:border-[#c9c0cc] hover:bg-[#faf9fb]",
                            isTypeLocked && "opacity-60 cursor-not-allowed hover:border-[#e5e0e7] hover:bg-white"
                          )}
                        >
                          {field.value === "group" && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
                              field.value === "group"
                                ? "bg-primary text-white"
                                : "bg-[#f0eef1] text-[#7c6b80]"
                            )}
                          >
                            <Users className="w-7 h-7" />
                          </div>
                          <h3 className="text-lg font-semibold text-[#1c151d]">
                            Group / Firm Application
                          </h3>
                          <p className="text-sm text-[#7c6b80] text-center mt-2 leading-relaxed">
                            We are applying as a group with multiple partners, associates, and staff
                          </p>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedType === "group" && (
                <div className="space-y-6 p-6 bg-[#faf9fb] rounded-xl border border-[#e5e0e7]">
                  <h3 className="text-base font-semibold text-[#1c151d]">
                    Group Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firmPracticeName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-[#1c151d]">
                            Firm / Practice Group Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your firm or practice group name"
                              className="h-11 border-[#e5e0e7] bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedPartners"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#1c151d]">
                            Number of Partners Joining *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={2}
                              placeholder="Minimum 2"
                              className="h-11 border-[#e5e0e7] bg-white"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedAssociates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#1c151d]">
                            Number of Associates
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Optional"
                              className="h-11 border-[#e5e0e7] bg-white"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedStaff"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#1c151d]">
                            Number of Staff
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Optional"
                              className="h-11 border-[#e5e0e7] bg-white"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="h-11 px-6 bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90"
                >
                  Continue to Application
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ApplicationTypePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationTypeContent />
    </Suspense>
  );
}
