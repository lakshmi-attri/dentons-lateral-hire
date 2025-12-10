"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { teamOverviewSchema, type TeamOverviewFormData } from "@/lib/schemas/team";
import { useApplicationStore, type TeamMember } from "@/stores/application-store";
import { AddTeamMemberDialog } from "@/components/application/add-team-member-dialog";
import { useStepGuard } from "@/hooks/use-step-guard";

export default function TeamPage() {
  const router = useRouter();
  const { isChecking } = useStepGuard("/application/team");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const teamOverview = useApplicationStore((s) => s.teamOverview);
  const teamMembers = useApplicationStore((s) => s.teamMembers);
  const setTeamOverview = useApplicationStore((s) => s.setTeamOverview);
  const addTeamMember = useApplicationStore((s) => s.addTeamMember);
  const deleteTeamMembers = useApplicationStore((s) => s.deleteTeamMembers);
  const markStepCompleted = useApplicationStore((s) => s.markStepCompleted);

  const form = useForm<TeamOverviewFormData>({
    resolver: zodResolver(teamOverviewSchema),
    defaultValues: teamOverview,
  });

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7c6b80]">Loading...</div>
      </div>
    );
  }

  const onSubmit = (data: TeamOverviewFormData) => {
    setTeamOverview(data);
    markStepCompleted("/application/team");
    router.push("/application/strategy");
  };

  const onSaveDraft = () => {
    const values = form.getValues();
    setTeamOverview(values);
  };

  const handleAddMember = (member: Omit<TeamMember, "id">) => {
    addTeamMember(member);
  };

  const handleDeleteSelected = () => {
    deleteTeamMembers(selectedIds);
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === teamMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(teamMembers.map((m) => m.id));
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 px-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h2 className="text-[#1c151d] text-4xl font-black leading-tight tracking-[-0.033em]">
            Team Information
          </h2>
          <p className="text-[#7c6b80] text-base font-normal leading-normal">
            Please provide information about your current team members who may
            join you at Dentons.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-[#e5e0e7] shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <h3 className="text-[#1c151d] text-xl font-bold leading-tight">
                  Team Overview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="totalTeamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-[#1c151d]">
                          Total Team Size
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="e.g., 5"
                            className="h-12 border-[#e5e0e7] bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="associates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-[#1c151d]">
                          Number of Associates
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="e.g., 2"
                            className="h-12 border-[#e5e0e7] bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="staff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-[#1c151d]">
                          Number of Staff
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="e.g., 2"
                            className="h-12 border-[#e5e0e7] bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e5e0e7] shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-[#1c151d] text-xl font-bold leading-tight">
                    Team Members
                  </h3>
                  <div className="flex gap-2">
                    <AddTeamMemberDialog onAdd={handleAddMember} />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 gap-2 border-[#e5e0e7] bg-white text-[#1c151d] font-bold"
                      onClick={handleDeleteSelected}
                      disabled={selectedIds.length === 0}
                    >
                      <Trash2 className="h-5 w-5" />
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f7f6f8]">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              teamMembers.length > 0 &&
                              selectedIds.length === teamMembers.length
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="text-xs text-[#7c6b80] uppercase font-medium">
                          Name
                        </TableHead>
                        <TableHead className="text-xs text-[#7c6b80] uppercase font-medium">
                          Title
                        </TableHead>
                        <TableHead className="text-xs text-[#7c6b80] uppercase font-medium text-center">
                          Years with Partner
                        </TableHead>
                        <TableHead className="text-xs text-[#7c6b80] uppercase font-medium text-center">
                          Expected to Join
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-[#7c6b80]"
                          >
                            No team members added yet. Click &quot;Add
                            Member&quot; to add your first team member.
                          </TableCell>
                        </TableRow>
                      ) : (
                        teamMembers.map((member) => (
                          <TableRow
                            key={member.id}
                            className="border-b border-[#e5e0e7]"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.includes(member.id)}
                                onCheckedChange={() => toggleSelect(member.id)}
                              />
                            </TableCell>
                            <TableCell className="text-[#1c151d] font-medium">
                              {member.name}
                            </TableCell>
                            <TableCell className="text-[#1c151d]">
                              {member.title}
                            </TableCell>
                            <TableCell className="text-center text-[#1c151d]">
                              {member.yearsWithPartner}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  member.expectedToJoin === "Yes"
                                    ? "bg-green-100 text-green-800"
                                    : member.expectedToJoin === "No"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {member.expectedToJoin}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
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
              <Link href="/application/financials">
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
                Save & Continue
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
