import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

/**
 * Service Role Key を使用した Supabase クライアント（シングルトン）
 * RLS をバイパスして observability テーブルに書き込むために使用
 */
export function getObservabilityClient(): SupabaseClient | null {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  adminClient = createClient(url, key, {
    auth: { persistSession: false },
  });

  return adminClient;
}
