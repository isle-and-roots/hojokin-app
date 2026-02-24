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
              label="販売URL"
              value="https://hojokin-app-beta.vercel.app"
            />
            <Row
              label="販売価格"
              value={
                <ul className="list-none p-0 m-0 space-y-1">
                  <li>Free プラン: 無料</li>
                  <li>Pro プラン: 月額 2,980円（税込）</li>
                  <li>Business プラン: 月額 9,800円（税込）</li>
                </ul>
              }
            />
            <Row
              label="商品代金以外の必要料金"
              value="なし（インターネット接続料金等はお客様のご負担となります）"
            />
            <Row
              label="お支払い方法"
              value="クレジットカード（Visa、Mastercard、American Express、JCB）※決済処理はStripe, Inc.が行います"
            />
            <Row
              label="お支払い時期"
              value="お申込み時に初回決済が行われ、以降毎月同日に自動更新されます"
            />
            <Row
              label="サービスの提供時期"
              value="決済完了後、即時ご利用いただけます"
            />
            <Row
              label="返品・キャンセルについて"
              value={
                <ul className="list-none p-0 m-0 space-y-1">
                  <li>
                    デジタルサービスの性質上、返品・返金はお受けしておりません。
                  </li>
                  <li>
                    サブスクリプションはいつでもキャンセル可能です。キャンセル後も、現在の請求期間の終了日まではサービスをご利用いただけます。
                  </li>
                  <li>日割り計算による返金は行っておりません。</li>
                </ul>
              }
            />
            <Row
              label="動作環境"
              value="Google Chrome、Safari、Firefox、Microsoft Edge の最新版"
            />
            <Row
              label="特記事項"
              value="本サービスのAI機能による生成内容は参考情報であり、その正確性・完全性を保証するものではありません。補助金の採択を保証するものでもありません。"
            />
          </tbody>
        </table>
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
