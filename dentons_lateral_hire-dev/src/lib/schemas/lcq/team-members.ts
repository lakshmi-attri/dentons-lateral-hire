import { z } from "zod";

export const associateMemberSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  currentTitle: z.string().min(2, "Title is required"),
  barAdmissions: z.string().min(2, "Bar admissions are required"),
  yearsOfExperience: z.coerce.number().min(0, "Must be 0 or greater").max(40, "Maximum 40 years"),
  practiceArea: z.string().min(2, "Practice area is required"),
  currentCompensation: z.coerce.number().min(0, "Must be 0 or greater"),
  expectedToJoin: z.enum(["yes", "no", "undecided"]),
  billableRate: z.coerce.number().min(0, "Must be 0 or greater"),
});

export const staffMemberSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2, "Full name is required"),
  currentTitle: z.string().min(2, "Title is required"),
  yearsWithFirm: z.coerce.number().min(0, "Must be 0 or greater").max(40, "Maximum 40 years"),
  currentCompensation: z.coerce.number().min(0, "Must be 0 or greater"),
  expectedToJoin: z.enum(["yes", "no", "undecided"]),
});

export const teamMembersSchema = z.object({
  associates: z.array(associateMemberSchema).optional().default([]),
  staff: z.array(staffMemberSchema).optional().default([]),
});

export const addAssociateMemberSchema = associateMemberSchema.omit({ id: true });
export const addStaffMemberSchema = staffMemberSchema.omit({ id: true });

export type AssociateMemberFormData = z.infer<typeof associateMemberSchema>;
export type StaffMemberFormData = z.infer<typeof staffMemberSchema>;
export type TeamMembersFormData = z.infer<typeof teamMembersSchema>;
