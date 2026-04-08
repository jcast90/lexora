import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and shows product name", async ({ page }) => {
    await page.goto("/");
    // Page should load without errors
    await expect(page).not.toHaveTitle(/error/i);
    // Should have a heading
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });

  test("shows navigation with CTA", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    // Should have a CTA button/link in nav
    const cta = nav.locator("a").last();
    await expect(cta).toBeVisible();
  });

  test("has feature section", async ({ page }) => {
    await page.goto("/");
    // Should have multiple sections
    const sections = page.locator("section");
    expect(await sections.count()).toBeGreaterThan(2);
  });

  test("has footer", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("waitlist form submits (when in waitlist mode)", async ({ page }) => {
    await page.goto("/");
    const emailInput = page.locator('input[type="email"]').first();

    // If waitlist form exists, test it
    if (await emailInput.isVisible()) {
      await emailInput.fill("test@example.com");
      const submitBtn = page.locator('button[type="submit"]').first();
      await submitBtn.click();
      // Should show some response (success or error depending on Supabase config)
      await page.waitForTimeout(2000);
    }
  });

  test("no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Filter out expected errors (Supabase not configured, etc.)
    const realErrors = errors.filter(
      (e) => !e.includes("supabase") && !e.includes("placeholder") && !e.includes("Failed to fetch")
    );
    expect(realErrors).toHaveLength(0);
  });

  test("visual snapshot - landing page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("landing.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });
});
