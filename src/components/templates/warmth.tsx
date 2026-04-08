"use client";

import { useEffect, useRef } from "react";
import config, { isLiveMode, resolveLandingConfig, type VentureConfig } from "@/lib/config";
import { NavBar } from "./shared/nav";
import { FooterBar } from "./shared/footer";
import { WaitlistForm, LiveCtaButtons } from "./shared/waitlist-form";
import { PricingSection } from "./shared/pricing-section";
import { ProductFrame } from "./shared/product-frame";
import { GradientText, BrandIconBox } from "./shared/gradient-text";
import {
  ArrowRight,
  Target,
  Layers,
  Sparkles,
  AlertCircle,
  Shield,
  TrendingUp,
  Zap,
  ChevronDown,
  Quote,
} from "lucide-react";

const ICON_MAP: Record<string, typeof Zap> = {
  Zap,
  Target,
  Layers,
  Sparkles,
  AlertCircle,
  Shield,
  TrendingUp,
};

function getIcon(name?: string) {
  return (name && ICON_MAP[name]) || Zap;
}

/* ─── Intersection Observer fade-up ─── */
function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: make visible after 2s if IntersectionObserver doesn't fire
    const fallbackTimer = setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 2000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallbackTimer);
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Hero ─── */
function WarmthHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative flex flex-col items-center px-6 pt-36 pb-16 text-center overflow-hidden">
      {/* Soft glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full blur-[140px] opacity-[0.07]"
        style={{
          background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
        }}
      />

      <div className="relative z-10 max-w-3xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-sm text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
          <span>{isLiveMode ? "Now available" : "Now in early access"}</span>
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          <GradientText>{landing.headline}</GradientText>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          {landing.subheadline}
        </p>

        {waitlistMode && !isLiveMode ? (
          <WaitlistForm className="mx-auto mt-10 max-w-md" />
        ) : (
          <LiveCtaButtons />
        )}
      </div>

      {/* Product frame below hero */}
      <FadeIn className="relative z-10 mx-auto mt-16 w-full max-w-3xl" delay={300}>
        <ProductFrame
          imageUrl={landing.heroImage}
          alt={`${config.name} dashboard`}
          className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
        />
      </FadeIn>
    </section>
  );
}

/* ─── Social proof bar ─── */
function SocialProofBar() {
  const { landing } = resolveLandingConfig();
  if (!landing.socialProofLine) return null;

  return (
    <FadeIn className="border-y border-white/[0.04] py-8">
      <p className="text-center text-sm text-zinc-500">
        {landing.socialProofLine}
      </p>
    </FadeIn>
  );
}

