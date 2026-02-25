"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { BusinessProfile, SubsidyInfo } from "@/types";
import { JIZOKUKA_SECTIONS } from "@/types";
import {
  Sparkles,
  Loader2,
  Check,
  CheckCircle,
  ChevronRight,
  FileText,
  AlertCircle,
  Search,
} from "lucide-react";
import { CreditDisplay } from "@/components/credit-display";
import { UpgradeModal } from "@/components/upgrade-modal";
import { QuotaProgressBanner } from "@/components/quota-progress-banner";
import { useToast } from "@/components/ui/toast";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";
import { trackAiGeneration, trackApplicationSaved } from "@/lib/analytics";

export default function NewApplicationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </div>
      }
    >
      <NewApplicationContent />
    </Suspense>
  );
}

type SectionState = {
  key: string;
  title: string;
  group: string;
  status: "pending" | "generating" | "done" | "error";
  content: string;
  userEdited: string;
  additionalContext: string;
};

function NewApplicationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subsidyId = searchParams.get("subsidyId");
  const toast = useToast();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [subsidy, setSubsidy] = useState<SubsidyInfo | null>(null);
  const [loadingSubsidy, setLoadingSubsidy] = useState(!!subsidyId);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [sections, setSections] = useState<SectionState[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<{
    remaining: number;
    limit: number;
    plan: string;
  } | null>(null);
  const [profileLoadError, setProfileLoadError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Load quota info
  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { userProfile?: { plan: string; ai_generations_used: number } } | null) => {
        if (!data?.userProfile) return;
        const p = data.userProfile;
        const plan = p.plan || "free";
        const limitMap: Record<string, number> = { free: 3, starter: 15, pro: 100, business: 500 };
        const limit = limitMap[plan] ?? 3;
        const used = p.ai_generations_used ?? 0;
        const remaining = Math.max(0, limit - used);
        setQuotaInfo({ remaining, limit, plan });
      })
      .catch(() => { /* ignore */ });
  }, []);

  // Load profile from Supabase
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          setProfileId(data.profile.id);
        }
      })
      .catch(() => {
        setProfileLoadError(true);
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  useEffect(() => {
    if (profileLoadError) toast.error("プロフィールの読み込みに失敗しました");
  }, [profileLoadError, toast]);

  // Load subsidy and set sections
  useEffect(() => {
    if (subsidyId) {
      setLoadingSubsidy(true);
      fetch(`/api/subsidies/${subsidyId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: SubsidyInfo | null) => {
          if (data) {
            setSubsidy(data);
            setSections(
              data.applicationSections.map((s) => ({
                key: s.key,
                title: s.title,
                group: s.group || "",
                status: "pending",
                content: "",
                userEdited: "",
                additionalContext: "",
              }))
            );
          }
        })
        .finally(() => setLoadingSubsidy(false));
    } else {
      // Fallback: JIZOKUKA sections for backward compatibility
      setSections(
        JIZOKUKA_SECTIONS.map((s) => ({
          key: s.key,
          title: s.title,
          group: s.form,
          status: "pending",
          content: "",
          userEdited: "",
          additionalContext: "",
        }))
      );
    }
  }, [subsidyId]);

  const cancelGeneration = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
    setSections((prev) =>
      prev.map((s) =>
        s.status === "generating" ? { ...s, status: "pending", content: "" } : s
      )
    );
    toast.info("生成をキャンセルしました");
  };

  const generateSection = async (index: number) => {
    if (!profile) return;
    const section = sections[index];
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status: "generating" } : s))
    );

    posthog.capture(EVENTS.AI_GENERATION_STARTED, {
      section_key: section.key,
      subsidy_id: subsidyId || "jizokuka-001",
    });
    trackAiGeneration(subsidyId || "jizokuka-001", section.key);

    try {
      const res = await fetch("/api/ai/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: section.key,
          profile,
          subsidyId: subsidyId || undefined,
          additionalContext: section.additionalContext || undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 429 && err.error?.includes("上限")) {
          setQuotaExhausted(true);
          setShowUpgradeModal(true);
        }
        throw new Error(err.error || "生成に失敗しました");
      }

      const data = await res.json();
      setSections((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                status: "done",
                content: data.content,
                userEdited: data.content,
              }
            : s
        )
      );
      posthog.capture(EVENTS.AI_GENERATION_COMPLETED, {
        section_key: section.key,
        subsidy_id: subsidyId || "jizokuka-001",
      });
      // Update quota info after successful generation
      setQuotaInfo((prev) =>
        prev ? { ...prev, remaining: Math.max(0, prev.remaining - 1) } : prev
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      const msg = error instanceof Error ? error.message : "生成に失敗しました";
      setSections((prev) =>
        prev.map((s, i) =>
          i === index ? { ...s, status: "error", content: msg } : s
        )
      );
      posthog.capture(EVENTS.AI_GENERATION_FAILED, {
        section_key: section.key,
        subsidy_id: subsidyId || "jizokuka-001",
        error: msg,
      });
      toast.error(msg);
    } finally {
      abortRef.current = null;
      setIsGenerating(false);
    }
  };

  const generateAll = async () => {
    if (!profile) return;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].status === "done") continue;
      setActiveSectionIndex(i);
      await generateSection(i);
    }
  };

  const handleSave = async () => {
    const subsidyName = subsidy?.name ?? "小規模事業者持続化補助金";
    const sid = subsidyId || "jizokuka-001";

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subsidyId: sid,
          subsidyName,
          profileId: profileId || undefined,
          sections: sections.map((s) => ({
            sectionKey: s.key,
            sectionTitle: s.title,
            group: s.group,
            aiContent: s.content,
            userContent: s.userEdited || s.content,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存に失敗しました");
      }

      trackApplicationSaved(sid);
      router.push("/applications");
    } catch (error) {
      toast.error("保存に失敗しました: " + String(error));
    }
  };

  if (loadingSubsidy || loadingProfile) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground">補助金情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">
            企業プロフィールが未登録です
          </h2>
          <p className="text-muted-foreground mb-4">
            申請書類を生成するには、まず企業プロフィールを登録してください。
          </p>
          <a
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            プロフィールを登録する
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  // If no subsidyId and no subsidy loaded, show subsidy selector
  if (!subsidyId && !subsidy) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">新規申請を作成</h1>
          <p className="text-muted-foreground mt-1">
            申請する補助金を選択してください
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/applications/new?subsidyId=jizokuka-001"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
                  AI完全対応
                </span>
              </div>
              <h3 className="font-semibold">小規模事業者持続化補助金</h3>
              <p className="text-sm text-muted-foreground mt-1">
                販路開拓や業務効率化に最大250万円
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link
            href="/subsidies"
            className="flex items-center justify-between rounded-xl border border-dashed border-border bg-card p-5 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">他の補助金を探す</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  補助金検索から最適な補助金を見つけましょう
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    );
  }

  const activeSection = sections[activeSectionIndex];
  const completedCount = sections.filter((s) => s.status === "done").length;
  const allPending =
    sections.length > 0 && sections.every((s) => s.status === "pending");
  const allDone =
    sections.length > 0 && sections.every((s) => s.status === "done");

  // Group sections by group field
  const groups = sections.reduce(
    (acc, s, i) => {
      const g = s.group || "default";
      if (!acc[g]) acc[g] = [];
      acc[g].push({ ...s, globalIndex: i });
      return acc;
    },
    {} as Record<string, (SectionState & { globalIndex: number })[]>
  );

  const subsidyName =
    subsidy?.name ?? "小規模事業者持続化補助金";

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {subsidy?.nameShort ?? "持続化補助金"} 申請書作成
          </h1>
          <p className="text-muted-foreground mt-1">
            AIが各セクションの下書きを生成します。生成後に編集できます。
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CreditDisplay
            variant="compact"
            onQuotaLoaded={(remaining) => setQuotaExhausted(remaining === 0)}
          />
          <button
            onClick={generateAll}
            disabled={isGenerating || quotaExhausted}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 ${allPending ? "animate-pulse" : ""}`}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            全セクション一括生成
          </button>
          {completedCount > 0 && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors"
            >
              <FileText className="h-4 w-4" />
              保存
            </button>
          )}
        </div>
      </div>

      {/* 進捗 */}
      <div className="mb-6 rounded-lg bg-muted p-3">
        <div className="flex items-center justify-between text-sm">
          <span>
            生成進捗: {completedCount}/{sections.length} セクション
          </span>
          <span className="text-muted-foreground">{profile.companyName}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-border">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{
              width: `${sections.length > 0 ? (completedCount / sections.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* クォータ進捗バナー */}
      {quotaInfo && (
        <div className="mb-6">
          <QuotaProgressBanner
            remaining={quotaInfo.remaining}
            limit={quotaInfo.limit}
            plan={quotaInfo.plan}
          />
        </div>
      )}

      {/* 初回ガイドバナー */}
      {allPending && (
        <div className="mb-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold w-6 h-6 shrink-0 mt-0.5">
              3
            </span>
            <div>
              <p className="text-sm font-medium">Step 3/3 — AI生成を開始しましょう</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                「全セクション一括生成」をクリックするとAIが申請書の下書きを作成します
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 全セクション完了メッセージ */}
      {allDone && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
            <p className="text-sm font-medium text-green-800">
              申請書の下書きが完成しました！内容を確認して保存しましょう
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* セクションリスト */}
        <div className="col-span-4 space-y-4">
          {Object.entries(groups).map(([groupName, groupSections]) => (
            <div key={groupName}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {groupName}
              </h3>
              <div className="space-y-1">
                {groupSections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() =>
                      setActiveSectionIndex(section.globalIndex)
                    }
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                      activeSectionIndex === section.globalIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    {section.status === "done" ? (
                      <Check className="h-4 w-4 text-green-600 shrink-0" />
                    ) : section.status === "generating" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                    ) : section.status === "error" ? (
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                    )}
                    <span className="truncate">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* セクションエディタ */}
        <div className="col-span-8">
          {activeSection && (
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="font-semibold">{activeSection.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeSection.group || subsidyName}
                  </p>
                </div>
                <button
                  onClick={() => generateSection(activeSectionIndex)}
                  disabled={isGenerating || quotaExhausted}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {activeSection.status === "generating" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {activeSection.status === "done" ? "再生成" : "生成"}
                </button>
              </div>

              {/* 追加コンテキスト */}
              <div className="px-6 py-3 border-b border-border bg-muted/50">
                <label className="text-xs font-medium text-muted-foreground">
                  追加情報（オプション）
                </label>
                <input
                  type="text"
                  value={activeSection.additionalContext}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s, i) =>
                        i === activeSectionIndex
                          ? { ...s, additionalContext: e.target.value }
                          : s
                      )
                    )
                  }
                  className="w-full mt-1 rounded-lg border border-border px-3 py-1.5 text-sm bg-card"
                  placeholder="このセクションに含めたい追加情報を入力..."
                />
              </div>

              {/* コンテンツエリア */}
              <div className="p-6">
                {activeSection.status === "pending" && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p>
                      「生成」ボタンをクリックしてAIに下書きを作成させましょう
                    </p>
                  </div>
                )}
                {activeSection.status === "generating" && (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                    <p className="text-muted-foreground mb-3">AI生成中...</p>
                    <button
                      onClick={cancelGeneration}
                      className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                )}
                {activeSection.status === "error" && (
                  <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                    <p className="font-medium">エラーが発生しました</p>
                    <p className="mt-1">{activeSection.content}</p>
                    <button
                      onClick={() => generateSection(activeSectionIndex)}
                      disabled={quotaExhausted}
                      className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-white text-xs font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      再試行
                    </button>
                  </div>
                )}
                {activeSection.status === "done" && (
                  <textarea
                    value={activeSection.userEdited}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((s, i) =>
                          i === activeSectionIndex
                            ? { ...s, userEdited: e.target.value }
                            : s
                        )
                      )
                    }
                    rows={20}
                    className="w-full rounded-lg border border-border px-4 py-3 text-sm leading-relaxed resize-y"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
