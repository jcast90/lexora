import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function ThemedCard({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "border-white/[0.06] bg-brand-surface-light text-white",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
