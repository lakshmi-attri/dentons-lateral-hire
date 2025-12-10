import { z } from "zod";

export const teamOverviewSchema = z.object({
  totalTeamSize: z.string().min(1, "Total team size is required"),
  associates: z.string().min(1, "Number of associates is required"),
  staff: z.string().min(1, "Number of staff is required"),
});

export type TeamOverviewFormData = z.infer<typeof teamOverviewSchema>;

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  yearsWithPartner: z.number().min(0, "Must be 0 or more").max(50),
  expectedToJoin: z.enum(["Yes", "No", "Undecided"]),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
