"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { strategySchema, type StrategyFormData } from "@/lib/schemas/strategy";
import { useApplicationStore } from "@/stores/application-store";
import { useStepGuard } from "@/hooks/use-step-guard";

const strategicAreas = [
  { id: "ma", label: "Mergers & Acquisitions" },
  { id: "privateEquity", label: "Private Equity" },
  { id: "capitalMarkets", label: "Capital Markets" },
  { id: "litigation", label: "Complex Litigation" },
  { id: "ip", label: "Intellectual Property" },
  { id: "realEstate", label: "Real Estate" },
  { id: "tax", label: "Tax" },
  { id: "employment", label: "Employment Law" },
];

const regions = [
  { id: "northAmerica", label: "North America" },
  { id: "europe", label: "Europe" },
  { id: "asiaPacific", label: "Asia Pacific" },
  { id: "middleEast", label: "Middle East" },
  { id: "latinAmerica", label: "Latin America" },
  { id: "africa", label: "Africa" },
];

export default function StrategyPage() {
  const router = useRouter();
  const { isChecking } = useStepGuard("/application/strategy");
  const strategy = useApplicationStore((s) => s.strategy);
  const setStrategy = useApplicationStore((s) => s.setStrategy);
  const markStepCompleted = useApplicationStore((s) => s.markStepCompleted);

  const form = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      whyDentons: strategy.whyDentons,
      growthStrategy: strategy.growthStrategy,
      practiceAreas: strategy.practiceAreas,
      regions: strategy.regions,
      referralSource: strategy.referralSource,
      additionalComments: strategy.additionalComments,
    },
  });

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7c6b80]">Loading...</div>
      </div>
    );
  }

  const onSubmit = (data: StrategyFormData) => {
    setStrategy(data);
    markStepCompleted("/application/strategy");
    router.push("/status");
  };

  const onSaveDraft = () => {
    const values = form.getValues();
    setStrategy(values);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 px-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h2 className="text-[#1c151d] text-4xl font-black leading-tight tracking-[-0.033em]">
            Strategic Alignment
          </h2>
          <p className="text-[#7c6b80] text-base font-normal leading-normal">
            Help us understand how your practice aligns with Dentons&apos;
            strategic priorities.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-[#e5e0e7] shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <h3 className="text-[#1c151d] text-xl font-bold leading-tight">
                  Strategic Fit
                </h3>

                <FormField
                  control={form.control}
                  name="whyDentons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Why Dentons?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe why you're interested in joining Dentons and how your practice would benefit from the platform..."
                          className="min-h-[120px] border-[#e5e0e7] bg-white resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="growthStrategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Growth Strategy
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Outline your 3-5 year growth strategy and how Dentons can help you achieve it..."
                          className="min-h-[120px] border-[#e5e0e7] bg-white resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e5e0e7] shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[#1c151d] text-xl font-bold leading-tight">
                    Strategic Practice Areas
                  </h3>
                  <p className="text-[#7c6b80] text-sm">
                    Select the practice areas that align with your expertise.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="practiceAreas"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {strategicAreas.map((area) => (
                          <FormField
                            key={area.id}
                            control={form.control}
                            name="practiceAreas"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(area.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, area.id]);
                                      } else {
                                        field.onChange(
                                          current.filter(
                                            (v: string) => v !== area.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium text-[#1c151d] cursor-pointer">
                                  {area.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e5e0e7] shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[#1c151d] text-xl font-bold leading-tight">
                    Geographic Interest
                  </h3>
                  <p className="text-[#7c6b80] text-sm">
                    Select regions where you have clients or would like to
                    expand.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="regions"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {regions.map((region) => (
                          <FormField
                            key={region.id}
                            control={form.control}
                            name="regions"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(region.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, region.id]);
                                      } else {
                                        field.onChange(
                                          current.filter(
                                            (v: string) => v !== region.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium text-[#1c151d] cursor-pointer">
                                  {region.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e5e0e7] shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <h3 className="text-[#1c151d] text-xl font-bold leading-tight">
                  Additional Information
                </h3>

                <FormField
                  control={form.control}
                  name="referralSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Referral Source
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="How did you hear about this opportunity?"
                          className="h-12 border-[#e5e0e7] bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-[#1c151d]">
                        Additional Comments
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any additional information you'd like to share..."
                          className="min-h-[100px] border-[#e5e0e7] bg-white resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-4">
            <button
              type="button"
              onClick={onSaveDraft}
              className="text-sm font-bold text-primary hover:underline"
            >
              Save as Draft
            </button>
            <div className="flex gap-4">
              <Link href="/application/team">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12 px-6 bg-gray-200 text-[#1c151d] text-base font-bold hover:bg-gray-300"
                >
                  Back
                </Button>
              </Link>
              <Button
                type="submit"
                className="h-12 px-6 bg-primary text-white text-base font-bold shadow-md hover:bg-primary/90"
              >
                Submit Application
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
