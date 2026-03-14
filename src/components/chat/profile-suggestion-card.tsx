"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

interface ProfileSuggestion {
  field: string;
  value: string;
  label: string;
}

interface ProfileSuggestionCardProps {
  suggestion: ProfileSuggestion;
  onApply?: () => void;
  onSkip?: () => void;
}

export function ProfileSuggestionCard({
  suggestion,
  onApply,
  onSkip,
}: ProfileSuggestionCardProps) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [suggestion.field]: suggestion.value }),
      });
      setApplied(true);
      onApply?.();
    } catch {
      // ignore network errors silently
    } finally {
      setLoading(false);
    }
  };

  if (applied) return null;

  return (
    <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 flex items-start gap-2.5">
      <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-blue-900 font-medium">
          {suggestion.label}: <span className="font-normal">{suggestion.value}</span>
        </p>
        <p className="text-xs text-blue-700 mt-0.5">この情報をプロフィールに反映しますか？</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleApply}
            disabled={loading}
            className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "反映中..." : "反映する"}
          </button>
          <button
            onClick={onSkip}
            className="px-2.5 py-1 rounded-md text-blue-700 text-xs hover:bg-blue-100 transition-colors"
          >
            スキップ
          </button>
        </div>
      </div>
    </div>
  );
}
