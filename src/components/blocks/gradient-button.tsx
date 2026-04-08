"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { brandGradient } from "./styles";
import type { LucideIcon } from "lucide-react";

export interface GradientButtonProps
  extends React.ComponentProps<typeof Button> {
  icon?: LucideIcon;
}

export function GradientButton({
  icon: Icon,
  children,
  className,
  ...props
}: GradientButtonProps) {
  return (
    <Button
      className={cn("text-white", className)}
      style={brandGradient}
      {...props}
    >
      {Icon && <Icon className="size-4 mr-2" />}
      {children}
    </Button>
  );
}
