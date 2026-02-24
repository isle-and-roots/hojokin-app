# 開発ワークフロー

## 機能実装フロー

```
要件定義 → 設計 → 実装 → 検証 → マージ
 (HK0)    (HK0+担当)  (担当)  (HK4)   (確認後)
```

### 1. 要件定義 [HK0]
- ユーザーストーリーを1文で定義
- 収益インパクトを評価（High / Medium / Low）
- 実装優先度を決定

### 2. 設計 [HK0 + 担当エージェント]
- 変更するファイルの一覧
- DB スキーマ変更の有無
- API エンドポイントの設計
- UI モックアップ（テキストベース）

### 3. 実装 [担当エージェント]
- TypeScript strict モードでコーディング
- コンポーネントは小さく、単一責務
- Server Component をデフォルトに、Client は必要時のみ

### 4. 検証 [HK4]
- 品質ゲート全項目をチェック
- preview ツールで UI 確認
- エッジケースの確認

### 5. マージ
- ユーザー確認後にマージ

---

## 品質ゲート（全変更に適用）

| # | チェック項目 | コマンド/方法 | 基準 |
|---|------------|-------------|------|
| 1 | TypeScript | `npx tsc --noEmit` | エラー 0 |
| 2 | ESLint | `npm run lint` | 警告 0 |
| 3 | ビルド | `npm run build` | 成功 |
| 4 | セキュリティ | コードレビュー | API キー露出なし |
| 5 | レスポンシブ | preview_screenshot | 3ブレークポイント確認 |
| 6 | エラー処理 | 手動テスト | エラー時に適切な UI 表示 |

---

## コーディング規約

### ファイル命名
- コンポーネント: `PascalCase.tsx`（例: `SubsidyCard.tsx`）
- ページ: `page.tsx`（Next.js App Router 規約）
- API ルート: `route.ts`
- ユーティリティ: `camelCase.ts`（例: `formatCurrency.ts`）
- 型定義: `types/index.ts` に集約

### コンポーネント設計
```typescript
// Server Component（デフォルト）
export default async function SubsidyList() { ... }

// Client Component（状態・イベントが必要な場合のみ）
"use client";
export function SearchFilters() { ... }
```

### API ルート設計
```typescript
// 必ず try-catch + 適切なステータスコード
export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json()); // Zod バリデーション
    // 認証チェック（Phase 1 以降）
    // ビジネスロジック
    return Response.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "入力内容を確認してください" }, { status: 400 });
    }
    console.error("API Error:", error);
    return Response.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
```

### Supabase クエリ
```typescript
// 必ず RLS を前提とし、サーバーサイドで実行
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data, error } = await supabase
  .from("applications")
  .select("*")
  .eq("user_id", userId);

if (error) throw error;
```

### 型定義
```typescript
// src/types/index.ts に集約
// interface を優先（type は union/intersection のみ）
export interface BusinessProfile {
  id: string;
  companyName: string;
  // ...
}
```

---

## Supabase DB スキーマ設計（Phase 1）

### テーブル構成

```sql
-- ユーザー（Supabase Auth が管理、追加プロフィール用）
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  ai_generations_used INTEGER NOT NULL DEFAULT 0,
  ai_generations_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 事業者プロフィール
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
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

-- 補助金申請書
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  profile_id UUID REFERENCES business_profiles(id),
  subsidy_id TEXT NOT NULL,
  subsidy_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'ready', 'submitted', 'adopted', 'rejected')),
  requested_amount BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 申請書セクション
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

-- RLS ポリシー（必須）
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_sections ENABLE ROW LEVEL SECURITY;

-- 各テーブルに「自分のデータのみアクセス可」ポリシーを設定
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own business profiles" ON business_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own applications" ON applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sections" ON application_sections
  FOR ALL USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );
```

---

## Stripe 課金フロー（Phase 1）

### 基本フロー
```
ユーザー登録 → 無料プラン → Pro/Business 申込
  → Stripe Checkout → Webhook で plan 更新
  → 毎月自動課金 → 解約時は Webhook で free に戻す
```

### 使用量制限の実装
```typescript
// AI 生成 API で毎回チェック
async function checkUsageLimit(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);

  // リセット期間チェック（月初にリセット）
  if (shouldResetUsage(profile.ai_generations_reset_at)) {
    await resetUsage(userId);
    return true;
  }

  const limits = { free: 3, pro: 100, business: 500 };
  return profile.ai_generations_used < limits[profile.plan];
}
```

---

## エラーメッセージ日本語化

| 状況 | エラーメッセージ |
|------|---------------|
| 未認証 | ログインしてください |
| 生成上限到達 | 今月の AI 生成回数の上限に達しました。Pro プランにアップグレードすると無制限でご利用いただけます。 |
| AI 生成失敗 | 申請書の生成に失敗しました。もう一度お試しください。 |
| 保存失敗 | 保存に失敗しました。ネットワーク接続を確認してください。 |
| 入力エラー | 入力内容を確認してください。 |
| サーバーエラー | サーバーエラーが発生しました。しばらく経ってからもう一度お試しください。 |
| プラン制限 | この機能は Pro プラン以上でご利用いただけます。 |
