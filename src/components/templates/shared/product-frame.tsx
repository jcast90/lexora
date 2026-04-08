"use client";

import config from "@/lib/config";
import Image from "next/image";

/**
 * Browser-window mockup frame. Shows a real screenshot when imageUrl is
 * provided, otherwise renders a CSS-only placeholder with the product name
 * and a brand-colored gradient fill.
 */
export function ProductFrame({
  imageUrl,
  alt,
  className,
}: {
  imageUrl?: string | null;
  alt?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/[0.08] shadow-2xl ${className || ""}`}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] text-zinc-500">
            {config.domain || `${config.name?.toLowerCase().replace(/\s+/g, "")}.com`}
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Content area */}
      {imageUrl ? (
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={imageUrl}
            alt={alt || `${config.name} dashboard`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      ) : (
        <PlaceholderContent />
      )}
    </div>
  );
}

function PlaceholderContent() {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--brand-surface, #0A0A0F), color-mix(in srgb, var(--brand-primary) 8%, var(--brand-surface, #0A0A0F)))`,
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Fake dashboard elements */}
      <div className="relative z-10 p-6">
        {/* Fake stat cards row */}
        <div className="flex gap-3 mb-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex-1 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
            >
              <div className="h-2 w-8 rounded bg-white/[0.06] mb-2" />
              <div
                className="h-4 w-12 rounded"
                style={{
                  background: `color-mix(in srgb, var(--brand-primary) ${20 + n * 5}%, transparent)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Fake table rows */}
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="flex gap-4 border-b border-white/[0.02] py-2.5"
            style={{ opacity: 1 - n * 0.15 }}
          >
            <div className="h-2 w-20 rounded bg-white/[0.04]" />
            <div className="h-2 w-32 rounded bg-white/[0.04]" />
            <div className="h-2 w-16 rounded bg-white/[0.04]" />
            <div className="flex-1" />
            <div
              className="h-2 w-12 rounded"
              style={{
                background: `color-mix(in srgb, var(--brand-primary) 15%, transparent)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
