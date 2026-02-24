import { createClient } from "@/lib/supabase/server";

export interface DbApplication {
  id: string;
  user_id: string;
  profile_id: string | null;
  subsidy_id: string;
  subsidy_name: string;
  status: string;
  requested_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbApplicationSection {
  id: string;
  application_id: string;
  section_key: string;
  section_title: string;
  order_index: number;
  ai_generated_content: string | null;
  user_edited_content: string | null;
  final_content: string | null;
  model_used: string | null;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationWithSections extends DbApplication {
  sections: DbApplicationSection[];
}

export async function getApplications(userId: string): Promise<ApplicationWithSections[]> {
  const supabase = await createClient();

  const { data: apps, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`申請一覧の取得に失敗しました: ${error.message}`);
  if (!apps || apps.length === 0) return [];

  const appIds = apps.map((a: DbApplication) => a.id);
  const { data: sections, error: secError } = await supabase
    .from("application_sections")
    .select("*")
    .in("application_id", appIds)
    .order("order_index", { ascending: true });

  if (secError) throw new Error(`セクションの取得に失敗しました: ${secError.message}`);

  return apps.map((app: DbApplication) => ({
    ...app,
    sections: (sections as DbApplicationSection[])?.filter(
      (s) => s.application_id === app.id
    ) ?? [],
  }));
}

export async function getApplication(
  applicationId: string,
  userId: string
): Promise<ApplicationWithSections | null> {
  const supabase = await createClient();

  const { data: app, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .eq("user_id", userId)
    .single();

  if (error || !app) return null;

  const { data: sections } = await supabase
    .from("application_sections")
    .select("*")
    .eq("application_id", applicationId)
    .order("order_index", { ascending: true });

  return {
    ...(app as DbApplication),
    sections: (sections as DbApplicationSection[]) ?? [],
  };
}

export async function createApplication(
  userId: string,
  data: {
    subsidyId: string;
    subsidyName: string;
    profileId?: string;
    sections: {
      sectionKey: string;
      sectionTitle: string;
      group?: string;
      aiContent?: string;
      userContent?: string;
    }[];
  }
): Promise<DbApplication> {
  const supabase = await createClient();

  const { data: app, error } = await supabase
    .from("applications")
    .insert({
      user_id: userId,
      profile_id: data.profileId || null,
      subsidy_id: data.subsidyId,
      subsidy_name: data.subsidyName,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw new Error(`申請の作成に失敗しました: ${error.message}`);

  if (data.sections.length > 0) {
    const sectionsToInsert = data.sections.map((s, i) => ({
      application_id: (app as DbApplication).id,
      section_key: s.sectionKey,
      section_title: s.sectionTitle,
      order_index: i,
      ai_generated_content: s.aiContent || null,
      user_edited_content: s.userContent || null,
      final_content: s.userContent || s.aiContent || null,
    }));

    const { error: secError } = await supabase
      .from("application_sections")
      .insert(sectionsToInsert);

    if (secError) throw new Error(`セクションの保存に失敗しました: ${secError.message}`);
  }

  return app as DbApplication;
}

export async function deleteApplication(
  applicationId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", applicationId)
    .eq("user_id", userId);

  if (error) throw new Error(`申請の削除に失敗しました: ${error.message}`);
}

export async function updateApplicationStatus(
  applicationId: string,
  userId: string,
  status: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId)
    .eq("user_id", userId);

  if (error) throw new Error(`ステータスの更新に失敗しました: ${error.message}`);
}
