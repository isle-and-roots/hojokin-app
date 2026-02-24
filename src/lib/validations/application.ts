import { z } from "zod";

export const createApplicationSchema = z.object({
  subsidyId: z.string().min(1, "補助金IDは必須です"),
  subsidyName: z.string().min(1, "補助金名は必須です"),
  profileId: z.string().uuid().optional(),
  sections: z.array(
    z.object({
      sectionKey: z.string().min(1),
      sectionTitle: z.string().min(1),
      group: z.string().optional(),
      aiContent: z.string().optional(),
      userContent: z.string().optional(),
    })
  ).min(1, "セクションが必要です"),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
