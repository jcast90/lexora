"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { IconBox } from "./icon-box";
import { brandGradient } from "./styles";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  changeLabel?: string;
  icon?: LucideIcon;
  highlight?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend,
  changeLabel = "vs last month",
  icon: Icon,
  highlight,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-white/[0.06] bg-brand-surface-light text-white overflow-hidden",
        highlight && "relative",
        className
      )}
    >
      {highlight && (
        <div
          className="absolute inset-x-0 top-0 h-[1px]"
          style={brandGradient}
        />
      )}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-sm font-medium text-white/50">
          {title}
        </CardDescription>
        {Icon && <IconBox icon={Icon} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {change && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                trend === "up" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {change}
            </span>
            <span className="text-white/40">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
