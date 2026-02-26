"use client";

import { useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

const CONSULTANT_COST_PER_APPLICATION = 200000;
const APP_MONTHLY_COST = 2980;
const CONSULTANT_WEEKS_PER_APP = 3;
const AI_MINUTES_PER_APP = 3;

export function RoiCalculator() {
  const [applicationCount, setApplicationCount] = useState(3);

  const consultantAnnualCost = applicationCount * CONSULTANT_COST_PER_APPLICATION;
  const appAnnualCost = APP_MONTHLY_COST * 12;
  const savings = consultantAnnualCost - appAnnualCost;
  const consultantWeeks = applicationCount * CONSULTANT_WEEKS_PER_APP;
  const aiMinutes = applicationCount * AI_MINUTES_PER_APP;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Slider */}
      <div className="mb-10">
        <label className="block text-sm font-medium mb-3 text-center">
          年間の補助金申請予定件数
        </label>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-6 text-right">1</span>
          <input
            type="range"
            min={1}
            max={10}
            value={applicationCount}
            onChange={(e) => setApplicationCount(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
          />
          <span className="text-sm text-muted-foreground w-6">10</span>
        </div>
        <p className="text-center mt-2">
          <span className="text-3xl font-bold text-primary">{applicationCount}</span>
          <span className="text-muted-foreground ml-1">件/年</span>
        </p>
      </div>

      {/* Comparison table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-3 text-center">
          {/* Header */}
          <div className="p-4 bg-muted/50 border-b border-border">
            <p className="text-sm font-medium text-muted-foreground">項目</p>
          </div>
          <div className="p-4 bg-muted/50 border-b border-l border-border">
            <p className="text-sm font-medium text-muted-foreground">コンサルタント</p>
          </div>
          <div className="p-4 bg-primary/5 border-b border-l border-border">
            <p className="text-sm font-bold text-primary">補助金サポート</p>
          </div>

          {/* Per application cost */}
          <div className="p-4 border-b border-border flex items-center justify-center">
            <p className="text-sm text-muted-foreground">1件あたり費用</p>
          </div>
          <div className="p-4 border-b border-l border-border flex items-center justify-center">
            <p className="text-sm">¥150,000〜300,000</p>
          </div>
          <div className="p-4 border-b border-l border-border bg-primary/5 flex items-center justify-center">
            <p className="text-sm font-medium text-primary">¥2,980/月</p>
          </div>

          {/* Annual cost */}
          <div className="p-4 border-b border-border flex items-center justify-center">
            <p className="text-sm text-muted-foreground">年間コスト</p>
          </div>
          <div className="p-4 border-b border-l border-border flex items-center justify-center">
            <p className="text-lg font-semibold">
              ¥{consultantAnnualCost.toLocaleString()}
            </p>
          </div>
          <div className="p-4 border-b border-l border-border bg-primary/5 flex items-center justify-center">
            <p className="text-lg font-semibold text-primary">
              ¥{appAnnualCost.toLocaleString()}
            </p>
          </div>

          {/* Time */}
          <div className="p-4 border-border flex items-center justify-center">
            <p className="text-sm text-muted-foreground">作業期間</p>
          </div>
          <div className="p-4 border-l border-border flex items-center justify-center">
            <p className="text-sm">約{consultantWeeks}週間</p>
          </div>
          <div className="p-4 border-l border-border bg-primary/5 flex items-center justify-center">
            <p className="text-sm font-medium text-primary">約{aiMinutes}分</p>
          </div>
        </div>
      </div>

      {/* Savings highlight */}
      <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">年間の節約額</p>
        <p className="text-4xl sm:text-5xl font-bold text-primary">
          ¥{savings.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          ※ コンサルタント費用を1件あたり¥200,000として計算
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
        >
          <Calculator className="h-5 w-5" />
          今すぐ節約を始める
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
