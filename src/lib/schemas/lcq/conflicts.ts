import { z } from "zod";

// Clients Adverse to Dentons
export const adverseToDentonsSchema = z.object({
  id: z.string(),
  dentonsRepresentedEntity: z.string().min(2, "Entity name is required"),
  matterDescription: z.string().min(10, "Matter description is required"),
  datesOfInvolvement: z.string().min(4, "Dates are required"),
  yourRole: z.string().min(5, "Your role is required"),
});

// Prior Clients
export const priorClientSchema = z.object({
  id: z.string(),
  clientName: z.string().min(2, "Client name is required"),
  natureOfWork: z.string().min(10, "Nature of work is required"),
});

// Prospective Clients
export const prospectiveClientSchema = z.object({
  id: z.string(),
  clientName: z.string().min(2, "Client name is required"),
  natureOfOpportunity: z.string().min(10, "Nature of opportunity is required"),
  adverseEntities: z.string().optional().default(""),
});

// Pro Bono Work
export const proBonoWorkSchema = z.object({
  description: z.string().min(25, "Please describe your pro bono work (min 25 characters)"),
  hasProBonoWork: z.boolean(),
});

export const conflictsSchema = z.object({
  adverseToDentons: z.array(adverseToDentonsSchema),
  hasNoAdverseMatters: z.boolean().optional().default(false),
  priorClients: z.array(priorClientSchema),
  prospectiveClients: z.array(prospectiveClientSchema),
  proBonoWork: proBonoWorkSchema,
});

export const addAdverseToDentonsSchema = adverseToDentonsSchema.omit({ id: true });
export const addPriorClientSchema = priorClientSchema.omit({ id: true });
export const addProspectiveClientSchema = prospectiveClientSchema.omit({ id: true });

export type AdverseToDentonsFormData = z.infer<typeof adverseToDentonsSchema>;
export type PriorClientFormData = z.infer<typeof priorClientSchema>;
export type ProspectiveClientFormData = z.infer<typeof prospectiveClientSchema>;
export type ProBonoWorkFormData = z.infer<typeof proBonoWorkSchema>;
export type ConflictsFormData = z.infer<typeof conflictsSchema>;
