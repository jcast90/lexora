import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center py-20", className)}>
      <Loader2 className="size-6 animate-spin text-white/40" />
    </div>
  );
}
