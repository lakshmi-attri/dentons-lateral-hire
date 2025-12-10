import { z } from "zod";

export const referenceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  company: z.string().min(2, "Company is required"),
  businessType: z.string().min(2, "Business type is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  email: z.string().email("Invalid email address"),
  mayContactPreOffer: z.boolean(),
});

export const recruiterInfoSchema = z.object({
  representedByRecruiter: z.boolean(),
  recruiterName: z.string().optional().default(""),
  recruiterFirm: z.string().optional().default(""),
  recruiterPhone: z.string().optional().default(""),
  recruiterEmail: z.string().optional().default(""),
  soleRepresentative: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  if (data.representedByRecruiter) {
    if (!data.recruiterName || data.recruiterName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recruiter name is required",
        path: ["recruiterName"],
      });
    }
    if (!data.recruiterFirm || data.recruiterFirm.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recruiter firm is required",
        path: ["recruiterFirm"],
      });
    }
    if (!data.recruiterPhone || !/^\d{10}$/.test(data.recruiterPhone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recruiter phone is required (10 digits)",
        path: ["recruiterPhone"],
      });
    }
    if (!data.recruiterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recruiterEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid recruiter email is required",
        path: ["recruiterEmail"],
      });
    }
    if (!data.soleRepresentative) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please confirm this is your sole representative",
        path: ["soleRepresentative"],
      });
    }
  }
});

export const referencesSchema = z.object({
  reference1: referenceSchema,
  reference2: referenceSchema,
  reference3: referenceSchema,
  recruiter: recruiterInfoSchema,
});

export type ReferenceFormData = z.infer<typeof referenceSchema>;
export type RecruiterInfoFormData = z.infer<typeof recruiterInfoSchema>;
export type ReferencesFormData = z.infer<typeof referencesSchema>;
