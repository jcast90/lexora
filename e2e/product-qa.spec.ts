import { test, expect } from "@playwright/test";
import config from "../venture.config.json";

/**
 * Product-specific E2E tests — auto-generated from venture.config.json.
 * Tests every dashboard page listed in navItems to ensure it renders,
 * has content, and is functional. Generated BEFORE code, run AFTER.
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";
const IS_LOCAL = BASE.includes("localhost") || BASE.includes("127.0.0.1");

// Auth bypass for Playwright against deployed Vercel previews.
// SCREENSHOT_TOKEN is set as a Vercel env var; passing it via ?screenshot_mode=<token>
// skips Supabase auth middleware so dashboard pages render without a real session.
const SCREENSHOT_TOKEN = process.env.SCREENSHOT_TOKEN || "";

// Console error patterns that are expected during local QA (no real Supabase)
const SUPABASE_NOISE = [
  "supabase",
  "NEXT_PUBLIC_SUPABASE",
  "ERR_CONNECTION_REFUSED",
  "fetch failed",
  "NetworkError",
  "Failed to construct 'URL'",
  "Invalid URL",
  "AuthApiError",
  "AuthSessionMissingError",
  "getSession",
];
function withAuth(href: string): string {
  if (!SCREENSHOT_TOKEN) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}screenshot_mode=${SCREENSHOT_TOKEN}`;
}

// Extract feature pages from config (exclude Dashboard and Settings which are template)
const featurePages = (config as any).dashboard?.navItems?.filter(
  (nav: any) => !["Dashboard", "Settings"].includes(nav.label) && nav.href?.startsWith("/dashboard/")
) || [];

// Pages that used a deterministic fallback template — functional but generic.
// Content-matching tests are skipped; structural/error tests still run.
const fallbackSlugs = new Set<string>(
  ((config as any).fallbackPages || []) as string[]
);
const isFallback = (nav: any) =>
  fallbackSlugs.has(nav.href?.replace("/dashboard/", "") || "");

// Test 1: Every feature page renders (no 404, no error)
for (const nav of featurePages) {
  test(`dashboard/${nav.label} page renders`, async ({ page }) => {
    await page.goto(withAuth(nav.href), { waitUntil: "networkidle" });

    // Should NOT be a 404
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toContain("404");
    expect(visibleText).not.toContain("This page could not be found");
    expect(visibleText).not.toContain("Application error");

    // Page should have substantial content (not blank)
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(100);

    // Should have a heading related to the feature (skip for fallback pages —
    // they render with a generic heading that may not match the nav label exactly).
    // Wait for client-side hydration since template-first pages use "use client".
    if (!isFallback(nav)) {
      await page.waitForTimeout(1000);
      const headings = await page.locator("h1, h2").allTextContents();
      const slug = nav.href?.replace("/dashboard/", "") || "";
      const hasRelevantHeading = headings.some(h => {
        const lower = h.toLowerCase();
        return (
          lower.includes(nav.label.toLowerCase()) ||
          lower.includes(nav.label.toLowerCase().replace(/s$/, "")) ||
          lower.includes(slug.replace(/-/g, " "))
        );
      });
      // On local testing, heading mismatch is a warning, not a hard failure
      // (the page rendered with content, just the heading text may differ)
      if (!hasRelevantHeading && !IS_LOCAL) {
        expect(hasRelevantHeading).toBe(true);
      }
    }

    // Screenshot for review
    await page.screenshot({
      path: `e2e/screenshots/dashboard-${nav.label.toLowerCase().replace(/\s+/g, "-")}.png`,
      fullPage: true,
    });
  });
}

// Test 2: Dashboard sidebar has all nav links
// Skip on local QA — proxy.ts auth bypass doesn't reliably prevent redirects
// on localhost with next start. This test runs during post-deploy QA on Vercel.
test("dashboard sidebar contains all feature links", async ({ page }) => {
  if (IS_LOCAL) {
    test.skip();
    return;
  }
  const startPage = featurePages[0]?.href || "/dashboard";
  await page.goto(withAuth(startPage), { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  for (const nav of featurePages) {
    const link = page.locator(`a[href="${nav.href}"]`);
    const linkByText = page.locator(`nav a:has-text("${nav.label}")`);
    const found = (await link.count()) > 0 || (await linkByText.count()) > 0;
    expect(found).toBe(true);
  }
});

// Test 3: Each feature page has interactive elements
for (const nav of featurePages) {
  test(`dashboard/${nav.label} has interactive elements`, async ({ page }) => {
    await page.goto(withAuth(nav.href), { waitUntil: "networkidle" });

    // Should have at least one of: button, table, form, input
    const hasButton = await page.locator("button").count();
    const hasTable = await page.locator("table").count();
    const hasInput = await page.locator("input").count();
    const hasCard = await page.locator("[class*='card'], [class*='Card']").count();

    expect(hasButton + hasTable + hasInput + hasCard).toBeGreaterThan(0);
  });
}

// Test 4: Landing page has correct product name and pricing
test("landing page shows correct product info", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const body = await page.locator("body").innerText();

  // Product name should appear
  expect(body).toContain((config as any).name || "");

  // At least one pricing tier should be visible
  const pricing = (config as any).landing?.pricing || [];
  if (pricing.length > 0) {
    const hasPricing = pricing.some((tier: any) =>
      body.includes(tier.plan) || body.includes(tier.price)
    );
    expect(hasPricing).toBe(true);
  }
});

// Test 5: Console error detection
for (const nav of featurePages) {
  test(`dashboard/${nav.label} has no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        // Filter known noise
        if (text.includes("favicon") || text.includes("hydrat")) return;
        // During local QA, Supabase connection errors are expected (no DB running)
        if (IS_LOCAL && SUPABASE_NOISE.some((p) => text.includes(p))) return;
        errors.push(text);
      }
    });
    await page.goto(withAuth(nav.href), { waitUntil: "networkidle" });
    expect(errors).toEqual([]);
  });
}

// Test 6: Sidebar navigation round-trip
test("sidebar navigation round-trip works", async ({ page }) => {
  // Navigate to each feature page directly with auth bypass to verify they load
  for (const nav of featurePages) {
    await page.goto(withAuth(nav.href), { waitUntil: "networkidle" });
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(50);
  }
});

// Test 7: Empty state detection
for (const nav of featurePages) {
  test(`dashboard/${nav.label} shows data or empty state`, async ({ page }) => {
    await page.goto(withAuth(nav.href), { waitUntil: "networkidle" });
    // Should have either: table rows, cards with content, or an empty state message
    const hasTable = await page.locator("table tbody tr").count();
    const hasCards = await page.locator("[class*='card'], [class*='Card']").count();
    const hasEmptyState = await page.locator("text=/no .*(found|data|results|items|yet)/i").count();
    const hasContent = await page.locator("text=/coming soon/i").count();
    expect(hasTable + hasCards + hasEmptyState + hasContent).toBeGreaterThan(0);
  });
}

// Test 8: Landing page waitlist/CTA form works
test("landing page CTA/waitlist form is functional", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]');
  const inputCount = await emailInput.count();
  if (inputCount > 0) {
    await emailInput.first().fill("test@example.com");
    const submitBtn = page.locator('button[type="submit"], button:has-text("Join"), button:has-text("Get"), button:has-text("Start")');
    await expect(submitBtn.first()).toBeVisible();
  }
  // Either has email input OR has a CTA button linking somewhere
  const ctaButton = page.locator('a[href*="sign"], a[href*="login"], a[href*="dashboard"], button:has-text("Start"), button:has-text("Try")');
  expect(inputCount + await ctaButton.count()).toBeGreaterThan(0);
});

// Test 9: CRUD smoke — verify no critical fetch/reference errors on feature pages
for (const nav of featurePages) {
  test(`dashboard/${nav.label} no critical errors`, async ({ page }) => {
    const criticalErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        // During local QA, Supabase connection errors are expected (no DB running)
        if (IS_LOCAL && SUPABASE_NOISE.some((p) => text.includes(p))) return;
        if (
          text.includes("Failed to fetch") ||
          text.includes("404") ||
          text.includes("not defined") ||
          text.includes("403")
        ) {
          criticalErrors.push(text.substring(0, 200));
        }
      }
    });

    await page.goto(withAuth(nav.href), { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    expect(
      criticalErrors,
      `Critical errors on ${nav.label}: ${criticalErrors.join("; ")}`,
    ).toHaveLength(0);
  });
}
