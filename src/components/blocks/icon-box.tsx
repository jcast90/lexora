import { cn } from "@/lib/utils";
import { brandGradientSubtle } from "./styles";
import type { LucideIcon } from "lucide-react";

export interface IconBoxProps {
  icon: LucideIcon;
  variant?: "muted" | "brand" | "success" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "size-7", md: "size-9", lg: "size-10" };
const iconSizeMap = { sm: "size-3.5", md: "size-4", lg: "size-5" };
const variantMap = {
  muted: "bg-white/[0.06] text-white/40",
  brand: "text-brand-primary",
  success: "bg-emerald-500/10 text-emerald-400",
  danger: "bg-red-500/10 text-red-400",
  warning: "bg-amber-500/10 text-amber-400",
};

export function IconBox({
  icon: Icon,
  variant = "muted",
  size = "md",
  className,
}: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg",
        sizeMap[size],
        variantMap[variant],
        className
      )}
      style={variant === "brand" ? brandGradientSubtle : undefined}
    >
      <Icon className={iconSizeMap[size]} />
    </div>
  );
}
