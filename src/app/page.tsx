"use client";

import { resolveLandingConfig, type VentureConfig } from "@/lib/config";
import Warmth from "@/components/templates/warmth";

/* Additional templates are lazy-loaded to avoid bundling all three */
import dynamic from "next/dynamic";

const Precision = dynamic(() => import("@/components/templates/precision"), {
  loading: () => <TemplateShell />,
});
const Momentum = dynamic(() => import("@/components/templates/momentum"), {
  loading: () => <TemplateShell />,
});

const TEMPLATES: Record<string, React.ComponentType<{ config: VentureConfig }>> = {
  precision: Precision,
  warmth: Warmth,
  momentum: Momentum,
};

function TemplateShell() {
  return (
    <div className="min-h-screen bg-brand-surface text-white flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
  );
}

export default function LandingPage() {
  const resolvedConfig = resolveLandingConfig();
  const templateKey = resolvedConfig.landing.template || "warmth";
  const Template = TEMPLATES[templateKey] || Warmth;
  return <Template config={resolvedConfig} />;
}
