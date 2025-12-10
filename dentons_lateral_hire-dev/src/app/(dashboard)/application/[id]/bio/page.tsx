"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { bioSchema, type BioFormData } from "@/lib/schemas/bio";
import { useApplicationStore } from "@/stores/application-store";

export default function BioPage() {
  const router = useRouter();
  const bio = useApplicationStore((s) => s.bio);
  const setBio = useApplicationStore((s) => s.setBio);
  const markStepCompleted = useApplicationStore((s) => s.markStepCompleted);

  const form = useForm<BioFormData>({
    resolver: zodResolver(bioSchema),
    defaultValues: bio,
  });

  const onSubmit = (data: BioFormData) => {
    setBio(data);
    markStepCompleted("/application/bio");
    router.push("/application/financials");
  };

  const onSaveDraft = () => {
    const values = form.getValues();
    setBio(values);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 px-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h2 className="text-[#1c151d] text-4xl font-black leading-tight tracking-[-0.033em]">
            Biographical Information
          </h2>
          <p className="text-[#7c6b80] text-base font-normal leading-normal">
            Please provide your professional background and biographical
            details.
          </p>
        </div>
      </div>

      <Card className="border-[#e5e0e7] shadow-sm">
        <CardContent className="p-6 lg:p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Full Legal Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your full legal name"
                          className="h-12 border-[#e5e0e7] bg-white"
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Preferred Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your preferred name"
                          className="h-12 border-[#e5e0e7] bg-white"
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <FormField
                  control={form.control}
                  name="currentFirm"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Current Firm
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your current firm name"
                          className="h-12 border-[#e5e0e7] bg-white"
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentTitle"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Current Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Partner, Senior Associate"
                          className="h-12 border-[#e5e0e7] bg-white"
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                <FormField
                  control={form.control}
                  name="barYear"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Bar Admission Year
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="YYYY"
                          className="h-12 border-[#e5e0e7] bg-white"
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barState"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Primary Bar State
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., New York"
                          className="h-12 border-[#e5e0e7] bg-white"
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="practiceYears"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Years in Practice
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g., 15"
                          className="h-12 border-[#e5e0e7] bg-white"
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="practiceAreas"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-[#1c151d]">
                      Primary Practice Areas
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., M&A, Corporate Finance, Securities"
                        className="h-12 border-[#e5e0e7] bg-white"
                      />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-[#1c151d]">
                      Professional Biography
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Provide a brief summary of your professional background and accomplishments..."
                        className="min-h-[150px] border-[#e5e0e7] bg-white resize-none"
                      />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={onSaveDraft}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Save as Draft
                </button>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="h-12 px-6 bg-primary text-white text-base font-bold shadow-md hover:bg-primary/90"
                  >
                    Save & Continue
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
