import { test, expect } from "@playwright/test";

test.describe("Auth Pages", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type='email']")).toBeVisible();
    // Should have OAuth buttons
    await expect(page.getByText("Google")).toBeVisible();
    await expect(page.getByText("GitHub")).toBeVisible();
    // Should have link to signup
    await expect(page.getByText("Sign up")).toBeVisible();
  });

  test("signup page renders", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    // Should have link to login
    await expect(page.getByText("Sign in")).toBeVisible();
  });

  test("login shows magic link option", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText(/magic link|Magic Link/i)).toBeVisible();
  });

  test("login shows password option", async ({ page }) => {
    await page.goto("/login");
    // Click to switch to password mode
    const passwordToggle = page.getByText(/password/i).first();
    await passwordToggle.click();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    // Should redirect to login
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test("visual snapshot - login page", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("login.png", { maxDiffPixelRatio: 0.1 });
  });

  test("visual snapshot - signup page", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("signup.png", { maxDiffPixelRatio: 0.1 });
  });
});
