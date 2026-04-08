"use client";

import config, { isLiveMode, resolveLandingConfig, type VentureConfig } from "@/lib/config";
import { NavBar } from "./shared/nav";
import { FooterBar } from "./shared/footer";
import { WaitlistForm, LiveCtaButtons } from "./shared/waitlist-form";
import { PricingSection } from "./shared/pricing-section";
import { ProductFrame } from "./shared/product-frame";
import { GradientText } from "./shared/gradient-text";
import { ArrowRight, Target, Layers, Sparkles } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";

const stepIcons = [Target, Layers, Sparkles];
const painIcons = [
  "→",
  "⚡",
  "↗",
  "⬡",
  "◆",
  "▲",
];

/* ─── Cursor glow effect ─── */
function useCursorGlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !glowRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, color-mix(in srgb, var(--brand-primary) 8%, transparent), transparent 70%)`;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { containerRef, glowRef };
}

/* ─── Hero (split: text left, visual right) ─── */
function PrecisionHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;
  const { containerRef, glowRef } = useCursorGlow();

  return (
    <section ref={containerRef} className="relative px-6 pt-32 pb-20 overflow-hidden">
      {/* Cursor-following glow */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 z-0 transition-[background] duration-200" />

      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Gradient accent stripe */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--brand-primary), var(--brand-accent), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {landing.headline}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400">
            {landing.subheadline}
          </p>

          {waitlistMode && !isLiveMode ? (
            <WaitlistForm className="mt-8 max-w-sm" />
          ) : (
            <div className="mt-8 flex gap-3">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
              >
                {landing.primaryCta || "Try it Free"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        {/* Product visual */}
        <div className="hidden lg:block">
          <ProductFrame
            imageUrl={landing.heroImage}
            alt={`${config.name} dashboard`}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Stats bar (horizontal, monospace) ─── */
function StatsBar() {
  const { landing } = resolveLandingConfig();

  return (
    <section className="border-y border-white/[0.06]">
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3">
        {landing.painStats.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-center gap-3 px-6 py-6 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-white/[0.06]" : ""}`}
          >
            <span className="font-mono text-2xl font-bold text-white">
              {item.stat}
            </span>
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Timeline (horizontal 3-step) ─── */
function TimelineSection() {
  const { landing } = resolveLandingConfig();

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-bold tracking-tight mb-12">How it works</h2>

        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute top-6 left-0 right-0 h-px hidden sm:block"
            style={{
              background: "linear-gradient(90deg, var(--brand-primary), var(--brand-accent), transparent)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {landing.steps.map((step, i) => (
              <div key={i} className="relative">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm border border-white/[0.08] bg-brand-surface text-xs font-mono font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  0{i + 1}
                </div>
                <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pain points (2-col compact grid) ─── */
function PainPointsGrid() {
  const { landing } = resolveLandingConfig();

  return (
    <section className="px-6 py-16 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-bold tracking-tight mb-8">
          Problems we solve
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {landing.painPoints.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-sm border border-white/[0.04] bg-white/[0.01] p-4 transition-colors hover:border-white/[0.08]"
            >
              <span className="font-mono text-xs text-brand-primary mt-0.5">
                {painIcons[i % painIcons.length]}
              </span>
              <p className="text-sm leading-relaxed text-zinc-400">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA (minimal) ─── */
function MinimalCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold">{landing.finalCta.headline}</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {landing.finalCta.subheadline}
          </p>
        </div>
        <a
          href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
          className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg shrink-0"
          style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
        >
          {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try it Free" : "Get Started")}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

/* ─── Main Precision template ─── */
export default function Precision({ config: _config }: { config: VentureConfig }) {
  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="precision" />
      <PrecisionHero />
      <StatsBar />
      <TimelineSection />
      <PainPointsGrid />
      <PricingSection variant="table" />
      <MinimalCta />
      <FooterBar />
    </div>
  );
}
