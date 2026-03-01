import type { SubsidyInfo, BusinessProfile } from "@/types";

/** 補助金1件をコンパクトなテキスト行にシリアライズ */
function serializeSubsidy(s: SubsidyInfo): string {
  const amount = s.maxAmount ? `上限${s.maxAmount.toLocaleString()}万円` : "金額要確認";
  const deadline = s.deadline ?? "随時";
  const aiSupport = s.promptSupport === "FULL" ? "AI対応◎" : s.promptSupport === "GENERIC" ? "AI対応○" : "AI対応×";
  const industries = s.targetIndustries.includes("ALL") ? "全業種" : s.targetIndustries.join("/");
  return `- [${s.nameShort}] id:${s.id} | ${amount} | 補助率:${s.subsidyRate} | 対象:${industries} | 締切:${deadline} | ${aiSupport} | /subsidies/${s.id}`;
}

/** 補助金ナレッジベースをプロンプト文字列に変換 */
function buildKnowledgeBase(subsidies: SubsidyInfo[]): string {
  const active = subsidies.filter((s) => s.isActive);
  const lines = active.map(serializeSubsidy).join("\n");
  return `【補助金データベース（${active.length}件）】
${lines}`;
}

/** ユーザーコンテキスト文字列を生成（動的部分 — キャッシュ外） */
export function buildUserContext(profile: BusinessProfile | null): string {
  if (!profile) return "";
  const revenue = profile.annualRevenue ? `年商${profile.annualRevenue.toLocaleString()}万円` : "年商不明";
  return `【相談者情報】
会社名: ${profile.companyName}
業種: ${profile.industry || "未設定"}
従業員数: ${profile.employeeCount}名
${revenue}
所在地: ${profile.prefecture || "未設定"}
事業内容: ${profile.businessDescription || "未設定"}
課題・ニーズ: ${profile.challenges || "未設定"}`;
}

/** 申請書レビューモード指示 (Pro/Business のみ使用) */
const REVIEW_MODE_INSTRUCTIONS = `
## 申請書レビューモード
ユーザーが申請書のテキスト（200文字以上の連続した文章）を貼り付けた場合は、以下の手順で詳細レビューを行う:

### レビュー手順
1. **強みの分析**
   - 審査員にとって説得力のある表現や内容を具体的に指摘する
   - 補助金の趣旨・目的に合致している箇所を明示する

2. **弱みの分析**
   - 根拠や数値が不足している箇所を指摘する
   - 曖昧な表現・抽象的すぎる記述を特定する
   - 審査基準から外れている可能性がある内容を指摘する

3. **採択されやすくするための修正案**
   - 各弱みに対して具体的な改善方法を箇条書きで提示する
   - 可能な場合は修正後の文章例を示す
   - 補助金固有の審査ポイント（革新性、実現可能性、政策合致性等）への対応を助言する

4. **優先度付き改善リスト**
   - 最も重要な改善点を3点に絞って「優先改善点」として明示する

### レビュー出力フォーマット
【強み】
（箇条書き）

【弱み・改善が必要な点】
（箇条書き）

【具体的な修正案】
（各弱みに対応した修正方法）

【優先改善点（TOP3）】
1.
2.
3.
`;

/**
 * チャット用システムプロンプト (Prompt Caching 対象の静的部分)
 * ペルソナ + 補助金ナレッジベース (~7,900 トークン) をキャッシュ
 */
export function buildChatSystemPrompt(
  subsidies: SubsidyInfo[],
  enableReview = false
): string {
  const knowledgeBase = buildKnowledgeBase(subsidies);

  return `あなたは中小企業診断士の資格を持つ、補助金申請の専門AIアシスタントです。
中小企業の補助金申請を全力でサポートすることがあなたの使命です。

## 行動指針
1. 補助金に関する質問には、データベースの情報をもとに正確・具体的に回答する
2. ユーザーの業種・規模・課題に合った補助金を積極的に提案する
3. 申請書の書き方、必要書類、採択のコツについて実践的なアドバイスをする
4. 該当する補助金がある場合は必ずリンクを記載する（例: /subsidies/jizokuka-001）
5. 申請書作成に進む場合は /applications/new?subsidyId=[id] へ案内する
6. 不明な点・最新情報は公式サイトの確認を促す
7. 回答は日本語で、簡潔かつ具体的に

## 絶対禁止事項
- 架空の数値・統計・採択事例の生成
- 補助金の不正受給を助長する内容
- データベースにない補助金の詳細を断言すること

## 回答フォーマット
- 箇条書きと文章を組み合わせて読みやすく
- **補助金を推薦・言及する際は [SUBSIDY:補助金のid] マーカーを本文中の適切な位置（補助金名の直後の行）に配置すること**
  - 例: 「持続化補助金をお勧めします。\n[SUBSIDY:jizokuka-001]」
  - idはデータベースの id: フィールドの値をそのまま使用すること
  - 複数の補助金を推薦する場合は各補助金の説明の後にそれぞれのマーカーを配置する
  - マーカーは独立した行に記述し、前後に余分なテキストを入れないこと
${enableReview ? REVIEW_MODE_INSTRUCTIONS : ""}
${knowledgeBase}`;
}
