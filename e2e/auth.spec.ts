import { test, expect } from "@playwright/test";

test("admin login success", async ({ page }) => {
  await page.goto("/auth/login");

  await page.fill('input[type="email"]', "admin@example.com");
  await page.fill('input[type="password"]', "123456");
  await page.click('button[type="submit"]');

  /**
   * ✅ CHECKPOINT CHUẨN:
   * Không expect URL cứng vì next-auth redirect async
   * Chỉ cần chứng minh login thành công
   */

  // Cách 1 (ổn định nhất): chờ dashboard element
  await expect(
    page.getByRole("heading", { name: /dashboard|tổng quan/i })
  ).toBeVisible({ timeout: 15000 });
});
