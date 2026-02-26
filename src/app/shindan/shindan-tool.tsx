"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";
import { ALL_SUBSIDIES } from "@/lib/data/subsidies";
import type { SubsidyInfo, TargetIndustry, SubsidyCategory, TargetScale } from "@/types";
import { cn } from "@/lib/utils";

// ─── 診断質問定義 ───

type IndustryAnswer =
  | "SEIZOU"
  | "KOURI"
  | "INSHOKU"
  | "SERVICE"
  | "IT"
  | "KENSETSU"
  | "OTHER";

type PurposeAnswer =
  | "HANBAI"
  | "IT"
  | "SETSUBI"
  | "JINZAI"
  | "ENERGY"
  | "SHINJIGYO";

type ScaleAnswer = "KOBOKIGYO" | "CHUSHO" | "LARGE";

interface Answers {
  industry: IndustryAnswer | null;
  purpose: PurposeAnswer | null;
  scale: ScaleAnswer | null;
}

interface CompletedAnswers {
  industry: IndustryAnswer;
  purpose: PurposeAnswer;
  scale: ScaleAnswer;
}

const INDUSTRY_OPTIONS: { value: IndustryAnswer; label: string; emoji: string }[] = [
  { value: "SEIZOU", label: "製造業", emoji: "🏭" },
  { value: "KOURI", label: "小売業", emoji: "🛒" },
  { value: "INSHOKU", label: "飲食業", emoji: "🍽️" },
  { value: "SERVICE", label: "サービス業", emoji: "💼" },
  { value: "IT", label: "IT・情報通信", emoji: "💻" },
  { value: "KENSETSU", label: "建設業", emoji: "🏗️" },
  { value: "OTHER", label: "その他", emoji: "📋" },
];

const PURPOSE_OPTIONS: { value: PurposeAnswer; label: string; emoji: string; description: string }[] = [
  { value: "HANBAI", label: "販路拡大・マーケティング", emoji: "📈", description: "新規顧客獲得、広告、展示会など" },
  { value: "IT", label: "IT・デジタル化", emoji: "🖥️", description: "業務ソフト導入、EC開設、DXなど" },
  { value: "SETSUBI", label: "設備投資・機械購入", emoji: "⚙️", description: "生産設備、店舗改装、機器購入など" },
  { value: "JINZAI", label: "人材育成・採用", emoji: "👥", description: "研修費、資格取得、採用強化など" },
  { value: "ENERGY", label: "省エネ・脱炭素", emoji: "🌱", description: "省エネ設備、再エネ導入など" },
  { value: "SHINJIGYO", label: "新事業・事業転換", emoji: "🚀", description: "新分野への進出、業態転換など" },
];

const SCALE_OPTIONS: { value: ScaleAnswer; label: string; emoji: string; description: string }[] = [
  { value: "KOBOKIGYO", label: "小規模事業者", emoji: "🏪", description: "従業員5人以下（商業・サービス）/ 20人以下（製造・建設）" },
  { value: "CHUSHO", label: "中小企業", emoji: "🏢", description: "資本金3億円以下 または 従業員300人以下" },
  { value: "LARGE", label: "中堅・大企業", emoji: "🏬", description: "上記以外の企業" },
];

// ─── スコアリングロジック ───

