import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { searchSubsidies } from "@/lib/subsidies";
import type { TargetIndustry } from "@/types";

const quickRecommendSchema = z.object({
  industry: z.string().min(1, "業種を選択してください"),
});

// 業種コードから TargetIndustry へのマッピング
const INDUSTRY_TO_TARGET: Record<string, TargetIndustry> = {
  manufacturing: "SEIZOU",
  it: "IT",
  food: "INSHOKU",
  retail: "KOURI",
  construction: "KENSETSU",
  service: "SERVICE",
};

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "ログインしてください" },
        { status: 401 }
      );
    }

    // リクエストバリデーション
    const body = await request.json();
    const parsed = quickRecommendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容を確認してください", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { industry } = parsed.data;

    // 業種コードに対応する TargetIndustry を取得
    const targetIndustry = INDUSTRY_TO_TARGET[industry];

    // アクティブな補助金を取得してフィルタ
    const { items: allSubsidies } = await searchSubsidies({});
    const active = allSubsidies.filter((s) => s.isActive);

    // 業種マッチング + スコアリング（AI不使用、DBフィルタのみ）
    const scored = active.map((s) => {
      let score = s.popularity;

      // 業種マッチ
      if (targetIndustry && s.targetIndustries.includes(targetIndustry)) {
        score += 5;
      } else if (s.targetIndustries.includes("ALL")) {
        score += 2;
      }

      // AI対応ボーナス
      if (s.promptSupport === "FULL") score += 2;
      else if (s.promptSupport === "GENERIC") score += 1;

      // 難易度ボーナス（EASY優先）
      if (s.difficulty === "EASY") score += 1;

      return { subsidy: s, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const items = scored.slice(0, 3).map((s) => s.subsidy);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[quick-recommend] Error:", error);
    return NextResponse.json(
      { error: "補助金の取得に失敗しました" },
      { status: 500 }
    );
  }
}
