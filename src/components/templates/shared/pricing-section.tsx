"use client";

import config, { resolveLandingConfig, isLiveMode } from "@/lib/config";
import { GradientText } from "./gradient-text";
import { ArrowRight, Check } from "lucide-react";

type PricingVariant = "cards" | "table" | "glass";

export function PricingSection({
  variant = "cards",
}: {
  variant?: PricingVariant;
}) {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;
  if (waitlistMode && !isLiveMode) return null;

  if (variant === "table") return <PricingTable landing={landing} />;
  if (variant === "glass") return <PricingGlass landing={landing} />;
  return <PricingCards landing={landing} />;
}

/* ─── Card variant (Warmth) ─── */
function PricingCards({
  landing,
}: {
  landing: ReturnType<typeof resolveLandingConfig>["landing"];
}) {
  return (
    <section id="pricing" className="px-6 py-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, <GradientText>transparent</GradientText> pricing
          </h2>
          <p className="mt-4 text-zinc-400">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {landing.pricing.map((tier, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                tier.highlighted
                  ? "border-brand-primary/30 shadow-2xl"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
              style={
                tier.highlighted
                  ? {
                      background: `linear-gradient(to bottom, color-mix(in srgb, var(--brand-primary) 8%, transparent), color-mix(in srgb, var(--brand-accent) 4%, transparent))`,
                      boxShadow: `0 25px 50px -12px color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
                    }
                  : undefined
              }
            >
              {tier.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{tier.plan}</h3>
                <p className="mt-1 text-sm text-zinc-400">{tier.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className="text-zinc-500">{tier.period}</span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? "text-white hover:shadow-lg"
                    : "border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08]"
                }`}
                style={
                  tier.highlighted
                    ? {
                        background:
                          "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
                      }
                    : undefined
                }
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Table variant (Precision) ─── */
function PricingTable({
  landing,
}: {
  landing: ReturnType<typeof resolveLandingConfig>["landing"];
}) {
  return (
    <section id="pricing" className="px-6 py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold tracking-tight mb-12">Pricing</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-4 pr-8 text-left text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  Plan
                </th>
                <th className="py-4 pr-8 text-left text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  Price
                </th>
                <th className="py-4 text-left text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  Includes
                </th>
              </tr>
            </thead>
            <tbody>
              {landing.pricing.map((tier, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/[0.04] ${tier.highlighted ? "bg-white/[0.02]" : ""}`}
                >
                  <td className="py-5 pr-8">
                    <span className="font-semibold">{tier.plan}</span>
                    {tier.highlighted && (
                      <span className="ml-2 text-xs text-brand-primary">
                        recommended
                      </span>
                    )}
                  </td>
                  <td className="py-5 pr-8 font-mono text-lg">
                    {tier.price}
                    <span className="text-xs text-zinc-500">{tier.period}</span>
                  </td>
                  <td className="py-5 text-zinc-400">
                    {tier.features.join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── Glass variant (Momentum) ─── */
function PricingGlass({
  landing,
}: {
  landing: ReturnType<typeof resolveLandingConfig>["landing"];
}) {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <GradientText>Pricing</GradientText>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {landing.pricing.map((tier, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl p-8 backdrop-blur-xl transition-all ${
                tier.highlighted
                  ? "bg-white/[0.06] shadow-2xl"
                  : "bg-white/[0.03] hover:bg-white/[0.05]"
              }`}
              style={{
                border: tier.highlighted
                  ? "1px solid color-mix(in srgb, var(--brand-primary) 40%, transparent)"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {tier.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
                  }}
                >
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold">{tier.plan}</h3>
              <p className="mt-1 text-sm text-zinc-400">{tier.desc}</p>

              <div className="my-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className="text-zinc-500">{tier.period}</span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                style={{
                  background: tier.highlighted
                    ? "linear-gradient(to right, var(--brand-primary), var(--brand-accent))"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
