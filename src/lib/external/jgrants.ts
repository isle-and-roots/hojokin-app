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
  name: string;
  subsidy_max_limit: string | null;
  acceptance_start_datetime: string | null;
  acceptance_end_datetime: string | null;
  target_number_of_cases: string | null;
}

/** jGrants API 一覧レスポンス */
export interface JGrantsListResponse {
  result: JGrantsSubsidySummary[];
  total_count: number;
}

/** jGrants API 詳細レスポンス */
export interface JGrantsSubsidyDetail {
  id: string;
  name: string;
  title: string;
  name_sub: string | null;
  subsidy_max_limit: string | null;
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
 * @param keyword 検索キーワード（省略可）
 * @param from ページネーション開始位置（0始まり）
 * @param size 取得件数（最大100）
 */
export async function listSubsidies(options?: {
  keyword?: string;
  from?: number;
  size?: number;
}): Promise<JGrantsListResponse> {
  const params = new URLSearchParams();
  if (options?.keyword) params.set("keyword", options.keyword);
  if (options?.from !== undefined) params.set("from", String(options.from));
  params.set("size", String(options?.size ?? 100));

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
 * 全件をページネーションで取得するジェネレーター
 * タイムアウト対応: maxItems件取得したら停止
 */
export async function* fetchAllSubsidies(options?: {
  maxItems?: number;
  startFrom?: number;
}): AsyncGenerator<JGrantsSubsidySummary[], void, unknown> {
  const pageSize = 100;
  let from = options?.startFrom ?? 0;
  let fetched = 0;
  const maxItems = options?.maxItems ?? Infinity;

  while (fetched < maxItems) {
    const response = await listSubsidies({ from, size: pageSize });

    if (!response.result || response.result.length === 0) {
      break;
    }

    yield response.result;
    fetched += response.result.length;
    from += pageSize;

    // 全件取得完了
    if (fetched >= response.total_count) {
      break;
    }

    await rateLimitDelay();
  }
}
