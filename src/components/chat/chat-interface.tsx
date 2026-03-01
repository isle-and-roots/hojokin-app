"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  MessageSquare,
  Bot,
  User,
  Loader2,
  Plus,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SubsidyRecommendationCard } from "@/components/chat/subsidy-recommendation-card";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

/**
 * AI回答内の [SUBSIDY:id] マーカーを解析してセグメント配列に変換する。
 * セグメントは { type: "text", text } または { type: "subsidy", id } のいずれか。
 */
function parseMessageContent(
  content: string
): Array<{ type: "text"; text: string } | { type: "subsidy"; id: string }> {
  const segments: Array<{ type: "text"; text: string } | { type: "subsidy"; id: string }> = [];
  const regex = /\[SUBSIDY:([^\]]+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", text: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: "subsidy", id: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", text: content.slice(lastIndex) });
  }

  return segments;
}

const FAQ_ITEMS = [
  { id: "faq-1", question: "うちの業種で使える補助金は？" },
  { id: "faq-2", question: "補助金申請の流れを教えて" },
  { id: "faq-3", question: "一番採択されやすい補助金は？" },
  { id: "faq-4", question: "補助金の申請から入金まで、どのくらいの期間がかかりますか？" },
  { id: "faq-5", question: "小規模事業者向けのおすすめの補助金はどれですか？" },
  { id: "faq-6", question: "IT導入補助金でどんなソフトウェアが対象になりますか？" },
  { id: "faq-7", question: "補助金の審査で落ちやすいポイントはどこですか？" },
  { id: "faq-8", question: "申請書の「事業計画」欄はどう書けばよいですか？" },
] as const;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatInterfaceProps {
  initialSessionId?: string;
  subsidyId?: string;
  plan?: "free" | "starter" | "pro" | "business";
}

/** 相対時刻を日本語で返す */
function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

