/**
 * 補助金自動取込パイプライン
 *
 * Vercel Hobby制約対応（60秒タイムアウト）:
 * 1. jGrants APIから一覧取得
 * 2. 前回のカーソルから再開
 * 3. バッチ10件ずつ処理（1件あたり~3秒 → 10件で~30秒）
 * 4. 50秒経過で中断し、カーソルを保存
 * 5. 次回Cron実行で続きから処理
 */

import { listSubsidies, getSubsidyDetail } from "@/lib/external/jgrants";
import { mapJGrantsToPartialSubsidy } from "./mapper";
import { extractFieldsWithAI, mergeExtractionResult } from "./ai-extractor";
import { checkSubsidyQuality, checkAmountAnomaly } from "./quality-check";
import {
  upsertSubsidy,
  deactivateExpiredSubsidies,
  getSubsidyByIdFromDb,
  createIngestionLog,
  updateIngestionLog,
  getLatestIngestionLog,
} from "@/lib/db/subsidies";

const BATCH_SIZE = 10;
const TIMEOUT_MS = 50_000; // 50秒（60秒制限に対して10秒バッファ）

export interface PipelineResult {
  logId: string;
  status: "completed" | "partial" | "failed";
  totalFetched: number;
  totalUpserted: number;
  totalSkipped: number;
  totalErrors: number;
  nextCursor: number | null;
  deactivated: number;
  errors: string[];
}

/**
 * パイプラインを実行
 */
export async function runIngestionPipeline(): Promise<PipelineResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let totalFetched = 0;
  let totalUpserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let nextCursor: number | null = null;

  // 取込ログ作成
  const logId = await createIngestionLog();

  try {
    // 前回のカーソルを取得
    const lastLog = await getLatestIngestionLog();
    const startFrom =
      lastLog?.status === "partial"
        ? ((lastLog.metadata?.next_cursor as number) ?? 0)
        : 0;

    // jGrants一覧取得
    const listResponse = await listSubsidies({
      from: startFrom,
      size: BATCH_SIZE,
    });

    if (!listResponse.result || listResponse.result.length === 0) {
      // 全件処理完了 → 期限切れ補助金を非アクティブ化
      const deactivated = await deactivateExpiredSubsidies();

      await updateIngestionLog(logId, {
        status: "completed",
        total_fetched: 0,
        total_upserted: 0,
        total_skipped: 0,
        total_errors: 0,
        metadata: { last_cursor: 0, deactivated },
      });

      return {
        logId,
        status: "completed",
        totalFetched: 0,
        totalUpserted: 0,
        totalSkipped: 0,
        totalErrors: 0,
        nextCursor: null,
        deactivated,
        errors: [],
      };
    }

    totalFetched = listResponse.result.length;

    // バッチ処理
    for (const summary of listResponse.result) {
      // タイムアウトチェック
      if (Date.now() - startTime > TIMEOUT_MS) {
        nextCursor = startFrom + totalUpserted + totalSkipped + totalErrors;
        break;
      }

      try {
        // 詳細取得
        const detail = await getSubsidyDetail(summary.id);

        // マッピング
        const partialSubsidy = mapJGrantsToPartialSubsidy(detail);

        // AI抽出
        const { result: extraction, version } = await extractFieldsWithAI(detail);
        const subsidy = mergeExtractionResult(partialSubsidy, extraction);

        // 品質チェック
        const quality = checkSubsidyQuality(subsidy);
        if (!quality.passed) {
          console.warn(
            `[Pipeline] 品質チェック失敗 (${summary.id}):`,
            quality.errors
          );
          totalSkipped++;
          errors.push(`品質チェック失敗 (${summary.id}): ${quality.errors.join(", ")}`);
          continue;
        }

        // 金額異常変動チェック
        const existing = await getSubsidyByIdFromDb(subsidy.id);
        if (existing) {
          const anomaly = checkAmountAnomaly(subsidy.maxAmount, existing.maxAmount);
          if (anomaly.anomaly) {
            console.warn(`[Pipeline] 金額異常変動 (${summary.id}): ${anomaly.detail}`);
            errors.push(`金額異常変動 (${summary.id}): ${anomaly.detail}`);
            // 警告のみ、UPSERTは続行
          }
        }

        // UPSERT
        await upsertSubsidy(subsidy, "jgrants", {
          source_id: summary.id,
          source_url: detail.url || undefined,
          raw_data: detail,
          ai_extraction_version: version,
        });

        totalUpserted++;
      } catch (err) {
        totalErrors++;
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`処理失敗 (${summary.id}): ${message}`);
        console.error(`[Pipeline] エラー (${summary.id}):`, message);
      }
    }

    // 次ページが存在するかチェック
    const processedCount = totalUpserted + totalSkipped + totalErrors;
    if (
      nextCursor !== null ||
      startFrom + processedCount < listResponse.total_count
    ) {
      // まだ続きがある
      nextCursor = nextCursor ?? startFrom + processedCount;
    }

    const status = nextCursor !== null ? "partial" : "completed";

    // 全件完了時は期限切れ補助金を非アクティブ化
    let deactivated = 0;
    if (status === "completed") {
      deactivated = await deactivateExpiredSubsidies();
    }

    await updateIngestionLog(logId, {
      status,
      total_fetched: totalFetched,
      total_upserted: totalUpserted,
      total_skipped: totalSkipped,
      total_errors: totalErrors,
      error_details: errors.length > 0 ? errors : undefined,
      metadata: {
        next_cursor: nextCursor,
        start_from: startFrom,
        deactivated,
      },
    });

    return {
      logId,
      status,
      totalFetched,
      totalUpserted,
      totalSkipped,
      totalErrors,
      nextCursor,
      deactivated,
      errors,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await updateIngestionLog(logId, {
      status: "failed",
      total_fetched: totalFetched,
      total_upserted: totalUpserted,
      total_skipped: totalSkipped,
      total_errors: totalErrors + 1,
      error_details: [...errors, `パイプライン致命的エラー: ${message}`],
    });

    return {
      logId,
      status: "failed",
      totalFetched,
      totalUpserted,
      totalSkipped,
      totalErrors: totalErrors + 1,
      nextCursor: null,
      deactivated: 0,
      errors: [...errors, message],
    };
  }
}
