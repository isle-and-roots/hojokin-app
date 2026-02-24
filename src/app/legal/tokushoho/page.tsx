import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | 補助金サポート",
  description: "補助金サポートの特定商取引法に基づく表記です。",
};

export default function TokushohoPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold mb-8">特定商取引法に基づく表記</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <Row label="販売業者" value="ISLE & ROOTS" />
            <Row label="運営統括責任者" value="島 直人" />
            <Row
              label="所在地"
              value="〒231-0861 神奈川県横浜市中区元町5-211"
            />
            <Row label="電話番号" value="080-4002-0871" />
            <Row
              label="メールアドレス"
              value="naoto.shima@isle-and-roots.com"
            />
            <Row
              label="お問い合わせ受付時間"
              value="平日 10:00〜17:00（土日祝日・年末年始を除く）"
            />
            <Row
              label="販売URL"
              value="https://hojokin.isle-and-roots.com"
            />
            <Row
              label="サービス内容"
              value={
                <div className="space-y-2">
                  <p>
                    「補助金サポート」は、AI技術（Anthropic Claude
                    API）を活用し、中小企業・個人事業主向けの補助金申請書類の作成を支援するWebサービスです。主な機能は以下の通りです。
                  </p>
                  <ul className="list-disc pl-5 space-y-1 m-0">
                    <li>補助金情報の検索・閲覧</li>
                    <li>事業者プロフィールの登録・管理</li>
                    <li>AIによる補助金申請書類の自動生成</li>
                    <li>申請書のDOCXエクスポート（有料プラン）</li>
                    <li>申請書の保存・管理</li>
                  </ul>
                </div>
              }
            />
            <Row
              label="販売価格"
              value={
                <ul className="list-none p-0 m-0 space-y-1">
                  <li>Free プラン: 無料（月3回までのAI生成）</li>
                  <li>
                    Pro プラン: 月額 2,980円（税込）（AI生成無制限、DOCXエクスポート等）
                  </li>
                  <li>
                    Business プラン: 月額 9,800円（税込）（Pro機能+複数プロフィール、優先AI生成等）
                  </li>
                </ul>
              }
            />
            <Row label="決済通貨" value="日本円（JPY）" />
            <Row
              label="商品代金以外の必要料金"
              value="なし（インターネット接続料金等はお客様のご負担となります）"
            />
            <Row
              label="お支払い方法"
              value="クレジットカード（Visa、Mastercard、American Express、JCB）※決済処理はPolar Software Inc.が行います"
            />
            <Row
              label="お支払い時期"
              value="有料プランお申込み時に初回決済が行われ、以降毎月同日に自動更新・課金されます。"
            />
            <Row
              label="サービスの提供時期"
              value="決済完了後、即時ご利用いただけます。"
            />
            <Row
              label="サブスクリプションの解約方法"
              value={
                <div className="space-y-2">
                  <p>有料プランはいつでも解約できます。解約手順は以下の通りです。</p>
                  <ol className="list-decimal pl-5 space-y-1 m-0">
                    <li>本サービスにログインし、「料金プラン」ページへ移動</li>
                    <li>「プランを管理」ボタンをクリック</li>
                    <li>
                      顧客ポータルが開くので「プランをキャンセル」を選択
                    </li>
                    <li>確認画面で「キャンセルを確定」をクリック</li>
                  </ol>
                  <p>
                    解約後も、現在の請求期間の終了日まではサービスをご利用いただけます。次回更新日以降の課金は停止されます。
                  </p>
                </div>
              }
            />
            <Row
              label="返金ポリシー"
              value={
                <ul className="list-none p-0 m-0 space-y-1">
                  <li>
                    デジタルサービスの性質上、お支払い済みの料金の返金はお受けしておりません。
                  </li>
                  <li>日割り計算による返金は行っておりません。</li>
                  <li>
                    解約後も現在の請求期間終了日まではサービスをご利用いただけます。
                  </li>
                  <li>
                    サービスに重大な不具合が発生し、当社の責に帰すべき事由により提供が困難となった場合は、個別にご対応いたします。
                  </li>
                </ul>
              }
            />
            <Row
              label="動作環境"
              value="Google Chrome、Safari、Firefox、Microsoft Edge の最新版"
            />
            <Row
              label="特記事項"
              value="本サービスのAI機能による生成内容は参考情報であり、その正確性・完全性を保証するものではありません。補助金の採択を保証するものでもありません。申請書提出前にご自身の責任で内容をご確認ください。"
            />
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm">
        <h2 className="text-base font-semibold mb-3">カスタマーサポート</h2>
        <div className="space-y-1">
          <p>お問い合わせはメールにて承っております。</p>
          <p>メールアドレス: naoto.shima@isle-and-roots.com</p>
          <p>電話番号: 080-4002-0871</p>
          <p>受付時間: 平日 10:00〜17:00（土日祝日・年末年始を除く）</p>
          <p className="mt-2 text-muted-foreground">
            ※メールでのお問い合わせは2営業日以内にご回答いたします。
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        最終更新日: 2026年2月24日
      </p>
    </article>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <tr className="border-b border-border">
      <th className="py-4 pr-4 text-left font-medium align-top whitespace-nowrap w-48 text-foreground">
        {label}
      </th>
      <td className="py-4 text-foreground/80">{value}</td>
    </tr>
  );
}
