"use client";

export function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
      }}
    >
      {children}
    </span>
  );
}

export function BrandIconBox({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses =
    size === "sm"
      ? "h-8 w-8 rounded-lg"
      : size === "lg"
        ? "h-14 w-14 rounded-2xl"
        : "h-12 w-12 rounded-xl";
  return (
    <div
      className={`inline-flex items-center justify-center ${sizeClasses}`}
      style={{
        background: `linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 20%, transparent), color-mix(in srgb, var(--brand-accent) 20%, transparent))`,
        borderWidth: 1,
        borderColor:
          "color-mix(in srgb, var(--brand-primary) 10%, transparent)",
      }}
    >
      {children}
    </div>
  );
}
