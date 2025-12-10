import { z } from "zod";

export const contactSchema = z.object({
  legalFirstName: z.string().min(1, "First name is required"),
  legalMiddleName: z.string().optional().default(""),
  legalLastName: z.string().min(1, "Last name is required"),
  alias: z.string().optional().default(""),
  aliasType: z.enum(["alias", "former_name", "nickname"]).nullable().optional(),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().optional().default("").or(z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format (XXXXX or XXXXX-XXXX)")),
  personalEmail: z.string().min(1, "Email is required").email("Invalid email address"),
  personalPhone: z.string().optional().default("").or(z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits (no dashes or spaces)")),
  preferredContact: z.enum(["phone", "email"]),
  currentPractice: z.string().optional().default(""),
  reasonForDentons: z.string().optional().default(""),
}).superRefine((data, ctx) => {
  if (data.alias && data.alias.length > 0 && !data.aliasType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify the type of alternate name",
      path: ["aliasType"],
    });
  }
});

export type ContactFormData = z.infer<typeof contactSchema>;
