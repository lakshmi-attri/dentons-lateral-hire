import { z } from "zod";

export const matterSchema = z.object({
  id: z.string(),
  matterName: z.string().min(2, "Matter name is required"),
  matterDescription: z.string().min(25, "Please provide at least 25 characters"),
  adverseParties: z.string().min(2, "Adverse parties are required"),
  howAdverseInvolved: z.string().min(10, "Please describe how adverse parties are involved"),
});

export const clientFinancialHistorySchema = z.object({
  billings: z.object({
    year2022: z.coerce.number().min(0),
    year2023: z.coerce.number().min(0),
    year2024: z.coerce.number().min(0),
    year2025YTD: z.coerce.number().min(0),
  }),
  collections: z.object({
    year2022: z.coerce.number().min(0),
    year2023: z.coerce.number().min(0),
    year2024: z.coerce.number().min(0),
    year2025YTD: z.coerce.number().min(0),
  }),
});

export const clientAnticipatedCollectionsSchema = z.object({
  lowEstimate: z.coerce.number().min(0),
  baseEstimate: z.coerce.number().min(0),
  highEstimate: z.coerce.number().min(0),
}).superRefine((data, ctx) => {
  if (data.baseEstimate < data.lowEstimate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Base must be >= Low",
      path: ["baseEstimate"],
    });
  }
  if (data.highEstimate < data.baseEstimate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "High must be >= Base",
      path: ["highEstimate"],
    });
  }
});

export const portableClientSchema = z.object({
  id: z.string(),
  clientName: z.string().min(2, "Client name is required"),
  keyContactName: z.string().min(2, "Key contact name is required"),
  keyContactTitle: z.string().optional().default(""),
  keyContactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  affiliatesSubsidiaries: z.string().optional().default(""),
  yearsRepresented: z.coerce.number().min(1, "Must be at least 1 year").max(50, "Maximum 50 years"),
  portableWithin30Days: z.boolean(),
  numberOfOpenMatters: z.coerce.number().min(1, "At least 1 open matter required"),
  workDescription: z.string().min(25, "Please provide at least 25 characters"),
  staffingDescription: z.string().min(25, "Please provide at least 25 characters"),
  billRateForClient: z.coerce.number().min(0, "Must be 0 or greater"),
  matters: z.array(matterSchema).min(1, "At least one matter is required per client"),
  financialHistory: clientFinancialHistorySchema,
  anticipatedCollections: clientAnticipatedCollectionsSchema,
});

export const addPortableClientSchema = portableClientSchema.omit({ id: true, matters: true });
export const addMatterSchema = matterSchema.omit({ id: true });

export const portableClientsPageSchema = z.object({
  clients: z.array(portableClientSchema).optional().default([]),
});

export type MatterFormData = z.infer<typeof matterSchema>;
export type PortableClientFormData = z.infer<typeof portableClientSchema>;
export type PortableClientsPageFormData = z.infer<typeof portableClientsPageSchema>;
