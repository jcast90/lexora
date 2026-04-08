import * as React from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-4 py-8 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
