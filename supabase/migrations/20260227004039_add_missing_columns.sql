-- Fix 1: business_profiles に prefecture カラム追加（本番障害修正）
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS prefecture TEXT;

-- Fix 2: user_profiles に subscription_interval カラム追加（料金プラン対応）
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS subscription_interval TEXT NOT NULL DEFAULT 'monthly'
  CHECK (subscription_interval IN ('monthly', 'annual'));
