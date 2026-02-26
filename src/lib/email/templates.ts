const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

const BRAND_COLOR = "#2563eb";
const BRAND_NAME = "補助金サポート";

/** 共通の HTML ラッパー */
function wrapHtml(subject: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Hiragino Sans',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);max-width:600px;width:100%;">
          <!-- ヘッダー -->
          <tr>
            <td style="background-color:${BRAND_COLOR};border-radius:8px 8px 0 0;padding:24px 32px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">${BRAND_NAME}</p>
              <p style="margin:4px 0 0;color:#bfdbfe;font-size:13px;">AI で補助金申請書類を自動生成</p>
            </td>
          </tr>
          <!-- 本文 -->
          <tr>
            <td style="padding:32px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- フッター -->
          <tr>
            <td style="background-color:#f3f4f6;border-radius:0 0 8px 8px;padding:20px 32px;">
              <p style="margin:0;color:#6b7280;font-size:12px;text-align:center;">
                ${BRAND_NAME} — <a href="${SITE_URL}" style="color:${BRAND_COLOR};text-decoration:none;">${SITE_URL}</a>
              </p>
              <p style="margin:8px 0 0;color:#6b7280;font-size:12px;text-align:center;">
                メール配信停止をご希望の場合は、このメールに返信してお知らせください。
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** CTA ボタン HTML */
function ctaButton(label: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="border-radius:6px;background-color:${BRAND_COLOR};">
        <a href="${href}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:6px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

/** 区切り線 */
const divider =
  '<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />';

/** 見出し */
function h2(text: string): string {
  return `<h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">${text}</h2>`;
}

/** 段落 */
function p(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">${text}</p>`;
}

/** リストアイテム */
function ul(items: string[]): string {
  const lis = items
    .map(
      (item) =>
        `<li style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#374151;">${item}</li>`
    )
    .join("");
  return `<ul style="margin:0 0 16px;padding-left:24px;">${lis}</ul>`;
}

/** 強調テキスト */
function strong(text: string): string {
  return `<strong style="font-weight:600;color:#111827;">${text}</strong>`;
}

/** テーブル */
function table(headers: string[], rows: string[][]): string {
  const thead = `<tr>${headers.map((h) => `<th style="text-align:left;padding:10px 12px;font-size:13px;font-weight:600;color:#374151;border-bottom:2px solid #e5e7eb;">${h}</th>`).join("")}</tr>`;
  const tbody = rows
    .map(
      (row, i) =>
        `<tr style="background-color:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};">${row.map((cell) => `<td style="padding:10px 12px;font-size:14px;color:#374151;border-bottom:1px solid #e5e7eb;">${cell}</td>`).join("")}</tr>`
    )
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin:0 0 16px;">
    <thead style="background-color:#f3f4f6;">${thead}</thead>
    <tbody>${tbody}</tbody>
  </table>`;
}

/** ハイライトボックス */
function highlightBox(content: string): string {
  return `<div style="background-color:#eff6ff;border-left:4px solid ${BRAND_COLOR};padding:16px;border-radius:0 6px 6px 0;margin:0 0 16px;">${content}</div>`;
}

// ============================================================
// Day 0: ウェルカムメール
// ============================================================
export function welcomeEmail(): { subject: string; html: string } {
  const subject = `${BRAND_NAME}へようこそ！まずはプロフィールを入力しましょう`;

  const body = `
    ${p("こんにちは、")}
    ${p(`${BRAND_NAME}へのご登録ありがとうございます。`)}
    ${p("AIを活用して、補助金申請書類を素早く・正確に作成できるサービスです。<br>まずは3ステップで最初の申請書を作ってみましょう。")}
    ${divider}
    ${h2("クイックスタート 3ステップ")}
    ${ul([
      `${strong("企業プロフィールを入力する")}<br><span style="font-size:13px;color:#6b7280;">業種、従業員数、事業内容などを登録。一度入力すれば全ての申請書に自動反映されます。</span>`,
      `${strong("補助金を選ぶ")}<br><span style="font-size:13px;color:#6b7280;">持続化補助金・IT導入補助金など、100件以上の補助金から業種・目的に合ったものを検索。</span>`,
      `${strong("AIで下書きを生成する")}<br><span style="font-size:13px;color:#6b7280;">ボタン1つで中小企業診断士レベルの申請書の下書きが完成します。無料プランでは月3回まで無料でお試しいただけます。</span>`,
    ])}
    ${highlightBox(p("プロフィールの入力が完了すると、AIが企業情報を活用してより精度の高い申請書を生成できるようになります。"))}
    ${ctaButton("プロフィールを入力する", `${SITE_URL}/profile`)}
    ${divider}
    ${p("ご不明な点がございましたら、このメールに返信いただくか、サービス内のヘルプページをご確認ください。")}
    ${p(`${BRAND_NAME}編集部`)}
  `;

  return { subject, html: wrapHtml(subject, body) };
}

// ============================================================
// Day 1: 教育コンテンツ（補助金の選び方）
// ============================================================
export function subsidyGuideEmail(): { subject: string; html: string } {
  const subject = "あなたの会社に合った補助金の見つけ方";

  const body = `
    ${p("こんにちは、")}
    ${p(`${BRAND_NAME}をご利用いただきありがとうございます。`)}
    ${p("今日は「自社に合った補助金の選び方」についてご案内します。")}
    ${divider}
    ${h2("補助金と助成金の違い")}
    ${table(
      ["", "補助金", "助成金"],
      [
        ["主な財源", "国・自治体", "厚生労働省（雇用関係）"],
        ["審査", "あり（競争倍率あり）", "要件を満たせば受給可"],
        ["申請タイミング", "公募期間内のみ", "随時申請可能"],
        ["金額", "数十万〜数億円", "数十万〜数百万円"],
      ]
    )}
    ${p("補助金は競争がありますが、採択されれば大きな資金調達につながります。")}
    ${divider}
    ${h2("補助金選びの3つのポイント")}
    ${ul([
      `${strong("事業目的と合致しているか")}<br><span style="font-size:13px;color:#6b7280;">補助金ごとに「デジタル化」「販路開拓」「設備投資」など目的が決まっています。自社の投資計画と目的が一致する補助金を選びましょう。</span>`,
      `${strong("自社の規模・業種が対象か")}<br><span style="font-size:13px;color:#6b7280;">多くの補助金は中小企業・小規模事業者が対象です。従業員数や資本金の要件を確認しましょう。</span>`,
      `${strong("締切と準備期間は十分か")}<br><span style="font-size:13px;color:#6b7280;">申請書の準備には通常2〜4週間かかります。余裕を持ったスケジュールで取り組みましょう。</span>`,
    ])}
    ${p("サービスでは業種・目的・金額でフィルタリングして最適な補助金を見つけられます。")}
    ${ctaButton("補助金を探す", `${SITE_URL}/subsidies`)}
    ${divider}
    ${p("明日は「AI生成機能の使い方」をご案内します。")}
    ${p(`${BRAND_NAME}編集部`)}
  `;

  return { subject, html: wrapHtml(subject, body) };
}

// ============================================================
// Day 3: 試用促進（AI生成を体験する）
// ============================================================
export function tryAiEmail(): { subject: string; html: string } {
  const subject = "AI生成を試してみませんか？無料で3回まで使えます";

  const body = `
    ${p("こんにちは、")}
    ${p(`${BRAND_NAME}に登録いただいてから3日が経ちました。`)}
    ${p("まだAI生成をお試しになっていない方に向けて、具体的な使い方をご案内します。")}
    ${divider}
    ${h2("AI生成の手順（3分でできます）")}
    ${ul([
      `${strong("Step 1: 企業プロフィールを入力（まだの方）")}<br><span style="font-size:13px;color:#6b7280;">業種・従業員数・事業内容などを登録してください。これがAI生成の精度を大きく左右します。</span>`,
      `${strong("Step 2: 申請したい補助金を選ぶ")}<br><span style="font-size:13px;color:#6b7280;">「持続化補助金」「IT導入補助金」など、100件以上からあなたの会社に合った補助金を選択。</span>`,
      `${strong("Step 3: 「AI生成」ボタンを押す")}<br><span style="font-size:13px;color:#6b7280;">セクションごとに、中小企業診断士レベルの文章が自動生成されます。生成後は自由に編集も可能です。</span>`,
    ])}
    ${divider}
    ${h2("AI生成サンプル（持続化補助金 経営計画書）")}
    ${highlightBox(`<p style="margin:0;font-size:14px;line-height:1.8;color:#1e40af;font-style:italic;">「当社は2018年の創業以来、地域密着型の飲食業として事業を展開してまいりました。代表者の20年にわたる料理人経験を活かし、地元産食材を使った季節料理を提供し、地域の食文化の継承に貢献してきました...」</p>`)}
    ${p("無料プランでは月3回まで無料でご利用いただけます。まずは実際に試して、品質をご確認ください。")}
    ${ctaButton("AI生成を試してみる", `${SITE_URL}/applications/new`)}
    ${divider}
    ${p(`${BRAND_NAME}編集部`)}
  `;

  return { subject, html: wrapHtml(subject, body) };
}

// ============================================================
// Day 7: Pro訴求（機能ハイライト）
// ============================================================
export function proUpsellEmail(): { subject: string; html: string } {
  const subject = "Proプランで全補助金に対応 — 月額2,980円";

  const body = `
    ${p("こんにちは、")}
    ${p(`${BRAND_NAME}をご利用いただきありがとうございます。`)}
    ${p("今日はProプランについてご案内します。")}
    ${divider}
    ${h2("Free vs Pro 比較")}
    ${table(
      ["機能", "無料プラン", "Proプラン（¥2,980/月）"],
      [
        ["AI生成", "月3回まで", "月100回（実質無制限）"],
        ["申請書保存", "1件", "無制限"],
        ["対応補助金", "一部", "全補助金対応"],
        ["Word出力", "×", "○（DOCX形式）"],
        ["優先サポート", "×", "○"],
      ]
    )}
    ${divider}
    ${h2("Proプランで広がること")}
    ${ul([
      `${strong("AI生成回数が大幅アップ")}<br><span style="font-size:13px;color:#6b7280;">無料プランの月3回から月100回へ。申請書の試行錯誤が思う存分できます。</span>`,
      `${strong("全補助金でAI完全対応")}<br><span style="font-size:13px;color:#6b7280;">持続化補助金・IT導入補助金に加え、ものづくり補助金など全補助金で補助金専用に最適化されたAIが申請書を生成します。</span>`,
      `${strong("Word（DOCX）でエクスポート")}<br><span style="font-size:13px;color:#6b7280;">完成した申請書をWord形式で出力。そのまま申請窓口に提出できます。</span>`,
      `${strong("申請書を無制限に保存")}<br><span style="font-size:13px;color:#6b7280;">複数の補助金を同時進行で検討できます。</span>`,
    ])}
    ${highlightBox(p("月額2,980円（税込）。いつでもキャンセル可能です。"))}
    ${ctaButton("Proプランを見る", `${SITE_URL}/pricing`)}
    ${divider}
    ${p(`${BRAND_NAME}編集部`)}
  `;

  return { subject, html: wrapHtml(subject, body) };
}

// ============================================================
// Day 14: 締切緊急性
// ============================================================
export function deadlineUrgencyEmail(): { subject: string; html: string } {
  const subject =
    "補助金の締切が近づいています — 準備は大丈夫ですか？";

  const body = `
    ${p("こんにちは、")}
    ${p("補助金には申請期限があります。締切を過ぎると、次の公募まで数ヶ月〜1年以上待つことになる場合があります。")}
    ${divider}
    ${h2("申請書作成の目安スケジュール")}
    ${table(
      ["時期", "作業内容"],
      [
        ["締切4週間前", "申請する補助金を決定、プロフィール入力完了"],
        ["締切3週間前", "AI生成で各セクションの下書き作成"],
        ["締切2週間前", "内容の確認・修正、添付書類の準備"],
        ["締切1週間前", "最終確認、申請窓口への提出"],
      ]
    )}
    ${divider}
    ${h2("今すぐ確認したい補助金")}
    ${ul([
      `${strong("小規模事業者持続化補助金")} — 販路開拓・業務効率化に。年4回の公募`,
      `${strong("IT導入補助金")} — ITツール導入に最大450万円補助`,
      `${strong("ものづくり補助金")} — 設備投資に最大1,250万円補助`,
    ])}
    ${p(`${BRAND_NAME}では全ての補助金の締切情報を随時更新しています。`)}
    ${ctaButton("補助金の締切を確認する", `${SITE_URL}/subsidies`)}
    ${divider}
    ${p(`${BRAND_NAME}編集部`)}
  `;

  return { subject, html: wrapHtml(subject, body) };
}

// ============================================================
// Day 21: 成功パターン（採択のコツ）
// ============================================================
export function successTipsEmail(): { subject: string; html: string } {
  const subject = "採択される申請書に共通する5つの特徴";

  const body = `
    ${p("こんにちは、")}
    ${p("今日は「採択率を上げる申請書の書き方」について解説します。")}
    ${divider}
    ${h2("採択される申請書の5つの特徴")}
    ${ul([
      `${strong("具体的な数字を使う")}<br><span style="font-size:13px;color:#6b7280;">「売上が増加した」ではなく「前年比15%増収」と具体的に。曖昧な表現は審査員の印象に残りません。</span>`,
      `${strong("補助金の目的と自社の課題が一致している")}<br><span style="font-size:13px;color:#6b7280;">補助金ごとに設定された「政策目的」と自社の事業計画を紐づける。「なぜこの補助金が必要か」を明確に説明する。</span>`,
      `${strong("実現可能性が高い計画")}<br><span style="font-size:13px;color:#6b7280;">野心的すぎる目標より、現実的で達成可能な計画のほうが審査に通りやすい。</span>`,
      `${strong("地域貢献・社会的インパクトを示す")}<br><span style="font-size:13px;color:#6b7280;">「地域の雇用創出」「環境負荷の低減」など、社会的価値を具体的に記述。</span>`,
      `${strong("補助対象経費の明確化")}<br><span style="font-size:13px;color:#6b7280;">何に補助金を使うのか、費用の内訳と根拠を明確に示す。</span>`,
    ])}
    ${highlightBox(p("これらのポイントを踏まえて、AIが生成した下書きを確認・修正することで採択率を高めることができます。"))}
    ${ctaButton("申請書を作成する", `${SITE_URL}/applications/new`)}
    ${divider}
    ${p(`${BRAND_NAME}編集部`)}
  `;

  return { subject, html: wrapHtml(subject, body) };
}

// ============================================================
// Day 30: 期間限定オファー
// ============================================================
export function limitedOfferEmail(): { subject: string; html: string } {
  const subject = "【今月限定】Proプランが初月50%OFF";

  const body = `
    ${p("こんにちは、")}
    ${p(`${BRAND_NAME}に登録いただいてから30日が経ちました。`)}
    ${p("今月限り、Proプランを初月50%OFFでご提供します。")}
    ${divider}
    ${h2("今月限定オファー")}
    <div style="text-align:center;padding:24px;background-color:#eff6ff;border-radius:8px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:14px;color:#6b7280;text-decoration:line-through;">月額 ¥2,980</p>
      <p style="margin:0 0 4px;font-size:36px;font-weight:800;color:${BRAND_COLOR};">初月 ¥1,490</p>
      <p style="margin:0;font-size:14px;color:#6b7280;">翌月から通常価格 ¥2,980/月</p>
    </div>
    ${ul([
      "AI生成: 月100回（実質無制限）",
      "全補助金対応（FULL AIサポート）",
      "Word(DOCX)エクスポート",
      "申請書無制限保存",
      "いつでもキャンセル可能",
    ])}
    ${divider}
    ${h2("このオファーが終わると？")}
    ${p("通常価格の月額¥2,980でのご提供となります。今月のうちにProプランをお試しいただき、サービスの価値を実感してください。")}
    ${highlightBox(`<p style="margin:0;font-size:14px;font-weight:600;color:#1e40af;">オファー有効期限: 今月末まで</p><p style="margin:4px 0 0;font-size:13px;color:#1e40af;">（適用には下記のボタンからお申し込みが必要です）</p>`)}
    ${ctaButton("初月50%OFFで始める", `${SITE_URL}/pricing`)}
    ${divider}
    <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">※ このメールは登録から30日経過したユーザー向けの特別オファーです。</p>
    <p style="margin:0 0 16px;font-size:12px;color:#9ca3af;">※ 初月のみ割引が適用されます。翌月からは通常価格(¥2,980/月)となります。</p>
    ${p(`${BRAND_NAME}編集部`)}
  `;

  return { subject, html: wrapHtml(subject, body) };
}

// ============================================================
// テンプレートキーマップ
// ============================================================
export type EmailTemplateKey =
  | "welcome"
  | "subsidy_guide"
  | "try_ai"
  | "pro_upsell"
  | "deadline_urgency"
  | "success_tips"
  | "limited_offer";

export function getEmailTemplate(key: EmailTemplateKey): {
  subject: string;
  html: string;
} {
  switch (key) {
    case "welcome":
      return welcomeEmail();
    case "subsidy_guide":
      return subsidyGuideEmail();
    case "try_ai":
      return tryAiEmail();
    case "pro_upsell":
      return proUpsellEmail();
    case "deadline_urgency":
      return deadlineUrgencyEmail();
    case "success_tips":
      return successTipsEmail();
    case "limited_offer":
      return limitedOfferEmail();
    default: {
      const _exhaustive: never = key;
      throw new Error(`Unknown email template key: ${String(_exhaustive)}`);
    }
  }
}
