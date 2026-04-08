import { test, expect } from "@playwright/test";

/**
 * Visual QA tests — capture screenshots of every page and verify
 * they render correctly. Used by the build pipeline to catch
 * blank pages, broken layouts, and missing content.
 *
 * Run against a deployed URL:
 *   BASE_URL=https://product.vercel.app npx playwright test e2e/visual-qa.spec.ts
 */

const pages = [
  { name: "landing", path: "/", mustContain: ["h1"] },
  { name: "login", path: "/login", mustContain: ["input[type='email']"] },
  { name: "signup", path: "/signup", mustContain: ["input[type='email']"] },
];

for (const p of pages) {
  test(`${p.name} page renders and is not blank`, async ({ page }) => {
    await page.goto(p.path);
    await page.waitForLoadState("networkidle");

    // Page should not be blank
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(50);

    // Required elements should exist
    for (const selector of p.mustContain) {
      await expect(page.locator(selector).first()).toBeVisible();
    }

    // No error pages — check visible text only (innerText excludes script payloads)
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toContain("Application error");
    expect(visibleText).not.toContain("Internal Server Error");
    expect(visibleText).not.toMatch(/\b500\b.*(?:error|server)/i);

    // Screenshot for visual review
    await page.screenshot({
      path: `e2e/screenshots/${p.name}.png`,
      fullPage: true,
    });
  });
}

test("all nav links work", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Get all internal links
  const links = await page.locator("a[href^='/']").all();
  const hrefs = new Set<string>();
  for (const link of links) {
    const href = await link.getAttribute("href");
    if (href && !href.includes("#")) hrefs.add(href);
  }

  // Visit each and verify it doesn't 500
  for (const href of hrefs) {
    const response = await page.goto(href);
    expect(response?.status()).toBeLessThan(500);
  }
});

test("responsive - mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Should still show content
  const body = await page.locator("body").textContent();
  expect(body?.trim().length).toBeGreaterThan(50);

  await page.screenshot({
    path: "e2e/screenshots/landing-mobile.png",
    fullPage: true,
  });
});
