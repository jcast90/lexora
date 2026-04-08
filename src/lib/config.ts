import baseConfig from "../../venture.config.json";

type BaseVentureConfig = typeof baseConfig;

export type ScreenshotSpec = {
  id: string;
  page: string;
  description: string;
  viewport: { width: number; height: number };
  waitFor?: string;
  clip?: { x: number; y: number; width: number; height: number } | null;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LandingConfig = BaseVentureConfig["landing"] & {
  template?: "precision" | "warmth" | "momentum";
  primaryCta?: string;
  secondaryCta?: string;
  navCta?: string;
  waitlistCardTitle?: string;
  waitlistCardSubtitle?: string;
  finalCtaButton?: string;
  socialProofLine?: string;
  features?: FeatureItem[];
  testimonials?: TestimonialItem[];
  faq?: FaqItem[];
  screenshots?: ScreenshotSpec[];
  heroImage?: string | null;
  featureImages?: string[];
};

type LandingVariant = {
  key: string;
  weight?: number;
  overrides?: Partial<LandingConfig>;
};

type LandingExperimentConfig = {
  key?: string;
  cookieName?: string;
  variants?: LandingVariant[];
};

export type VentureConfig = Omit<BaseVentureConfig, "landing"> & {
  landing: LandingConfig;
  experiments?: {
    landingPage?: LandingExperimentConfig;
  };
};

const typedBaseConfig = baseConfig as VentureConfig;

export default typedBaseConfig;

export const brand = typedBaseConfig.brand;
export const isLiveMode = !typedBaseConfig.flags?.waitlistMode || typedBaseConfig.flags?.mvpReady;

export function getLandingExperimentConfig(): LandingExperimentConfig | null {
  return typedBaseConfig.experiments?.landingPage || null;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const raw = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));
  return raw ? decodeURIComponent(raw.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

function chooseWeightedVariant(variants: LandingVariant[]): LandingVariant {
  const total = variants.reduce((sum, variant) => sum + (variant.weight ?? 0), 0);
  if (total <= 0) return variants[0];
  let cursor = Math.random() * total;
  for (const variant of variants) {
    cursor -= variant.weight ?? 0;
    if (cursor <= 0) return variant;
  }
  return variants[variants.length - 1];
}

function getLandingVariants(): LandingVariant[] {
  const experiment = getLandingExperimentConfig();
  return Array.isArray(experiment?.variants) ? experiment.variants : [];
}

export function getAssignedLandingVariant(): string {
  const experiment = getLandingExperimentConfig();
  const variants = getLandingVariants();
  if (typeof window === "undefined" || !experiment || variants.length === 0) return "control";

  const cookieName = experiment.cookieName || "vo_exp_landing_page";
  const previewVariant = new URLSearchParams(window.location.search).get("variant");
  const validKeys = new Set(variants.map((variant) => variant.key));

  if (previewVariant && validKeys.has(previewVariant)) {
    writeCookie(cookieName, previewVariant);
    return previewVariant;
  }

  const existing = readCookie(cookieName);
  if (existing && validKeys.has(existing)) return existing;

  const selected = chooseWeightedVariant(variants);
  writeCookie(cookieName, selected.key);
  return selected.key;
}

function mergeLanding(
  baseLanding: LandingConfig,
  overrides: Partial<LandingConfig> | undefined
): LandingConfig {
  if (!overrides) return baseLanding;
  return {
    ...baseLanding,
    ...overrides,
    painStats: overrides.painStats || baseLanding.painStats,
    steps: overrides.steps || baseLanding.steps,
    painPoints: overrides.painPoints || baseLanding.painPoints,
    pricing: overrides.pricing || baseLanding.pricing,
    finalCta: {
      ...baseLanding.finalCta,
      ...(overrides.finalCta || {}),
    },
  };
}

export function resolveLandingConfig(): VentureConfig {
  const variants = getLandingVariants();
  if (variants.length === 0 || typeof window === "undefined") {
    return typedBaseConfig;
  }

  const variantKey = getAssignedLandingVariant();
  const selected = variants.find((variant) => variant.key === variantKey);
  if (!selected?.overrides) return typedBaseConfig;

  return {
    ...typedBaseConfig,
    landing: mergeLanding(typedBaseConfig.landing, selected.overrides),
  };
}
