"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface SearchInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  containerClassName?: string;
}

export function SearchInput({
  containerClassName,
  className,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
      <Input
        type="text"
        placeholder={placeholder}
        className={cn(
          "pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30",
          className
        )}
        {...props}
      />
    </div>
  );
}