export function ChatInterface({ initialSessionId, subsidyId, plan = "free" }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const canReview = plan === "pro" || plan === "business";
  const showReviewHint = !canReview && input.length >= 200;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  // セッション一覧の取得
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      if (!res.ok) return;
      const data = await res.json() as { sessions: ChatSession[] };
      setSessions(data.sessions ?? []);
    } catch {
      // サイレント失敗
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // 初期セッションのメッセージをロード
  useEffect(() => {
    if (!initialSessionId) return;
    void loadSession(initialSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSessionId]);

  const loadSession = useCallback(async (id: string) => {
    setIsLoadingHistory(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/sessions/${id}`);
      if (!res.ok) {
        setError("会話履歴の読み込みに失敗しました");
        return;
      }
      const data = await res.json() as {
        session: ChatSession;
        messages: { id: string; role: string; content: string }[];
      };
      setSessionId(id);
      setMessages(
        data.messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
        }))
      );
    } catch {
      setError("会話履歴の読み込みに失敗しました");
    } finally {
      setIsLoadingHistory(false);
      setShowSidebar(false);
    }
  }, []);

  const startNewSession = useCallback(() => {
    setSessionId(undefined);
    setMessages([]);
    setError(null);
    setShowSidebar(false);
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setError(null);
    setIsLoading(true);

    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content: trimmed },
      { id: assistantMessageId, role: "assistant", content: "", isStreaming: true },
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          context: subsidyId ? { subsidyId } : undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string; upgradeRequired?: boolean };
        if (data.upgradeRequired) {
          setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
          setError(data.error ?? "Proプランへのアップグレードが必要です");
          return;
        }
        throw new Error(data.error ?? "エラーが発生しました");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("ストリームの読み取りに失敗しました");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);
          try {
            const event = JSON.parse(jsonStr) as {
              type: string;
              text?: string;
              sessionId?: string;
              message?: string;
            };

            if (event.type === "init" && event.sessionId) {
              const newId = event.sessionId;
              setSessionId(newId);
              // セッション一覧を更新
              void fetchSessions();
            } else if (event.type === "delta" && event.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: m.content + event.text }
                    : m
                )
              );
            } else if (event.type === "done") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, isStreaming: false } : m
                )
              );
              // 返答完了後にセッション一覧を再取得
              void fetchSessions();
            } else if (event.type === "error") {
              throw new Error(event.message ?? "エラーが発生しました");
            }
          } catch (parseError) {
            if (parseError instanceof SyntaxError) continue;
            throw parseError;
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
        return;
      }

      const errorMessage = err instanceof Error ? err.message : "エラーが発生しました";
      setError(errorMessage);
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== assistantMessageId)
          .map((m) => (m.id === userMessageId ? { ...m } : m))
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, sessionId, subsidyId, fetchSessions]);

  /** サジェストボタン: テキストを即座に送信する */
  const sendSuggestion = useCallback(async (text: string) => {
    if (isLoading) return;
    setInput("");
    setError(null);
    setIsLoading(true);

    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content: text },
      { id: assistantMessageId, role: "assistant", content: "", isStreaming: true },
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          context: subsidyId ? { subsidyId } : undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "エラーが発生しました");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("ストリームの読み取りに失敗しました");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);
          try {
            const event = JSON.parse(jsonStr) as {
              type: string;
              text?: string;
              sessionId?: string;
              message?: string;
            };

            if (event.type === "init" && event.sessionId) {
              setSessionId(event.sessionId);
              void fetchSessions();
            } else if (event.type === "delta" && event.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: m.content + event.text }
                    : m
                )
              );
            } else if (event.type === "done") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, isStreaming: false } : m
                )
              );
              void fetchSessions();
            } else if (event.type === "error") {
              throw new Error(event.message ?? "エラーが発生しました");
            }
          } catch (parseError) {
            if (parseError instanceof SyntaxError) continue;
            throw parseError;
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
        return;
      }
      const errorMessage = err instanceof Error ? err.message : "エラーが発生しました";
      setError(errorMessage);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, sessionId, subsidyId, fetchSessions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full">
      {/* 会話履歴サイドバー */}
      <>
        {/* モバイルオーバーレイ */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <aside
          className={cn(
            "flex flex-col border-r border-border bg-card w-72 shrink-0 z-30",
            "lg:relative lg:translate-x-0",
            "fixed inset-y-0 left-0 transition-transform duration-200",
            showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* サイドバーヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-sm font-semibold">会話履歴</span>
            <button
              onClick={startNewSession}
              className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground rounded-lg px-3 py-1.5 hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              新しい会話
            </button>
          </div>

          {/* セッション一覧 */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoadingSessions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-40" />
                まだ会話がありません
              </div>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSession(s.id)}
                  className={cn(
                    "w-full text-left rounded-lg px-3 py-2.5 transition-colors group",
                    s.id === sessionId
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm font-medium truncate leading-tight">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(s.updated_at)}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>
      </>

      {/* チャットメイン */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* モバイル: 履歴ボタン */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 lg:hidden">
          <button
            onClick={() => setShowSidebar(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
            会話履歴
          </button>
          {sessionId && (
            <button
              onClick={startNewSession}
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              新しい会話
            </button>
          )}
        </div>

        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto py-10">
              {/* ヒーロー */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold mb-1">補助金AIアシスタント</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  補助金の選び方、申請書の書き方、必要書類など、なんでもお気軽にご質問ください。
                </p>
              </div>

              {/* FAQ セクション */}
              <div className="w-full">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 pl-1">
                  よくある質問
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {FAQ_ITEMS.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => {
                        posthog.capture(EVENTS.FAQ_QUESTION_CLICKED, {
                          faq_id: faq.id,
                          faq_question: faq.question,
                        });
                        void sendSuggestion(faq.question);
                      }}
                      className="text-left text-sm px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-colors leading-snug"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%]",
                    message.role === "user"
                      ? "rounded-2xl px-4 py-3 text-sm leading-relaxed bg-primary text-primary-foreground rounded-tr-sm"
                      : "rounded-2xl px-4 py-3 text-sm leading-relaxed bg-muted rounded-tl-sm"
                  )}
                >
                  {!message.content && message.isStreaming ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="text-muted-foreground text-xs">考え中...</span>
                    </span>
                  ) : message.role === "assistant" && message.content ? (
                    <>
                      {parseMessageContent(message.content).map((seg, i) =>
                        seg.type === "subsidy" ? (
                          <SubsidyRecommendationCard key={i} subsidyId={seg.id} />
                        ) : (
                          <span key={i} className="whitespace-pre-wrap">{seg.text}</span>
                        )
                      )}
                      {message.isStreaming && (
                        <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5 align-middle" />
                      )}
                    </>
                  ) : (
                    <>
                      {message.content}
                      {message.content && message.isStreaming && (
                        <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5 align-middle" />
                      )}
                    </>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center mt-0.5">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 max-w-md">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div className="border-t border-border bg-background px-4 py-4">
          {showReviewHint && (
            <div className="max-w-3xl mx-auto mb-3 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
              <p className="text-amber-800 dark:text-amber-300">
                申請書のレビューはProプランでご利用いただけます。AIが強み・弱みを分析し、採択率を高める修正案を提案します。
              </p>
              <a
                href="/pricing"
                className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition-colors"
              >
                Proへアップグレード
              </a>
            </div>
          )}
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="補助金について質問する... (Shift+Enterで改行)"
              rows={1}
              disabled={isLoading}
              className={cn(
                "flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
                "disabled:opacity-60 transition-all overflow-hidden"
              )}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={cn(
                "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                input.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              aria-label="送信"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            AIの回答は参考情報です。重要な決定の前に必ず公式情報をご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}
