/** Reusable brand gradient style objects */
export const brandGradient = {
  background:
    "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
} as const;

export const brandGradientSubtle = {
  background:
    "linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 15%, transparent), color-mix(in srgb, var(--brand-accent) 15%, transparent))",
} as const;
