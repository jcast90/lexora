import config, { getAssignedLandingVariant, getLandingExperimentConfig } from "@/lib/config";

const DEFAULT_EVENT_NAMES = {
  page_view: "page_view",
  landing_page_view: "landing_page_view",
  experiment_exposure: "experiment_exposure",
  landing_cta_clicked: "landing_cta_clicked",
  waitlist_signup_submitted: "waitlist_signup_submitted",
  waitlist_signup_succeeded: "waitlist_signup_succeeded",
  signup_started: "signup_started",
  signup_completed: "signup_completed",
  dashboard_viewed: "dashboard_viewed",
  checkout_started: "checkout_started",
  subscription_started: "subscription_started",
} as const;

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

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `anon_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function getCanonicalEventName(name: keyof typeof DEFAULT_EVENT_NAMES): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((config as any).analytics?.events?.[name] as string) || DEFAULT_EVENT_NAMES[name];
}

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "server";

  const storageKey = "vo_anon_id";
  const cookieKey = "vo_anon_id";
  const fromStorage = window.localStorage.getItem(storageKey);
  if (fromStorage) {
    writeCookie(cookieKey, fromStorage);
    return fromStorage;
  }

  const fromCookie = readCookie(cookieKey);
  if (fromCookie) {
    window.localStorage.setItem(storageKey, fromCookie);
    return fromCookie;
  }

  const created = randomId();
  window.localStorage.setItem(storageKey, created);
  writeCookie(cookieKey, created);
  return created;
}

export function getAttributionPayload() {
  if (typeof window === "undefined") {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      referrer: null,
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    referrer: document.referrer || null,
  };
}

export function buildTrackingPayload() {
  const experiment = getLandingExperimentConfig();
  return {
    anonId: getAnonymousId(),
    experimentKey: experiment?.key || null,
    variantKey: getAssignedLandingVariant(),
    ...getAttributionPayload(),
  };
}
