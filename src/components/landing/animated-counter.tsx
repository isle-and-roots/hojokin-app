"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix: string;
  label: string;
}

export function AnimatedCounter({ target, suffix, label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.5,
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, target, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <div ref={ref} className="space-y-1">
      <p className="text-3xl sm:text-4xl font-bold text-primary">
        {display}
        <span className="text-lg font-medium ml-0.5">{suffix}</span>
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
