"use client";

import { useEffect, useState } from "react";
import { CommandPalette } from "@/components/ui/command-palette";
import type { PlanKey } from "@/lib/plans";

interface CommandPaletteTriggerProps {
  plan: PlanKey;
}

export function CommandPaletteTrigger({ plan }: CommandPaletteTriggerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CommandPalette
      open={open}
      onClose={() => setOpen(false)}
      plan={plan}
    />
  );
}
