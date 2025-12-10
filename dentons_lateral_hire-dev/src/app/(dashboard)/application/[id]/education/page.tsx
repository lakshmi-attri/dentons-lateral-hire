"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, GraduationCap, Scale, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { useAuthStore } from "@/stores/auth-store";
import type { InstitutionType } from "@/types/lcq";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";

const institutionTypes: { value: InstitutionType; label: string }[] = [
  { value: "law_school", label: "Law School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "other", label: "Other" },
];

export default function EducationPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const education = useLCQStore((s) => s.education);
  const addEducationEntry = useLCQStore((s) => s.addEducationEntry);
  const deleteEducationEntry = useLCQStore((s) => s.deleteEducationEntry);
  const addBarAdmission = useLCQStore((s) => s.addBarAdmission);
  const deleteBarAdmission = useLCQStore((s) => s.deleteBarAdmission);
  const addProfessionalOrg = useLCQStore((s) => s.addProfessionalOrg);
  const deleteProfessionalOrg = useLCQStore((s) => s.deleteProfessionalOrg);
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

  const [eduDialogOpen, setEduDialogOpen] = useState(false);
  const [barDialogOpen, setBarDialogOpen] = useState(false);
  const [orgDialogOpen, setOrgDialogOpen] = useState(false);

  const [newEducation, setNewEducation] = useState({
    type: "law_school" as InstitutionType,
    institutionName: "",
    degree: "",
    graduationYear: "",
  });

  const [newBar, setNewBar] = useState({
    stateOrCourt: "",
    barNumber: "",
    admissionDate: "",
    isActive: true,
    inGoodStanding: true,
  });

  const [newOrg, setNewOrg] = useState({
    name: "",
    role: "",
  });

  const hasLawSchool = education.education.some((e) => e.type === "law_school");
  const hasUndergrad = education.education.some((e) => e.type === "undergraduate");
  const hasBarAdmission = education.barAdmissions.length > 0;
  const hasGoodStanding = education.barAdmissions.some((b) => b.inGoodStanding);

  const handleAddEducation = () => {
    if (
      newEducation.institutionName &&
      newEducation.degree &&
      newEducation.graduationYear
    ) {
      addEducationEntry(newEducation);
      setNewEducation({
        type: "law_school",
        institutionName: "",
        degree: "",
        graduationYear: "",
      });
      setEduDialogOpen(false);
    }
  };

  const handleAddBar = () => {
    if (newBar.stateOrCourt && newBar.barNumber && newBar.admissionDate) {
      addBarAdmission(newBar);
      setNewBar({
        stateOrCourt: "",
        barNumber: "",
        admissionDate: "",
        isActive: true,
        inGoodStanding: true,
      });
      setBarDialogOpen(false);
    }
  };

  const handleAddOrg = () => {
    if (newOrg.name) {
      addProfessionalOrg(newOrg);
      setNewOrg({ name: "", role: "" });
      setOrgDialogOpen(false);
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!hasLawSchool) {
      alert("At least one law school entry is required");
      return false;
    }
    if (!hasUndergrad) {
      alert("At least one undergraduate entry is required");
      return false;
    }
    if (!hasBarAdmission) {
      alert("At least one bar admission is required");
      return false;
    }
    if (!hasGoodStanding) {
      alert("At least one bar admission must be in good standing");
      return false;
    }
    return true;
  };

  const isValid = hasLawSchool && hasUndergrad && hasBarAdmission && hasGoodStanding;

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">
          Education & Admissions
        </h1>
        <p className="text-[#7c6b80] mt-2">
          Please provide your educational background, bar admissions, and professional organization memberships.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
      <CardContent className="p-8">
        <Tabs defaultValue="education" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Education
              {!hasLawSchool || !hasUndergrad ? (
                <span className="ml-1 text-red-500">*</span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Bar Admissions
              {!hasBarAdmission || !hasGoodStanding ? (
                <span className="ml-1 text-red-500">*</span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organizations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="education" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Educational Background</h3>
                <p className="text-sm text-gray-500">
                  Add your law school and undergraduate degrees (both required).
                </p>
              </div>
              <Dialog open={eduDialogOpen} onOpenChange={setEduDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Education
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Education Entry</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Institution Type *</Label>
                      <Select
                        value={newEducation.type}
                        onValueChange={(v) =>
                          setNewEducation({ ...newEducation, type: v as InstitutionType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {institutionTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Institution Name *</Label>
                      <Input
                        value={newEducation.institutionName}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            institutionName: e.target.value,
                          })
                        }
                        placeholder="Harvard Law School"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree *</Label>
                      <Input
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, degree: e.target.value })
                        }
                        placeholder="Juris Doctor (JD)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Graduation Year *</Label>
                      <Input
                        value={newEducation.graduationYear}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            graduationYear: e.target.value,
                          })
                        }
                        placeholder="2015"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddEducation}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {!hasLawSchool && (
              <p className="text-red-500 text-sm">
                At least one law school entry is required
              </p>
            )}
            {!hasUndergrad && (
              <p className="text-red-500 text-sm">
                At least one undergraduate entry is required
              </p>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {education.education.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No education entries added yet
                    </TableCell>
                  </TableRow>
                ) : (
                  education.education.map((edu) => (
                    <TableRow key={edu.id}>
                      <TableCell className="capitalize">
                        {edu.type.replace("_", " ")}
                      </TableCell>
                      <TableCell>{edu.institutionName}</TableCell>
                      <TableCell>{edu.degree}</TableCell>
                      <TableCell>{edu.graduationYear}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEducationEntry(edu.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="bar" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Bar Admissions</h3>
                <p className="text-sm text-gray-500">
                  Add all state bar admissions (at least one required, one must be
                  in good standing).
                </p>
              </div>
              <Dialog open={barDialogOpen} onOpenChange={setBarDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Bar Admission
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Bar Admission</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>State / Court / Agency *</Label>
                      <Input
                        value={newBar.stateOrCourt}
                        onChange={(e) =>
                          setNewBar({ ...newBar, stateOrCourt: e.target.value })
                        }
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bar / License Number *</Label>
                      <Input
                        value={newBar.barNumber}
                        onChange={(e) =>
                          setNewBar({ ...newBar, barNumber: e.target.value })
                        }
                        placeholder="123456"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Admission Date *</Label>
                      <DatePicker
                        value={newBar.admissionDate}
                        onChange={(date) =>
                          setNewBar({ ...newBar, admissionDate: date ? date.toISOString().split('T')[0] : "" })
                        }
                        placeholder="Select admission date"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={newBar.isActive}
                        onCheckedChange={(checked) =>
                          setNewBar({ ...newBar, isActive: checked as boolean })
                        }
                      />
                      <Label htmlFor="isActive">Currently Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inGoodStanding"
                        checked={newBar.inGoodStanding}
                        onCheckedChange={(checked) =>
                          setNewBar({ ...newBar, inGoodStanding: checked as boolean })
                        }
                      />
                      <Label htmlFor="inGoodStanding">In Good Standing</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddBar}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {!hasBarAdmission && (
              <p className="text-red-500 text-sm">
                At least one bar admission is required
              </p>
            )}
            {hasBarAdmission && !hasGoodStanding && (
              <p className="text-red-500 text-sm">
                At least one bar admission must be in good standing
              </p>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State/Court</TableHead>
                  <TableHead>Bar Number</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Good Standing</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {education.barAdmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No bar admissions added yet
                    </TableCell>
                  </TableRow>
                ) : (
                  education.barAdmissions.map((bar) => (
                    <TableRow key={bar.id}>
                      <TableCell>{bar.stateOrCourt}</TableCell>
                      <TableCell>{bar.barNumber}</TableCell>
                      <TableCell>{bar.admissionDate}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs",
                            bar.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {bar.isActive ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs",
                            bar.inGoodStanding
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {bar.inGoodStanding ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteBarAdmission(bar.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Professional Organizations</h3>
                <p className="text-sm text-gray-500">
                  Add any professional organizations you belong to (optional).
                </p>
              </div>
              <Dialog open={orgDialogOpen} onOpenChange={setOrgDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Organization
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Professional Organization</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Organization Name *</Label>
                      <Input
                        value={newOrg.name}
                        onChange={(e) =>
                          setNewOrg({ ...newOrg, name: e.target.value })
                        }
                        placeholder="American Bar Association"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role / Involvement</Label>
                      <Input
                        value={newOrg.role}
                        onChange={(e) =>
                          setNewOrg({ ...newOrg, role: e.target.value })
                        }
                        placeholder="Member, Committee Chair, etc."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddOrg}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Role / Involvement</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {education.professionalOrgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No professional organizations added yet
                    </TableCell>
                  </TableRow>
                ) : (
                  education.professionalOrgs.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>{org.name}</TableCell>
                      <TableCell>{org.role || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProfessionalOrg(org.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/education", applicationType) || ""}
          nextHref={getNextStep("/application/education", applicationType) || ""}
          currentStep="/application/education"
          onSubmit={handleSubmit}
          isValid={isValid}
        />
        </CardContent>
      </Card>
    </div>
  );
}
