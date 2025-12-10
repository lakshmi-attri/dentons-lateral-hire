import { z } from "zod";

export const currentPositionSchema = z.object({
  firmName: z.string().optional().default(""),
  location: z.string().optional().default(""),
  title: z.string().optional().default(""),
  partnerType: z.enum(["equity", "non_equity", "income", "counsel", "other"]).nullable().optional(),
  startDate: z.string().optional().default(""),
  reasonForMove: z.string().optional().default(""),
});

export const priorPositionSchema = z.object({
  id: z.string(),
  firmName: z.string().min(2, "Firm/Company name is required"),
  location: z.string().min(2, "Location is required"),
  title: z.string().min(2, "Title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reasonForLeaving: z.string().min(10, "Please provide at least 10 characters"),
});

export const workHistorySchema = z.object({
  currentPosition: currentPositionSchema,
  priorPositions: z.array(priorPositionSchema).optional().default([]),
  plannedTimeOff: z.boolean().optional().default(false),
  timeOffDetails: z.string().optional().default(""),
  expectedNoticePeriod: z.string().optional().default(""),
  everAskedToLeave: z.boolean().optional().default(false),
  askedToLeaveDetails: z.string().optional().default(""),
}).superRefine((data, ctx) => {
  if (data.plannedTimeOff && (!data.timeOffDetails || data.timeOffDetails.length < 10)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide details about planned time off (min 10 characters)",
      path: ["timeOffDetails"],
    });
  }
  if (data.everAskedToLeave && (!data.askedToLeaveDetails || data.askedToLeaveDetails.length < 25)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide details (min 25 characters)",
      path: ["askedToLeaveDetails"],
    });
  }
});

export const addPriorPositionSchema = priorPositionSchema.omit({ id: true });

export type CurrentPositionFormData = z.infer<typeof currentPositionSchema>;
export type PriorPositionFormData = z.infer<typeof priorPositionSchema>;
export type WorkHistoryFormData = z.infer<typeof workHistorySchema>;
