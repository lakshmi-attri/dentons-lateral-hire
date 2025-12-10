import { z } from "zod";

export const applicationTypeSchema = z.object({
  applicationType: z.enum(["individual", "group"], {
    message: "Please select an application type",
  }),
  estimatedPartners: z.number().optional(),
  estimatedAssociates: z.number().optional(),
  estimatedStaff: z.number().optional(),
  firmPracticeName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.applicationType === "group") {
    if (!data.estimatedPartners || data.estimatedPartners < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least 2 partners required for group application",
        path: ["estimatedPartners"],
      });
    }
    if (!data.firmPracticeName || data.firmPracticeName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Firm/Practice name is required for group application",
        path: ["firmPracticeName"],
      });
    }
  }
});

export type ApplicationTypeFormData = z.infer<typeof applicationTypeSchema>;
