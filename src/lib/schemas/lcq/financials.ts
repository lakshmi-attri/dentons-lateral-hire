import { z } from "zod";

export const yearlyDataSchema = z.object({
  year2022: z.coerce.number().min(0, "Must be 0 or greater"),
  year2023: z.coerce.number().min(0, "Must be 0 or greater"),
  year2024: z.coerce.number().min(0, "Must be 0 or greater"),
  year2025YTD: z.coerce.number().min(0, "Must be 0 or greater"),
});

export const timekeeperSchema = z.object({
  totalBillableHours: yearlyDataSchema,
  hoursOriginatedByYou: yearlyDataSchema,
  nonBillableHours: yearlyDataSchema,
  standardHourlyRate: yearlyDataSchema,
  effectiveBillRate: yearlyDataSchema,
});

export const billingsCollectionsSchema = z.object({
  billings: yearlyDataSchema,
  collections: yearlyDataSchema,
});

export const additionalInfoSchema = z.object({
  fiscalYearType: z.enum(["calendar", "fiscal"]).optional().default("calendar"),
  fiscalYearExplanation: z.string().optional().default(""),
  unbilledFeesYearEnd: z.coerce.number().min(0, "Must be 0 or greater").optional().default(0),
  uncollectedBilledFees: z.coerce.number().min(0, "Must be 0 or greater").optional().default(0),
  uncollectedExplanation: z.string().optional().default(""),
  originationCreditMethod: z.string().optional().default(""),
  canIncreaseRate: z.boolean().optional().default(false),
  newRateIfYes: z.coerce.number().min(0).optional().default(0),
  clientRateRestrictions: z.boolean().optional().default(false),
  restrictionsDetail: z.string().optional().default(""),
});

export const anticipatedCollectionsSchema = z.object({
  lowEstimate: z.coerce.number().min(0, "Must be 0 or greater"),
  baseEstimate: z.coerce.number().min(0, "Must be 0 or greater"),
  highEstimate: z.coerce.number().min(0, "Must be 0 or greater"),
  higherThanHistoricalExplanation: z.string().optional().default(""),
}).superRefine((data, ctx) => {
  if (data.baseEstimate < data.lowEstimate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Base estimate must be greater than or equal to low estimate",
      path: ["baseEstimate"],
    });
  }
  if (data.highEstimate < data.baseEstimate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "High estimate must be greater than or equal to base estimate",
      path: ["highEstimate"],
    });
  }
});

export const compensationSchema = z.object({
  compensationExpectations: z.coerce.number().min(0, "Must be 0 or greater"),
  bonusExpectations: z.coerce.number().min(0).optional().default(0),
  businessDevelopmentBudget: z.coerce.number().min(0).optional().default(0),
  practiceExpenditures: z.string().optional().default(""),
});

export const financialsSchema = z.object({
  timekeeper: timekeeperSchema,
  billingsCollections: billingsCollectionsSchema,
  additionalInfo: additionalInfoSchema,
  anticipatedCollections: anticipatedCollectionsSchema,
  compensation: compensationSchema,
});

export type YearlyDataFormData = z.infer<typeof yearlyDataSchema>;
export type TimekeeperFormData = z.infer<typeof timekeeperSchema>;
export type BillingsCollectionsFormData = z.infer<typeof billingsCollectionsSchema>;
export type AdditionalInfoFormData = z.infer<typeof additionalInfoSchema>;
export type AnticipatedCollectionsFormData = z.infer<typeof anticipatedCollectionsSchema>;
export type CompensationFormData = z.infer<typeof compensationSchema>;
export type FinancialsFormData = z.infer<typeof financialsSchema>;
