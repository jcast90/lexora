"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconBox } from "./icon-box";
import type { LucideIcon } from "lucide-react";

export interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: "brand" | "success" | "danger" | "warning" | "muted";
  className?: string;
}

export function QuickAction({
  icon,
  label,
  onClick,
  variant = "brand",
  className,
}: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start gap-3 border-white/[0.08] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white",
        className
      )}
      onClick={onClick}
    >
      <IconBox icon={icon} variant={variant} size="sm" />
      {label}
    </Button>
  );
}
