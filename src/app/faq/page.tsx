import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";
import { FaqAccordion } from "@/components/landing/faq-accordion";

const FAQ_CATEGORIES = [
  {
    title: "サービスについて",
    items: [
      {
        question: "補助金サポートとは何ですか？",
        answer:
          "補助金サポートは、AIを活用して中小企業の補助金申請書類を自動生成するWebサービスです。企業プロフィールを登録するだけで、中小企業診断士レベルの申請書の下書きをAIが作成します。持続化補助金やIT導入補助金など、100件以上の補助金に対応しています。",
      },
      {
        question: "AIが生成した申請書は本当に使えるのですか？",
        answer:
          "AIは中小企業診断士の知見を基に、各補助金の審査基準に沿った文章を生成します。ただし、生成された内容は下書きとしてご活用ください。最終的な内容の確認・調整はお客様の責任で行っていただく必要があります。",
      },
      {
        question: "どの補助金に対応していますか？",
        answer:
          "現在9カテゴリ100件以上の補助金に対応しています。持続化補助金やIT導入補助金など主要な補助金はAI完全対応で、セクションごとに最適化された文章を生成します。その他の補助金もAI汎用対応で申請書の下書きを生成できます。",
      },
      {
        question: "専門家（中小企業診断士）に依頼するのと何が違いますか？",
        answer:
          "中小企業診断士への依頼は通常10〜30万円以上の費用と2〜4週間の期間が必要です。補助金サポートではAIが数分で下書きを生成するため、費用は月額2,980円から、時間も大幅に短縮できます。生成された内容を基に専門家にレビューを依頼することも可能で、両者を組み合わせる使い方もおすすめです。",
      },
    ],
  },
  {
    title: "料金プランについて",
    items: [
      {
        question: "無料プランでどこまで使えますか？",
        answer:
          "無料プランでは月3回までAI生成をご利用いただけます。補助金の検索・閲覧は無制限です。まずは無料で品質をお確かめいただき、ご満足いただけましたらProプランへのアップグレードをご検討ください。",
      },
      {
        question: "プランの変更やキャンセルはいつでもできますか？",
        answer:
          "はい、いつでも変更・キャンセルが可能です。アップグレードは即時反映、ダウングレードは次回請求日から適用されます。顧客ポータルからワンクリックで手続きできます。",
      },
      {
        question: "AI生成の回数は翌月に繰り越せますか？",
        answer:
          "未使用の生成回数は翌月に繰り越されません。毎月1日にリセットされます。",
      },
      {
        question: "請求書や領収書は発行できますか？",
        answer:
          "顧客ポータルから請求書・領収書をダウンロードできます。アカウント設定ページの「サブスクリプション管理」ボタン、または「請求書・領収書」カードからアクセスしてください。",
      },
      {
        question: "返金はできますか？",
        answer:
          "サブスクリプションはいつでもキャンセル可能で、キャンセル後は次回請求日まで引き続きご利用いただけます。日割り返金には対応しておりませんが、1ヶ月単位で気軽にお試しいただけます。",
      },
    ],
  },
  {
    title: "AI生成の品質について",
    items: [
      {
        question: "AIが生成する申請書の品質はどの程度ですか？",
        answer:
          "中小企業診断士の知見をベースにしたプロンプトで、審査員に「具体的で実現可能」と評価される品質を目指しています。生成後にお客様自身で内容を確認・修正していただくことを前提としています。",
      },
      {
        question: "生成された申請書の品質に不安があります",
        answer:
          "AI生成後も自由に編集が可能です。また、追加のコンテキストを指定して再生成することもできます。Proプランでは回数制限が大幅に緩和されるため、何度でも試行錯誤して最適な申請書を作成できます。",
      },
      {
        question: "Businessプランの「高精度AIモデル」とは何ですか？",
        answer:
          "最新のClaude Opusモデルを使用し、より高品質な申請書を生成します。他のプランではClaude Sonnetを使用しています。",
      },
      {
        question: "補助金に採択されなかった場合、返金はありますか？",
        answer:
          "補助金サポートは申請書の下書き作成ツールであり、採択を保証するサービスではありません。そのため採択結果による返金は行っておりません。ただし、サービス自体にご満足いただけない場合はいつでも解約可能です。まずは無料プランで品質をご確認いただくことをおすすめします。",
      },
    ],
  },
  {
    title: "セキュリティ・プライバシーについて",
    items: [
      {
        question: "データのセキュリティは大丈夫ですか？",
        answer:
          "お客様の企業情報と申請書データはSupabaseの安全なデータベースに保存されます。通信はすべてSSL/TLSで暗号化され、APIキーの管理もセキュアに行っています。第三者への情報共有は一切ございません。",
      },
      {
        question: "入力した企業情報はどのように管理されますか？",
        answer:
          "お客様の企業情報はSupabaseの安全なデータベースに暗号化して保存されます。AI生成時にAnthropicのAPIに送信されますが、Anthropicはユーザーデータをモデル学習に使用しません。また、第三者への情報販売や共有は一切行っておりません。ISLE & ROOTSのプライバシーポリシーに基づき厳格に管理しています。",
      },
    ],
  },
];

