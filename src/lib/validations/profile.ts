import { z } from "zod";

export const businessProfileSchema = z.object({
  companyName: z.string().min(1, "事業者名は必須です"),
  representative: z.string().optional().default(""),
  address: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().email("有効なメールアドレスを入力してください").optional().or(z.literal("")),
  industry: z.string().optional().default(""),
  employeeCount: z.number().int().min(0).optional().default(0),
  annualRevenue: z.number().nullable().optional(),
  foundedYear: z.number().int().min(1800).max(2100).nullable().optional(),
  businessDescription: z.string().optional().default(""),
  products: z.string().optional().default(""),
  targetCustomers: z.string().optional().default(""),
  salesChannels: z.string().optional().default(""),
  strengths: z.string().optional().default(""),
  challenges: z.string().optional().default(""),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;
