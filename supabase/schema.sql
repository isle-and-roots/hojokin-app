-- =============================================
-- hojokin-app DB スキーマ
-- Supabase SQL Editor で実行
-- =============================================

-- updated_at 自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 1. user_profiles（ユーザープロフィール）
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  ai_generations_used INTEGER NOT NULL DEFAULT 0,
  ai_generations_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 新規ユーザー登録時に自動で user_profiles を作成
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- 2. business_profiles（事業者プロフィール）
-- =============================================
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  representative TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  industry TEXT,
  employee_count INTEGER,
  annual_revenue BIGINT,
  founded_year INTEGER,
  business_description TEXT,
  products TEXT,
  target_customers TEXT,
  sales_channels TEXT,
  strengths TEXT,
  challenges TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own business profiles" ON business_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 3. applications（補助金申請書）
-- =============================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES business_profiles(id),
  subsidy_id TEXT NOT NULL,
  subsidy_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'ready', 'submitted', 'adopted', 'rejected')),
  requested_amount BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own applications" ON applications
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 4. application_sections（申請書セクション）
-- =============================================
CREATE TABLE application_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  section_title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  ai_generated_content TEXT,
  user_edited_content TEXT,
  final_content TEXT,
  model_used TEXT,
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE application_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sections" ON application_sections
  FOR ALL USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

CREATE TRIGGER update_application_sections_updated_at
  BEFORE UPDATE ON application_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- インデックス
-- =============================================
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_subsidy_id ON applications(subsidy_id);
CREATE INDEX idx_application_sections_application_id ON application_sections(application_id);
