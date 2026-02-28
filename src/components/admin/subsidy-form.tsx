"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SubsidyData {
  id: string;
  name: string;
  name_short: string;
  department: string;
  summary: string;
  description: string;
  max_amount: number | null;
  min_amount: number | null;
  subsidy_rate: string;
  deadline: string | null;
  url: string | null;
  categories: string[];
  target_scale: string[];
  target_industries: string[];
  tags: string[];
  prompt_support: string;
  subsidy_type: string;
  popularity: number;
  difficulty: string;
  is_active: boolean;
  source: string;
}

const CATEGORIES = [
  { value: "HANBAI_KAIKAKU", label: "販路開拓" },
  { value: "IT_DIGITAL", label: "IT・デジタル" },
  { value: "SETSUBI_TOUSHI", label: "設備投資" },
  { value: "KENKYUU_KAIHATSU", label: "研究開発" },
  { value: "JINZAI_IKUSEI", label: "人材育成" },
  { value: "CHIIKI_KASSEIKA", label: "地域活性化" },
  { value: "SOUZOU_TENKAN", label: "創造・転換" },
  { value: "KANKYOU_ENERGY", label: "環境・エネルギー" },
  { value: "OTHER", label: "その他" },
];

const DIFFICULTIES = [
  { value: "EASY", label: "簡単" },
  { value: "MEDIUM", label: "普通" },
  { value: "HARD", label: "難しい" },
];

const PROMPT_SUPPORTS = [
  { value: "FULL", label: "完全対応" },
  { value: "GENERIC", label: "汎用対応" },
  { value: "NONE", label: "非対応" },
];

export function SubsidyForm({ subsidy }: { subsidy: SubsidyData }) {
  const router = useRouter();
  const [data, setData] = useState(subsidy);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update<K extends keyof SubsidyData>(key: K, value: SubsidyData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const res = await fetch(`/api/admin/subsidies/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setSaving(false);

    if (res.ok) {
      setMessage({ type: "success", text: "保存しました" });
      router.refresh();
    } else {
      const err = await res.json();
      setMessage({ type: "error", text: err.error || "保存に失敗しました" });
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          管理画面に戻る
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "保存中..." : "保存"}
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 基本情報 */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold">基本情報</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID</label>
            <input
              value={data.id}
              disabled
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ソース</label>
            <input
              value={data.source}
              disabled
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">名称</label>
          <input
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">略称</label>
          <input
            value={data.name_short}
            onChange={(e) => update("name_short", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">管轄省庁</label>
          <input
            value={data.department}
            onChange={(e) => update("department", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">概要</label>
          <textarea
            value={data.summary}
            onChange={(e) => update("summary", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">詳細説明</label>
          <textarea
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          />
        </div>
      </div>

      {/* 金額・日程 */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold">金額・日程</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">上限額（万円）</label>
            <input
              type="number"
              value={data.max_amount ?? ""}
              onChange={(e) => update("max_amount", e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">下限額（万円）</label>
            <input
              type="number"
              value={data.min_amount ?? ""}
              onChange={(e) => update("min_amount", e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">補助率</label>
            <input
              value={data.subsidy_rate}
              onChange={(e) => update("subsidy_rate", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">締切</label>
            <input
              type="date"
              value={data.deadline ?? ""}
              onChange={(e) => update("deadline", e.target.value || null)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">公式URL</label>
            <input
              value={data.url ?? ""}
              onChange={(e) => update("url", e.target.value || null)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
        </div>
      </div>

      {/* 分類 */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold">分類</h2>

        <div>
          <label className="block text-sm font-medium mb-2">カテゴリ</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat.value} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={data.categories.includes(cat.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      update("categories", [...data.categories, cat.value]);
                    } else {
                      update("categories", data.categories.filter((c) => c !== cat.value));
                    }
                  }}
                  className="rounded"
                />
                {cat.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">難易度</label>
            <select
              value={data.difficulty}
              onChange={(e) => update("difficulty", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">AI対応</label>
            <select
              value={data.prompt_support}
              onChange={(e) => update("prompt_support", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            >
              {PROMPT_SUPPORTS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">人気度 (0-10)</label>
            <input
              type="number"
              min={0}
              max={10}
              value={data.popularity}
              onChange={(e) => update("popularity", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
            id="is_active"
            className="rounded"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            公開中
          </label>
        </div>
      </div>
    </div>
  );
}
