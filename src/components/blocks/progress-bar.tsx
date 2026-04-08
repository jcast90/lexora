import { brandGradient } from "./styles";

export interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  displayValue?: string;
  className?: string;
}

export function ProgressBar({
  label,
  value,
  max,
  displayValue,
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="text-white/80">
          {displayValue ?? `${value} / ${max}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, ...brandGradient }}
        />
      </div>
    </div>
  );
}
