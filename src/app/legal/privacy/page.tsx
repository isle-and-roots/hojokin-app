import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 補助金サポート",
  description: "補助金サポートのプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold mb-8">プライバシーポリシー</h1>

      <p className="text-sm text-muted-foreground mb-8">
        最終更新日: 2026年2月24日
      </p>

      <p>
        ISLE &
        ROOTS（以下「当社」）は、「補助金サポート」（以下「本サービス」）の提供にあたり、ユーザーの個人情報を以下の方針に基づき適切に取り扱います。
      </p>

      <Section title="1. 収集する情報">
        <p>本サービスでは、以下の情報を収集します。</p>
        <h3 className="text-base font-medium mt-4 mb-2">
          (1) Google OAuth認証を通じて取得する情報
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>メールアドレス</li>
          <li>氏名（表示名）</li>
          <li>プロフィール画像URL</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">
          (2) ユーザーが入力する情報
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            事業者プロフィール（会社名、代表者名、住所、電話番号、事業内容等）
          </li>
          <li>補助金申請書に関する入力情報</li>
        </ul>

        <h3 className="text-base font-medium mt-4 mb-2">
          (3) 自動的に収集される情報
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
          <li>サービスの利用状況（AI生成回数等）</li>
        </ul>
      </Section>

      <Section title="2. 利用目的">
        <p>収集した個人情報は、以下の目的で利用します。</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>本サービスの提供・運営</li>
          <li>ユーザー認証およびアカウント管理</li>
          <li>サブスクリプションの課金管理</li>
          <li>AI機能による補助金申請書類の生成</li>
          <li>サービスの改善・新機能の開発</li>
          <li>お問い合わせへの対応</li>
          <li>利用規約に違反する行為への対応</li>
        </ol>
      </Section>

      <Section title="3. 第三者への提供">
        <p>
          当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
        </p>

        <h3 className="text-base font-medium mt-4 mb-2">
          (1) 業務委託先への提供
        </h3>
        <p>
          本サービスの運営に必要な範囲で、以下の事業者にデータを提供しています。
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="py-2 pr-4 text-left font-medium">事業者</th>
                <th className="py-2 pr-4 text-left font-medium">目的</th>
                <th className="py-2 text-left font-medium">提供データ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Supabase, Inc.</td>
                <td className="py-2 pr-4">データベース・認証基盤</td>
                <td className="py-2">
                  メールアドレス、プロフィール情報、申請書データ
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Polar Software Inc.</td>
                <td className="py-2 pr-4">決済処理</td>
                <td className="py-2">メールアドレス、課金情報</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Anthropic, PBC</td>
                <td className="py-2 pr-4">AI生成処理</td>
                <td className="py-2">
                  事業者プロフィール情報（AI生成に必要な範囲）
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Vercel, Inc.</td>
                <td className="py-2 pr-4">ホスティング・分析</td>
                <td className="py-2">アクセスログ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-medium mt-4 mb-2">(2) 法令に基づく場合</h3>
        <p>
          法令に基づき開示が求められた場合、または人の生命・身体・財産の保護のために必要な場合には、個人情報を提供することがあります。
        </p>
      </Section>

      <Section title="4. データの保管">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            ユーザーのデータは、Supabase（クラウドデータベース）に暗号化して保管されます。
          </li>
          <li>
            アカウント削除後、個人情報は合理的な期間内に削除されます。ただし、法令上保管が必要なデータ（決済記録等）は、法定期間保管します。
          </li>
        </ol>
      </Section>

      <Section title="5. Cookieの利用">
        <p>本サービスでは、以下の目的でCookieを使用します。</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>ユーザー認証セッションの維持</li>
          <li>サービスの利用状況の分析</li>
        </ul>
        <p className="mt-2">
          ブラウザの設定によりCookieを無効にすることができますが、本サービスの一部機能が利用できなくなる場合があります。
        </p>
      </Section>

      <Section title="6. 個人情報の開示・訂正・削除">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            ユーザーは、当社に対して自身の個人情報の開示、訂正、削除を請求する権利を有します。
          </li>
          <li>
            請求は、下記のお問い合わせ先までメールにてご連絡ください。本人確認の上、合理的な期間内に対応いたします。
          </li>
        </ol>
      </Section>

      <Section title="7. 安全管理措置">
        <p>
          当社は、個人情報の漏えい、滅失、毀損の防止のため、以下の安全管理措置を講じています。
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>通信の暗号化（SSL/TLS）</li>
          <li>データベースへのアクセス制御（Row Level Security）</li>
          <li>APIキーの厳格な管理</li>
          <li>セキュリティヘッダーの設定</li>
        </ul>
      </Section>

      <Section title="8. ポリシーの変更">
        <p>
          当社は、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは、本サービス上に掲載した時点で効力を生じるものとします。重要な変更がある場合には、サービス内で通知いたします。
        </p>
      </Section>

      <Section title="9. お問い合わせ">
        <p>
          個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
        </p>
        <div className="mt-3 p-4 bg-muted/50 rounded-lg text-sm">
          <p>ISLE & ROOTS</p>
          <p className="mt-1">運営統括責任者: 島 直人</p>
          <p className="mt-1">
            メールアドレス: naoto.shima@isle-and-roots.com
          </p>
        </div>
      </Section>

      <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground">
        <p>制定日: 2026年2月24日</p>
        <p className="mt-1">ISLE & ROOTS</p>
      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}
