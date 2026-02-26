"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

export function EmailCaptureSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/email-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "lp_section" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "登録に失敗しました");
        setStatus("error");
        return;
      }

      posthog.capture(EVENTS.EMAIL_CAPTURE_SUBMITTED, { source: "lp_section" });
      setStatus("success");
    } catch {
      setErrorMsg("通信エラーが発生しました");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-7 w-7 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">登録ありがとうございます</h3>
          <p className="text-muted-foreground">
            補助金の最新情報をお届けします。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-primary/5">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">補助金の最新情報を受け取る</h3>
        <p className="text-muted-foreground mb-6">
          新しい補助金の公募開始や締切リマインダーを無料でお届けします
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
            required
            className="flex-1 rounded-xl border border-border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            登録する
          </button>
        </form>

        {status === "error" && (
          <p className="text-sm text-destructive mt-3">{errorMsg}</p>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          いつでも配信停止できます。スパムは送りません。
        </p>
      </div>
    </section>
  );
}
