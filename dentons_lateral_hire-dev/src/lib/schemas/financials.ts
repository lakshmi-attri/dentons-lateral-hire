import { z } from "zod";

export const billingSchema = z.object({
  client: z.string().min(2, "Client name is required"),
  matter: z.string().min(2, "Matter description is required"),
  year1: z.number().min(0, "Must be 0 or more"),
  year2: z.number().min(0, "Must be 0 or more"),
  year3: z.number().min(0, "Must be 0 or more"),
});

export type BillingFormData = z.infer<typeof billingSchema>;

export const portableClientSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  estimatedBilling: z.number().min(0, "Must be 0 or more"),
  likelihood: z.enum(["High", "Medium", "Low"]),
});

export type PortableClientFormData = z.infer<typeof portableClientSchema>;
