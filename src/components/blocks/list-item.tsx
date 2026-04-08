import * as React from "react";
import { cn } from "@/lib/utils";

export interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
