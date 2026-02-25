/**
 * プロフィールフォームの選択肢定義
 * 自由入力を削減し、入力負担を軽くする
 */

// === 業種 ===
export const INDUSTRY_OPTIONS = [
  "製造業",
  "小売業",
  "飲食業",
  "サービス業",
  "IT・情報通信",
  "建設業",
  "医療・福祉",
  "不動産業",
  "農林水産業",
  "運輸業",
  "教育・学習",
  "宿泊業",
  "卸売業",
  "その他",
] as const;

// === 従業員数レンジ ===
export const EMPLOYEE_RANGES = [
  { label: "1〜5名", value: 3 },
  { label: "6〜20名", value: 13 },
  { label: "21〜50名", value: 35 },
  { label: "51〜100名", value: 75 },
  { label: "101〜300名", value: 200 },
  { label: "301名以上", value: 500 },
] as const;

/** employeeCount の数値から最も近いレンジを返す */
export function findEmployeeRange(count: number) {
  if (count <= 0) return null;
  return EMPLOYEE_RANGES.reduce((closest, range) =>
    Math.abs(range.value - count) < Math.abs(closest.value - count)
      ? range
      : closest
  );
}

// === 年間売上レンジ（万円） ===
export const REVENUE_RANGES = [
  { label: "〜500万円", value: 300 },
  { label: "500万〜1,000万円", value: 750 },
  { label: "1,000万〜3,000万円", value: 2000 },
  { label: "3,000万〜5,000万円", value: 4000 },
  { label: "5,000万〜1億円", value: 7500 },
  { label: "1億〜5億円", value: 30000 },
  { label: "5億円以上", value: 100000 },
] as const;

/** annualRevenue の数値から最も近いレンジを返す */
export function findRevenueRange(revenue: number | null) {
  if (revenue === null || revenue <= 0) return null;
  return REVENUE_RANGES.reduce((closest, range) =>
    Math.abs(range.value - revenue) < Math.abs(closest.value - revenue)
      ? range
      : closest
  );
}

// === 都道府県 ===
export const PREFECTURES = [
  "北海道",
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
] as const;

// === 販売チャネル（マルチセレクト） ===
export const SALES_CHANNEL_OPTIONS = [
  "実店舗",
  "ECサイト",
  "卸売",
  "直販・訪問販売",
  "代理店・フランチャイズ",
  "SNS販売",
  "電話・FAX",
] as const;

// === 経営課題（マルチセレクト） ===
export const CHALLENGE_OPTIONS = [
  "売上・収益の低迷",
  "人手不足・採用難",
  "デジタル化・IT化の遅れ",
  "後継者不足",
  "新規顧客の開拓",
  "原材料・仕入コストの上昇",
  "競合の激化",
  "設備の老朽化",
  "販路の拡大",
] as const;
