-- 補助金データテーブル（静的TS→DB移行 + jGrants自動取込対応）
CREATE TABLE subsidies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_short TEXT NOT NULL,
  department TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  max_amount BIGINT,
  min_amount BIGINT,
  subsidy_rate TEXT NOT NULL,
  deadline DATE,
  application_period_start DATE,
  application_period_end DATE,
  url TEXT,
  categories TEXT[] NOT NULL DEFAULT '{}',
  target_scale TEXT[] NOT NULL DEFAULT '{}',
  target_industries TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  eligibility_criteria TEXT[] NOT NULL DEFAULT '{}',
  excluded_cases TEXT[] NOT NULL DEFAULT '{}',
  required_documents TEXT[] NOT NULL DEFAULT '{}',
  application_sections JSONB NOT NULL DEFAULT '[]',
  prompt_support TEXT NOT NULL DEFAULT 'NONE',
  subsidy_type TEXT NOT NULL DEFAULT 'OTHER',
  popularity INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'MEDIUM',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- 自動取込メタデータ
  source TEXT NOT NULL DEFAULT 'manual',
  source_id TEXT,
  source_url TEXT,
  raw_data JSONB,
  ai_extraction_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_subsidies_is_active ON subsidies (is_active);
CREATE INDEX idx_subsidies_source ON subsidies (source);
CREATE INDEX idx_subsidies_categories ON subsidies USING GIN (categories);
CREATE INDEX idx_subsidies_deadline ON subsidies (deadline) WHERE deadline IS NOT NULL;

-- RLS有効化
ALTER TABLE subsidies ENABLE ROW LEVEL SECURITY;

-- 補助金データは全ユーザーが閲覧可能（認証不要）
CREATE POLICY "subsidies_select_all" ON subsidies
  FOR SELECT USING (true);

-- 書き込みはService Role Keyのみ（Cron/Admin用）
CREATE POLICY "subsidies_service_role_all" ON subsidies
  FOR ALL USING (auth.role() = 'service_role');

-- 取込実行ログテーブル
CREATE TABLE ingestion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  total_fetched INTEGER NOT NULL DEFAULT 0,
  total_upserted INTEGER NOT NULL DEFAULT 0,
  total_skipped INTEGER NOT NULL DEFAULT 0,
  total_errors INTEGER NOT NULL DEFAULT 0,
  error_details JSONB,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE ingestion_logs ENABLE ROW LEVEL SECURITY;

-- Service Roleのみアクセス可能
CREATE POLICY "ingestion_logs_service_role_all" ON ingestion_logs
  FOR ALL USING (auth.role() = 'service_role');
