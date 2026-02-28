import { createClient } from "@supabase/supabase-js";
import type {
  SubsidyInfo,
  SubsidyCategory,
  TargetScale,
  TargetIndustry,
  PromptSupport,
  SubsidyType,
  SubsidySectionDefinition,
} from "@/types";

/** DB行の型（snake_case） */
interface DbSubsidy {
  id: string;
  name: string;
  name_short: string;
  department: string;
  summary: string;
  description: string;
  max_amount: number | null;
  min_amount: number | null;
  subsidy_rate: string;
  deadline: string | null;
  application_period_start: string | null;
  application_period_end: string | null;
  url: string | null;
  categories: string[];
  target_scale: string[];
  target_industries: string[];
  tags: string[];
  eligibility_criteria: string[];
  excluded_cases: string[];
  required_documents: string[];
  application_sections: SubsidySectionDefinition[];
  prompt_support: string;
  subsidy_type: string;
  popularity: number;
  difficulty: string;
  is_active: boolean;
  last_updated: string;
  source: string;
  source_id: string | null;
  source_url: string | null;
  raw_data: unknown;
  ai_extraction_version: string | null;
  created_at: string;
  updated_at: string;
}

/** Service Role Key でクライアント作成（RLSバイパス） */
function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase 環境変数が設定されていません");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Anon Key でクライアント作成（読み取り用） */
function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/** DB行 → SubsidyInfo 変換 */
export function toSubsidyInfo(row: DbSubsidy): SubsidyInfo {
  return {
    id: row.id,
    name: row.name,
    nameShort: row.name_short,
    department: row.department,
    summary: row.summary,
    description: row.description,
    maxAmount: row.max_amount,
    minAmount: row.min_amount,
    subsidyRate: row.subsidy_rate,
    deadline: row.deadline,
    applicationPeriod:
      row.application_period_start
        ? {
            start: row.application_period_start,
            end: row.application_period_end,
          }
        : null,
    url: row.url,
    categories: row.categories as SubsidyCategory[],
    targetScale: row.target_scale as TargetScale[],
    targetIndustries: row.target_industries as TargetIndustry[],
    tags: row.tags,
    eligibilityCriteria: row.eligibility_criteria,
    excludedCases: row.excluded_cases,
    requiredDocuments: row.required_documents,
    applicationSections: row.application_sections,
    promptSupport: row.prompt_support as PromptSupport,
    subsidyType: row.subsidy_type as SubsidyType,
    popularity: row.popularity,
    difficulty: row.difficulty as "EASY" | "MEDIUM" | "HARD",
    isActive: row.is_active,
    lastUpdated: row.last_updated,
  };
}

/** SubsidyInfo → DB行データ変換（UPSERT用） */
export function toDbData(s: SubsidyInfo, source: "manual" | "jgrants" = "manual") {
  return {
    id: s.id,
    name: s.name,
    name_short: s.nameShort,
    department: s.department,
    summary: s.summary,
    description: s.description,
    max_amount: s.maxAmount,
    min_amount: s.minAmount,
    subsidy_rate: s.subsidyRate,
    deadline: s.deadline,
    application_period_start: s.applicationPeriod?.start ?? null,
    application_period_end: s.applicationPeriod?.end ?? null,
    url: s.url,
    categories: s.categories,
    target_scale: s.targetScale,
    target_industries: s.targetIndustries,
    tags: s.tags,
    eligibility_criteria: s.eligibilityCriteria,
    excluded_cases: s.excludedCases,
    required_documents: s.requiredDocuments,
    application_sections: s.applicationSections,
    prompt_support: s.promptSupport,
    subsidy_type: s.subsidyType,
    popularity: s.popularity,
    difficulty: s.difficulty,
    is_active: s.isActive,
    last_updated: s.lastUpdated,
    source,
    updated_at: new Date().toISOString(),
  };
}

/** DB から全補助金を取得 */
export async function getAllSubsidiesFromDb(): Promise<SubsidyInfo[] | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("subsidies")
    .select("*")
    .order("popularity", { ascending: false });

  if (error || !data || data.length === 0) return null;
  return (data as DbSubsidy[]).map(toSubsidyInfo);
}

