"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, FileText, Check, Sparkles } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

interface DocxPaywallModalProps {
  open: boolean;
  onClose: () => void;
  previewText?: string;
}

const COMPARISON = [
  { feature: "AI申請書生成", starter: "15回/月", pro: "100回/月" },
  { feature: "DOCXエクスポート", starter: "✓", pro: "✓" },
  { feature: "申請書保存", starter: "5件", pro: "無制限" },
  { feature: "全補助金AI対応", starter: "—", pro: "✓" },
] as const;

export function DocxPaywallModal({
  open,
  onClose,
  previewText,
}: DocxPaywallModalProps) {
  useEffect(() => {
    if (open) {
      posthog.capture(EVENTS.EXPORT_PAYWALLED);
    }
  }, [open]);

  if (!open) return null;

  const handleUpgradeClick = () => {
    posthog.capture(EVENTS.EXPORT_PAYWALL_UPGRADE_CLICKED);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent transition-colors z-10"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                Word出力はStarterプラン以上で利用可能
              </h2>
              <p className="text-sm text-muted-foreground">
                アップグレードして申請書をWord形式でダウンロード
              </p>
            </div>
          </div>
        </div>

        {/* Preview with blur */}
        {previewText && (
          <div className="px-6 pt-4">
            <p className="text-xs text-muted-foreground mb-2">
              出力プレビュー
            </p>
            <div className="relative rounded-lg border border-border bg-muted/50 p-4 max-h-32 overflow-hidden">
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {previewText.slice(0, 200)}...
              </p>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-muted/50 to-transparent" />
            </div>
          </div>
        )}

        {/* Comparison table */}
        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-muted-foreground">
                  機能
                </th>
                <th className="text-center py-2 font-medium">Starter</th>
                <th className="text-center py-2 font-medium text-primary">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-b border-border/50">
                  <td className="py-2 text-muted-foreground">{row.feature}</td>
                  <td className="py-2 text-center">
                    {row.starter === "✓" ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : row.starter === "—" ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      row.starter
                    )}
                  </td>
                  <td className="py-2 text-center">
                    {row.pro === "✓" ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <span className="font-medium">{row.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 pt-0 flex flex-col items-center gap-3">
          <Link
            href="/pricing"
            onClick={handleUpgradeClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors w-full justify-center"
          >
            <Sparkles className="h-4 w-4" />
            Starterプランで始める (月額¥980)
          </Link>
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            後で検討する
          </button>
        </div>
      </div>
    </div>
  );
}