function scoreSubsidy(
  subsidy: SubsidyInfo,
  answers: CompletedAnswers
): number {
  let score = 0;

  // 規模マッチング
  const scaleMap: Record<ScaleAnswer, TargetScale[]> = {
    KOBOKIGYO: ["KOBOKIGYO", "ALL"],
    CHUSHO: ["CHUSHO", "ALL"],
    LARGE: ["ALL"],
  };
  const matchesScale = subsidy.targetScale.some((s) =>
    scaleMap[answers.scale].includes(s)
  );
  if (!matchesScale) return -1; // 対象外

  // 業種マッチング（ALL は全業種対象）
  const industryMap: Record<IndustryAnswer, TargetIndustry[]> = {
    SEIZOU: ["SEIZOU", "ALL"],
    KOURI: ["KOURI", "ALL"],
    INSHOKU: ["INSHOKU", "ALL"],
    SERVICE: ["SERVICE", "ALL"],
    IT: ["IT", "ALL"],
    KENSETSU: ["KENSETSU", "ALL"],
    OTHER: ["ALL"],
  };
  const matchesIndustry = subsidy.targetIndustries.some((i) =>
    industryMap[answers.industry].includes(i)
  );
  if (matchesIndustry) score += 3;

  // 目的カテゴリマッチング
  const purposeMap: Record<PurposeAnswer, SubsidyCategory[]> = {
    HANBAI: ["HANBAI_KAIKAKU"],
    IT: ["IT_DIGITAL"],
    SETSUBI: ["SETSUBI_TOUSHI"],
    JINZAI: ["JINZAI_IKUSEI"],
    ENERGY: ["KANKYOU_ENERGY"],
    SHINJIGYO: ["SOUZOU_TENKAN", "KENKYUU_KAIHATSU"],
  };
  const matchesPurpose = subsidy.categories.some((c) =>
    purposeMap[answers.purpose].includes(c)
  );
  if (matchesPurpose) score += 5;

  // 人気度ボーナス
  score += (subsidy.popularity ?? 0) * 0.1;

  // FULL対応ボーナス
  if (subsidy.promptSupport === "FULL") score += 2;

  // アクティブボーナス
  if (subsidy.isActive) score += 1;

  return score;
}

