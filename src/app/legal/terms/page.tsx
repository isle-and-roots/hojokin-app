import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | 補助金サポート",
  description: "補助金サポートの利用規約です。",
};

export default function TermsPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold mb-8">利用規約</h1>

      <p className="text-sm text-muted-foreground mb-8">
        最終更新日: 2026年2月24日
      </p>

      <p>
        この利用規約（以下「本規約」）は、ISLE &
        ROOTS（以下「当社」）が提供する「補助金サポート」（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用いただくにあたり、本規約に同意いただいたものとみなします。
      </p>

      <Section title="第1条（サービスの概要）">
        <p>
          本サービスは、AI技術を活用して中小企業・個人事業主向けの補助金申請書類の作成を支援するWebサービスです。
        </p>
      </Section>

      <Section title="第2条（アカウント登録）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            本サービスの利用にはGoogleアカウントによるログインが必要です。
          </li>
          <li>
            ユーザーは、自身のアカウントの管理について一切の責任を負うものとします。
          </li>
          <li>
            アカウントの不正利用が判明した場合、当社はアカウントを停止する権利を有します。
          </li>
        </ol>
      </Section>

      <Section title="第3条（料金および支払い）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            本サービスには無料プランと有料プラン（Pro、Business）があります。各プランの料金および機能は料金ページに定める通りです。
          </li>
          <li>
            有料プランは月額制のサブスクリプションであり、お申込み時に初回決済が行われます。
          </li>
          <li>
            サブスクリプションは毎月自動的に更新されます。ユーザーがキャンセルしない限り、毎月同日に自動的に課金されます。
          </li>
          <li>
            決済処理はPolar Software Inc.のシステムを通じて行われます。
          </li>
          <li>
            料金は税込表示です。
          </li>
        </ol>
      </Section>

      <Section title="第4条（解約・キャンセル）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            有料プランはいつでも解約することができます。解約手順は以下の通りです。
            <ol className="list-[lower-alpha] pl-5 mt-2 space-y-1">
              <li>本サービスにログインし、「料金プラン」ページへ移動</li>
              <li>「プランを管理」ボタンをクリック</li>
              <li>
                顧客ポータルが開くので「プランをキャンセル」を選択
              </li>
              <li>確認画面で「キャンセルを確定」をクリック</li>
            </ol>
          </li>
          <li>
            解約後も、現在の請求期間の終了日まではサービスをご利用いただけます。次回更新日以降の課金は停止されます。
          </li>
          <li>日割り計算による返金は行っておりません。</li>
          <li>
            デジタルサービスの性質上、お支払い済みの料金の返金はお受けしておりません。
          </li>
          <li>
            サービスに重大な不具合が発生し、当社の責に帰すべき事由によりサービスの提供が困難となった場合は、個別にご対応いたします。お問い合わせは
            naoto.shima@isle-and-roots.com までご連絡ください。
          </li>
        </ol>
      </Section>

      <Section title="第5条（AI生成コンテンツに関する免責）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            本サービスのAI機能により生成されたコンテンツ（以下「生成コンテンツ」）は、あくまで参考情報として提供するものであり、その正確性、完全性、有用性、適法性を保証するものではありません。
          </li>
          <li>
            生成コンテンツは補助金の採択を保証するものではありません。
          </li>
          <li>
            生成コンテンツに基づいてユーザーが行った申請の結果について、当社は一切の責任を負いません。
          </li>
          <li>
            ユーザーは、生成コンテンツを提出前に必ずご自身の責任で確認・修正してください。
          </li>
        </ol>
      </Section>

      <Section title="第6条（禁止事項）">
        <p>ユーザーは、以下の行為を行ってはなりません。</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>法令または公序良俗に反する行為</li>
          <li>
            虚偽の情報を入力して補助金申請書類を生成する行為
          </li>
          <li>
            本サービスを補助金の不正受給の目的で利用する行為
          </li>
          <li>
            本サービスのリバースエンジニアリング、逆コンパイル、または逆アセンブルを行う行為
          </li>
          <li>
            当社または第三者の知的財産権、プライバシー、名誉その他の権利を侵害する行為
          </li>
          <li>本サービスの運営を妨害する行為</li>
          <li>
            第三者に自身のアカウントを使用させる行為
          </li>
        </ol>
      </Section>

      <Section title="第7条（知的財産権）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            本サービスに関する知的財産権は当社に帰属します。
          </li>
          <li>
            AI機能により生成されたコンテンツの著作権は、ユーザーに帰属するものとします。ただし、当社はサービス改善の目的で生成データを匿名化して利用する権利を有します。
          </li>
        </ol>
      </Section>

      <Section title="第8条（サービスの変更・停止）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            当社は、事前の通知なく本サービスの内容を変更し、または提供を停止・終了することができるものとします。
          </li>
          <li>
            サービスの変更・停止によりユーザーに損害が生じた場合、当社は故意または重過失がある場合を除き、一切の責任を負いません。
          </li>
        </ol>
      </Section>

      <Section title="第9条（個人情報の取り扱い）">
        <p>
          ユーザーの個人情報の取り扱いについては、当社の
          <a href="/legal/privacy" className="text-primary hover:underline">
            プライバシーポリシー
          </a>
          に定める通りとします。
        </p>
      </Section>

      <Section title="第10条（免責事項）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            当社は、本サービスの利用により生じた損害について、当社に故意または重過失がある場合を除き、一切の責任を負いません。
          </li>
          <li>
            当社の損害賠償責任は、ユーザーが当社に支払った直近1ヶ月分の利用料を上限とします。
          </li>
        </ol>
      </Section>

      <Section title="第11条（規約の変更）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することがあります。
          </li>
          <li>
            変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
          </li>
        </ol>
      </Section>

      <Section title="第12条（準拠法・管轄裁判所）">
        <ol className="list-decimal pl-5 space-y-2">
          <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
          <li>
            本サービスに関する紛争については、横浜地方裁判所を第一審の専属的合意管轄裁判所とします。
          </li>
        </ol>
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
