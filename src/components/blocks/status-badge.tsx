import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "active"
  | "inactive"
  | "pending"
  | "completed";

export interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  inactive: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral: "border-white/20 text-white/50",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.neutral;
  return (
    <Badge variant="outline" className={cn(style, className)}>
      {label ?? status}
    </Badge>
  );
}
