import config from "@/lib/config";

export function Logo({ size = 32 }: { size?: number }) {
  const initials = config.name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-lg flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${config.brand.primary}, ${config.brand.accent})`,
      }}
    >
      {initials}
    </div>
  );
}

export function LogoWithName({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={size} />
      <span className="font-bold text-lg">{config.name}</span>
    </div>
  );
}
