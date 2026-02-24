import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Sparkles,
  FileText,
  Search,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default async function LandingPage() {
  // 認証済みユーザーはダッシュボードへリダイレクト
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch {
    // Supabase 未設定の場合はランディングページを表示
  }

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                H
              </span>
            </div>
            <span className="font-bold">補助金サポート</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI搭載 補助金申請支援
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            補助金申請書類を
            <br />
            <span className="text-primary">AIが自動生成</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            小規模事業者持続化補助金やIT導入補助金など、15種類の補助金に対応。
            企業プロフィールを入力するだけで、審査に通りやすい申請書類をAIが生成します。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              無料で始める
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border font-medium hover:bg-accent transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="py-16 px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            3ステップで申請書類が完成
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">1. 補助金を探す</h3>
              <p className="text-sm text-muted-foreground">
                業種・規模に合った補助金を15件の中から検索。AI対応度や難易度も一目で確認。
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">2. AIが下書き生成</h3>
              <p className="text-sm text-muted-foreground">
                企業プロフィールを基に、各セクションの下書きをAIが自動生成。編集も自由自在。
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">3. Word出力</h3>
              <p className="text-sm text-muted-foreground">
                完成した申請書類をWord(DOCX)形式でエクスポート。そのまま申請に使えます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 対応補助金 */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">15種類の補助金に対応</h2>
          <p className="text-muted-foreground mb-8">
            主要な補助金をカバー。AI完全対応の補助金ではセクション毎に最適化された文章を生成。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "小規模事業者持続化補助金",
              "IT導入補助金",
              "ものづくり補助金",
              "事業再構築補助金",
              "キャリアアップ助成金",
              "小規模事業者経営改善資金",
            ].map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm"
              >
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                {name}
              </span>
            ))}
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
              + 他9件
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">
            今すぐ無料で始めましょう
          </h2>
          <p className="text-muted-foreground mb-6">
            無料プランでAI生成を3回まで試せます。クレジットカード不要。
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            無料アカウントを作成
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>ISLE & ROOTS</span>
          <span>Powered by Claude AI</span>
        </div>
      </footer>
    </div>
  );
}
