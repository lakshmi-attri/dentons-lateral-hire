"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";
import { useAuthStore } from "@/stores/auth-store";
import { PRACTICE_AREAS, US_STATES } from "@/types/lcq";
import type { PartnerType } from "@/types/lcq";

const PARTNER_TYPES: { value: PartnerType; label: string }[] = [
  { value: "equity", label: "Equity Partner" },
  { value: "non_equity", label: "Non-Equity Partner" },
  { value: "income", label: "Income Partner" },
  { value: "counsel", label: "Counsel" },
  { value: "other", label: "Other" },
];

export default function PartnersPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const additionalPartners = useLCQStore((s) => s.additionalPartners);
  const addPartner = useLCQStore((s) => s.addPartner);
  const updatePartner = useLCQStore((s) => s.updatePartner);
  const deletePartner = useLCQStore((s) => s.deletePartner);
  const groupOverview = useLCQStore((s) => s.groupOverview);
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullLegalName: "",
    email: "",
    phone: "",
    currentTitle: "",
    partnerType: "equity" as PartnerType,
    primaryBarAdmission: "",
    barNumber: "",
    yearsAtCurrentFirm: 0,
    primaryPracticeArea: "",
    billings2022: 0,
    billings2023: 0,
    billings2024: 0,
    portableBookEstimate: 0,
    compensationExpectation: 0,
    completeFullLCQSeparately: false,
  });

  const resetForm = () => {
    setFormData({
      fullLegalName: "",
      email: "",
      phone: "",
      currentTitle: "",
      partnerType: "equity",
      primaryBarAdmission: "",
      barNumber: "",
      yearsAtCurrentFirm: 0,
      primaryPracticeArea: "",
      billings2022: 0,
      billings2023: 0,
      billings2024: 0,
      portableBookEstimate: 0,
      compensationExpectation: 0,
      completeFullLCQSeparately: false,
    });
    setEditingId(null);
  };

  const handleOpenDialog = (partnerId?: string) => {
    if (partnerId) {
      const partner = additionalPartners.find((p) => p.id === partnerId);
      if (partner) {
        setFormData({
          fullLegalName: partner.fullLegalName,
          email: partner.email,
          phone: partner.phone,
          currentTitle: partner.currentTitle,
          partnerType: partner.partnerType,
          primaryBarAdmission: partner.primaryBarAdmission,
          barNumber: partner.barNumber,
          yearsAtCurrentFirm: partner.yearsAtCurrentFirm,
          primaryPracticeArea: partner.primaryPracticeArea,
          billings2022: partner.billings2022,
          billings2023: partner.billings2023,
          billings2024: partner.billings2024,
          portableBookEstimate: partner.portableBookEstimate,
          compensationExpectation: partner.compensationExpectation,
          completeFullLCQSeparately: partner.completeFullLCQSeparately,
        });
        setEditingId(partnerId);
      }
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.fullLegalName || !formData.email) return;

    if (editingId) {
      updatePartner(editingId, formData);
    } else {
      addPartner(formData);
    }
    setDialogOpen(false);
    resetForm();
  };

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
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Additional Partners</h1>
        <p className="text-[#7c6b80] mt-2">
          Add information about the other partners who will be joining Dentons with your group. You indicated {groupOverview.partnersJoiningDentons} partners will be joining.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            {additionalPartners.length} of {groupOverview.partnersJoiningDentons - 1} additional partner(s) added
            <span className="text-xs text-gray-500 ml-2">(excluding primary applicant)</span>
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Partner" : "Add Partner"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Legal Name *</Label>
                    <Input
                      value={formData.fullLegalName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullLegalName: e.target.value })
                      }
                      placeholder="Full legal name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone * (10 digits)</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData({ ...formData, phone: digits });
                      }}
                      placeholder="1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Title *</Label>
                    <Input
                      value={formData.currentTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, currentTitle: e.target.value })
                      }
                      placeholder="Partner, Counsel, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Partner Type *</Label>
                    <Select
                      value={formData.partnerType}
                      onValueChange={(value: PartnerType) =>
                        setFormData({ ...formData, partnerType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTNER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Years at Current Firm *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsAtCurrentFirm}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yearsAtCurrentFirm: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Bar Admission *</Label>
                    <Select
                      value={formData.primaryBarAdmission}
                      onValueChange={(value) =>
                        setFormData({ ...formData, primaryBarAdmission: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bar Number *</Label>
                    <Input
                      value={formData.barNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, barNumber: e.target.value })
                      }
                      placeholder="Bar number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Primary Practice Area *</Label>
                  <Select
                    value={formData.primaryPracticeArea}
                    onValueChange={(value) =>
                      setFormData({ ...formData, primaryPracticeArea: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select practice area" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRACTICE_AREAS.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Historical Billings</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>2022 Billings ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.billings2022}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            billings2022: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>2023 Billings ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.billings2023}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            billings2023: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>2024 Billings ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.billings2024}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            billings2024: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Portable Book Estimate ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.portableBookEstimate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          portableBookEstimate: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Compensation Expectation ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.compensationExpectation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compensationExpectation: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fullLCQ"
                    checked={formData.completeFullLCQSeparately}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        completeFullLCQSeparately: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="fullLCQ">
                    This partner will complete a full LCQ separately
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={handleSave}>
                  {editingId ? "Update Partner" : "Add Partner"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {additionalPartners.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border rounded-lg">
            <p>No additional partners added yet.</p>
            <p className="text-sm mt-2">
              Click &quot;Add Partner&quot; to add information about other partners joining.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Practice Area</TableHead>
                  <TableHead className="text-right">Portable Book</TableHead>
                  <TableHead className="text-right">Comp. Expectation</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {additionalPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{partner.fullLegalName}</p>
                        <p className="text-xs text-gray-500">{partner.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {PARTNER_TYPES.find((t) => t.value === partner.partnerType)?.label}
                    </TableCell>
                    <TableCell>{partner.primaryPracticeArea}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(partner.portableBookEstimate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(partner.compensationExpectation)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(partner.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePartner(partner.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/partners", applicationType) || ""}
          nextHref={getNextStep("/application/partners", applicationType) || ""}
          currentStep="/application/partners"
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
    </div>
  );
}
