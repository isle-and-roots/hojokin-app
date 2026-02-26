"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, SkipForward } from "lucide-react";

interface DemoScenario {
  id: string;
  label: string;
  subsidyName: string;
  profile: { label: string; value: string }[];
  generatedText: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "jizokuka",
    label: "持続化補助金",
    subsidyName: "経営計画書",
    profile: [
      { label: "業種", value: "飲食業" },
      { label: "従業員", value: "5名" },
      { label: "売上", value: "3,000万円" },
      { label: "所在地", value: "東京都世田谷区" },
    ],
    generatedText:
      "当社は2015年の創業以来、地域密着型の飲食業として事業を展開してまいりました。代表者の15年にわたる料理人経験を活かし、地元産食材を使った季節料理を提供し、地域の食文化の継承に貢献してきました。現在、従業員5名体制で月間来客数約800名を維持しております。\n\n今後の経営方針として、テイクアウト・デリバリー事業の拡充により新たな顧客層の開拓を目指します。具体的には、地元食材を活用したお弁当・惣菜の販売を通じて、高齢者世帯や共働き世帯への食の提供体制を構築してまいります。",
  },
  {
    id: "it-donyu",
    label: "IT導入補助金",
    subsidyName: "導入計画",
    profile: [
      { label: "業種", value: "製造業" },
      { label: "従業員", value: "20名" },
      { label: "売上", value: "1.5億円" },
      { label: "課題", value: "受発注業務の効率化" },
    ],
    generatedText:
      "弊社は金属加工部品の製造を主事業とし、自動車関連メーカー様を中心に取引を行っております。現在、受発注管理を紙伝票とExcelで運用しており、月間約200件の受注処理に多大な工数を要しています。\n\n本IT導入計画では、クラウド型の生産管理・受発注システムを導入し、受注から出荷までの一元管理を実現します。これにより、受発注処理時間を現状の1件あたり30分から5分に短縮し、年間約1,300時間の工数削減を見込んでおります。併せて、リアルタイムでの在庫把握が可能となり、過剰在庫の削減と納期遵守率の向上を図ります。",
  },
  {
    id: "monodzukuri",
    label: "ものづくり補助金",
    subsidyName: "事業計画",
    profile: [
      { label: "業種", value: "金属加工業" },
      { label: "従業員", value: "12名" },
      { label: "売上", value: "8,000万円" },
      { label: "設備", value: "5軸マシニングセンタ導入" },
    ],
    generatedText:
      "弊社は精密金属加工を専門とし、航空宇宙・医療機器分野の高精度部品を製造しております。近年、取引先から要求される加工精度が±0.01mmから±0.005mmへと厳格化しており、現有設備では対応が困難な状況です。\n\n本事業では、5軸同時制御マシニングセンタを導入し、複雑形状の一体加工を実現します。従来3工程を要していた加工を1工程に集約することで、加工時間を60%削減し、同時に加工精度±0.003mmを達成します。これにより、航空宇宙分野の新規受注獲得（年間売上2,000万円増）を目指します。",
  },
];

export function AiTypewriterDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);
  const activeTabRef = useRef(0);

  const scenario = DEMO_SCENARIOS[activeTab];

  const stopTyping = useCallback(() => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
  }, []);

  const startTyping = useCallback(() => {
    const text = DEMO_SCENARIOS[activeTabRef.current].generatedText;
    charIndexRef.current = 0;
    setDisplayedText("");
    setIsTyping(true);
    setIsComplete(false);

    function typeNext() {
      if (charIndexRef.current >= text.length) {
        setIsTyping(false);
        setIsComplete(true);
        return;
      }

      const char = text[charIndexRef.current];
      charIndexRef.current++;
      setDisplayedText(text.slice(0, charIndexRef.current));

      const delay = char === "\n" ? 300 : 30;
      typingRef.current = setTimeout(typeNext, delay);
    }

    typingRef.current = setTimeout(typeNext, 500);
  }, []);

  const handleTabChange = useCallback(
    (tabIndex: number) => {
      stopTyping();
      activeTabRef.current = tabIndex;
      setActiveTab(tabIndex);
      setDisplayedText("");
      setIsTyping(false);
      setIsComplete(false);

      if (hasStartedRef.current) {
        // Delay to let React batch the state resets before starting new typing
        setTimeout(() => startTyping(), 0);
      }
    },
    [stopTyping, startTyping]
  );

  const skipToEnd = useCallback(() => {
    stopTyping();
    setDisplayedText(DEMO_SCENARIOS[activeTabRef.current].generatedText);
    setIsTyping(false);
    setIsComplete(true);
  }, [stopTyping]);

  // IntersectionObserver for auto-start
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          startTyping();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startTyping]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DEMO_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => handleTabChange(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === i
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Demo area */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        {/* Profile sidebar */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            入力情報
          </p>
          <div className="space-y-2.5">
            {scenario.profile.map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generated text area */}
        <div className="rounded-xl border-2 border-primary/30 bg-card p-5 shadow-lg shadow-primary/5 min-h-[280px] flex flex-col">
          <p className="text-xs text-primary font-semibold mb-3 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI生成結果（{scenario.subsidyName}）
          </p>
          <div className="flex-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse align-text-bottom" />
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            {!isComplete && (
              <button
                onClick={skipToEnd}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward className="h-3.5 w-3.5" />
                全文を表示
              </button>
            )}
            {isComplete && (
              <p className="text-xs text-green-600 font-medium">
                生成完了 — 約3分で申請書が完成
              </p>
            )}
            <p className="text-xs text-muted-foreground ml-auto">
              ※ 実際のAI出力例です
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
