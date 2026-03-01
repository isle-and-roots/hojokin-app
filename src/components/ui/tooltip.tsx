"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: ReactNode;
}

const POSITION_CLASSES: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const ARROW_CLASSES: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-foreground/90",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-foreground/90",
  left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-foreground/90",
  right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-foreground/90",
};

export function Tooltip({ content, position = "top", children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    hideTimerRef.current = setTimeout(() => setVisible(false), 100);
  }, []);

  const toggle = useCallback(() => {
    setVisible((v) => !v);
  }, []);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* タップで表示/非表示（モバイル） */}
      <span
        onClick={toggle}
        className="contents"
        role="button"
        tabIndex={0}
        aria-label={`ヘルプ: ${content}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle();
        }}
      >
        {children}
      </span>

      {visible && (
        <span
          className={`absolute z-50 w-56 rounded-lg bg-foreground/90 px-3 py-2 text-xs text-background shadow-lg pointer-events-none ${POSITION_CLASSES[position]}`}
          role="tooltip"
        >
          {content}
          {/* 矢印 */}
          <span
            className={`absolute border-4 ${ARROW_CLASSES[position]}`}
          />
        </span>
      )}
    </span>
  );
}

/** 「?」アイコン付きの小さなヘルプボタン */
export function HelpTooltip({
  content,
  position = "top",
}: {
  content: string;
  position?: TooltipPosition;
}) {
  return (
    <Tooltip content={content} position={position}>
      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-muted text-muted-foreground text-[10px] font-bold cursor-help hover:bg-muted-foreground/20 transition-colors select-none">
        ?
      </span>
    </Tooltip>
  );
}
