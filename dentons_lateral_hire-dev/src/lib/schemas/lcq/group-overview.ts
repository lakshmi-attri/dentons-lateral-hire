import { z } from "zod";

export const groupOverviewSchema = z.object({
  firmName: z.string().min(2, "Firm/Practice name is required"),
  firmStructure: z.string().min(1, "Firm structure is required"),
  yearEstablished: z.coerce.number()
    .min(1800, "Year must be 1800 or later")
    .max(2025, "Year cannot be in the future")
    .nullable()
    .optional(),
  totalPartnersInFirm: z.coerce.number().min(1, "At least 1 partner required"),
  partnersJoiningDentons: z.coerce.number().min(2, "At least 2 partners must join"),
  totalAssociates: z.coerce.number().min(0, "Must be 0 or greater"),
  associatesJoining: z.coerce.number().min(0, "Must be 0 or greater"),
  totalStaff: z.coerce.number().min(0, "Must be 0 or greater"),
  staffJoining: z.coerce.number().min(0, "Must be 0 or greater"),
  currentOfficeLocations: z.array(z.string()).min(1, "At least one office location is required"),
  primaryPracticeAreas: z.array(z.string()).min(1, "At least one practice area is required"),
  reasonForTransition: z.string().min(100, "Please provide at least 100 characters"),
  integrationTimeline: z.string().min(50, "Please provide at least 50 characters"),
}).superRefine((data, ctx) => {
  if (data.partnersJoiningDentons > data.totalPartnersInFirm) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Partners joining cannot exceed total partners",
      path: ["partnersJoiningDentons"],
    });
  }
  if (data.associatesJoining > data.totalAssociates) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Associates joining cannot exceed total associates",
      path: ["associatesJoining"],
    });
  }
  if (data.staffJoining > data.totalStaff) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Staff joining cannot exceed total staff",
      path: ["staffJoining"],
    });
  }
});

export type GroupOverviewFormData = z.infer<typeof groupOverviewSchema>;
