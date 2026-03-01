"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ConfettiPiece = {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
  rotationSpeed: number;
  horizontalDrift: number;
};

const COLORS = [
  "#2563eb", // primary blue
  "#3b82f6", // lighter blue
  "#22c55e", // green
  "#f97316", // orange
  "#eab308", // yellow
  "#a855f7", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    rotationSpeed: 180 + Math.random() * 360,
    horizontalDrift: (Math.random() - 0.5) * 120,
  }));
}

interface ConfettiProps {
  show: boolean;
  /** Duration in ms before auto-hiding. Default: 3000 */
  duration?: number;
  onDone?: () => void;
}

export function Confetti({ show, duration = 3000, onDone }: ConfettiProps) {
  const [pieces] = useState<ConfettiPiece[]>(() => generatePieces(28));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    const showTimer = setTimeout(() => setVisible(true), 0);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, duration);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [show, duration, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          aria-hidden
        >
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: `calc(${piece.x}vw + ${piece.horizontalDrift}px)`,
                y: "110vh",
                rotate: piece.rotationSpeed,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2.4,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: {
                  times: [0, 0.7, 1],
                  duration: 2.4,
                  delay: piece.delay,
                },
              }}
              style={{
                position: "absolute",
                top: 0,
                width: piece.size,
                height: piece.size * 0.6,
                backgroundColor: piece.color,
                borderRadius: 2,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
