"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";
import { useAuthStore } from "@/stores/auth-store";
import { PRACTICE_AREAS } from "@/types/lcq";
import type { ExpectedToJoin } from "@/types/lcq";

const EXPECTED_TO_JOIN_OPTIONS: { value: ExpectedToJoin; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "undecided", label: "Undecided" },
];

export default function TeamMembersPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const teamMembers = useLCQStore((s) => s.teamMembers);
  const addAssociate = useLCQStore((s) => s.addAssociate);
  const updateAssociate = useLCQStore((s) => s.updateAssociate);
  const deleteAssociate = useLCQStore((s) => s.deleteAssociate);
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
  const addStaffMember = useLCQStore((s) => s.addStaffMember);
  const updateStaffMember = useLCQStore((s) => s.updateStaffMember);
  const deleteStaffMember = useLCQStore((s) => s.deleteStaffMember);
  const groupOverview = useLCQStore((s) => s.groupOverview);

  const [associateDialogOpen, setAssociateDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [editingAssociateId, setEditingAssociateId] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [associateForm, setAssociateForm] = useState({
    fullName: "",
    email: "",
    currentTitle: "",
    barAdmissions: "",
    yearsOfExperience: 0,
    practiceArea: "",
    currentCompensation: 0,
    expectedToJoin: "yes" as ExpectedToJoin,
    billableRate: 0,
  });

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    currentTitle: "",
    yearsWithFirm: 0,
    currentCompensation: 0,
    expectedToJoin: "yes" as ExpectedToJoin,
  });

  const resetAssociateForm = () => {
    setAssociateForm({
      fullName: "",
      email: "",
      currentTitle: "",
      barAdmissions: "",
      yearsOfExperience: 0,
      practiceArea: "",
      currentCompensation: 0,
      expectedToJoin: "yes",
      billableRate: 0,
    });
    setEditingAssociateId(null);
  };

  const resetStaffForm = () => {
    setStaffForm({
      fullName: "",
      currentTitle: "",
      yearsWithFirm: 0,
      currentCompensation: 0,
      expectedToJoin: "yes",
    });
    setEditingStaffId(null);
  };

  const handleOpenAssociateDialog = (id?: string) => {
    if (id) {
      const associate = teamMembers.associates.find((a) => a.id === id);
      if (associate) {
        setAssociateForm({
          fullName: associate.fullName,
          email: associate.email,
          currentTitle: associate.currentTitle,
          barAdmissions: associate.barAdmissions,
          yearsOfExperience: associate.yearsOfExperience,
          practiceArea: associate.practiceArea,
          currentCompensation: associate.currentCompensation,
          expectedToJoin: associate.expectedToJoin,
          billableRate: associate.billableRate,
        });
        setEditingAssociateId(id);
      }
    } else {
      resetAssociateForm();
    }
    setAssociateDialogOpen(true);
  };

  const handleOpenStaffDialog = (id?: string) => {
    if (id) {
      const staff = teamMembers.staff.find((s) => s.id === id);
      if (staff) {
        setStaffForm({
          fullName: staff.fullName,
          currentTitle: staff.currentTitle,
          yearsWithFirm: staff.yearsWithFirm,
          currentCompensation: staff.currentCompensation,
          expectedToJoin: staff.expectedToJoin,
        });
        setEditingStaffId(id);
      }
    } else {
      resetStaffForm();
    }
    setStaffDialogOpen(true);
  };

  const handleSaveAssociate = () => {
    if (!associateForm.fullName || !associateForm.currentTitle) return;

    if (editingAssociateId) {
      updateAssociate(editingAssociateId, associateForm);
    } else {
      addAssociate(associateForm);
    }
    setAssociateDialogOpen(false);
    resetAssociateForm();
  };

  const handleSaveStaff = () => {
    if (!staffForm.fullName || !staffForm.currentTitle) return;

    if (editingStaffId) {
      updateStaffMember(editingStaffId, staffForm);
    } else {
      addStaffMember(staffForm);
    }
    setStaffDialogOpen(false);
    resetStaffForm();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getExpectedBadgeColor = (expected: ExpectedToJoin) => {
    switch (expected) {
      case "yes":
        return "bg-green-100 text-green-800";
      case "no":
        return "bg-red-100 text-red-800";
      case "undecided":
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Team Members</h1>
        <p className="text-[#7c6b80] mt-2">
          Add information about associates and staff who may be joining Dentons with your group.
          {groupOverview.associatesJoining > 0 &&
            ` You indicated ${groupOverview.associatesJoining} associate(s) will be joining.`}
          {groupOverview.staffJoining > 0 &&
            ` You indicated ${groupOverview.staffJoining} staff member(s) will be joining.`}
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <Tabs defaultValue="associates" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="associates">
              Associates ({teamMembers.associates.length})
            </TabsTrigger>
            <TabsTrigger value="staff">
              Staff ({teamMembers.staff.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="associates">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {teamMembers.associates.length} associate(s) added
                </p>
                <Dialog open={associateDialogOpen} onOpenChange={setAssociateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" onClick={() => handleOpenAssociateDialog()}>
                      <Plus className="w-4 h-4" />
                      Add Associate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAssociateId ? "Edit Associate" : "Add Associate"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name *</Label>
                          <Input
                            value={associateForm.fullName}
                            onChange={(e) =>
                              setAssociateForm({ ...associateForm, fullName: e.target.value })
                            }
                            placeholder="Full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={associateForm.email}
                            onChange={(e) =>
                              setAssociateForm({ ...associateForm, email: e.target.value })
                            }
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Current Title *</Label>
                          <Input
                            value={associateForm.currentTitle}
                            onChange={(e) =>
                              setAssociateForm({ ...associateForm, currentTitle: e.target.value })
                            }
                            placeholder="Associate, Senior Associate"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Years of Experience</Label>
                          <Input
                            type="number"
                            min="0"
                            max="40"
                            value={associateForm.yearsOfExperience}
                            onChange={(e) =>
                              setAssociateForm({
                                ...associateForm,
                                yearsOfExperience: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Bar Admissions *</Label>
                        <Input
                          value={associateForm.barAdmissions}
                          onChange={(e) =>
                            setAssociateForm({ ...associateForm, barAdmissions: e.target.value })
                          }
                          placeholder="e.g., New York, California"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Practice Area *</Label>
                        <Select
                          value={associateForm.practiceArea}
                          onValueChange={(value) =>
                            setAssociateForm({ ...associateForm, practiceArea: value })
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Current Compensation ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={associateForm.currentCompensation}
                            onChange={(e) =>
                              setAssociateForm({
                                ...associateForm,
                                currentCompensation: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Billable Rate ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={associateForm.billableRate}
                            onChange={(e) =>
                              setAssociateForm({
                                ...associateForm,
                                billableRate: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Expected to Join *</Label>
                        <Select
                          value={associateForm.expectedToJoin}
                          onValueChange={(value: ExpectedToJoin) =>
                            setAssociateForm({ ...associateForm, expectedToJoin: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPECTED_TO_JOIN_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" onClick={resetAssociateForm}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button onClick={handleSaveAssociate}>
                        {editingAssociateId ? "Update" : "Add Associate"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {teamMembers.associates.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  <p>No associates added yet.</p>
                  <p className="text-sm mt-1">Click &quot;Add Associate&quot; to add team members.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Practice Area</TableHead>
                        <TableHead className="text-right">Compensation</TableHead>
                        <TableHead>Joining</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.associates.map((associate) => (
                        <TableRow key={associate.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{associate.fullName}</p>
                              {associate.email && (
                                <p className="text-xs text-gray-500">{associate.email}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{associate.currentTitle}</TableCell>
                          <TableCell>{associate.practiceArea}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(associate.currentCompensation)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getExpectedBadgeColor(associate.expectedToJoin)}>
                              {EXPECTED_TO_JOIN_OPTIONS.find(
                                (o) => o.value === associate.expectedToJoin
                              )?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenAssociateDialog(associate.id)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteAssociate(associate.id)}
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
            </div>
          </TabsContent>

          <TabsContent value="staff">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {teamMembers.staff.length} staff member(s) added
                </p>
                <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" onClick={() => handleOpenStaffDialog()}>
                      <Plus className="w-4 h-4" />
                      Add Staff Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingStaffId ? "Edit Staff Member" : "Add Staff Member"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          value={staffForm.fullName}
                          onChange={(e) =>
                            setStaffForm({ ...staffForm, fullName: e.target.value })
                          }
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Current Title *</Label>
                        <Input
                          value={staffForm.currentTitle}
                          onChange={(e) =>
                            setStaffForm({ ...staffForm, currentTitle: e.target.value })
                          }
                          placeholder="Legal Secretary, Paralegal, etc."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Years with Firm</Label>
                          <Input
                            type="number"
                            min="0"
                            max="40"
                            value={staffForm.yearsWithFirm}
                            onChange={(e) =>
                              setStaffForm({
                                ...staffForm,
                                yearsWithFirm: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Current Compensation ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={staffForm.currentCompensation}
                            onChange={(e) =>
                              setStaffForm({
                                ...staffForm,
                                currentCompensation: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Expected to Join *</Label>
                        <Select
                          value={staffForm.expectedToJoin}
                          onValueChange={(value: ExpectedToJoin) =>
                            setStaffForm({ ...staffForm, expectedToJoin: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPECTED_TO_JOIN_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" onClick={resetStaffForm}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button onClick={handleSaveStaff}>
                        {editingStaffId ? "Update" : "Add Staff Member"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {teamMembers.staff.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  <p>No staff members added yet.</p>
                  <p className="text-sm mt-1">Click &quot;Add Staff Member&quot; to add team members.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Years with Firm</TableHead>
                        <TableHead className="text-right">Compensation</TableHead>
                        <TableHead>Joining</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.staff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.fullName}</TableCell>
                          <TableCell>{staff.currentTitle}</TableCell>
                          <TableCell>{staff.yearsWithFirm} years</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(staff.currentCompensation)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getExpectedBadgeColor(staff.expectedToJoin)}>
                              {EXPECTED_TO_JOIN_OPTIONS.find(
                                (o) => o.value === staff.expectedToJoin
                              )?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenStaffDialog(staff.id)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteStaffMember(staff.id)}
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
            </div>
          </TabsContent>
        </Tabs>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/team-members", applicationType) || ""}
          nextHref={getNextStep("/application/team-members", applicationType) || ""}
          currentStep="/application/team-members"
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
    </div>
  );
}
