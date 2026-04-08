"use client";

import { useEffect, useRef, useState } from "react";
import config, { isLiveMode, resolveLandingConfig, type VentureConfig } from "@/lib/config";
import { NavBar } from "./shared/nav";
import { FooterBar } from "./shared/footer";
import { WaitlistForm } from "./shared/waitlist-form";
import { PricingSection } from "./shared/pricing-section";
import { ProductFrame } from "./shared/product-frame";
import { GradientText, BrandIconBox } from "./shared/gradient-text";
import { ArrowRight, Target, Layers, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";

const ICON_MAP: Record<string, typeof Zap> = {
  Zap, Target, Layers, Sparkles, Shield, TrendingUp,
};

function getIcon(name?: string) {
  return (name && ICON_MAP[name]) || Zap;
}

/* ─── Animated counter ─── */
function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="font-mono text-4xl font-bold transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <GradientText>{value}</GradientText>
    </span>
  );
}

/* ─── Hero with gradient mesh and inline email capture ─── */
function MomentumHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative flex flex-col items-center px-6 pt-36 pb-24 text-center overflow-hidden">
      {/* Animated gradient mesh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `
            conic-gradient(from 0deg at 30% 40%, var(--brand-primary), transparent 120deg),
            conic-gradient(from 180deg at 70% 60%, var(--brand-accent), transparent 120deg),
            conic-gradient(from 90deg at 50% 20%, color-mix(in srgb, var(--brand-primary) 50%, var(--brand-accent)), transparent 120deg)
          `,
          filter: "blur(80px)",
          animation: "meshRotate 20s linear infinite",
        }}
      />

      <div className="relative z-10 max-w-3xl">
        <h1
          className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent), var(--brand-primary))",
            backgroundSize: "200% 200%",
            animation: "gradientShift 6s ease infinite",
          }}
        >
          {landing.headline}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          {landing.subheadline}
        </p>

        {/* Email capture directly in hero */}
        {waitlistMode && !isLiveMode ? (
          <WaitlistForm className="mx-auto mt-10 max-w-md" />
        ) : (
          <div className="mt-10">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:shadow-xl"
              style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
            >
              {landing.primaryCta || "Try it Free"}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Glass stat cards with animated counters ─── */
function GlassStats() {
  const { landing } = resolveLandingConfig();

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {landing.painStats.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-2xl p-8 backdrop-blur-xl transition-all hover:bg-white/[0.04]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <AnimatedStat value={item.stat} />
            <span className="text-sm text-zinc-400">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Bento grid features ─── */
function BentoFeatures() {
  const { landing } = resolveLandingConfig();
  const features = landing.features;
  if (!features?.length) return <BentoFallback />;

  // Layout pattern: first item large, rest smaller, last one wide
  const gridPattern = features.length >= 4
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2";

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-16">
          <GradientText>Features</GradientText>
        </h2>

        <div className={`grid ${gridPattern} gap-4`}>
          {features.map((feature, i) => {
            const Icon = getIcon(feature.icon);
            const featureImage = landing.featureImages?.[i] || null;
            // First item spans 2 columns on large screens
            const spanClass = i === 0 && features.length >= 3 ? "sm:col-span-2 lg:col-span-2" : "";

            return (
              <div
                key={i}
                className={`group relative rounded-2xl p-6 backdrop-blur-xl transition-all hover:bg-white/[0.04] ${spanClass}`}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Gradient border on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    border: "1px solid transparent",
                    backgroundImage: `linear-gradient(var(--brand-surface), var(--brand-surface)), linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  }}
                />

                <div className="relative z-10">
                  <BrandIconBox size="md">
                    <Icon className="h-5 w-5 text-brand-primary" />
                  </BrandIconBox>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>

                  {featureImage && (
                    <div className="mt-4">
                      <ProductFrame
                        imageUrl={featureImage}
                        alt={feature.title}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Fallback: use pain points if no features */
function BentoFallback() {
  const { landing } = resolveLandingConfig();

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {landing.painPoints.map((point, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 backdrop-blur-xl transition-all hover:bg-white/[0.04]"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-sm leading-relaxed text-zinc-300">{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── How it works ─── */
function HowItWorks() {
  const { landing } = resolveLandingConfig();
  const stepIcons = [Target, Layers, Sparkles];

  return (
    <section className="px-6 py-20 border-t border-white/[0.04]">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight mb-12">
          <GradientText>How it works</GradientText>
        </h2>

        {/* Horizontal on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {landing.steps.map((step, i) => {
            const Icon = stepIcons[i] || Sparkles;
            return (
              <div
                key={i}
                className="group flex flex-col items-start rounded-2xl p-6 backdrop-blur-xl transition-all hover:bg-white/[0.03]"
                style={{
                  background: "rgba(255,255,255,0.01)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))" }}
                >
                  {i + 1}
                </div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function CompactCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 py-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, var(--brand-primary), var(--brand-accent), var(--brand-primary))`,
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
          <GradientText>{landing.finalCta.headline}</GradientText>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
          {landing.finalCta.subheadline}
        </p>

        <div className="mt-10">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:shadow-xl"
            style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
          >
            {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try it Free" : "Get Started")}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Momentum template ─── */
export default function Momentum({ config: _config }: { config: VentureConfig }) {
  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="momentum" />
      <MomentumHero />
      <GlassStats />
      <BentoFeatures />
      <HowItWorks />
      <PricingSection variant="glass" />
      <CompactCta />
      <FooterBar />
    </div>
  );
}
