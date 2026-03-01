"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, Sparkles } from "lucide-react";

/**
 * 初回ユーザー向けチャットCTA
 * chat_sessions が 0 件のとき表示する。
 * APIから取得 (クライアントサイドで条件判定)。
 */
export function ChatOnboardingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/chat/sessions");
        if (!res.ok) return;
        const data = await res.json() as { sessions: { id: string }[] };
        if ((data.sessions ?? []).length === 0) {
          setShow(true);
        }
      } catch {
        // サイレント失敗（非表示のまま）
      }
    }
    void check();
  }, []);

  if (!show) return null;

  return (
    <div className="mb-8 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 via-blue-50/50 to-primary/5 p-6 flex items-center gap-5">
      <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <MessageSquare className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-base">まずはAIに相談してみましょう</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            おすすめ
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          業種を伝えるだけで、最適な補助金を提案します。申請書の書き方から採択のコツまで何でも聞けます。
        </p>
      </div>
      <Link
        href="/chat"
        className="shrink-0 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        相談してみる
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
