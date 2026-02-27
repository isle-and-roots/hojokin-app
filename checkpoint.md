# Checkpoint
Updated: 2026-02-27 11:20

## Goal
Task 42: Google Search Console サイトマップ送信の準備 — 完了

## Done
- [x] sitemap.xml が /login にリダイレクトされる問題を発見
- [x] src/proxy.ts の publicPaths に /sitemap.xml /robots.txt /faq /shindan を追加
- [x] tsc --noEmit パス (エラーゼロ)
- [x] docs/search-console-setup.md 作成 (手順書)

## Pending
- [ ] middleware修正をVercelにデプロイ (git push)
- [ ] Search Console で所有権確認 (HTMLタグ方式を推奨)
- [ ] sitemap.xml を Search Console に送信

## Files
- src/proxy.ts — publicPaths に /sitemap.xml /robots.txt /faq /shindan を追加
- docs/search-console-setup.md — Search Console 設定手順書 (新規作成)

## Decisions
- /faq と /shindan も同時に公開パスに追加 (SEO上も認証なしでアクセス可能にすべきページ)
- gcloud CLI 未インストールのため API 経由の送信は不可 -> 手動手順書を作成

## Next
git push して Vercel にデプロイ後、Search Console 手順書に従って手動で設定する
