"use client";

import config from "@/lib/config";

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { brand } = config;
  return (
    <div
      style={
        {
          "--brand-primary": brand.primary,
          "--brand-primary-dark": brand.primaryDark,
          "--brand-accent": brand.accent,
          "--brand-surface": brand.surface,
          "--brand-surface-light": brand.surfaceLight,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
