# Checkpoint
Updated: 2026-02-24 18:30

## Goal
認証を Google OAuth のみに変更 — 完了

## Done
- [x] MKエージェント組織構築（MK0-MK4 → CLAUDE.md追記済）
- [x] 12週マーケティングスケジュール策定
- [x] Week 1-2: ブログ基盤・SEO・コンテンツ生成
- [x] CLAUDE.md の認証方針を Google OAuth のみに更新
- [x] ログインページを Google OAuth のみに簡素化
- [x] ミドルウェアから /signup を /login にリダイレクト
- [x] auth/callback を /dashboard にリダイレクト
- [x] ビルド成功確認

## Pending
- [ ] 記事4本レビュー → content/blog/ に移動
- [ ] Vercelデプロイ
- [ ] Week 3 SNS投稿

## Files
- CLAUDE.md - 認証方針を Google OAuth のみに更新
- src/app/(auth)/login/page.tsx - Google ボタンのみ
- src/middleware.ts - /signup リダイレクト、publicPaths整理
- src/app/(auth)/auth/callback/route.ts - /dashboard にリダイレクト

## Decisions
- Google OAuth のみ（メール/パスワードは不使用）
- signup は /login にリダイレクト（互換性維持）
- Opus vs Sonnet は運用データ後に判断保留

## Next
記事レビュー → Vercelデプロイ → Week 3 実行
