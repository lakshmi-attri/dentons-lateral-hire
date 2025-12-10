"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { useAuthStore } from "@/stores/auth-store";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FinancialsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const financials = useLCQStore((s) => s.financials);
  const updateFinancials = useLCQStore((s) => s.updateFinancials);
  const loadApplication = useLCQStore((s) => s.loadApplication);
  const applicationType = useLCQStore((s) => s.applicationType);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (applicationId) {
      loadApplication(applicationId);
    }
  }, [user, applicationId, loadApplication, router]);

  const handleSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">
          Financial Snapshot
        </h1>
        <p className="text-[#7c6b80] mt-2">
          Please provide your historical billings, collections, and compensation information.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Annual Timekeeper Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#1c151d]">Annual Timekeeper Information</h3>
              <p className="text-sm text-[#7c6b80] mb-4">Provide your billing hours and rates for the past years</p>
              
              {/* Total Client Billable Hours */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-[#1c151d]">Total Client Billable Hours</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2022</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.totalBillableHours.year2022 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            totalBillableHours: {
                              ...financials.timekeeper.totalBillableHours,
                              year2022: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2023</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.totalBillableHours.year2023 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            totalBillableHours: {
                              ...financials.timekeeper.totalBillableHours,
                              year2023: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2024</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.totalBillableHours.year2024 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            totalBillableHours: {
                              ...financials.timekeeper.totalBillableHours,
                              year2024: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2025 YTD</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.totalBillableHours.year2025YTD ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            totalBillableHours: {
                              ...financials.timekeeper.totalBillableHours,
                              year2025YTD: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Hours Originated by You */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-[#1c151d]">Client Billable Hours Originated by You</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2022</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.hoursOriginatedByYou.year2022 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            hoursOriginatedByYou: {
                              ...financials.timekeeper.hoursOriginatedByYou,
                              year2022: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2023</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.hoursOriginatedByYou.year2023 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            hoursOriginatedByYou: {
                              ...financials.timekeeper.hoursOriginatedByYou,
                              year2023: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2024</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.hoursOriginatedByYou.year2024 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            hoursOriginatedByYou: {
                              ...financials.timekeeper.hoursOriginatedByYou,
                              year2024: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2025 YTD</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.hoursOriginatedByYou.year2025YTD ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            hoursOriginatedByYou: {
                              ...financials.timekeeper.hoursOriginatedByYou,
                              year2025YTD: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Standard Hourly Rate */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-[#1c151d]">Standard Hourly Bill Rate (Rack Rate)</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2022 ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.standardHourlyRate.year2022 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            standardHourlyRate: {
                              ...financials.timekeeper.standardHourlyRate,
                              year2022: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2023 ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.standardHourlyRate.year2023 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            standardHourlyRate: {
                              ...financials.timekeeper.standardHourlyRate,
                              year2023: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2024 ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.standardHourlyRate.year2024 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            standardHourlyRate: {
                              ...financials.timekeeper.standardHourlyRate,
                              year2024: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2025 YTD ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.standardHourlyRate.year2025YTD ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            standardHourlyRate: {
                              ...financials.timekeeper.standardHourlyRate,
                              year2025YTD: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Effective Bill Rate */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-[#1c151d]">Effective Bill Rate (After Discounts)</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2022 ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.effectiveBillRate.year2022 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            effectiveBillRate: {
                              ...financials.timekeeper.effectiveBillRate,
                              year2022: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2023 ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.effectiveBillRate.year2023 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            effectiveBillRate: {
                              ...financials.timekeeper.effectiveBillRate,
                              year2023: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2024 ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.effectiveBillRate.year2024 ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            effectiveBillRate: {
                              ...financials.timekeeper.effectiveBillRate,
                              year2024: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#7c6b80]">2025 YTD ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.timekeeper.effectiveBillRate.year2025YTD ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          timekeeper: {
                            ...financials.timekeeper,
                            effectiveBillRate: {
                              ...financials.timekeeper.effectiveBillRate,
                              year2025YTD: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Billings & Collections */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#1c151d]">Previous Billings and Collections</h3>
              <p className="text-sm text-[#7c6b80] mb-4">For clients you have originated</p>
              
              <h4 className="text-sm font-medium mb-3 text-[#1c151d]">Billings (in US dollars)</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>2022 Billings ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.billingsCollections.billings.year2022 ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        billingsCollections: {
                          ...financials.billingsCollections,
                          billings: {
                            ...financials.billingsCollections.billings,
                            year2022: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>2023 Billings ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.billingsCollections.billings.year2023 ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        billingsCollections: {
                          ...financials.billingsCollections,
                          billings: {
                            ...financials.billingsCollections.billings,
                            year2023: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>2024 Billings ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.billingsCollections.billings.year2024 ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        billingsCollections: {
                          ...financials.billingsCollections,
                          billings: {
                            ...financials.billingsCollections.billings,
                            year2024: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>2025 YTD Billings ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.billingsCollections.billings.year2025YTD ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        billingsCollections: {
                          ...financials.billingsCollections,
                          billings: {
                            ...financials.billingsCollections.billings,
                            year2025YTD: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Collections */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3 text-[#1c151d]">Collections (in US dollars)</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>2022 Collections ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.billingsCollections.collections.year2022 ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        billingsCollections: {
                          ...financials.billingsCollections,
                          collections: {
                            ...financials.billingsCollections.collections,
                            year2022: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>2023 Collections ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.billingsCollections.collections.year2023 ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        billingsCollections: {
                          ...financials.billingsCollections,
                          collections: {
                            ...financials.billingsCollections.collections,
                            year2023: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>2024 Collections ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.billingsCollections.collections.year2024 ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        billingsCollections: {
                          ...financials.billingsCollections,
                          collections: {
                            ...financials.billingsCollections.collections,
                            year2024: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>2025 YTD Collections ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.billingsCollections.collections.year2025YTD ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        billingsCollections: {
                          ...financials.billingsCollections,
                          collections: {
                            ...financials.billingsCollections.collections,
                            year2025YTD: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Anticipated Collections */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#1c151d]">Anticipated Collections (First 12 Months at Dentons)</h3>
              <p className="text-sm text-[#7c6b80] mb-4">Provide expected collections only for clients you reasonably anticipate representing</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Low Estimate ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.anticipatedCollections.lowEstimate ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        anticipatedCollections: {
                          ...financials.anticipatedCollections,
                          lowEstimate: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base Estimate ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.anticipatedCollections.baseEstimate ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        anticipatedCollections: {
                          ...financials.anticipatedCollections,
                          baseEstimate: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>High Estimate ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.anticipatedCollections.highEstimate ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        anticipatedCollections: {
                          ...financials.anticipatedCollections,
                          highEstimate: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Additional Financial Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#1c151d]">Additional Financial Information</h3>
              
              <div className="space-y-6">
                {/* Fiscal Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Is your firm on a fiscal or calendar year?</Label>
                    <Select
                      value={financials.additionalInfo.fiscalYearType}
                      onValueChange={(value) =>
                        updateFinancials({
                          additionalInfo: {
                            ...financials.additionalInfo,
                            fiscalYearType: value as "calendar" | "fiscal",
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calendar">Calendar Year</SelectItem>
                        <SelectItem value="fiscal">Fiscal Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {financials.additionalInfo.fiscalYearType === "fiscal" && (
                    <div className="space-y-2">
                      <Label>Fiscal Year Explanation</Label>
                      <Input
                        value={financials.additionalInfo.fiscalYearExplanation}
                        onChange={(e) =>
                          updateFinancials({
                            additionalInfo: {
                              ...financials.additionalInfo,
                              fiscalYearExplanation: e.target.value,
                            },
                          })
                        }
                        placeholder="Explain your fiscal year"
                      />
                    </div>
                  )}
                </div>

                {/* Unbilled/Uncollected Fees */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unbilled Fees at Year End ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.additionalInfo.unbilledFeesYearEnd ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          additionalInfo: {
                            ...financials.additionalInfo,
                            unbilledFeesYearEnd: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Uncollected Billed Fees ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={financials.additionalInfo.uncollectedBilledFees ?? 0}
                      onChange={(e) =>
                        updateFinancials({
                          additionalInfo: {
                            ...financials.additionalInfo,
                            uncollectedBilledFees: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {financials.additionalInfo.uncollectedBilledFees > 0 && (
                  <div className="space-y-2">
                    <Label>Explanation for Uncollected Fees</Label>
                    <Textarea
                      value={financials.additionalInfo.uncollectedExplanation}
                      onChange={(e) =>
                        updateFinancials({
                          additionalInfo: {
                            ...financials.additionalInfo,
                            uncollectedExplanation: e.target.value,
                          },
                        })
                      }
                      placeholder="Explain any uncollected fees"
                      rows={3}
                    />
                  </div>
                )}

                {/* Origination Credit */}
                <div className="space-y-2">
                  <Label>How does your current firm assign origination credit?</Label>
                  <Textarea
                    value={financials.additionalInfo.originationCreditMethod}
                    onChange={(e) =>
                      updateFinancials({
                        additionalInfo: {
                          ...financials.additionalInfo,
                          originationCreditMethod: e.target.value,
                        },
                      })
                    }
                    placeholder="Describe origination credit assignment (minimum 25 characters)"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#1c151d]">Compensation Expectations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Compensation Expectations ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.compensation.compensationExpectations ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        compensation: {
                          ...financials.compensation,
                          compensationExpectations: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bonus Expectations ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={financials.compensation.bonusExpectations ?? 0}
                    onChange={(e) =>
                      updateFinancials({
                        compensation: {
                          ...financials.compensation,
                          bonusExpectations: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <WizardNavigation
            applicationId={applicationId}
            backHref={getPreviousStep("/application/financials", applicationType) || ""}
            nextHref={getNextStep("/application/financials", applicationType) || ""}
            currentStep="/application/financials"
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
