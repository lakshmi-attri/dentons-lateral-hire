import { z } from "zod";

export const strategySchema = z.object({
  whyDentons: z.string().min(50, "Please provide at least 50 characters"),
  growthStrategy: z.string().min(50, "Please provide at least 50 characters"),
  practiceAreas: z
    .array(z.string())
    .min(1, "Select at least one practice area"),
  regions: z.array(z.string()).min(1, "Select at least one region"),
  referralSource: z.string(),
  additionalComments: z.string(),
});

export type StrategyFormData = z.infer<typeof strategySchema>;
