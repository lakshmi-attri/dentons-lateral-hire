import { z } from "zod";

export const partnerProfileSchema = z.object({
  id: z.string(),
  fullLegalName: z.string().min(2, "Full legal name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  currentTitle: z.string().min(2, "Current title is required"),
  partnerType: z.enum(["equity", "non_equity", "income", "counsel", "other"]),
  primaryBarAdmission: z.string().min(2, "Primary bar admission is required"),
  barNumber: z.string().min(3, "Bar number is required"),
  yearsAtCurrentFirm: z.coerce.number().min(0, "Must be 0 or greater").max(50, "Maximum 50 years"),
  primaryPracticeArea: z.string().min(2, "Practice area is required"),
  billings2022: z.coerce.number().min(0, "Must be 0 or greater"),
  billings2023: z.coerce.number().min(0, "Must be 0 or greater"),
  billings2024: z.coerce.number().min(0, "Must be 0 or greater"),
  portableBookEstimate: z.coerce.number().min(0, "Must be 0 or greater"),
  compensationExpectation: z.coerce.number().min(0, "Must be 0 or greater"),
  completeFullLCQSeparately: z.boolean(),
});

export const addPartnerProfileSchema = partnerProfileSchema.omit({ id: true });

export type PartnerProfileFormData = z.infer<typeof partnerProfileSchema>;