/* ─── Problem statement ─── */
function ProblemSection() {
  const { landing } = resolveLandingConfig();
  if (!landing.painPoints?.length) return null;

  return (
    <FadeIn className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          The problem with <GradientText>today</GradientText>
        </h2>
        <div className="mx-auto mt-8 max-w-2xl space-y-4">
          {landing.painPoints.map((point, i) => (
            <p key={i} className="text-lg leading-relaxed text-zinc-400">
              {point}
            </p>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Alternating features ─── */
function FeaturesSection() {
  const { landing } = resolveLandingConfig();
  const features = landing.features;
  if (!features?.length) return null;

  return (
    <section className="px-6 py-24 border-t border-white/[0.04]">
      <div className="mx-auto max-w-5xl">
        <FadeIn className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you <GradientText>need</GradientText>
          </h2>
        </FadeIn>

        <div className="space-y-24">
          {features.map((feature, i) => {
            const Icon = getIcon(feature.icon);
            const isReversed = i % 2 === 1;
            const featureImage = landing.featureImages?.[i] || null;

            return (
              <FadeIn
                key={i}
                delay={i * 100}
                className={`flex flex-col gap-12 items-center ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                {/* Text side */}
                <div className="flex-1 lg:max-w-md">
                  <BrandIconBox size="lg">
                    <Icon className="h-7 w-7 text-brand-primary" />
                  </BrandIconBox>
                  <h3 className="mt-6 text-2xl font-bold">{feature.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>

                {/* Visual side */}
                <div className="flex-1 w-full max-w-lg">
                  <ProductFrame
                    imageUrl={featureImage}
                    alt={feature.title}
                    className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works (vertical numbered steps with dotted line) ─── */
function StepsSection() {
  const { landing } = resolveLandingConfig();
  const stepIcons = [Target, Layers, Sparkles];

  return (
    <section className="px-6 py-24 border-t border-white/[0.04]">
      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it <GradientText>works</GradientText>
          </h2>
          <p className="mt-4 text-zinc-400">
            Get started in minutes, not months.
          </p>
        </FadeIn>

        <div className="relative">
          {/* Dotted connecting line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px hidden sm:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, color-mix(in srgb, var(--brand-primary) 30%, transparent) 0px, color-mix(in srgb, var(--brand-primary) 30%, transparent) 4px, transparent 4px, transparent 12px)",
            }}
          />

          <div className="space-y-12">
            {landing.steps.map((step, i) => {
              const Icon = stepIcons[i] || Sparkles;
              return (
                <FadeIn
                  key={i}
                  delay={i * 150}
                  className="flex items-start gap-6 sm:pl-0"
                >
                  {/* Number circle */}
                  <div
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                    }}
                  >
                    {i + 1}
                  </div>

                  <div className="pt-1">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-zinc-400">
                      {step.desc}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials (CSS scroll-snap carousel) ─── */
function TestimonialsSection() {
  const { landing } = resolveLandingConfig();
  const testimonials = landing.testimonials;
  if (!testimonials?.length) return null;

  return (
    <section className="py-24 border-t border-white/[0.04]">
      <FadeIn className="px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-16">
            What people are <GradientText>saying</GradientText>
          </h2>
        </div>
      </FadeIn>

      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-4 scrollbar-hide">
        <div className="shrink-0 w-[calc((100%-theme(maxWidth.5xl))/2)]" />
        {testimonials.map((t, i) => (
          <FadeIn
            key={i}
            delay={i * 100}
            className="snap-center shrink-0 w-[340px] sm:w-[400px]"
          >
            <div className="h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-white/[0.1] hover:scale-[1.02]">
              <Quote className="h-8 w-8 text-brand-primary opacity-40 mb-4" />
              <p className="text-base leading-relaxed text-zinc-300">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-zinc-500">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
        <div className="shrink-0 w-6" />
      </div>
    </section>
  );
}

/* ─── FAQ Accordion ─── */
function FaqSection() {
  const { landing } = resolveLandingConfig();
  const faq = landing.faq;
  if (!faq?.length) return null;

  return (
    <FadeIn className="px-6 py-24 border-t border-white/[0.04]">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-16">
          Frequently asked <GradientText>questions</GradientText>
        </h2>

        <div className="space-y-3">
          {faq.map((item, i) => (
            <FaqAccordionItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

function FaqAccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details
      ref={detailsRef}
      className="group rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.1]"
    >
      <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-base font-medium list-none">
        {question}
        <ChevronDown className="h-4 w-4 text-zinc-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">
        {answer}
      </div>
    </details>
  );
}

/* ─── Pain stats ─── */
function PainStatsSection() {
  const { landing } = resolveLandingConfig();

  return (
    <FadeIn>
      <section className="relative border-y border-white/[0.04] bg-white/[0.01]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-white/[0.04] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {landing.painStats.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 px-8 py-12 text-center"
            >
              <GradientText>
                <span className="text-4xl font-bold">{item.stat}</span>
              </GradientText>
              <span className="text-sm text-zinc-400">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

/* ─── Final CTA ─── */
function FinalCtaSection() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 py-32 overflow-hidden">
      {/* Glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full blur-[140px] opacity-[0.06]"
        style={{
          background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
        }}
      />

      <FadeIn className="relative z-10 mx-auto max-w-3xl text-center">
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
            style={{
              background:
                "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
            }}
          >
            {landing.finalCtaButton ||
              landing.primaryCta ||
              (isLiveMode ? "Try it Free" : "Join the Waitlist")}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Main Warmth template ─── */
export default function Warmth({ config: _config }: { config: VentureConfig }) {
  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="default" />
      <WarmthHero />
      <SocialProofBar />
      <PainStatsSection />
      <ProblemSection />
      <FeaturesSection />
      <StepsSection />
      <TestimonialsSection />
      <PricingSection variant="cards" />
      <FaqSection />
      <FinalCtaSection />
      <FooterBar />
    </div>
  );
}
