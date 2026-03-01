/**
 * jGrants API クライアント
 *
 * デジタル庁の補助金公開API（認証不要・無料）
 * レート制限: 60リクエスト/分
 * ドキュメント: https://api.jgrants-portal.go.jp/exp
 */

const BASE_URL = "https://api.jgrants-portal.go.jp/exp";

/** jGrants API 一覧レスポンスの1件 */
export interface JGrantsSubsidySummary {
  id: string;
  name: string;          // 内部ID（例: "S-00008160"）
  title: string;         // 補助金タイトル
  subsidy_max_limit: number | null;  // 円単位の数値
  acceptance_start_datetime: string | null;
  acceptance_end_datetime: string | null;
  target_area_search: string | null;
  target_number_of_employees: string | null;
}

/** jGrants API 一覧レスポンス */
export interface JGrantsListResponse {
  metadata: { type: string; resultset: { count: number } };
  result: JGrantsSubsidySummary[];
}

/** jGrants API 詳細レスポンス */
export interface JGrantsSubsidyDetail {
  id: string;
  name: string;
  title: string;
  name_sub: string | null;
  subsidy_max_limit: number | null;
  subsidy_rate: string | null;
  target: string | null;
  detail: string | null;
  usage: string | null;
  application_method: string | null;
  acceptance_start_datetime: string | null;
  acceptance_end_datetime: string | null;
  competent_authority: string | null;
  target_area_search: string | null;
  target_number_of_cases: string | null;
  subsidy_category: string | null;
  supplementary_information: string | null;
  url: string | null;
  created_date: string | null;
  updated_date: string | null;
}

/** jGrants API 詳細レスポンスラッパー */
export interface JGrantsDetailResponse {
  result: JGrantsSubsidyDetail;
}

class JGrantsApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "JGrantsApiError";
  }
}

/** レート制限のための遅延 */
async function rateLimitDelay(): Promise<void> {
  // 60req/min = 1req/sec を余裕を持って1.1秒
  await new Promise((resolve) => setTimeout(resolve, 1100));
}

/**
 * 補助金一覧を取得
 * @param keyword 検索キーワード（必須）
 * @param sort ソートフィールド
 * @param order ソート順
 * @param acceptance 受付中のみ（1=受付中）
 */
export async function listSubsidies(options?: {
  keyword?: string;
  sort?: string;
  order?: string;
  acceptance?: number;
}): Promise<JGrantsListResponse> {
  const params = new URLSearchParams();
  params.set("keyword", options?.keyword ?? "補助金");
  if (options?.sort) params.set("sort", options.sort);
  if (options?.order) params.set("order", options.order);
  if (options?.acceptance !== undefined)
    params.set("acceptance", String(options.acceptance));

  const url = `${BASE_URL}/v1/public/subsidies?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new JGrantsApiError(
      response.status,
      `jGrants一覧取得失敗: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * 補助金詳細を取得
 * @param id jGrants補助金ID
 */
export async function getSubsidyDetail(
  id: string
): Promise<JGrantsSubsidyDetail> {
  await rateLimitDelay();

  const url = `${BASE_URL}/v2/public/subsidies/id/${encodeURIComponent(id)}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new JGrantsApiError(
      response.status,
      `jGrants詳細取得失敗 (${id}): ${response.status} ${response.statusText}`
    );
  }

  const data: JGrantsDetailResponse = await response.json();
  return data.result;
}

/**
 * 全件を一括取得
 * jGrants APIはページネーション不要（全件一括返却）
 */
export async function fetchAllSubsidies(options?: {
  keyword?: string;
  acceptance?: number;
}): Promise<JGrantsListResponse> {
  return listSubsidies({
    keyword: options?.keyword ?? "補助金",
    sort: "created_date",
    order: "DESC",
    acceptance: options?.acceptance ?? 1,
  });
}
