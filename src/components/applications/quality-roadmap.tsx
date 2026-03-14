"use client";

import Link from "next/link";
import { CheckSquare } from "lucide-react";

interface QualityRoadmapProps {
  score: number;
  grade: string;
  profileCompleteness: number;
}

interface Action {
  label: string;
  pointGain: number;
  href: string;
}

function getTargetGrade(grade: string): string {
  const grades = ["D", "C", "B", "A", "S"];
  const idx = grades.indexOf(grade.toUpperCase());
  if (idx === -1 || idx === grades.length - 1) return "S";
  return grades[idx + 1];
}

function getActions(profileCompleteness: number, score: number): Action[] {
  const actions: Action[] = [];

  if (profileCompleteness < 80) {
    actions.push({
      label: "プロフィールを充実させる（業種・事業内容を追加）",
      pointGain: 10,
      href: "/profile",
    });
  }

  if (score < 70) {
    actions.push({
      label: "セクションをAIで再生成して品質を向上",
      pointGain: 15,
      href: "#",
    });
  }

  actions.push({
    label: "Proプランにアップグレードして高精度モデルを利用",
    pointGain: 20,
    href: "/pricing",
  });

  return actions.slice(0, 3);
}

export function QualityRoadmap({ score, grade, profileCompleteness }: QualityRoadmapProps) {
  const targetGrade = getTargetGrade(grade);
  const actions = getActions(profileCompleteness, score);
  const totalGain = actions.reduce((sum, a) => sum + a.pointGain, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">品質改善ロードマップ</h3>
        <p className="text-xs text-muted-foreground mt-1">
          あと{actions.length}アクションで{targetGrade}ランクに到達（+{totalGain}点）
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {actions.map((action, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <CheckSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <Link
                href={action.href}
                className="text-xs text-foreground hover:text-primary hover:underline transition-colors"
              >
                {action.label}
              </Link>
            </div>
            <span className="text-xs font-medium text-green-600 shrink-0">
              +{action.pointGain}点
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
