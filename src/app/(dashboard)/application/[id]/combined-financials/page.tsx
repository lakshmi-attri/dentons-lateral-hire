"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";
import { useAuthStore } from "@/stores/auth-store";

export default function CombinedFinancialsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const combinedFinancials = useLCQStore((s) => s.combinedFinancials);
  const updateCombinedFinancials = useLCQStore((s) => s.updateCombinedFinancials);
  const additionalPartners = useLCQStore((s) => s.additionalPartners);
  const teamMembers = useLCQStore((s) => s.teamMembers);
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

  const totalPartnerBook = additionalPartners.reduce(
    (sum, p) => sum + p.portableBookEstimate,
    0
  );

  const totalPartnerComp = additionalPartners.reduce(
    (sum, p) => sum + p.compensationExpectation,
    0
  );

  const totalAssociateComp = teamMembers.associates.reduce(
    (sum, a) => sum + a.currentCompensation,
    0
  );

  const totalStaffComp = teamMembers.staff.reduce(
    (sum, s) => sum + s.currentCompensation,
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Combined Financials</h1>
        <p className="text-[#7c6b80] mt-2">
          Provide combined financial projections and infrastructure requirements for the group.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Summary from Team Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Partner Portable Book Total</p>
                <p className="font-medium text-lg">{formatCurrency(totalPartnerBook)}</p>
              </div>
              <div>
                <p className="text-gray-500">Partner Compensation Total</p>
                <p className="font-medium text-lg">{formatCurrency(totalPartnerComp)}</p>
              </div>
              <div>
                <p className="text-gray-500">Associate Salaries Total</p>
                <p className="font-medium text-lg">{formatCurrency(totalAssociateComp)}</p>
              </div>
              <div>
                <p className="text-gray-500">Staff Salaries Total</p>
                <p className="font-medium text-lg">{formatCurrency(totalStaffComp)}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Combined Revenue Projections</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Low Estimate ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={combinedFinancials.combinedLowEstimate}
                  onChange={(e) =>
                    updateCombinedFinancials({
                      combinedLowEstimate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-gray-500">Conservative projection</p>
              </div>
              <div className="space-y-2">
                <Label>Base Estimate ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={combinedFinancials.combinedBaseEstimate}
                  onChange={(e) =>
                    updateCombinedFinancials({
                      combinedBaseEstimate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-gray-500">Most likely projection</p>
              </div>
              <div className="space-y-2">
                <Label>High Estimate ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={combinedFinancials.combinedHighEstimate}
                  onChange={(e) =>
                    updateCombinedFinancials({
                      combinedHighEstimate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-gray-500">Optimistic projection</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Payroll & Compensation</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Total Annual Payroll ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={combinedFinancials.totalAnnualPayroll}
                  onChange={(e) =>
                    updateCombinedFinancials({
                      totalAnnualPayroll: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-gray-500">
                  Total payroll for all team members joining
                </p>
              </div>
              <div className="space-y-2">
                <Label>Partner Draw Total ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={combinedFinancials.partnerDrawTotal}
                  onChange={(e) =>
                    updateCombinedFinancials({
                      partnerDrawTotal: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-gray-500">Combined partner draws/compensation</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label>Associate Salaries Total ($)</Label>
                <Input
                  type="number"
                  min="0"
                  value={combinedFinancials.associateSalariesTotal}
                  onChange={(e) =>
                    updateCombinedFinancials({
                      associateSalariesTotal: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Staff Salaries Total ($)</Label>
                <Input
                  type="number"
                  min="0"
                  value={combinedFinancials.staffSalariesTotal}
                  onChange={(e) =>
                    updateCombinedFinancials({
                      staffSalariesTotal: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Infrastructure Requirements</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Office Space Requirements *</Label>
                <Textarea
                  value={combinedFinancials.officeSpaceRequirements}
                  onChange={(e) =>
                    updateCombinedFinancials({ officeSpaceRequirements: e.target.value })
                  }
                  placeholder="Describe office space needs including number of offices, workstations, conference rooms, etc. (minimum 25 characters)"
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  {combinedFinancials.officeSpaceRequirements.length}/25 characters minimum
                </p>
              </div>
              <div className="space-y-2">
                <Label>Technology & IT Needs</Label>
                <Textarea
                  value={combinedFinancials.technologyITNeeds}
                  onChange={(e) =>
                    updateCombinedFinancials({ technologyITNeeds: e.target.value })
                  }
                  placeholder="Describe any specific technology, software, or IT infrastructure requirements..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Other Infrastructure</Label>
                <Textarea
                  value={combinedFinancials.otherInfrastructure}
                  onChange={(e) =>
                    updateCombinedFinancials({ otherInfrastructure: e.target.value })
                  }
                  placeholder="Any other infrastructure or operational requirements..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </div>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/combined-financials", applicationType) || ""}
          nextHref={getNextStep("/application/combined-financials", applicationType) || ""}
          currentStep="/application/combined-financials"
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
    </div>
  );
}
