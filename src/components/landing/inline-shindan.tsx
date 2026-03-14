"use client";

import { useState } from "react";
import { Loader2, ArrowRight, CheckCircle, Sparkles, Banknote } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

type Industry = "manufacturing" | "it" | "food" | "retail" | "construction" | "service";
type Purpose = "設備投資" | "IT導入" | "販路開拓" | "人材育成" | "研究開発";
type Scale = "1-5人" | "6-20人" | "21-50人" | "51-100人" | "101人以上";

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "manufacturing", label: "製造業" },
  { value: "it", label: "IT・情報通信" },
  { value: "food", label: "飲食業" },
  { value: "retail", label: "小売業" },
  { value: "construction", label: "建設業" },
  { value: "service", label: "サービス業" },
];

const PURPOSES: Purpose[] = ["設備投資", "IT導入", "販路開拓", "人材育成", "研究開発"];

const SCALES: Scale[] = ["1-5人", "6-20人", "21-50人", "51-100人", "101人以上"];

interface RecommendItem {
  id: string;
  name: string;
  maxAmount: number | null;
  subsidyRate: string;
  promptSupport: "FULL" | "GENERIC" | "NONE";
}

interface RecommendResponse {
  items: RecommendItem[];
}

function formatAmount(amount: number | null): string {
  if (amount === null) return "要確認";
  if (amount >= 10000) return `${(amount / 10000).toFixed(0)}億円`;
  return `${amount.toLocaleString()}万円`;
}

export function InlineShindan() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose | null>(null);
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [results, setResults] = useState<RecommendItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(industry);
    setCurrentStep(2);
  };

  const handlePurposeSelect = (purpose: Purpose) => {
    setSelectedPurpose(purpose);
    setCurrentStep(3);
  };

  const handleScaleSelect = async (scale: Scale) => {
    setSelectedScale(scale);
    if (!selectedIndustry) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subsidies/quick-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: selectedIndustry }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json();
        setError(data.error ?? "取得に失敗しました");
        setLoading(false);
        return;
      }

      const data: RecommendResponse = await res.json();
      setResults(data.items);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedIndustry(null);
    setSelectedPurpose(null);
    setSelectedScale(null);
    setResults(null);
    setError(null);
  };

  return (
    <section className="py-12 md:py-20 px-6 bg-muted/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
            QUICK CHECK
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold">あなたに合う補助金を3問で診断</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            業種・目的・規模を選ぶだけで最適な補助金をご提案します
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Step indicator */}
          {!results && !loading && (
            <div className="flex items-center gap-2 mb-6">
              {([1, 2, 3] as Step[]).map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                      currentStep === step
                        ? "bg-primary text-primary-foreground"
                        : currentStep > step
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 w-8 rounded-full transition-all",
                        currentStep > step ? "bg-green-500" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
              <span className="ml-2 text-xs text-muted-foreground">
                ステップ {currentStep} / 3
              </span>
            </div>
          )}

          {/* Step 1: 業種 */}
          {currentStep === 1 && !results && !loading && (
            <div>
              <p className="font-semibold mb-4">Q1. 業種を教えてください</p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleIndustrySelect(value)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium border transition-all",
                      selectedIndustry === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 目的 */}
          {currentStep === 2 && !results && !loading && (
            <div>
              <p className="font-semibold mb-4">Q2. 主な目的を教えてください</p>
              <div className="flex flex-wrap gap-2">
                {PURPOSES.map((purpose) => (
                  <button
                    key={purpose}
                    onClick={() => handlePurposeSelect(purpose)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium border transition-all",
                      selectedPurpose === purpose
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {purpose}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 規模 */}
          {currentStep === 3 && !results && !loading && (
            <div>
              <p className="font-semibold mb-4">Q3. 従業員規模を教えてください</p>
              <div className="flex flex-wrap gap-2">
                {SCALES.map((scale) => (
                  <button
                    key={scale}
                    onClick={() => handleScaleSelect(scale)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium border transition-all",
                      selectedScale === scale
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">診断中です...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-4">
              <p className="text-sm text-destructive mb-3">{error}</p>
              <button
                onClick={handleReset}
                className="text-sm text-primary hover:underline"
              >
                もう一度試す
              </button>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div>
              <p className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                おすすめの補助金が見つかりました
              </p>
              <div className="space-y-3 mb-6">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm leading-snug">{item.name}</p>
                      {item.promptSupport === "FULL" && (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-600 px-2 py-0.5 text-xs font-medium">
                          <Sparkles className="h-3 w-3" />
                          AI完全対応
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Banknote className="h-3.5 w-3.5" />
                        上限 {formatAmount(item.maxAmount)}
                      </span>
                      <span>補助率 {item.subsidyRate}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  サインアップでさらに詳しく
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  やり直す
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
