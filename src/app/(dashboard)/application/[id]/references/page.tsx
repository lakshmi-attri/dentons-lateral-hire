"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";
import { useAuthStore } from "@/stores/auth-store";
import type { Reference, RecruiterInfo } from "@/types/lcq";

interface ReferenceFormProps {
  title: string;
  reference: Reference;
  onChange: (data: Partial<Reference>) => void;
}

function ReferenceForm({ title, reference, onChange }: ReferenceFormProps) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            value={reference.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Reference full name"
          />
        </div>
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input
            value={reference.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Current title"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company/Firm *</Label>
          <Input
            value={reference.company}
            onChange={(e) => onChange({ company: e.target.value })}
            placeholder="Company or firm name"
          />
        </div>
        <div className="space-y-2">
          <Label>Business Type *</Label>
          <Input
            value={reference.businessType}
            onChange={(e) => onChange({ businessType: e.target.value })}
            placeholder="e.g., Law Firm, Corporation"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone * (10 digits)</Label>
          <Input
            value={reference.phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              onChange({ phone: digits });
            }}
            placeholder="1234567890"
          />
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={reference.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${title.toLowerCase().replace(/\s/g, "-")}-contact`}
          checked={reference.mayContactPreOffer}
          onCheckedChange={(checked) =>
            onChange({ mayContactPreOffer: checked as boolean })
          }
        />
        <Label htmlFor={`${title.toLowerCase().replace(/\s/g, "-")}-contact`}>
          May be contacted prior to offer
        </Label>
      </div>
    </div>
  );
}

export default function ReferencesPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const references = useLCQStore((s) => s.references);
  const updateReferences = useLCQStore((s) => s.updateReferences);
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

  const handleReference1Change = (data: Partial<Reference>) => {
    updateReferences({ reference1: { ...references.reference1, ...data } });
  };

  const handleReference2Change = (data: Partial<Reference>) => {
    updateReferences({ reference2: { ...references.reference2, ...data } });
  };

  const handleReference3Change = (data: Partial<Reference>) => {
    updateReferences({ reference3: { ...references.reference3, ...data } });
  };

  const handleRecruiterChange = (data: Partial<RecruiterInfo>) => {
    updateReferences({ recruiter: { ...references.recruiter, ...data } });
  };

  const handleSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">References</h1>
        <p className="text-[#7c6b80] mt-2">
          Please provide three professional references who can speak to your qualifications and character.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <div className="space-y-6">
          <ReferenceForm
            title="Reference 1"
            reference={references.reference1}
            onChange={handleReference1Change}
          />
          <ReferenceForm
            title="Reference 2"
            reference={references.reference2}
            onChange={handleReference2Change}
          />
          <ReferenceForm
            title="Reference 3"
            reference={references.reference3}
            onChange={handleReference3Change}
          />

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Recruiter Information</h3>
            <div className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="representedByRecruiter"
                  checked={references.recruiter.representedByRecruiter}
                  onCheckedChange={(checked) =>
                    handleRecruiterChange({ representedByRecruiter: checked as boolean })
                  }
                />
                <Label htmlFor="representedByRecruiter">
                  I am represented by a legal recruiter
                </Label>
              </div>

              {references.recruiter.representedByRecruiter && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Recruiter Name *</Label>
                      <Input
                        value={references.recruiter.recruiterName}
                        onChange={(e) =>
                          handleRecruiterChange({ recruiterName: e.target.value })
                        }
                        placeholder="Recruiter's full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recruiting Firm *</Label>
                      <Input
                        value={references.recruiter.recruiterFirm}
                        onChange={(e) =>
                          handleRecruiterChange({ recruiterFirm: e.target.value })
                        }
                        placeholder="Recruiting firm name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Recruiter Phone * (10 digits)</Label>
                      <Input
                        value={references.recruiter.recruiterPhone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                          handleRecruiterChange({ recruiterPhone: digits });
                        }}
                        placeholder="1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recruiter Email *</Label>
                      <Input
                        type="email"
                        value={references.recruiter.recruiterEmail}
                        onChange={(e) =>
                          handleRecruiterChange({ recruiterEmail: e.target.value })
                        }
                        placeholder="recruiter@email.com"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="soleRepresentative"
                      checked={references.recruiter.soleRepresentative}
                      onCheckedChange={(checked) =>
                        handleRecruiterChange({ soleRepresentative: checked as boolean })
                      }
                    />
                    <Label htmlFor="soleRepresentative">
                      This recruiter is my sole representative for this opportunity
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/references", applicationType) || ""}
          nextHref={getNextStep("/application/references", applicationType) || ""}
          currentStep="/application/references"
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
    </div>
  );
}
