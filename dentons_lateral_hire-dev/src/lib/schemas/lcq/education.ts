import { z } from "zod";

export const educationEntrySchema = z.object({
  id: z.string(),
  type: z.enum(["law_school", "undergraduate", "graduate", "other"]),
  institutionName: z.string().min(2, "Institution name is required"),
  degree: z.string().min(2, "Degree is required"),
  graduationYear: z.string()
    .regex(/^\d{4}$/, "Enter a valid year (YYYY)")
    .refine(
      (val) => {
        const year = parseInt(val);
        return year >= 1950 && year <= 2030;
      },
      "Year must be between 1950 and 2030"
    ),
});

export const barAdmissionSchema = z.object({
  id: z.string(),
  stateOrCourt: z.string().min(2, "State or court is required"),
  barNumber: z.string().min(3, "Bar number is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  isActive: z.boolean(),
  inGoodStanding: z.boolean(),
});

export const professionalOrgSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Organization name is required"),
  role: z.string().optional().default(""),
});

export const educationSchema = z.object({
  education: z.array(educationEntrySchema).optional().default([]),
  barAdmissions: z.array(barAdmissionSchema).optional().default([]),
  professionalOrgs: z.array(professionalOrgSchema).optional().default([]),
});

export const addEducationEntrySchema = educationEntrySchema.omit({ id: true });
export const addBarAdmissionSchema = barAdmissionSchema.omit({ id: true });
export const addProfessionalOrgSchema = professionalOrgSchema.omit({ id: true });

export type EducationEntryFormData = z.infer<typeof educationEntrySchema>;
export type BarAdmissionFormData = z.infer<typeof barAdmissionSchema>;
export type ProfessionalOrgFormData = z.infer<typeof professionalOrgSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
