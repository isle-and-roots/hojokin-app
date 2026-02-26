"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Mail, CheckCircle, Loader2, FileText } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

const STORAGE_KEY = "exit_intent_dismissed";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = useCallback(() => {
    posthog.capture(EVENTS.EMAIL_CAPTURE_DISMISSED, { source: "exit_intent" });
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    // Don't show if already dismissed this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch { /* ignore */ }

    let shown = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (shown) return;
      if (e.clientY <= 0) {
        shown = true;
        posthog.capture(EVENTS.EXIT_INTENT_SHOWN);
        setOpen(true);
      }
    };

    // Delay adding listener to avoid triggering immediately
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/email-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit_intent" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "登録に失敗しました");
        setStatus("error");
        return;
      }

      posthog.capture(EVENTS.EMAIL_CAPTURE_SUBMITTED, { source: "exit_intent" });
      setStatus("success");
      setTimeout(() => setOpen(false), 2000);
    } catch {
      setErrorMsg("通信エラーが発生しました");
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent transition-colors z-10"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {status === "success" ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">登録完了</h3>
            <p className="text-muted-foreground text-sm">
              補助金の最新情報をお届けします
            </p>
          </div>
        ) : (
          <>
            <div className="p-8 pb-4 text-center border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold">
                補助金の締切、見逃していませんか？
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                公募開始・締切リマインダーを無料でお届けします
              </p>
            </div>

            <div className="p-6">
              <ul className="space-y-2 mb-6">
                {[
                  "新しい補助金の公募開始通知",
                  "申請締切のリマインダー",
                  "採択率を上げるコツ・最新記事",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレスを入力"
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  無料で登録する
                </button>
              </form>

              {status === "error" && (
                <p className="text-sm text-destructive mt-2">{errorMsg}</p>
              )}

              <button
                onClick={handleClose}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-3"
              >
                今はいいです
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
