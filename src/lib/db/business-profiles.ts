import { createClient } from "@/lib/supabase/server";
import type { BusinessProfile } from "@/types";

interface DbBusinessProfile {
  id: string;
  user_id: string;
  company_name: string;
  representative: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  industry: string | null;
  employee_count: number | null;
  annual_revenue: number | null;
  founded_year: number | null;
  business_description: string | null;
  products: string | null;
  target_customers: string | null;
  sales_channels: string | null;
  strengths: string | null;
  challenges: string | null;
  created_at: string;
  updated_at: string;
}

function toBusinessProfile(row: DbBusinessProfile): BusinessProfile {
  return {
    id: row.id,
    companyName: row.company_name,
    representative: row.representative ?? "",
    address: row.address ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    industry: row.industry ?? "",
    employeeCount: row.employee_count ?? 0,
    annualRevenue: row.annual_revenue,
    foundedYear: row.founded_year,
    businessDescription: row.business_description ?? "",
    products: row.products ?? "",
    targetCustomers: row.target_customers ?? "",
    salesChannels: row.sales_channels ?? "",
    strengths: row.strengths ?? "",
    challenges: row.challenges ?? "",
    recentRevenue: null,
    recentProfit: null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getBusinessProfile(
  userId: string
): Promise<BusinessProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return toBusinessProfile(data as DbBusinessProfile);
}

export async function upsertBusinessProfile(
  userId: string,
  profile: Partial<BusinessProfile>,
  profileId?: string
): Promise<BusinessProfile> {
  const supabase = await createClient();

  const dbData = {
    user_id: userId,
    company_name: profile.companyName ?? "",
    representative: profile.representative || null,
    address: profile.address || null,
    phone: profile.phone || null,
    email: profile.email || null,
    industry: profile.industry || null,
    employee_count: profile.employeeCount ?? null,
    annual_revenue: profile.annualRevenue ?? null,
    founded_year: profile.foundedYear ?? null,
    business_description: profile.businessDescription || null,
    products: profile.products || null,
    target_customers: profile.targetCustomers || null,
    sales_channels: profile.salesChannels || null,
    strengths: profile.strengths || null,
    challenges: profile.challenges || null,
  };

  if (profileId) {
    // Update existing
    const { data, error } = await supabase
      .from("business_profiles")
      .update(dbData)
      .eq("id", profileId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw new Error(`プロフィールの更新に失敗しました: ${error.message}`);
    return toBusinessProfile(data as DbBusinessProfile);
  } else {
    // Insert new
    const { data, error } = await supabase
      .from("business_profiles")
      .insert(dbData)
      .select()
      .single();

    if (error) throw new Error(`プロフィールの作成に失敗しました: ${error.message}`);
    return toBusinessProfile(data as DbBusinessProfile);
  }
}
