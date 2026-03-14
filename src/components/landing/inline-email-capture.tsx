"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

export function InlineEmailCapture() {
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
        body: JSON.stringify({ email, source: "final_cta" }),
      });
      const data: { error?: string } = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "登録に失敗しました");
        setStatus("error");
        return;
      }

      posthog.capture(EVENTS.EMAIL_CAPTURE_SUBMITTED, { source: "final_cta" });
      setStatus("success");
    } catch {
      setErrorMsg("通信エラーが発生しました");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        登録ありがとうございます。最新情報をお届けします。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
      <label htmlFor="final-cta-email" className="sr-only">メールアドレス</label>
      <input
        id="final-cta-email"
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
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        登録する
      </button>
      {status === "error" && (
        <p className="text-xs text-destructive col-span-full mt-1">{errorMsg}</p>
      )}
    </form>
  );
}
