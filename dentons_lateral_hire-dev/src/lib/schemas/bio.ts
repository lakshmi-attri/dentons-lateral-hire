import { z } from "zod";

export const bioSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  preferredName: z.string(),
  currentFirm: z.string().min(2, "Current firm is required"),
  currentTitle: z.string().min(2, "Current title is required"),
  barYear: z.string().regex(/^\d{4}$/, "Enter a valid year (YYYY)"),
  barState: z.string().min(2, "Primary bar state is required"),
  practiceYears: z.string().min(1, "Years in practice is required"),
  practiceAreas: z.string().min(2, "Practice areas are required"),
  biography: z.string().min(50, "Biography must be at least 50 characters"),
});

export type BioFormData = z.infer<typeof bioSchema>;
