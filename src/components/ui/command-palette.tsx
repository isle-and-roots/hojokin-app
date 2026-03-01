"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  User,
  CreditCard,
  Building2,
  ArrowRight,
  Command,
  MessageSquare,
} from "lucide-react";
import { ALL_SUBSIDIES } from "@/lib/data/subsidies";
import { UpgradeModal } from "@/components/upgrade-modal";
import type { PlanKey } from "@/lib/plans";

interface CommandItem {
  id: string;
  type: "subsidy" | "action";
  label: string;
  description?: string;
  href?: string;
  action?: () => void;
  icon: React.ReactNode;
  requiresPaid?: boolean;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  plan: PlanKey;
}

const QUICK_ACTIONS: CommandItem[] = [
  {
    id: "ai-chat",
    type: "action",
    label: "AI相談を開始",
    description: "補助金についてAIに質問する",
    href: "/chat",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "new-application",
    type: "action",
    label: "新規申請書を作成",
    description: "補助金申請書を新規作成する",
    href: "/applications/new",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "profile",
    type: "action",
    label: "プロフィール編集",
    description: "事業者情報を更新する",
    href: "/profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "pricing",
    type: "action",
    label: "料金プランを確認",
    description: "プランの詳細と料金を見る",
    href: "/pricing",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "subsidies-search",
    type: "action",
    label: "補助金を検索",
    description: "全補助金の検索・絞り込み",
    href: "/subsidies",
    icon: <Building2 className="h-4 w-4" />,
    requiresPaid: true,
  },
];

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;

  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

interface PaletteInnerProps {
  onClose: () => void;
  plan: PlanKey;
}

function PaletteInner({ onClose, plan }: PaletteInnerProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo<CommandItem[]>(() => {
    const subsidyItems: CommandItem[] =
      query.length > 0
        ? ALL_SUBSIDIES.filter(
            (s) =>
              fuzzyMatch(s.name, query) ||
              fuzzyMatch(s.nameShort, query) ||
              s.tags.some((t) => fuzzyMatch(t, query))
          )
            .slice(0, 6)
            .map((s) => ({
              id: `subsidy-${s.id}`,
              type: "subsidy" as const,
              label: s.nameShort || s.name,
              description: s.summary,
              href: `/subsidies/${s.id}`,
              icon: <Building2 className="h-4 w-4" />,
              requiresPaid: true,
            }))
        : [];

    const filteredActions = QUICK_ACTIONS.filter(
      (a) =>
        query.length === 0 ||
        fuzzyMatch(a.label, query) ||
        (a.description != null && fuzzyMatch(a.description, query))
    );

    return [...filteredActions, ...subsidyItems];
  }, [query]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.requiresPaid && plan === "free") {
        setUpgradeOpen(true);
        return;
      }
      onClose();
      if (item.href) {
        router.push(item.href);
      } else if (item.action) {
        item.action();
      }
    },
    [plan, onClose, router]
  );

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setActiveIndex(0);
    },
    []
  );

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = items[activeIndex];
        if (item) {
          handleSelect(item);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, activeIndex, handleSelect, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const hasGroups =
    query.length > 0 &&
    items.some((i) => i.type === "action") &&
    items.some((i) => i.type === "subsidy");

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="コマンドを検索、補助金名を入力..."
              value={query}
              onChange={handleQueryChange}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              <span className="text-[10px]">ESC</span>
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {query
                  ? `「${query}」に一致する結果はありません`
                  : "コマンドを入力してください"}
              </div>
            ) : (
              <ul ref={listRef} className="py-2">
                {hasGroups && (
                  <li className="px-3 py-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      アクション
                    </span>
                  </li>
                )}
                {items.map((item, index) => {
                  const isFirstSubsidy =
                    hasGroups &&
                    item.type === "subsidy" &&
                    items[index - 1]?.type !== "subsidy";

                  return (
                    <li key={item.id}>
                      {isFirstSubsidy && (
                        <div className="px-3 py-1 mt-1">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            補助金
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          index === activeIndex
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => handleSelect(item)}
                      >
                        <span
                          className={`flex-shrink-0 ${
                            index === activeIndex
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium truncate">
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="block text-xs text-muted-foreground truncate">
                              {item.description}
                            </span>
                          )}
                        </span>
                        {item.requiresPaid && plan === "free" && (
                          <span className="flex-shrink-0 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            Pro
                          </span>
                        )}
                        <ArrowRight
                          className={`h-3.5 w-3.5 flex-shrink-0 transition-opacity ${
                            index === activeIndex ? "opacity-60" : "opacity-0"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">
                  ↑↓
                </kbd>
                移動
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">
                  ↵
                </kbd>
                選択
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Command className="h-3 w-3" />
              <span>+K</span>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  );
}

/**
 * CommandPalette — mounts PaletteInner only when open=true.
 * This ensures state (query, activeIndex) is always reset to defaults on open.
 */
export function CommandPalette({ open, onClose, plan }: CommandPaletteProps) {
  if (!open) return null;
  return <PaletteInner onClose={onClose} plan={plan} />;
}
