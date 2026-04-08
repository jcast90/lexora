"use client";

import posthog from "posthog-js";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { buildTrackingPayload, getCanonicalEventName } from "@/lib/analytics/events";

export function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    const payload = {
      page: pathname,
      ua: navigator.userAgent,
      ...buildTrackingPayload(),
    };

    const timer = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently ignore tracking failures
      });

      try {
        posthog.capture(
          getCanonicalEventName(pathname === "/" ? "landing_page_view" : "page_view"),
          payload
        );
      } catch {
        // Ignore PostHog client failures
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