/** DB からアクティブな補助金のみ取得 */
export async function getActiveSubsidiesFromDb(): Promise<SubsidyInfo[] | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("subsidies")
    .select("*")
    .eq("is_active", true)
    .order("popularity", { ascending: false });

  if (error || !data || data.length === 0) return null;
  return (data as DbSubsidy[]).map(toSubsidyInfo);
}

/** DB から補助金を1件取得 */
export async function getSubsidyByIdFromDb(
  id: string
): Promise<SubsidyInfo | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("subsidies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return toSubsidyInfo(data as DbSubsidy);
}

/** 補助金をUPSERT（Service Role Key使用） */
export async function upsertSubsidy(
  subsidy: SubsidyInfo,
  source: "manual" | "jgrants" = "manual",
  extra?: { source_id?: string; source_url?: string; raw_data?: unknown; ai_extraction_version?: string }
): Promise<void> {
  const supabase = createServiceClient();
  const dbData = {
    ...toDbData(subsidy, source),
    ...(extra?.source_id ? { source_id: extra.source_id } : {}),
    ...(extra?.source_url ? { source_url: extra.source_url } : {}),
    ...(extra?.raw_data ? { raw_data: extra.raw_data } : {}),
    ...(extra?.ai_extraction_version ? { ai_extraction_version: extra.ai_extraction_version } : {}),
  };

  const { error } = await supabase
    .from("subsidies")
    .upsert(dbData, { onConflict: "id" });

  if (error) {
    throw new Error(`補助金のUPSERTに失敗しました (${subsidy.id}): ${error.message}`);
  }
}

/** 複数補助金を一括UPSERT（Service Role Key使用） */
export async function bulkUpsertSubsidies(
  subsidies: SubsidyInfo[],
  source: "manual" | "jgrants" = "manual"
): Promise<void> {
  const supabase = createServiceClient();
  const rows = subsidies.map((s) => toDbData(s, source));

  const { error } = await supabase
    .from("subsidies")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`補助金の一括UPSERTに失敗しました: ${error.message}`);
  }
}

/** 期限切れ補助金を非アクティブ化（Service Role Key使用） */
export async function deactivateExpiredSubsidies(): Promise<number> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("subsidies")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("is_active", true)
    .lt("deadline", today)
    .not("deadline", "is", null)
    .select("id");

  if (error) {
    throw new Error(`期限切れ補助金の非アクティブ化に失敗しました: ${error.message}`);
  }
  return data?.length ?? 0;
}

/** 補助金件数を取得 */
export async function getSubsidyCount(): Promise<number | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;

  const { count, error } = await supabase
    .from("subsidies")
    .select("*", { count: "exact", head: true });

  if (error) return null;
  return count;
}

// === 取込ログ関連 ===

export interface IngestionLogInput {
  status?: string;
  total_fetched?: number;
  total_upserted?: number;
  total_skipped?: number;
  total_errors?: number;
  error_details?: unknown;
  metadata?: Record<string, unknown>;
}

/** 取込ログを作成 */
export async function createIngestionLog(): Promise<string> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("ingestion_logs")
    .insert({ status: "running" })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`取込ログの作成に失敗しました: ${error?.message}`);
  }
  return data.id;
}

/** 取込ログを更新 */
export async function updateIngestionLog(
  logId: string,
  updates: IngestionLogInput
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("ingestion_logs")
    .update({
      ...updates,
      ...(updates.status === "completed" || updates.status === "failed"
        ? { finished_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", logId);

  if (error) {
    throw new Error(`取込ログの更新に失敗しました: ${error.message}`);
  }
}

/** 最新の取込ログを取得 */
export async function getLatestIngestionLog(): Promise<{
  id: string;
  status: string;
  metadata: Record<string, unknown>;
  started_at: string;
  finished_at: string | null;
  total_fetched: number;
  total_upserted: number;
  total_errors: number;
} | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("ingestion_logs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

/** 取込ログ一覧を取得 */
export async function getIngestionLogs(limit = 20): Promise<
  Array<{
    id: string;
    status: string;
    started_at: string;
    finished_at: string | null;
    total_fetched: number;
    total_upserted: number;
    total_skipped: number;
    total_errors: number;
    metadata: Record<string, unknown>;
  }>
> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("ingestion_logs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}
