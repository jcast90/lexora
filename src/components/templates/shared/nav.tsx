"use client";

import config, { resolveLandingConfig, isLiveMode } from "@/lib/config";
import { Zap } from "lucide-react";

type NavVariant = "default" | "precision" | "momentum";

export function NavBar({ variant = "default" }: { variant?: NavVariant }) {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;
  const href = waitlistMode && !isLiveMode ? "#waitlist" : "/signup";

  const variantStyles: Record<NavVariant, { nav: string; logo: string; btn: string }> = {
    default: {
      nav: "border-b border-white/[0.06] bg-brand-surface/80 backdrop-blur-xl",
      logo: "rounded-lg",
      btn: "rounded-full px-5 py-2",
    },
    precision: {
      nav: "border-b border-white/[0.06] bg-brand-surface/90 backdrop-blur-md",
      logo: "rounded-sm",
      btn: "rounded-sm px-5 py-2 text-xs uppercase tracking-wider",
    },
    momentum: {
      nav: "border-b border-white/[0.04] bg-brand-surface/60 backdrop-blur-2xl",
      logo: "rounded-lg",
      btn: "rounded-full px-6 py-2.5",
    },
  };

  const s = variantStyles[variant];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${s.nav}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 ${s.logo} flex items-center justify-center`}
            style={{
              background:
                "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))",
            }}
          >
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {config.name}
          </span>
        </div>
        <a
          href={href}
          className={`${s.btn} text-sm font-medium text-white transition-all hover:shadow-lg`}
          style={{
            background:
              "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
          }}
        >
          {landing.navCta ||
            landing.primaryCta ||
            (isLiveMode ? "Try it Free" : "Get Early Access")}
        </a>
      </div>
    </nav>
  );
}
