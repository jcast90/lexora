"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import config, { getAssignedLandingVariant, getLandingExperimentConfig } from "@/lib/config";
import { buildTrackingPayload, getCanonicalEventName } from "@/lib/analytics/events";

let posthogInitialized = false;

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (!key) return;

    if (!posthogInitialized) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false,
        autocapture: true,
      });
      posthogInitialized = true;
    }

    const experiment = getLandingExperimentConfig();
    if (!experiment?.key) return;

    const marker = `vo_exp_seen_${experiment.key}`;
    if (window.sessionStorage.getItem(marker) === "1") return;

    posthog.capture(getCanonicalEventName("experiment_exposure"), {
      venture_name: config.name,
      experiment_key: experiment.key,
      variant_key: getAssignedLandingVariant(),
      ...buildTrackingPayload(),
    });
    window.sessionStorage.setItem(marker, "1");
  }, []);

  return <>{children}</>;
}
