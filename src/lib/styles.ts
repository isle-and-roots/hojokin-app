import { cn } from "@/lib/utils";

export { cn };

export const cardVariants = {
  flat: "bg-card border border-border rounded-xl",
  raised: "bg-card border border-border rounded-xl shadow-md",
  floating: "bg-card border border-border rounded-xl shadow-lg",
  interactive: "bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
  glass: "bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg",
} as const;

export const buttonVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150",
  secondary: "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-all duration-150",
  ghost: "bg-transparent hover:bg-muted active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150",
  danger: "bg-destructive text-white hover:bg-destructive/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive transition-all duration-150",
} as const;

export const badgeVariants = {
  default: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  outline: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
  dot: "inline-flex items-center gap-1.5 text-xs font-medium",
} as const;

export const sizeVariants = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

export type CardVariant = keyof typeof cardVariants;
export type ButtonVariant = keyof typeof buttonVariants;
export type BadgeVariant = keyof typeof badgeVariants;
export type SizeVariant = keyof typeof sizeVariants;
