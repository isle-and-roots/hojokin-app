# Google Search Console: サイトマップ送信手順

**対象サイト**: https://hojokin-app-beta.vercel.app/
**サイトマップURL**: https://hojokin-app-beta.vercel.app/sitemap.xml

---

## 前提条件: ミドルウェア修正について

`/sitemap.xml` がログインページにリダイレクトされていた問題を修正済み。
`src/proxy.ts` の `publicPaths` に `/sitemap.xml` と `/robots.txt` を追加した。
この変更をデプロイしてから以下の手順を実行すること。

---

## Step 1: Google Search Console にアクセス

URL: https://search.google.com/search-console

Google アカウントでログインする（isle-and-roots アカウントを使用）。

---

## Step 2: プロパティを追加する

1. 左上の「プロパティを追加」をクリック
2. プロパティタイプを選択する画面が表示される

**2つのオプション:**
- **ドメイン**: `hojokin-app-beta.vercel.app`（推奨）
  - DNS TXT レコードで確認が必要
  - Vercel ダッシュボードの DNS 設定にアクセスが必要
- **URLプレフィックス**: `https://hojokin-app-beta.vercel.app/`（簡単）
  - HTMLファイルまたはメタタグで確認できる

### URLプレフィックス方式（推奨 — 最も簡単）

「URLプレフィックス」を選択し、`https://hojokin-app-beta.vercel.app/` を入力して「続行」をクリック。

---

## Step 3: 所有権の確認

「HTMLタグ」方法が最も簡単:

1. 「HTMLタグ」を選択
2. 表示されるメタタグをコピー:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXX" />
   ```
3. `src/app/layout.tsx` の `<head>` セクションに追加:
   ```tsx
   // src/app/layout.tsx
   export const metadata: Metadata = {
     // ... 既存のメタデータ
     verification: {
       google: "XXXXXXXXXXXXXXXXXXXXXX", // Search Console から取得したコード
     },
   };
   ```
4. `npm run build` でビルド確認
5. Vercel にデプロイ（git push）
6. Search Console に戻り「確認」をクリック

### 代替: HTMLファイル方式

1. Search Console が提供するファイル（例: `google1234abcd.html`）をダウンロード
2. `/Users/naotoshima/hojokin-app/public/` に配置
3. Vercel にデプロイ
4. `https://hojokin-app-beta.vercel.app/google1234abcd.html` にアクセスして確認
5. Search Console で「確認」をクリック

### Vercel ドメインの DNS 確認方式

Vercel が管理するドメインで DNS 確認をする場合:

1. Search Console で「ドメイン」プロパティを選択
2. 表示された TXT レコード値をコピー
3. Vercel ダッシュボード → プロジェクト → Domains → DNS Records
4. TXT レコードを追加（反映に数分〜数時間かかる場合がある）
5. Search Console で「確認」をクリック

---

## Step 4: サイトマップを送信する

1. Search Console の左メニューから「サイトマップ」を選択
2. 「新しいサイトマップを追加」フィールドにサイトマップのパスを入力:
   ```
   sitemap.xml
   ```
   （ベースURLは自動補完される）
3. 「送信」をクリック
4. 「成功」と表示されれば完了

**注意**: サイトマップが正常に取得されない場合、以下を確認:
- ミドルウェアの修正（`/sitemap.xml` をpublicPathsに追加）がデプロイされているか
- `https://hojokin-app-beta.vercel.app/sitemap.xml` にブラウザで直接アクセスして XML が返るか

---

## Step 5: インデックス登録の確認

送信後、以下を確認:

1. 「サイトマップ」画面でステータスが「成功」になっているか
2. 「検出されたURL数」が表示されるまで数日かかる場合がある
3. URL検査ツール（左メニュー）でトップページのインデックス状態を確認

---

## サイトマップの内容

現在のサイトマップ（`src/app/sitemap.ts`）には以下のURLが含まれる:

| URL | 優先度 | 更新頻度 |
|-----|--------|---------|
| トップページ | 1.0 | 毎日 |
| /subsidies | 0.9 | 毎日 |
| /blog | 0.8 | 毎週 |
| 各補助金ページ | 0.8 | 毎週 |
| /pricing | 0.7 | 毎週 |
| 各ブログ記事 | 0.7 | 毎月 |
| /faq, /shindan | 0.6 | 毎月 |
| /login, /signup | 0.5 | 毎月 |
| /legal/* | 0.3 | 毎月 |

---

## トラブルシューティング

### サイトマップが「取得できません」と表示される場合

1. ミドルウェアの修正をデプロイしたか確認する
2. ターミナルで以下を実行してXMLが返るか確認:
   ```bash
   curl -sI https://hojokin-app-beta.vercel.app/sitemap.xml
   # HTTP/2 200 が返れば正常
   ```
3. ブラウザのシークレットモードで `https://hojokin-app-beta.vercel.app/sitemap.xml` にアクセス

### 所有権確認が通らない場合

- HTMLタグ方式: `src/app/layout.tsx` に verification メタタグが正しく追加されているか確認
- デプロイが完了してから数分待ってから再試行

---

## 関連タスク

- Plans.md: Task 42 (Google Search Console サイトマップ送信)
- 修正ファイル: `src/proxy.ts` — publicPaths に `/sitemap.xml`, `/robots.txt`, `/faq`, `/shindan` を追加
