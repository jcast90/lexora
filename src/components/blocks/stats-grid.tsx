"use client";

import { cn } from "@/lib/utils";
import { StatCard, type StatCardProps } from "./stat-card";

export interface StatsGridProps {
  stats: StatCardProps[];
  highlightFirst?: boolean;
  className?: string;
}

export function StatsGrid({
  stats,
  highlightFirst = true,
  className,
}: StatsGridProps) {
  return (
    <div
      className={cn("mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {stats.map((stat, i) => (
        <StatCard
          key={stat.title}
          {...stat}
          highlight={highlightFirst && i === 0}
        />
      ))}
    </div>
  );
}
