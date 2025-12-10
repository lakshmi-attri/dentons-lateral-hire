"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, AlertCircle, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useLCQStore } from "@/stores/lcq-store";

interface SectionSummaryProps {
  title: string;
  href: string;
  items: { label: string; value: string | number | boolean | null }[];
}

function SectionSummary({ title, href, items }: SectionSummaryProps) {
  const formatValue = (value: string | number | boolean | null): string => {
    if (value === null || value === undefined || value === "") return "Not provided";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Link href={href}>
          <Button variant="outline" size="sm" className="gap-1">
            <Edit2 className="w-3 h-3" />
            Edit
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium truncate">{formatValue(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;
  const contactInfo = useLCQStore((s) => s.contactInfo);
  const education = useLCQStore((s) => s.education);
  const workHistory = useLCQStore((s) => s.workHistory);
  const financials = useLCQStore((s) => s.financials);
  const portableClients = useLCQStore((s) => s.portableClients);
  const conflicts = useLCQStore((s) => s.conflicts);
  const dueDiligence = useLCQStore((s) => s.dueDiligence);
  const references = useLCQStore((s) => s.references);
  const acknowledgment = useLCQStore((s) => s.acknowledgment);
  const updateAcknowledgment = useLCQStore((s) => s.updateAcknowledgment);
  const applicationType = useLCQStore((s) => s.applicationType);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isComplete = (section: string): boolean => {
    switch (section) {
      case "contact":
        return !!(contactInfo.legalFirstName && contactInfo.legalLastName && contactInfo.personalEmail);
      case "education":
        return education.education.length > 0 && education.barAdmissions.length > 0;
      case "workHistory":
        return !!(workHistory.currentPosition.firmName && workHistory.currentPosition.startDate);
      case "clients":
        return true;
      case "conflicts":
        return true;
      case "dueDiligence":
        return dueDiligence.legallyEligibleToWork !== null;
      case "references":
        return !!(references.reference1.name && references.reference2.name && references.reference3.name);
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!acknowledgment.certifyTrueAndComplete) {
      setSubmitError("You must certify that the information is true and complete.");
      return;
    }
    if (!acknowledgment.understandMaterialChanges) {
      setSubmitError("You must confirm you understand the requirement to update material changes.");
      return;
    }
    if (!acknowledgment.candidateSignature) {
      setSubmitError("Please provide your signature.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      updateAcknowledgment({ signatureDate: new Date().toISOString().split("T")[0] });
      router.push(`/application/${applicationId}/submitted`);
    } catch {
      setSubmitError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalConflicts =
    conflicts.adverseToDentons.length +
    conflicts.priorClients.length +
    conflicts.prospectiveClients.length +
    (conflicts.proBonoWork?.hasProBonoWork ? 1 : 0);

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Review & Submit</h1>
        <p className="text-[#7c6b80] mt-2">
          Please review your application before submitting. Click &quot;Edit&quot; on any section to make changes.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-600">Application Type:</span>
            <span className="font-medium capitalize">{applicationType || "Not selected"}</span>
          </div>

          <SectionSummary
            title="Contact Information"
            href={`/application/${applicationId}/contact`}
            items={[
              { label: "Name", value: `${contactInfo.legalFirstName} ${contactInfo.legalLastName}` },
              { label: "Email", value: contactInfo.personalEmail },
              { label: "Phone", value: contactInfo.personalPhone },
              { label: "Current Practice", value: contactInfo.currentPractice },
            ]}
          />

          <SectionSummary
            title="Education & Admissions"
            href={`/application/${applicationId}/education`}
            items={[
              { label: "Education Entries", value: `${education.education.length} entries` },
              { label: "Bar Admissions", value: `${education.barAdmissions.length} admissions` },
              { label: "Professional Orgs", value: `${education.professionalOrgs.length} memberships` },
              { label: "", value: "" },
            ]}
          />

          <SectionSummary
            title="Work History"
            href={`/application/${applicationId}/work-history`}
            items={[
              { label: "Current Firm", value: workHistory.currentPosition.firmName },
              { label: "Current Title", value: workHistory.currentPosition.title },
              { label: "Prior Positions", value: `${workHistory.priorPositions.length} positions` },
              { label: "Notice Period", value: workHistory.expectedNoticePeriod },
            ]}
          />

          <SectionSummary
            title="Financial Snapshot"
            href={`/application/${applicationId}/financials`}
            items={[
              { label: "Base Estimate", value: `$${financials.anticipatedCollections.baseEstimate.toLocaleString()}` },
              { label: "Compensation Expectation", value: `$${financials.compensation.compensationExpectations.toLocaleString()}` },
              { label: "Bonus Expectation", value: `$${financials.compensation.bonusExpectations.toLocaleString()}` },
              { label: "", value: "" },
            ]}
          />

          <SectionSummary
            title="Portable Clients"
            href={`/application/${applicationId}/clients`}
            items={[
              { label: "Total Clients", value: `${portableClients.length} clients` },
              { label: "Total Matters", value: `${portableClients.reduce((acc, c) => acc + c.matters.length, 0)} matters` },
              { label: "", value: "" },
              { label: "", value: "" },
            ]}
          />

          <SectionSummary
            title="Conflicts Information"
            href={`/application/${applicationId}/conflicts`}
            items={[
              { label: "Adverse to Dentons", value: `${conflicts.adverseToDentons.length} entries` },
              { label: "Prior Clients", value: `${conflicts.priorClients.length} clients` },
              { label: "Prospective Clients", value: `${conflicts.prospectiveClients.length} clients` },
              { label: "Pro Bono", value: conflicts.proBonoWork.hasProBonoWork ? "Provided" : "None" },
            ]}
          />

          <SectionSummary
            title="Due Diligence"
            href={`/application/${applicationId}/due-diligence`}
            items={[
              { label: "Work Eligible", value: dueDiligence.legallyEligibleToWork },
              { label: "Visa Sponsorship Needed", value: dueDiligence.requiresVisaSponsorship },
              { label: "Board Memberships", value: `${dueDiligence.boardMemberships.length} memberships` },
              { label: "", value: "" },
            ]}
          />

          <SectionSummary
            title="References"
            href={`/application/${applicationId}/references`}
            items={[
              { label: "Reference 1", value: references.reference1.name || "Not provided" },
              { label: "Reference 2", value: references.reference2.name || "Not provided" },
              { label: "Reference 3", value: references.reference3.name || "Not provided" },
              { label: "Recruiter", value: references.recruiter.representedByRecruiter ? references.recruiter.recruiterName : "N/A" },
            ]}
          />

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-bold mb-4 text-[#1c151d]">Acknowledgment</h3>
            <div className="bg-[#f7f6f8] p-6 rounded-lg space-y-4 border border-[#e5e0e7]">
              <p className="text-sm text-[#1c151d] leading-relaxed">
                I certify that the information submitted in this questionnaire is true and complete to the best of my knowledge and Dentons may rely on such information in evaluating my candidacy.
              </p>
              <p className="text-sm text-[#1c151d] leading-relaxed">
                If any of the provided information materially changes during the course of my discussions with Dentons, I will affirmatively update this information before any potential offer that Dentons may extend to me is accepted.
              </p>

              <div className="border-t border-[#e5e0e7] pt-4 mt-4 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="certifyTrueAndComplete"
                    checked={acknowledgment.certifyTrueAndComplete}
                    onCheckedChange={(checked) =>
                      updateAcknowledgment({ certifyTrueAndComplete: checked as boolean })
                    }
                  />
                  <Label htmlFor="certifyTrueAndComplete" className="text-sm font-medium leading-tight text-[#1c151d]">
                    I certify that the information is true and complete to the best of my knowledge *
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="understandMaterialChanges"
                    checked={acknowledgment.understandMaterialChanges}
                    onCheckedChange={(checked) =>
                      updateAcknowledgment({ understandMaterialChanges: checked as boolean })
                    }
                  />
                  <Label htmlFor="understandMaterialChanges" className="text-sm font-medium leading-tight text-[#1c151d]">
                    I understand I must update Dentons if any material information changes *
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Signature *</Label>
                    <Input
                      value={acknowledgment.candidateSignature}
                      onChange={(e) => updateAcknowledgment({ candidateSignature: e.target.value })}
                      placeholder="Type your full legal name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={acknowledgment.signatureDate}
                      onChange={(e) => updateAcknowledgment({ signatureDate: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-xs text-[#7c6b80]">
                  By typing your name above, you acknowledge that this constitutes your electronic signature.
                </p>
              </div>
            </div>
          </div>

          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center pt-6 border-t">
            <Link href={`/application/${applicationId}/references`}>
              <Button variant="outline">Back</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !acknowledgment.certifyTrueAndComplete || !acknowledgment.understandMaterialChanges || !acknowledgment.candidateSignature}
              className="gap-2"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