const ALL_FAQ_ITEMS = FAQ_CATEGORIES.flatMap((cat) => cat.items);

export const metadata: Metadata = {
  title: "よくある質問（FAQ） | 補助金申請サポート",
  description:
    "補助金申請サポートに関するよくある質問をまとめました。サービス内容、料金プラン、AI生成の品質、セキュリティについてお答えします。",
  keywords: [
    "補助金サポート FAQ",
    "補助金申請 よくある質問",
    "AI申請書 質問",
    "補助金サポート 料金",
  ],
  alternates: {
    canonical:
      (process.env.NEXT_PUBLIC_SITE_URL ||
        "https://hojokin.isle-and-roots.com") + "/faq",
  },
};

export default function FaqPage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "よくある質問",
        item: `${siteUrl}/faq`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-foreground hover:text-primary transition-colors"
          >
            補助金申請サポート
          </Link>
          <Link
            href="/login"
            className="text-sm text-primary hover:underline"
          >
            ログイン
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        {/* パンくず */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            ホーム
          </Link>
          <span>/</span>
          <span className="text-foreground">よくある質問</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2">よくある質問（FAQ）</h1>
        <p className="text-muted-foreground mb-10">
          補助金サポートに関するご質問にお答えします。
        </p>

        {/* カテゴリ別 FAQ */}
        {FAQ_CATEGORIES.map((category) => (
          <section key={category.title} className="mb-10">
            <h2 className="text-xl font-bold mb-4">{category.title}</h2>
            <FaqAccordion items={category.items} />
          </section>
        ))}

        {/* CTA */}
        <div className="mt-12 rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">
            まずは無料で試してみませんか？
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            無料プランでAI申請書生成を3回までお試しいただけます。クレジットカード不要です。
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
          >
            無料で始める
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* その他のリンク */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            ご不明な点は
            <Link
              href="/legal/tokushoho"
              className="text-primary hover:underline mx-1"
            >
              運営会社情報
            </Link>
            をご確認ください。
          </p>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-border mt-16 py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            補助金申請サポート
          </Link>
          <span className="mx-2">|</span>
          <Link
            href="/subsidies"
            className="hover:text-foreground transition-colors"
          >
            補助金検索
          </Link>
          <span className="mx-2">|</span>
          <Link
            href="/pricing"
            className="hover:text-foreground transition-colors"
          >
            料金プラン
          </Link>
          <span className="mx-2">|</span>
          <Link
            href="/blog"
            className="hover:text-foreground transition-colors"
          >
            ブログ
          </Link>
          <p className="mt-3 text-xs">
            &copy; {new Date().getFullYear()} ISLE &amp; ROOTS 合同会社
          </p>
        </div>
      </footer>
    </div>
  );
}
