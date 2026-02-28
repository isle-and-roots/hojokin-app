"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Edit, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubsidyRow {
  id: string;
  name: string;
  name_short: string;
  source: string;
  is_active: boolean;
  max_amount: number | null;
  deadline: string | null;
  updated_at: string;
}

interface SubsidyTableProps {
  initialItems: SubsidyRow[];
  initialTotal: number;
}

export function SubsidyTable({ initialItems, initialTotal }: SubsidyTableProps) {
  const [items, setItems] = useState<SubsidyRow[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchSubsidies(opts?: { search?: string; source?: string; page?: number }) {
    setLoading(true);
    const params = new URLSearchParams();
    if (opts?.search) params.set("search", opts.search);
    if (opts?.source) params.set("source", opts.source);
    params.set("page", String(opts?.page ?? 1));

    const res = await fetch(`/api/admin/subsidies?${params}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }

  function handleSearch() {
    setPage(1);
    fetchSubsidies({ search, source: sourceFilter, page: 1 });
  }

  function handleSourceFilter(source: string) {
    setSourceFilter(source);
    setPage(1);
    fetchSubsidies({ search, source, page: 1 });
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    fetchSubsidies({ search, source: sourceFilter, page: newPage });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) return;
    const res = await fetch(`/api/admin/subsidies/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchSubsidies({ search, source: sourceFilter, page });
    }
  }

  const totalPages = Math.ceil(total / 50);

  return (
    <div>
      {/* 検索・フィルター */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="補助金名で検索..."
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
          >
            検索
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {["", "manual", "jgrants"].map((src) => (
            <button
              key={src}
              onClick={() => handleSourceFilter(src)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border",
                sourceFilter === src
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {src === "" ? "全て" : src === "manual" ? "手動" : "jGrants"}
            </button>
          ))}
        </div>
      </div>

      {/* テーブル */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">名称</th>
              <th className="text-left px-4 py-3 font-medium w-24">ソース</th>
              <th className="text-left px-4 py-3 font-medium w-24">状態</th>
              <th className="text-left px-4 py-3 font-medium w-28">上限額</th>
              <th className="text-left px-4 py-3 font-medium w-28">締切</th>
              <th className="text-left px-4 py-3 font-medium w-36">更新日</th>
              <th className="text-right px-4 py-3 font-medium w-24">操作</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y divide-border", loading && "opacity-50")}>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium truncate max-w-[300px]">{item.name_short}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[300px]">{item.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      item.source === "jgrants"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {item.source === "jgrants" ? "jGrants" : "手動"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      item.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {item.is_active ? "公開" : "非公開"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.max_amount ? `${item.max_amount.toLocaleString()}万円` : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.deadline || "随時"}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(item.updated_at).toLocaleString("ja-JP")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/subsidies/${item.id}`}
                      className="p-1.5 rounded hover:bg-accent"
                      title="編集"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/subsidies/${item.id}`}
                      className="p-1.5 rounded hover:bg-accent"
                      title="プレビュー"
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.name_short)}
                      className="p-1.5 rounded hover:bg-red-100 text-red-600"
                      title="削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  補助金が見つかりません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            全{total}件中 {(page - 1) * 50 + 1}–{Math.min(page * 50, total)}件
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
            >
              前へ
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
            >
              次へ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface IngestionLog {
  id: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  total_fetched: number;
  total_upserted: number;
  total_skipped: number;
  total_errors: number;
}

export function IngestionPanel({ logs }: { logs: IngestionLog[] }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleManualRun() {
    setRunning(true);
    setResult(null);
    const res = await fetch("/api/admin/ingestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setRunning(false);
    setResult(
      data.success
        ? `完了: ${data.totalUpserted}件取込, ${data.totalSkipped}件スキップ, ${data.totalErrors}件エラー`
        : `失敗: ${data.errors?.join(", ") || "不明なエラー"}`
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">jGrants 自動取込</h2>
        <button
          onClick={handleManualRun}
          disabled={running}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", running && "animate-spin")} />
          {running ? "実行中..." : "手動実行"}
        </button>
      </div>

      {result && (
        <div className="mb-4 p-3 rounded-lg bg-muted text-sm">{result}</div>
      )}

      <div className="space-y-2">
        {logs.length === 0 && (
          <p className="text-sm text-muted-foreground">実行履歴がありません</p>
        )}
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center gap-4 text-sm border-b border-border pb-2 last:border-0"
          >
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                log.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : log.status === "partial"
                    ? "bg-yellow-100 text-yellow-700"
                    : log.status === "running"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
              )}
            >
              {log.status}
            </span>
            <span className="text-muted-foreground">
              {new Date(log.started_at).toLocaleString("ja-JP")}
            </span>
            <span>
              取込{log.total_upserted} / スキップ{log.total_skipped} / エラー
              {log.total_errors}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
