import { z } from "zod";

export const combinedFinancialsSchema = z.object({
  combinedLowEstimate: z.coerce.number().min(0, "Must be 0 or greater"),
  combinedBaseEstimate: z.coerce.number().min(0, "Must be 0 or greater"),
  combinedHighEstimate: z.coerce.number().min(0, "Must be 0 or greater"),
  totalAnnualPayroll: z.coerce.number().min(0, "Must be 0 or greater"),
  partnerDrawTotal: z.coerce.number().min(0, "Must be 0 or greater"),
  associateSalariesTotal: z.coerce.number().min(0, "Must be 0 or greater"),
  staffSalariesTotal: z.coerce.number().min(0, "Must be 0 or greater"),
  officeSpaceRequirements: z.string().min(25, "Please provide at least 25 characters"),
  technologyITNeeds: z.string().optional().default(""),
  otherInfrastructure: z.string().optional().default(""),
}).superRefine((data, ctx) => {
  if (data.combinedBaseEstimate < data.combinedLowEstimate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Base estimate must be >= low estimate",
      path: ["combinedBaseEstimate"],
    });
  }
  if (data.combinedHighEstimate < data.combinedBaseEstimate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "High estimate must be >= base estimate",
      path: ["combinedHighEstimate"],
    });
  }
});

export type CombinedFinancialsFormData = z.infer<typeof combinedFinancialsSchema>;
