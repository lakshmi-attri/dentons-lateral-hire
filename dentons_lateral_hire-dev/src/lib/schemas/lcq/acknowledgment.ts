import { z } from "zod";

export const acknowledgmentSchema = z.object({
  certifyTrueAndComplete: z.boolean().refine((val) => val === true, {
    message: "You must certify that the information is true and complete",
  }),
  understandMaterialChanges: z.boolean().refine((val) => val === true, {
    message: "You must confirm you understand the requirement to update material changes",
  }),
  candidateSignature: z.string().min(2, "Signature is required"),
  signatureDate: z.string().min(1, "Date is required"),
  
  // Recruiter information
  representedByRecruiter: z.boolean(),
  recruiterName: z.string().optional().default(""),
  recruiterPhone: z.string().optional().default(""),
  recruiterEmail: z.string().optional().default(""),
  confirmSoleRepresentation: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  if (data.representedByRecruiter) {
    if (!data.recruiterName || data.recruiterName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recruiter name is required",
        path: ["recruiterName"],
      });
    }
    if (!data.recruiterPhone || data.recruiterPhone.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recruiter phone is required",
        path: ["recruiterPhone"],
      });
    }
    if (!data.recruiterEmail || !z.string().email().safeParse(data.recruiterEmail).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid recruiter email is required",
        path: ["recruiterEmail"],
      });
    }
    if (!data.confirmSoleRepresentation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please confirm this is your sole representative",
        path: ["confirmSoleRepresentation"],
      });
    }
  }
});

export type AcknowledgmentFormData = z.infer<typeof acknowledgmentSchema>;