function getTopSubsidies(answers: CompletedAnswers): SubsidyInfo[] {
  const completedAnswers: CompletedAnswers = {
    industry: answers.industry,
    purpose: answers.purpose,
    scale: answers.scale,
  };
  const scored = ALL_SUBSIDIES.map((s) => ({
    subsidy: s,
    score: scoreSubsidy(s, completedAnswers),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((x) => x.subsidy);
}

// ─── コンポーネント ───

type Step = "industry" | "purpose" | "scale";

export function ShindanTool() {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0=intro, 1-3=questions, 4=result
  const [answers, setAnswers] = useState<Answers>({
    industry: null,
    purpose: null,
    scale: null,
  });
  const [results, setResults] = useState<SubsidyInfo[]>([]);

  function handleStart() {
    setCurrentStep(1);
    posthog.capture(EVENTS.SHINDAN_STARTED);
  }

  function handleAnswer(step: Step, value: string) {
    const newAnswers = { ...answers, [step]: value } as Answers;
    setAnswers(newAnswers);

    const nextStep = currentStep + 1;
    if (nextStep <= 3) {
      setCurrentStep(nextStep);
    } else {
      // 全問完了 → 結果算出
      const complete = newAnswers as CompletedAnswers;
      const top = getTopSubsidies(complete);
      setResults(top);
      setCurrentStep(4);
      posthog.capture(EVENTS.SHINDAN_COMPLETED, {
        industry: newAnswers.industry,
        purpose: newAnswers.purpose,
        scale: newAnswers.scale,
        resultCount: top.length,
        topSubsidyId: top[0]?.id ?? null,
      });
    }
  }

  function handleReset() {
    setCurrentStep(0);
    setAnswers({ industry: null, purpose: null, scale: null });
    setResults([]);
  }

  const progressPercent = currentStep === 0 ? 0 : Math.round(((currentStep - 1) / 3) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          無料・登録不要
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          補助金診断ツール
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          3問に答えるだけで、あなたの事業に最適な補助金を診断します
        </p>
      </div>

      {/* プログレスバー（質問中のみ） */}
      {currentStep >= 1 && currentStep <= 3 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>質問 {currentStep} / 3</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* ─── 画面: イントロ ─── */}
      {currentStep === 0 && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            {[
              { label: "対応補助金", value: "15種類以上" },
              { label: "診断時間", value: "約1分" },
              { label: "費用", value: "無料" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-muted/50 p-3">
                <p className="text-lg font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            診断スタート
            <ChevronRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            登録・メールアドレス不要で診断できます
          </p>
        </div>
      )}

      {/* ─── 画面: 質問1 業種 ─── */}
      {currentStep === 1 && (
        <QuestionCard
          question="あなたの事業の業種を教えてください"
          questionNumber={1}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INDUSTRY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer("industry", opt.value)}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-medium hover:border-primary/60 hover:bg-primary/5 transition-all"
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </QuestionCard>
      )}

      {/* ─── 画面: 質問2 目的 ─── */}
      {currentStep === 2 && (
        <QuestionCard
          question="補助金で実現したいことは何ですか？"
          questionNumber={2}
        >
          <div className="flex flex-col gap-3">
            {PURPOSE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer("purpose", opt.value)}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left hover:border-primary/60 hover:bg-primary/5 transition-all"
              >
                <span className="text-2xl shrink-0">{opt.emoji}</span>
                <div>
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </QuestionCard>
      )}

      {/* ─── 画面: 質問3 規模 ─── */}
      {currentStep === 3 && (
        <QuestionCard
          question="事業の規模を教えてください"
          questionNumber={3}
        >
          <div className="flex flex-col gap-3">
            {SCALE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer("scale", opt.value)}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left hover:border-primary/60 hover:bg-primary/5 transition-all"
              >
                <span className="text-2xl shrink-0">{opt.emoji}</span>
                <div>
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </QuestionCard>
      )}

      {/* ─── 画面: 結果 ─── */}
      {currentStep === 4 && (
        <div>
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 mb-6 text-center">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <h2 className="text-lg font-bold mb-1">診断完了！</h2>
            <p className="text-sm text-muted-foreground">
              あなたの事業に合った補助金を
              <span className="font-semibold text-foreground">
                {results.length}件
              </span>
              見つけました
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                条件に完全一致する補助金が見つかりませんでした。
                条件を変えて再診断するか、補助金一覧からお探しください。
              </p>
              <Link
                href="/subsidies"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                補助金一覧を見る
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-6">
              {results.map((subsidy, index) => (
                <SubsidyResultCard
                  key={subsidy.id}
                  subsidy={subsidy}
                  rank={index + 1}
                />
              ))}
            </div>
          )}

          {/* 申請書作成CTA */}
          <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center mt-6">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-base mb-2">
              AIで申請書の下書きを自動作成
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              プロフィールを入力するだけで、上記の補助金の申請書をAIが自動生成。
              無料プランで月3セクションまでお試しいただけます。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              無料で申請書を作成する
            </Link>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              もう一度診断する
            </button>
          </div>
        </div>
      )}

      {/* 補助金一覧リンク */}
      {currentStep !== 4 && (
        <div className="mt-6 text-center">
          <Link
            href="/subsidies"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            すべての補助金を見る →
          </Link>
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  questionNumber,
  children,
}: {
  question: string;
  questionNumber: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="bg-muted/50 px-6 py-4 border-b border-border">
        <p className="text-xs text-muted-foreground mb-1">質問 {questionNumber} / 3</p>
        <h2 className="font-bold text-base sm:text-lg">{question}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function SubsidyResultCard({
  subsidy,
  rank,
}: {
  subsidy: SubsidyInfo;
  rank: number;
}) {
  const rankColors = ["border-yellow-400/60 bg-yellow-50/50", "border-gray-300/60 bg-gray-50/50", "border-orange-300/60 bg-orange-50/50"];
  const rankLabels = ["第1位", "第2位", "第3位"];
  const rankBadgeColors = ["bg-yellow-100 text-yellow-800", "bg-gray-100 text-gray-700", "bg-orange-100 text-orange-800"];

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-5",
        rankColors[rank - 1] ?? "border-border bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
              rankBadgeColors[rank - 1] ?? "bg-muted text-muted-foreground"
            )}
          >
            {rankLabels[rank - 1] ?? `第${rank}位`}
          </span>
          {subsidy.promptSupport === "FULL" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
              <Sparkles className="h-3 w-3" />
              AI FULL対応
            </span>
          )}
        </div>
        {subsidy.maxAmount && (
          <p className="text-xs text-muted-foreground shrink-0">
            最大{subsidy.maxAmount}万円
          </p>
        )}
      </div>
      <h3 className="font-bold text-sm sm:text-base mb-1">{subsidy.name}</h3>
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
        {subsidy.summary}
      </p>
      <div className="flex items-center gap-3">
        <Link
          href={`/subsidies/${subsidy.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
        >
          詳細を見る
          <ArrowRight className="h-3 w-3" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="h-3 w-3" />
          申請書を作成
        </Link>
      </div>
    </div>
  );
}
