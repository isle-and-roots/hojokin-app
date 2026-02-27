"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, PlusCircle, Download, Trash2, Sparkles, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";

const DocxPaywallModal = dynamic(
  () => import("@/components/docx-paywall-modal").then((m) => m.DocxPaywallModal),
  { ssr: false }
);
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

interface AppSection {
  section_key: string;
  section_title: string;
  final_content: string | null;
}

interface ApplicationData {
  id: string;
  subsidy_id: string;
  subsidy_name: string;
  status: string;
  sections: AppSection[];
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "下書き", color: "bg-gray-100 text-gray-700" },
  review: { label: "レビュー中", color: "bg-blue-100 text-blue-700" },
  ready: { label: "提出準備完了", color: "bg-green-100 text-green-700" },
  submitted: { label: "提出済み", color: "bg-purple-100 text-purple-700" },
  adopted: { label: "採択", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "不採択", color: "bg-red-100 text-red-700" },
};

export default function ApplicationsPage() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [paywallApp, setPaywallApp] = useState<ApplicationData | null>(null);

  // Load plan and applications in parallel
  useEffect(() => {
    const fetchPlan = fetch("/api/user/plan")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { userProfile?: { plan: string } } | null) => {
        if (data?.userProfile?.plan) setUserPlan(data.userProfile.plan);
      })
      .catch(() => { /* ignore */ });

    const fetchApps = fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) {
          setApplications(data.applications);
        }
      })
      .catch(() => {
        setLoadError(true);
      })
      .finally(() => setLoading(false));

    Promise.all([fetchPlan, fetchApps]);
  }, []);

  useEffect(() => {
    if (loadError) toast.error("申請一覧の読み込みに失敗しました");
  }, [loadError, toast]);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "申請書の削除",
      message: "この申請書を削除しますか？この操作は取り消せません。",
      confirmLabel: "削除する",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((a) => a.id !== id));
      posthog.capture(EVENTS.APPLICATION_DELETED);
      toast.success("申請書を削除しました");
    } catch (error) {
      toast.error("削除に失敗しました: " + String(error));
    }
  };

  const handleExport = async (app: ApplicationData) => {
    // Free plan: show paywall instead of calling API
    if (userPlan === "free") {
      setPaywallApp(app);
      return;
    }

    posthog.capture(EVENTS.DOCX_EXPORT_ATTEMPTED, {
      subsidy_name: app.subsidy_name,
    });
    try {
      const exportData = {
        subsidyName: app.subsidy_name,
        subsidyType: app.subsidy_id,
        sections: app.sections.map((s) => ({
          sectionKey: s.section_key,
          sectionTitle: s.section_title,
          content: s.final_content || "",
        })),
      };
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${app.subsidy_name}_${new Date().toISOString().slice(0, 10)}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("エクスポートに失敗しました: " + String(error));
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">申請一覧</h1>
          <p className="text-muted-foreground mt-1">
            作成した補助金申請書類の一覧
          </p>
        </div>
        <Link
          href="/subsidies"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          新規申請
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">申請書類がありません</h2>
          <p className="text-muted-foreground mb-4">
            補助金を検索して、AIで申請書類を生成しましょう
          </p>
          <Link
            href="/subsidies"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            補助金を探す
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const statusInfo = STATUS_LABELS[app.status] || STATUS_LABELS.draft;
            return (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{app.subsidy_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {app.sections.length}セクション |{" "}
                      {new Date(app.created_at).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                  <button
                    onClick={() => handleExport(app)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    title="Wordエクスポート"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DocxPaywallModal
        open={!!paywallApp}
        onClose={() => setPaywallApp(null)}
        previewText={
          paywallApp?.sections
            .map((s) => s.final_content)
            .filter(Boolean)
            .join("\n\n")
            .slice(0, 300) || undefined
        }
      />
    </div>
  );
}
