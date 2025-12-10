"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MonthPicker } from "@/components/ui/month-picker";
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
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { workHistorySchema, type WorkHistoryFormData } from "@/lib/schemas/lcq/work-history";
import { useLCQStore } from "@/stores/lcq-store";
import { useAuthStore } from "@/stores/auth-store";
import type { PartnerType, WorkPosition } from "@/types/lcq";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";

const partnerTypes: { value: PartnerType; label: string }[] = [
  { value: "equity", label: "Equity Partner" },
  { value: "non_equity", label: "Non-Equity Partner" },
  { value: "income", label: "Income Partner" },
  { value: "counsel", label: "Of Counsel" },
  { value: "other", label: "Other" },
];

export default function WorkHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const workHistory = useLCQStore((s) => s.workHistory);
  const updateWorkHistory = useLCQStore((s) => s.updateWorkHistory);
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

  const [priorPositions, setPriorPositions] = useState<WorkPosition[]>(
    workHistory.priorPositions || []
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPosition, setNewPosition] = useState({
    firmName: "",
    location: "",
    title: "",
    startDate: "",
    endDate: "",
    reasonForLeaving: "",
  });

  const form = useForm<WorkHistoryFormData>({
    resolver: zodResolver(workHistorySchema),
    defaultValues: {
      currentPosition: {
        firmName: workHistory.currentPosition?.firmName || "",
        location: workHistory.currentPosition?.location || "",
        title: workHistory.currentPosition?.title || "",
        partnerType: workHistory.currentPosition?.partnerType || null,
        startDate: workHistory.currentPosition?.startDate || "",
        reasonForMove: workHistory.currentPosition?.reasonForMove || "",
      },
      priorPositions: workHistory.priorPositions || [],
      plannedTimeOff: workHistory.plannedTimeOff || false,
      timeOffDetails: workHistory.timeOffDetails || "",
      expectedNoticePeriod: workHistory.expectedNoticePeriod || "",
      everAskedToLeave: workHistory.everAskedToLeave || false,
      askedToLeaveDetails: workHistory.askedToLeaveDetails || "",
    },
  });

  const plannedTimeOff = form.watch("plannedTimeOff");
  const everAskedToLeave = form.watch("everAskedToLeave");

  useEffect(() => {
    const subscription = form.watch((data) => {
      if (data.currentPosition) {
        updateWorkHistory({
          currentPosition: {
            firmName: data.currentPosition.firmName || "",
            location: data.currentPosition.location || "",
            title: data.currentPosition.title || "",
            partnerType: data.currentPosition.partnerType || null,
            startDate: data.currentPosition.startDate || "",
            reasonForMove: data.currentPosition.reasonForMove || "",
          },
          plannedTimeOff: data.plannedTimeOff || false,
          timeOffDetails: data.timeOffDetails || "",
          expectedNoticePeriod: data.expectedNoticePeriod || "",
          everAskedToLeave: data.everAskedToLeave || false,
          askedToLeaveDetails: data.askedToLeaveDetails || "",
          priorPositions,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateWorkHistory, priorPositions]);

  const handleAddPosition = () => {
    if (
      newPosition.firmName &&
      newPosition.title &&
      newPosition.startDate &&
      newPosition.endDate
    ) {
      const position: WorkPosition = {
        id: Math.random().toString(36).substring(2, 11),
        ...newPosition,
      };
      const updated = [...priorPositions, position];
      setPriorPositions(updated);
      updateWorkHistory({ priorPositions: updated });
      setNewPosition({
        firmName: "",
        location: "",
        title: "",
        startDate: "",
        endDate: "",
        reasonForLeaving: "",
      });
      setDialogOpen(false);
    }
  };

  const handleDeletePosition = (id: string) => {
    const updated = priorPositions.filter((p) => p.id !== id);
    setPriorPositions(updated);
    updateWorkHistory({ priorPositions: updated });
  };

  const handleSubmit = async (): Promise<boolean> => {
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      updateWorkHistory({
        ...data,
        priorPositions,
      });
    }
    return isValid;
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Work History</h1>
        <p className="text-[#7c6b80] mt-2">
          Please provide information about your current and prior employment.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <Form {...form}>
          <form className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Current Position
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="currentPosition.firmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firm / Company Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Current employer name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentPosition.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (City) *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="New York, NY" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="currentPosition.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title / Position *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Partner" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentPosition.partnerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type (if applicable)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {partnerTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentPosition.startDate"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <MonthPicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select start month"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentPosition.reasonForMove"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Considering a Move * (min 25 characters)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Please describe why you are considering this transition..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <p className="text-sm text-gray-500">
                      {field.value?.length || 0} / 25 characters minimum
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Prior Positions
                </h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Prior Position
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Prior Position</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Firm / Company Name *</Label>
                          <Input
                            value={newPosition.firmName}
                            onChange={(e) =>
                              setNewPosition({ ...newPosition, firmName: e.target.value })
                            }
                            placeholder="Previous employer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location (City) *</Label>
                          <Input
                            value={newPosition.location}
                            onChange={(e) =>
                              setNewPosition({ ...newPosition, location: e.target.value })
                            }
                            placeholder="City, State"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Title / Position *</Label>
                        <Input
                          value={newPosition.title}
                          onChange={(e) =>
                            setNewPosition({ ...newPosition, title: e.target.value })
                          }
                          placeholder="Associate"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date *</Label>
                          <MonthPicker
                            value={newPosition.startDate}
                            onChange={(value) =>
                              setNewPosition({ ...newPosition, startDate: value })
                            }
                            placeholder="Select start month"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date *</Label>
                          <MonthPicker
                            value={newPosition.endDate}
                            onChange={(value) =>
                              setNewPosition({ ...newPosition, endDate: value })
                            }
                            placeholder="Select end month"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Reason for Leaving *</Label>
                        <Textarea
                          value={newPosition.reasonForLeaving}
                          onChange={(e) =>
                            setNewPosition({
                              ...newPosition,
                              reasonForLeaving: e.target.value,
                            })
                          }
                          placeholder="Describe your reason for leaving..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddPosition}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Firm</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priorPositions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        No prior positions added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    priorPositions.map((pos) => (
                      <TableRow key={pos.id}>
                        <TableCell>
                          <div>{pos.firmName}</div>
                          <div className="text-sm text-gray-500">{pos.location}</div>
                        </TableCell>
                        <TableCell>{pos.title}</TableCell>
                        <TableCell>
                          {pos.startDate} - {pos.endDate}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePosition(pos.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Transition Questions
              </h3>

              <FormField
                control={form.control}
                name="plannedTimeOff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you have any planned time off before starting?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(v) => field.onChange(v === "true")}
                        value={field.value ? "true" : "false"}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="timeoff-yes" />
                          <Label htmlFor="timeoff-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="timeoff-no" />
                          <Label htmlFor="timeoff-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {plannedTimeOff && (
                <FormField
                  control={form.control}
                  name="timeOffDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Off Details *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Please provide details about your planned time off..."
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="expectedNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Notice Period *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 2 weeks, 30 days, 90 days" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="everAskedToLeave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Have you ever been asked to resign or leave a position?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(v) => field.onChange(v === "true")}
                        value={field.value ? "true" : "false"}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="asked-yes" />
                          <Label htmlFor="asked-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="asked-no" />
                          <Label htmlFor="asked-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {everAskedToLeave && (
                <FormField
                  control={form.control}
                  name="askedToLeaveDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please Explain *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Please provide details about the circumstances..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/work-history", applicationType) || ""}
          nextHref={getNextStep("/application/work-history", applicationType) || ""}
          currentStep="/application/work-history"
          onSubmit={handleSubmit}
          isValid={form.formState.isValid}
        />
        </CardContent>
      </Card>
    </div>
  );
}
