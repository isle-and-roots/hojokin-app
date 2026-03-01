"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Clock, Sparkles, FileText } from "lucide-react";

type NotificationType = "deadline" | "nudge" | "new_subsidy";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  ctaLabel?: string;
}

interface ApiApplication {
  id: string;
  subsidy_id: string;
  subsidy_name: string;
  status: string;
  updated_at: string;
}

interface ApiSubsidy {
  id: string;
  nameShort: string;
  deadline: string | null;
  promptSupport: string;
  lastUpdated: string;
  isActive: boolean;
}

const STORAGE_KEY = "hojokin_dismissed_notifications";
const DEADLINE_WARN_DAYS = 7;
const NUDGE_STALE_DAYS = 3;

function getDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveDismissed(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

function daysDiff(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function daysSince(dateStr: string): number {
  const past = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - past) / (1000 * 60 * 60 * 24));
}

const TYPE_STYLES: Record<NotificationType, { bar: string; icon: typeof Clock; iconClass: string }> = {
  deadline: {
    bar: "border-orange-300 bg-orange-50",
    icon: Clock,
    iconClass: "text-orange-500",
  },
  nudge: {
    bar: "border-blue-300 bg-blue-50",
    icon: FileText,
    iconClass: "text-blue-500",
  },
  new_subsidy: {
    bar: "border-primary/30 bg-primary/5",
    icon: Sparkles,
    iconClass: "text-primary",
  },
};

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Lazy init from localStorage so we never call setState synchronously in an effect
  const [dismissed, setDismissed] = useState<string[]>(() => getDismissed());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function buildNotifications() {
      const results: Notification[] = [];

      // ── 申請データ取得 ──
      let applications: ApiApplication[] = [];
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = (await res.json()) as { applications: ApiApplication[] };
          applications = data.applications ?? [];
        }
      } catch {
        // network error — skip app-based notifications
      }

      // ── 補助金データ取得 ──
      let subsidies: ApiSubsidy[] = [];
      try {
        const res = await fetch("/api/subsidies/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filters: {} }),
        });
        if (res.ok) {
          const data = (await res.json()) as { items: ApiSubsidy[] };
          subsidies = data.items ?? [];
        }
      } catch {
        // skip subsidy-based notifications
      }

      // ── 通知1: 締切7日前 ──
      const activeApps = applications.filter(
        (a) => a.status !== "submitted" && a.status !== "adopted" && a.status !== "rejected"
      );
      for (const app of activeApps) {
        const subsidy = subsidies.find((s) => s.id === app.subsidy_id);
        if (!subsidy?.deadline) continue;
        const daysLeft = daysDiff(subsidy.deadline);
        if (daysLeft > 0 && daysLeft <= DEADLINE_WARN_DAYS) {
          const notifId = `deadline_${app.id}`;
          results.push({
            id: notifId,
            type: "deadline",
            title: "締切が近づいています",
            message: `「${app.subsidy_name}」の締切まで残り${daysLeft}日です。申請書の最終確認を行いましょう。`,
            href: `/applications`,
            ctaLabel: "申請一覧を確認",
          });
        }
      }

      // ── 通知2: 申請書3日未更新ナッジ ──
      const staleApps = applications.filter((a) => {
        if (a.status === "submitted" || a.status === "adopted" || a.status === "rejected") return false;
        return daysSince(a.updated_at) >= NUDGE_STALE_DAYS;
      });
      if (staleApps.length > 0) {
        const oldest = staleApps.sort(
          (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        )[0];
        const notifId = `nudge_${oldest.id}`;
        results.push({
          id: notifId,
          type: "nudge",
          title: "申請書の作成を続けましょう",
          message: `「${oldest.subsidy_name}」の申請書が${daysSince(oldest.updated_at)}日間更新されていません。`,
          href: `/applications`,
          ctaLabel: "申請書を編集",
        });
      }

      // ── 通知3: 新FULL対応補助金 ──
      const fullSubsidies = subsidies
        .filter((s) => s.isActive && s.promptSupport === "FULL")
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      if (fullSubsidies.length > 0) {
        const newest = fullSubsidies[0];
        const notifId = `new_subsidy_${newest.id}`;
        results.push({
          id: notifId,
          type: "new_subsidy",
          title: "新しいAI完全対応補助金",
          message: `「${newest.nameShort}」がAI完全対応になりました。申請書をAIで自動生成できます。`,
          href: `/subsidies/${newest.id}`,
          ctaLabel: "詳細を見る",
        });
      }

      setNotifications(results);
      setLoaded(true);
    }

    buildNotifications();
  }, []);

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    saveDismissed(next);
  };

  const visible = notifications.filter((n) => !dismissed.includes(n.id));

  if (!loaded || visible.length === 0) return null;

  return (
    <div className="mb-6 space-y-2">
      {visible.map((notif) => {
        const style = TYPE_STYLES[notif.type];
        const Icon = style.icon;
        return (
          <div
            key={notif.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${style.bar}`}
          >
            <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${style.iconClass}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-snug">{notif.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
              {notif.href && notif.ctaLabel && (
                <Link
                  href={notif.href}
                  className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-primary hover:underline"
                >
                  {notif.ctaLabel}
                </Link>
              )}
            </div>
            <button
              onClick={() => dismiss(notif.id)}
              aria-label="通知を閉じる"
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
