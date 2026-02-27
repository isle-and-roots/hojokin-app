-- email_leads テーブルが本番に存在しなかったため追加
-- db:check で検出された不整合を修正
CREATE TABLE IF NOT EXISTS email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'email_leads' AND policyname = 'Service role can manage email leads'
  ) THEN
    CREATE POLICY "Service role can manage email leads" ON email_leads FOR ALL USING (true);
  END IF;
END $$;
